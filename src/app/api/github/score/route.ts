import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { scoreGithubProfile } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { username } = await req.json();
    if (!username) return NextResponse.json({ error: "Username required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Fetch GitHub data
    const profileRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: { "User-Agent": "AI-Career-Copilot" }
    });
    if (!profileRes.ok) return NextResponse.json({ error: "GitHub profile not found" }, { status: 404 });
    const profileData = await profileRes.json();

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=10`, {
      headers: { "User-Agent": "AI-Career-Copilot" }
    });
    const reposData = await reposRes.json();

    // AI Scoring
    const aiScore = await scoreGithubProfile(username, reposData, profileData);

    // Save to DB
    const githubScore = await prisma.githubScore.create({
      data: {
        userId: user.id,
        githubHandle: username,
        overallScore: aiScore.overallScore,
        profileName: aiScore.profileName,
        breakdown: aiScore.breakdown,
        markdownFeedback: aiScore.markdownFeedback,
        topRepos: aiScore.topRepos,
      }
    });

    return NextResponse.json({ success: true, data: githubScore });
  } catch (error) {
    console.error("GitHub score error:", error);
    return NextResponse.json({ error: "Failed to generate GitHub score" }, { status: 500 });
  }
}
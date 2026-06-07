// src/app/api/github/score/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getGithubProfile } from "@/lib/github";
import { scoreGithubProfile } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { githubHandle } = await req.json();
    if (!githubHandle) return NextResponse.json({ success: false, error: "githubHandle is required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    // Check cache (24hr)
    const cached = await prisma.githubScore.findFirst({
      where: {
        userId: user.id,
        githubHandle,
        scoredAt: { gte: new Date(Date.now() - 24 * 60 * 60_000) },
      },
      orderBy: { scoredAt: "desc" },
    });

    if (cached) {
      return NextResponse.json({
        success: true,
        data: {
          overallScore: cached.overallScore,
          breakdown: cached.breakdown,
          suggestions: cached.suggestions,
          topRepos: cached.topRepos,
          cached: true,
        },
      });
    }

    // Fetch GitHub data
    const { profile, repos } = await getGithubProfile(githubHandle);

    // Score with Gemini
    const result = await scoreGithubProfile(githubHandle, repos, profile);

    // Save to DB
    await prisma.githubScore.create({
      data: {
        userId: user.id,
        githubHandle,
        overallScore: result.overallScore,
        breakdown: result.breakdown as object,
        suggestions: result.suggestions as object,
        topRepos: result.topRepos as object,
      },
    });

    // Update user github URL
    await prisma.user.update({
      where: { id: user.id },
      data: { githubUrl: `https://github.com/${githubHandle}` },
    });

    return NextResponse.json({ success: true, data: result });

  } catch (error) {
    console.error("[github/score] Error:", error);
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json({ success: false, error: "GitHub user not found." }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
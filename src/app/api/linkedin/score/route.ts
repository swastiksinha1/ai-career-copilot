import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { scoreLinkedinProfile } from "@/lib/anthropic";
import pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) return NextResponse.json({ error: "PDF file is required" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await pdfParse(buffer);
    const profileText = parsed.text;

    // AI Scoring
    const aiScore = await scoreLinkedinProfile(profileText);

    // Save to DB
    const linkedinScore = await prisma.linkedinScore.create({
      data: {
        userId: user.id,
        overallScore: aiScore.overallScore,
        profileName: aiScore.profileName,
        breakdown: aiScore.breakdown,
        markdownFeedback: aiScore.markdownFeedback,
      }
    });

    return NextResponse.json({ success: true, data: linkedinScore });
  } catch (error) {
    console.error("LinkedIn score error:", error);
    return NextResponse.json({ error: "Failed to generate LinkedIn score" }, { status: 500 });
  }
}

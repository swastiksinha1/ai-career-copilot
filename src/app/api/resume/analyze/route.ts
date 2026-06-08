// src/app/api/resume/analyze/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { analyzeResume } from "@/lib/anthropic";
const pdfParse = require("pdf-parse");

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const targetRole = (formData.get("targetRole") as string) || "Software Engineer";

    if (!file) return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    if (file.type !== "application/pdf") return NextResponse.json({ success: false, error: "Only PDF files are supported" }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ success: false, error: "File too large. Max 5MB." }, { status: 400 });

    // Extract text from PDF using pdf-parse
    const buffer = Buffer.from(await file.arrayBuffer());
    let rawText = "";
    try {
      const pdfParseFn = typeof pdfParse === "function" ? pdfParse : pdfParse.default;
      const parsed = await pdfParseFn(buffer);
      rawText = parsed.text.trim();
    } catch (err) {
      console.error("PDF Parse error:", err);
      return NextResponse.json({ success: false, error: "Failed to read PDF. Please ensure it's a readable PDF." }, { status: 400 });
    }

    if (rawText.length < 50) {
      return NextResponse.json({ success: false, error: "Could not extract enough text from PDF. Try a text-based PDF." }, { status: 400 });
    }

    // Get or create user
    let user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      user = await prisma.user.create({
        data: { clerkId, email: `${clerkId}@placeholder.com`, targetRole },
      });
    }

    // Analyze with Gemini
    const analysis = await analyzeResume(rawText.slice(0, 8000), targetRole);

    // Deactivate old resumes
    await prisma.resume.updateMany({
      where: { userId: user.id, isActive: true },
      data: { isActive: false },
    });

    // Save to database
    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        fileName: file.name,
        rawText: rawText.slice(0, 50000),
        skills: analysis.skills || [],
        experience: analysis.experience || [],
        education: analysis.education || [],
        roleFitScore: analysis.roleFitScore || {},
        skillGaps: analysis.skillGaps || [],
        summary: analysis.summary || "",
        isActive: true,
        analyzedAt: new Date(),
      },
    });

    // Update user target role
    await prisma.user.update({
      where: { id: user.id },
      data: { targetRole },
    });

  const skills = analysis.skills || [];
    const skillsFormatted = Array.isArray(skills)
      ? { technical: skills, tools: [], soft: [] }
      : skills;

    return NextResponse.json({
      success: true,
      data: {
        ...analysis,
        resumeId: resume.id,
        overallStrength: analysis.fitScore || 70,
        roleFitScores: [{
          role: targetRole,
          score: analysis.fitScore || 70,
          strengths: Array.isArray(skills) ? skills.slice(0, 3) : [],
          gaps: analysis.skillGaps || [],
        }],
        topSkillGaps: analysis.skillGaps || [],
        skills: skillsFormatted,
        summary: analysis.summary || "",
      },
    });

  } catch (error) {
    console.error("[resume/analyze] Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
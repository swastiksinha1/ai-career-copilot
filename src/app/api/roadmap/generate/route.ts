// src/app/api/roadmap/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { generateRoadmap } from "@/lib/anthropic";

export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ success: false, data: null });

    const roadmap = await prisma.roadmap.findFirst({
      where: { userId: user.id, isActive: true },
      include: { weeks: { orderBy: { weekNumber: "asc" } } },
    });

    if (!roadmap) return NextResponse.json({ success: false, data: null });

    return NextResponse.json({ success: true, data: roadmap });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { targetRole, durationWeeks = 8 } = await req.json();
    if (!targetRole) return NextResponse.json({ error: "Target role is required" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { resumes: { where: { isActive: true }, take: 1 } },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const activeResume = user.resumes[0];
    const skillGaps = activeResume ? (activeResume.skillGaps as string[]) : [];
    const currentSkills = activeResume ? (activeResume.skills as string[]) : [];

    const weeks = await generateRoadmap(targetRole, skillGaps, currentSkills, durationWeeks);

    // Deactivate old roadmaps
    await prisma.roadmap.updateMany({
      where: { userId: user.id },
      data: { isActive: false },
    });

    // Create new roadmap
    const roadmap = await prisma.roadmap.create({
      data: {
        userId: user.id,
        resumeId: activeResume?.id || "",
        targetRole,
        durationWeeks,
        weeks: {
          create: weeks.map((week: any) => ({
            weekNumber: week.weekNumber,
            title: week.title,
            focus: week.focus,
            tasks: week.tasks,
          })),
        },
      },
      include: { weeks: { orderBy: { weekNumber: "asc" } } },
    });

    return NextResponse.json({ success: true, data: roadmap });
  } catch (error) {
    console.error("Roadmap generation error:", error);
    return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 });
  }
}
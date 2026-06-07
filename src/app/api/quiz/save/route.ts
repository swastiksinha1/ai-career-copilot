import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { targetRole, score, totalQuestions } = await req.json();

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        targetRole,
        score,
        totalQuestions,
      },
    });

    return NextResponse.json({ success: true, data: attempt });
  } catch (error) {
    console.error("Quiz save error:", error);
    return NextResponse.json({ error: "Failed to save quiz" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateQuiz } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { targetRole, numQuestions = 5 } = await req.json();
    if (!targetRole) return NextResponse.json({ error: "Target role is required" }, { status: 400 });

    const questions = await generateQuiz(targetRole, numQuestions);
    return NextResponse.json({ success: true, data: questions });
  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
  }
}

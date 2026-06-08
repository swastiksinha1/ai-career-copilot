import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getGeminiClient } from "@/lib/anthropic";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { jobDescription } = await req.json();
    if (!jobDescription) return NextResponse.json({ error: "Job description required" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { resumes: { where: { isActive: true }, take: 1 } },
    });

    const activeResume = user?.resumes[0];
    if (!activeResume) {
      return NextResponse.json({ error: "Please upload a resume first." }, { status: 400 });
    }

    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are an expert ATS (Applicant Tracking System) and senior technical recruiter.
I will provide you with a Job Description and a Candidate's Resume.

Job Description:
${jobDescription}

Candidate Resume:
${activeResume.content}

Task: Compare the resume against the job description.
Provide a highly concise, punchy analysis formatted in Markdown.
Do not use conversational filler (like "Here is the analysis"). Jump straight into it.
Include:
1. An overall Match Score (e.g., 75%)
2. Top Strengths (Why they are a good fit)
3. Top Missing Keywords / Gaps (What they need to add to their resume or learn)
4. A 1-sentence final verdict.
`;

    const result = await model.generateContentStream(prompt);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(new TextEncoder().encode(chunkText));
            }
          }
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });

  } catch (error) {
    console.error("Matcher API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

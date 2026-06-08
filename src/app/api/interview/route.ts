import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getGeminiClient } from "@/lib/anthropic";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { mode, jobDescription, question, answer } = await req.json();

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { resumes: { where: { isActive: true }, take: 1 } },
    });
    const activeResume = user?.resumes[0];

    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    if (mode === "question") {
      // Generate a question (no streaming needed, just text)
      if (!jobDescription) return NextResponse.json({ error: "Job description required" }, { status: 400 });
      
      const prompt = `You are a strict, senior technical interviewer.
Job Description:
${jobDescription}

Generate exactly ONE difficult, scenario-based interview question tailored to this job description.
Do not include any introductory text. Just the question.`;
      
      const result = await model.generateContent(prompt);
      return NextResponse.json({ question: result.response.text() });
    } 
    
    if (mode === "evaluate") {
      // Evaluate an answer and stream the feedback
      if (!question || !answer) return NextResponse.json({ error: "Question and answer required" }, { status: 400 });
      
      const prompt = `You are a strict, senior technical interviewer evaluating a candidate.
Job Description Context:
${jobDescription || "Not provided"}

Candidate's Resume Context:
${activeResume?.content || "Not provided"}

Interview Question:
${question}

Candidate's Answer:
${answer}

Task: Evaluate the candidate's answer. Provide a highly concise, punchy analysis formatted in Markdown.
Include:
1. Score (out of 10)
2. What they did well (1-2 bullets)
3. What they missed / How to improve (1-2 bullets)
4. An example of a "Perfect Answer" snippet (just 1-2 sentences).
Jump straight into the evaluation. No conversational filler.`;

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
    }

    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });

  } catch (error) {
    console.error("Interview API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { jobDescription, targetRole, keySkills, githubUrl, linkedinUrl } = await req.json();
    if (!jobDescription) return NextResponse.json({ error: "Job description required" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { resumes: { where: { isActive: true }, take: 1 } },
    });

    const activeResume = user?.resumes[0];
    if (!activeResume) {
      return NextResponse.json({ error: "Please upload a resume first." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let additionalContext = "";
    if (targetRole) additionalContext += `- Target Role: ${targetRole}\n`;
    if (keySkills) additionalContext += `- Key Skills to Highlight: ${keySkills}\n`;
    if (githubUrl) additionalContext += `- GitHub Profile: ${githubUrl}\n`;
    if (linkedinUrl) additionalContext += `- LinkedIn Profile: ${linkedinUrl}\n`;

    const prompt = `You are an expert career coach and professional copywriter.
I will provide you with a Job Description, a Candidate's Resume, and some optional preferences.

Job Description:
${jobDescription}

Candidate Resume:
${activeResume.content}

Additional Preferences (Incorporate these if provided):
${additionalContext || "None provided"}

Task: Write a highly compelling, modern, and professional cover letter for this candidate applying to this specific job.
Rules:
- Do not use generic, outdated phrases like "To Whom It May Concern" or "I am writing to apply for...". Start with a strong hook.
- Focus on the candidate's actual achievements from their resume that directly match the job description's requirements.
- If "Key Skills to Highlight" are provided, ensure you weave them naturally into the narrative.
- If GitHub or LinkedIn profiles are provided, include them appropriately in the header or contact section.
- Keep it concise (under 400 words).
- Use a confident but humble tone.
- Provide only the cover letter content. Do not include conversational filler.
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
    console.error("Cover Letter API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

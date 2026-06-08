// src/lib/anthropic.ts
// AI client and helper functions (using Gemini)

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKeys: string[] = [];

// 1. Load from GEMINI_API_KEY (comma-separated or single key)
const mainKey = process.env.GEMINI_API_KEY || "";
if (mainKey) {
  mainKey.split(",").forEach(k => {
    const trimmed = k.trim();
    if (trimmed && !apiKeys.includes(trimmed)) apiKeys.push(trimmed);
  });
}

// 2. Load from GEMINI_API_KEYS (comma-separated list)
const keysList = process.env.GEMINI_API_KEYS || "";
if (keysList) {
  keysList.split(",").forEach(k => {
    const trimmed = k.trim();
    if (trimmed && !apiKeys.includes(trimmed)) apiKeys.push(trimmed);
  });
}

// 3. Load from separate individual keys: GEMINI_API_KEY_1, GEMINI_API_KEY_2, etc. (up to 20 keys)
for (let i = 1; i <= 20; i++) {
  const individualKey = process.env[`GEMINI_API_KEY_${i}`];
  if (individualKey) {
    const trimmed = individualKey.trim();
    if (trimmed && !apiKeys.includes(trimmed)) apiKeys.push(trimmed);
  }
}

const geminiClients = apiKeys.map((key) => new GoogleGenerativeAI(key));
let currentClientIndex = 0;

export function getGeminiClient() {
  if (geminiClients.length === 0) {
    throw new Error("No GEMINI API clients configured. Please set GEMINI_API_KEY or GEMINI_API_KEY_1, GEMINI_API_KEY_2 etc. in your environment variables.");
  }
  const client = geminiClients[currentClientIndex];
  currentClientIndex = (currentClientIndex + 1) % geminiClients.length;
  return client;
}

const MODEL_NAME = "gemini-2.5-flash";

async function generateContentWithRetry(prompt: string, systemInstruction: string, generationConfig: any) {
  let lastError;
  const maxRetries = Math.max(3, apiKeys.length);
  for (let i = 0; i < maxRetries; i++) {
    try {
      const genAI = getGeminiClient();
      const model = genAI.getGenerativeModel({ model: MODEL_NAME, systemInstruction, generationConfig });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error: any) {
      lastError = error;
      console.warn(`Gemini API Error (Attempt ${i + 1}/${maxRetries}):`, error.message);
      // Wait before retrying (exponential backoff)
      if (i < maxRetries - 1) {
        await new Promise(res => setTimeout(res, 1500 * Math.pow(2, i)));
      }
    }
  }
  throw lastError;
}

// ─────────────────────────────────────────
// RESUME ANALYSIS
// ─────────────────────────────────────────
export async function analyzeResume(resumeText: string, targetRole: string = "Software Engineer") {
  const prompt = `Analyze this resume against the target role of "${targetRole}".
Evaluate how well the candidate's skills and experience match this specific role.
Return ONLY a JSON object with this exact structure:
{
  "skills": ["skill1", "skill2"],
  "experience": [{"title": "Job Title", "company": "Company", "years": 2}],
  "education": [{"degree": "B.Tech", "institution": "University"}],
  "roleFitScore": {"${targetRole}": 85},
  "skillGaps": ["Missing skill 1 for ${targetRole}", "Missing skill 2"],
  "summary": "2-3 sentence career summary highlighting relevance to ${targetRole}",
  "fitScore": 85
}

Be highly critical and realistic with the fitScore (0-100) based strictly on how well the resume matches a typical "${targetRole}" job.

Resume:
${resumeText}`;

  const text = await generateContentWithRetry(
    prompt,
    "You are an expert tech recruiter. Always respond with valid JSON only, no markdown, no backticks, no explanation.",
    { temperature: 0.3, responseMimeType: "application/json" }
  );
  
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ─────────────────────────────────────────
// ROADMAP GENERATION
// ─────────────────────────────────────────
export async function generateRoadmap(
  targetRole: string,
  skillGaps: string[],
  currentSkills: string[],
  durationWeeks: number = 8
) {
  const prompt = `Create a ${durationWeeks}-week preparation roadmap and return ONLY a JSON array:
[
  {
    "weekNumber": 1,
    "title": "Week 1: Topic Name",
    "focus": "Main focus area",
    "tasks": [
      {
        "task": "Task description",
        "type": "learn",
        "completed": false,
        "resources": ["Resource 1", "Resource 2"]
      }
    ]
  }
]

Target Role: ${targetRole}
Current Skills: ${currentSkills.join(", ")}
Skill Gaps: ${skillGaps.join(", ")}

Generate exactly ${durationWeeks} weeks with 3-5 tasks each.`;

  const text = await generateContentWithRetry(
    prompt,
    "You are an expert career coach. Always respond with valid JSON only, no markdown, no backticks, no explanation.",
    { temperature: 0.3, responseMimeType: "application/json" }
  );
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ─────────────────────────────────────────
// GITHUB SCORING
// ─────────────────────────────────────────
export async function scoreGithubProfile(
  username: string,
  repos: any[],
  profileData: any
) {
  const prompt = `Score this GitHub profile and return ONLY a JSON object:
{
  "overallScore": 72,
  "profileName": "User Name",
  "breakdown": {
    "profileCompleteness": 15,
    "repositoryQuality": 25,
    "activityConsistency": 20,
    "projectDiversity": 12
  },
  "markdownFeedback": "### 🚀 Strengths\\n- Good repos\\n\\n### ⚠️ Primary Gap\\n- Add a README\\n\\n### 💡 Quick Win\\n- Pin repositories\\n\\n### 📈 Long-term Goal\\n- Contribute to open source\\n\\n### 🔍 Code Quality\\n- Clean commits\\n\\n### 🎯 Overall Impact\\n- Great potential",
  "topRepos": [
    {"name": "repo-name", "stars": 5, "description": "What it does"}
  ]
}

CRITICAL RULE: The values in the breakdown object MUST each be out of a maximum of 25, and their sum MUST exactly equal the overallScore (which is out of 100). Do NOT output any breakdown score greater than 25.

Make sure markdownFeedback is a comprehensive, beautifully formatted markdown string. You MUST provide exactly 6 to 8 distinct, bite-sized sections starting with "###".
Examples of sections you could include:
1. ### 🚀 Top Strengths
2. ### ⚠️ Primary Gap
3. ### 💡 Quick Win
4. ### 📈 Long-term Goal
5. ### 🔍 Code Quality
6. ### 🎯 Overall Impact

CRITICAL UI RULE: The text under EACH section MUST be extremely short (maximum 2-3 short sentences or 2 bullet points). We are displaying these in small, fixed-size isometric 3D cards. If you write too much text under a single heading, it will break the layout. Spread your feedback across more boxes rather than writing long paragraphs.

CRITICAL JSON FORMATTING: You MUST ensure all newlines in the markdownFeedback string are properly escaped as \\n so the JSON is valid. Do not use raw newlines inside the string!

CRITICAL GRADING RUBRIC (Be realistic but encouraging):
- Focus on the QUALITY of the repositories, descriptions, and languages used rather than sheer quantity.
- Do NOT heavily penalize candidates for having a low number of public repositories. A few high-quality projects are better than 50 empty ones.
- 30-50: Beginner. Has a profile, maybe 1-2 basic projects, low activity.
- 51-70: Intermediate. Good profile, a few solid projects with descriptions, some activity.
- 71-85: Advanced. Very solid projects, good descriptions, stars, followers, clear tech stack focus.
- 86-100: Expert. High impact open source, lots of stars, deep complexity.
`;

  const dataString = `
Username: ${username}
Name: ${profileData.name || "Unknown"}
Public Repos: ${profileData.public_repos}
Followers: ${profileData.followers}
Bio: ${profileData.bio || "None"}
Top Repos: ${JSON.stringify([...repos].sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0)).slice(0, 5).map((r) => ({
  name: r.name,
  description: r.description,
  stars: r.stargazers_count,
  language: r.language,
})))}
`;

  const finalPrompt = prompt + dataString;

  const text = await generateContentWithRetry(
    finalPrompt,
    "You are a senior engineering hiring manager. Always respond with valid JSON only, no markdown, no backticks, no explanation.",
    { temperature: 0.0, responseMimeType: "application/json" }
  );
  
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ─────────────────────────────────────────
// LINKEDIN SCORING
// ─────────────────────────────────────────
export async function scoreLinkedinProfile(profileText: string) {
  const prompt = `Score this LinkedIn profile and return ONLY a JSON object:
{
  "overallScore": 75,
  "profileName": "Extracted Name from PDF",
  "breakdown": {
    "experienceImpact": 25,
    "summaryQuality": 15,
    "skillsRelevance": 20,
    "completeness": 15
  },
  "markdownFeedback": "### 🚀 Strengths\\n- Strong experience\\n\\n### ⚠️ Areas for Improvement\\n- Quantify your impact"
}

Extract the candidate's real name from the PDF text for 'profileName'.
Make sure markdownFeedback is a comprehensive, beautifully formatted markdown string with headers, bullet points, and actionable advice to improve their score.
Evaluate strictly based on best practices for tech industry LinkedIn profiles.

Profile Text (from PDF export):
${profileText}`;

  const text = await generateContentWithRetry(
    prompt,
    "You are a senior engineering hiring manager. Always respond with valid JSON only, no markdown, no backticks, no explanation.",
    { temperature: 0.3, responseMimeType: "application/json" }
  );
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ─────────────────────────────────────────
// MCQ QUIZ GENERATOR
// ─────────────────────────────────────────
export async function generateQuiz(targetRole: string, numQuestions: number = 5) {
  const prompt = `Create a ${numQuestions}-question multiple choice quiz for a "${targetRole}". 
The questions should cover core technical concepts, practical scenarios, and best practices relevant to this role.
Vary the difficulty from intermediate to advanced.

Return ONLY a JSON array with this exact structure:
[
  {
    "questionText": "What is the primary purpose of...?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctOptionIndex": 1,
    "explanation": "Option B is correct because..."
  }
]`;

  const text = await generateContentWithRetry(
    prompt,
    "You are an expert technical interviewer. Always respond with valid JSON only, no markdown, no backticks, no explanation.",
    { temperature: 0.7, responseMimeType: "application/json" }
  );
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}
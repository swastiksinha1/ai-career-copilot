// src/lib/anthropic.ts
// AI client and helper functions (using Gemini)

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKeys = (process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "")
  .split(",")
  .map((key) => key.trim())
  .filter((key) => key.length > 0);

const geminiClients = apiKeys.map((key) => new GoogleGenerativeAI(key));
let currentClientIndex = 0;

function getGeminiClient() {
  if (geminiClients.length === 0) {
    throw new Error("No GEMINI API clients configured. Please set GEMINI_API_KEYS or GEMINI_API_KEY in .env");
  }
  const client = geminiClients[currentClientIndex];
  currentClientIndex = (currentClientIndex + 1) % geminiClients.length;
  return client;
}

const MODEL_NAME = "gemini-2.5-flash";

// ─────────────────────────────────────────
// RESUME ANALYSIS
// ─────────────────────────────────────────
export async function analyzeResume(resumeText: string) {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: "You are an expert tech recruiter. Always respond with valid JSON only, no markdown, no backticks, no explanation.",
    generationConfig: {
      temperature: 0.3,
      responseMimeType: "application/json",
    }
  });

  const prompt = `Analyze this resume and return ONLY a JSON object with this exact structure:
{
  "skills": ["skill1", "skill2"],
  "experience": [{"title": "Job Title", "company": "Company", "years": 2}],
  "education": [{"degree": "B.Tech", "institution": "University"}],
  "roleFitScore": {"Full Stack Developer": 75, "Backend Developer": 80},
  "skillGaps": ["Docker", "System Design"],
  "summary": "2-3 sentence career summary",
  "fitScore": 75
}

Resume:
${resumeText}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
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
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: "You are an expert career coach. Always respond with valid JSON only, no markdown, no backticks, no explanation.",
    generationConfig: {
      temperature: 0.3,
      responseMimeType: "application/json",
    }
  });

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

  const result = await model.generateContent(prompt);
  const text = result.response.text();
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
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: "You are a senior engineering hiring manager. Always respond with valid JSON only, no markdown, no backticks, no explanation.",
    generationConfig: {
      temperature: 0.3,
      responseMimeType: "application/json",
    }
  });

  const prompt = `Score this GitHub profile and return ONLY a JSON object:
{
  "overallScore": 72,
  "breakdown": {
    "profileCompleteness": 15,
    "repositoryQuality": 25,
    "activityConsistency": 20,
    "projectDiversity": 12
  },
  "suggestions": [
    "Add a README to your top repository"
  ],
  "topRepos": [
    {"name": "repo-name", "stars": 5, "description": "What it does"}
  ]
}

Username: ${username}
Public Repos: ${profileData.public_repos}
Followers: ${profileData.followers}
Bio: ${profileData.bio || "None"}
Top Repos: ${JSON.stringify(repos.slice(0, 5).map((r) => ({
  name: r.name,
  description: r.description,
  stars: r.stargazers_count,
  language: r.language,
})))}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}
// src/types/index.ts
// Shared TypeScript types used across the app

// ─── Resume Analysis ──────────────────────────────────
export interface ParsedSkills {
  technical: string[];
  soft: string[];
  tools: string[];
}

export interface WorkExperience {
  title: string;
  company: string;
  duration: string; // e.g. "2 years"
  highlights: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year?: string;
  gpa?: string;
}

export interface RoleFitScore {
  role: string;
  score: number; // 0–100
  strengths: string[];
  gaps: string[];
}

export interface ResumeAnalysis {
  skills: ParsedSkills;
  experience: WorkExperience[];
  education: Education[];
  roleFitScores: RoleFitScore[];
  topSkillGaps: string[];
  summary: string;
  overallStrength: number; // 0–100
}

// ─── Roadmap ──────────────────────────────────────────
export interface RoadmapTask {
  id: string;
  task: string;
  type: "learn" | "build" | "practice" | "apply";
  completed: boolean;
  resources?: string[]; // URLs or book names
}

export interface RoadmapWeekData {
  weekNumber: number;
  title: string;
  focus: string;
  tasks: RoadmapTask[];
  isCompleted: boolean;
}

// ─── Application Tracker ─────────────────────────────
export type AppStatus =
  | "WISHLIST"
  | "APPLIED"
  | "SCREEN"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED"
  | "WITHDRAWN";

export interface ApplicationData {
  id: string;
  company: string;
  role: string;
  jobUrl?: string;
  status: AppStatus;
  appliedAt: string;
  interviewAt?: string;
  notes?: string;
  location?: string;
  isRemote: boolean;
}

// ─── GitHub Scoring ───────────────────────────────────
export interface GithubScoreBreakdown {
  profileCompleteness: number; // 0–25
  repoQuality: number;         // 0–30
  activityConsistency: number; // 0–25
  projectDiversity: number;    // 0–20
}

export interface GithubScoreResult {
  overallScore: number;
  breakdown: GithubScoreBreakdown;
  suggestions: string[];
  topRepos: {
    name: string;
    stars: number;
    description: string;
    hasReadme: boolean;
  }[];
}

// ─── API Responses ────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// src/lib/github.ts
// GitHub REST API utilities (no auth needed for public profiles)

const GITHUB_API = "https://api.github.com";

const headers: HeadersInit = {
  Accept: "application/vnd.github.v3+json",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

export interface GithubRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  html_url: string;
  fork: boolean;
  topics: string[];
}

export interface GithubProfile {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export async function getGithubProfile(handle: string): Promise<GithubProfile> {
  const res = await fetch(`${GITHUB_API}/users/${handle}`, { headers });
  if (!res.ok) throw new Error(`GitHub user not found: ${handle}`);
  return res.json();
}

export async function getGithubRepos(handle: string): Promise<GithubRepo[]> {
  const res = await fetch(
    `${GITHUB_API}/users/${handle}/repos?sort=updated&per_page=30`,
    { headers }
  );
  if (!res.ok) throw new Error(`Could not fetch repos for: ${handle}`);
  const repos: GithubRepo[] = await res.json();
  // Filter out forks, sort by stars
  return repos
    .filter((r) => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10);
}

// Check if a repo has a README (important for scoring)
export async function hasReadme(handle: string, repo: string): Promise<boolean> {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${handle}/${repo}/readme`, {
      headers,
    });
    return res.ok;
  } catch {
    return false;
  }
}

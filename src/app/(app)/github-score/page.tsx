import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GithubAnalytics } from "@/components/GithubAnalytics";
import { GitBranch } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GitHub Analytics",
};

export default async function GithubScorePage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/");

  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      githubScores: { orderBy: { scoredAt: "desc" }, take: 1 },
    },
  });

  const githubScore = user?.githubScores[0];

  return (
    <main style={{ padding: "48px 40px", flex: 1, background: "var(--bg)", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
          <div style={{ padding: "12px", background: "rgba(245,158,11,0.1)", borderRadius: "12px", color: "#F59E0B" }}>
            <GitBranch size={28} />
          </div>
          <div>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "36px", fontWeight: 800, color: "var(--text)" }}>GitHub Analytics</h1>
            <p style={{ color: "var(--text-muted)", marginTop: "4px", fontSize: "16px" }}>Evaluate your open-source impact and commit history.</p>
          </div>
        </div>

        <GithubAnalytics initialScore={githubScore} />
        
      </div>
    </main>
  );
}

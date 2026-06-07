// src/app/dashboard/page.tsx
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import NavBar from "@/components/NavBar";

export default async function DashboardPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/");

  const clerkUser = await currentUser();

  let user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId,
        email: clerkUser?.emailAddresses[0]?.emailAddress || "",
        name: clerkUser?.fullName || "",
      },
    });
  }

  const fullUser = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      resumes: { where: { isActive: true }, take: 1 },
      roadmaps: {
        where: { isActive: true },
        include: { weeks: { orderBy: { weekNumber: "asc" } } },
        take: 1,
      },
      applications: { orderBy: { createdAt: "desc" }, take: 5 },
      githubScores: { orderBy: { scoredAt: "desc" }, take: 1 },
    },
  });

  const activeResume = fullUser?.resumes[0];
  const activeRoadmap = fullUser?.roadmaps[0];
  const applications = fullUser?.applications || [];
  const githubScore = fullUser?.githubScores[0];
  const completedWeeks = activeRoadmap?.weeks.filter((w) => w.isCompleted).length || 0;
  const totalWeeks = activeRoadmap?.weeks.length || 0;

  const firstName = clerkUser?.firstName || "there";

  return (
    <>
      <NavBar />
      <main style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: "80px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 32px" }}>

          {/* Header */}
          <div style={{ marginBottom: "48px" }}>
            <p style={{ fontSize: "14px", color: "var(--text-dim)", marginBottom: "8px", fontWeight: 500 }}>
              WELCOME BACK
            </p>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "36px", fontWeight: 800 }}>
              Hey, {firstName} 👋
            </h1>
            <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>
              {fullUser?.targetRole ? `Targeting: ${fullUser.targetRole}` : "Upload a resume to get started"}
            </p>
          </div>

          {/* Stats Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
            {[
              { icon: "📄", label: "Resume", value: activeResume ? "Analyzed ✓" : "Not uploaded", accent: activeResume ? "#10B981" : "var(--text-dim)" },
              { icon: "🗺️", label: "Roadmap", value: totalWeeks ? `${completedWeeks}/${totalWeeks} weeks` : "Not started", accent: completedWeeks > 0 ? "#4F8EF7" : "var(--text-dim)" },
              { icon: "📋", label: "Applications", value: `${applications.length} tracked`, accent: applications.length > 0 ? "#7C3AED" : "var(--text-dim)" },
              { icon: "🐙", label: "GitHub Score", value: githubScore ? `${githubScore.overallScore}/100` : "Not scored", accent: githubScore ? "#F59E0B" : "var(--text-dim)" },
            ].map((stat) => (
              <div key={stat.label} className="card" style={{ position: "relative" }}>
                <div style={{ fontSize: "24px", marginBottom: "12px" }}>{stat.icon}</div>
                <div style={{ fontSize: "12px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: stat.accent, fontFamily: "Syne, sans-serif" }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Action Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
            <div className="card" style={{
              borderColor: !activeResume ? "rgba(79,142,247,0.4)" : "var(--border)",
              background: !activeResume ? "rgba(79,142,247,0.05)" : "var(--bg-2)",
              position: "relative", overflow: "hidden"
            }}>
              {!activeResume && (
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                  background: "linear-gradient(90deg, #4F8EF7, #7C3AED)"
                }} />
              )}
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
                {activeResume ? "Resume Analyzed ✓" : "Upload Your Resume"}
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "20px" }}>
                {activeResume ? activeResume.summary || "Resume analyzed. View your skill gaps and role fit." : "Upload your PDF resume to get AI-powered skill analysis and role-fit scoring."}
              </p>
              <Link href="/resume">
                <button className={!activeResume ? "btn-primary" : "btn-ghost"} style={{ fontSize: "14px" }}>
                  {activeResume ? "View Analysis →" : "Upload Resume →"}
                </button>
              </Link>
            </div>

            <div className="card" style={{
              borderColor: activeResume && !activeRoadmap ? "rgba(124,58,237,0.4)" : "var(--border)",
              background: activeResume && !activeRoadmap ? "rgba(124,58,237,0.05)" : "var(--bg-2)",
              position: "relative", overflow: "hidden"
            }}>
              {activeResume && !activeRoadmap && (
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                  background: "linear-gradient(90deg, #7C3AED, #4F8EF7)"
                }} />
              )}
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
                {activeRoadmap ? "Continue Roadmap" : "Generate Roadmap"}
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "20px" }}>
                {activeRoadmap ? `Week ${completedWeeks + 1} of ${totalWeeks}` : "Get a personalized week-by-week prep plan based on your resume."}
              </p>
              <Link href="/roadmap">
                <button className={activeResume && !activeRoadmap ? "btn-primary" : "btn-ghost"} style={{ fontSize: "14px" }}>
                  {activeRoadmap ? "Continue →" : "Generate Roadmap →"}
                </button>
              </Link>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: 700 }}>Recent Applications</h2>
              <Link href="/tracker" style={{ fontSize: "13px", color: "var(--accent)", textDecoration: "none" }}>
                View all →
              </Link>
            </div>
            {applications.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px", color: "var(--text-dim)" }}>
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>📋</div>
                <p style={{ fontSize: "14px" }}>No applications yet.</p>
                <Link href="/tracker" style={{ color: "var(--accent)", fontSize: "14px" }}>
                  Add your first one →
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {applications.slice(0, 4).map((app) => (
                  <div key={app.id} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "12px 16px", background: "var(--bg-3)", borderRadius: "10px",
                    border: "1px solid var(--border)"
                  }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: "15px" }}>{app.company}</span>
                      <span style={{ color: "var(--text-muted)", fontSize: "13px", marginLeft: "8px" }}>· {app.role}</span>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    WISHLIST: { bg: "rgba(107,122,153,0.15)", color: "#6B7A99" },
    APPLIED: { bg: "rgba(79,142,247,0.15)", color: "#4F8EF7" },
    SCREEN: { bg: "rgba(245,158,11,0.15)", color: "#F59E0B" },
    INTERVIEW: { bg: "rgba(124,58,237,0.15)", color: "#7C3AED" },
    OFFER: { bg: "rgba(16,185,129,0.15)", color: "#10B981" },
    REJECTED: { bg: "rgba(239,68,68,0.15)", color: "#EF4444" },
    WITHDRAWN: { bg: "rgba(107,122,153,0.1)", color: "#6B7A99" },
  };
  const s = styles[status] || styles.APPLIED;
  return (
    <span style={{
      fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "100px",
      background: s.bg, color: s.color, textTransform: "uppercase", letterSpacing: "0.05em"
    }}>
      {status}
    </span>
  );
}
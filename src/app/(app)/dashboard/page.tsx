import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, Map as MapIcon, KanbanSquare, GitBranch, Briefcase, PlusCircle, ArrowRight, ArrowUpRight, Inbox, Sparkles, Target } from "lucide-react";
import { ProfileAnalytics } from "@/components/ProfileAnalytics";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

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
      linkedinScores: { orderBy: { scoredAt: "desc" }, take: 1 },
      quizAttempts: { orderBy: { score: "desc" } },
    },
  });

  const activeResume = fullUser?.resumes[0];
  const activeRoadmap = fullUser?.roadmaps[0];
  const applications = fullUser?.applications || [];
  const githubScore = fullUser?.githubScores[0];
  const linkedinScore = fullUser?.linkedinScores[0];
  const completedWeeks = activeRoadmap?.weeks.filter((w) => w.isCompleted).length || 0;
  const totalWeeks = activeRoadmap?.weeks.length || 0;

  const firstName = clerkUser?.firstName || "there";

  // Copilot Leveling - Readiness Score Calculation
  const githubScoreVal = githubScore?.overallScore || 0;
  const linkedinScoreVal = linkedinScore?.overallScore || 0;
  const roadmapScoreVal = totalWeeks > 0 ? (completedWeeks / totalWeeks) * 100 : 0;
  
  const quizAttempts = fullUser?.quizAttempts || [];
  const bestQuizScore = quizAttempts.length > 0 
    ? Math.max(...quizAttempts.map(q => (q.score / Math.max(q.totalQuestions, 1)) * 100))
    : 0;
    
  const metricsCount = [githubScore, linkedinScore, activeRoadmap, quizAttempts.length > 0].filter(Boolean).length;
  // Average the available metrics. If none, score is 0.
  const readinessScore = metricsCount > 0 
    ? Math.round((githubScoreVal + linkedinScoreVal + roadmapScoreVal + bestQuizScore) / metricsCount)
    : 0;

  const circumference = 2 * Math.PI * 40; // radius = 40
  const strokeDashoffset = circumference - (readinessScore / 100) * circumference;

  return (
    <main style={{ padding: "48px 40px", flex: 1, background: "var(--bg)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Header with Copilot Leveling */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px", flexWrap: "wrap", gap: "24px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <div style={{ padding: "4px 10px", background: "rgba(79,142,247,0.1)", borderRadius: "100px", border: "1px solid rgba(79,142,247,0.2)" }}>
                <span style={{ fontSize: "12px", color: "#4F8EF7", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Welcome Back</span>
              </div>
            </div>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "40px", fontWeight: 800, color: "var(--text)", lineHeight: 1.1 }}>
              Hey, {firstName} 👋
            </h1>
            <p style={{ color: "var(--text-muted)", marginTop: "12px", fontSize: "16px", maxWidth: "600px" }}>
              {fullUser?.targetRole ? `Your mission: land a ${fullUser.targetRole} role. Let's make it happen.` : "Upload a resume to kickstart your personalized placement OS."}
            </p>
          </div>

          {/* Gamification Ring */}
          <div className="card" style={{ display: "flex", alignItems: "center", gap: "20px", padding: "20px 24px", animationDelay: "0.1s" }}>
            <div style={{ position: "relative", width: "100px", height: "100px", filter: "drop-shadow(0 4px 12px rgba(202,61,242,0.2))" }}>
              <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle 
                  cx="50" cy="50" r="40" fill="transparent" 
                  stroke="url(#gradient)" strokeWidth="8" 
                  strokeDasharray={circumference} 
                  strokeDashoffset={strokeDashoffset} 
                  strokeLinecap="round" 
                  style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.22, 1.4, 0.36, 1)" }} 
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ca3df2" />
                    <stop offset="100%" stopColor="#a32cc4" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "24px", fontWeight: 800, color: "var(--text)", fontFamily: "Syne, sans-serif", lineHeight: 1 }}>{readinessScore}</span>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, marginBottom: "4px" }}>
                <Target size={14} color="#ca3df2" /> Readiness Score
              </div>
              <p style={{ fontSize: "14px", color: "var(--text-dim)", maxWidth: "180px", lineHeight: 1.4 }}>
                {readinessScore >= 80 ? "You're heavily optimized." : "Complete analysis to boost your score."}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          {[
            { icon: FileText, label: "Resume Analysis", value: activeResume ? "Analyzed ✓" : "Not uploaded", accent: activeResume ? "#10B981" : "var(--text-dim)", bg: activeResume ? "rgba(16,185,129,0.05)" : "var(--bg-3)" },
            { icon: MapIcon, label: "Prep Roadmap", value: totalWeeks ? `${completedWeeks}/${totalWeeks} weeks` : "Not started", accent: completedWeeks > 0 ? "#4F8EF7" : "var(--text-dim)", bg: completedWeeks > 0 ? "rgba(79,142,247,0.05)" : "var(--bg-3)" },
            { icon: KanbanSquare, label: "Applications Tracker", value: `${applications.length} tracked`, accent: applications.length > 0 ? "#7C3AED" : "var(--text-dim)", bg: applications.length > 0 ? "rgba(124,58,237,0.05)" : "var(--bg-3)" },
            { icon: GitBranch, label: "GitHub Score", value: githubScore ? `${githubScore.overallScore}/100` : "Not scored", accent: githubScore ? "#F59E0B" : "var(--text-dim)", bg: githubScore ? "rgba(245,158,11,0.05)" : "var(--bg-3)" },
            { icon: Briefcase, label: "LinkedIn Score", value: linkedinScore ? `${linkedinScore.overallScore}/100` : "Not scored", accent: linkedinScore ? "#0A66C2" : "var(--text-dim)", bg: linkedinScore ? "rgba(10,102,194,0.05)" : "var(--bg-3)" },
          ].map((stat, i) => (
            <div key={stat.label} className="card animate-fade-up" style={{ padding: "24px", position: "relative", overflow: "hidden", animationDelay: `${i * 0.1}s` }}>
              <div style={{ position: "absolute", top: 0, right: 0, width: "120px", height: "120px", background: stat.bg, filter: "blur(40px)", borderRadius: "50%", transform: "translate(30%, -30%)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", color: stat.accent }}>
                <stat.icon size={24} strokeWidth={1.5} />
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px", fontWeight: 500 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: stat.accent, fontFamily: "Syne, sans-serif" }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Action Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
          
          {/* Resume Action */}
          <div className="card animate-fade-up" style={{ 
            background: !activeResume ? "linear-gradient(145deg, rgba(79,142,247,0.1), rgba(79,142,247,0.02))" : undefined, 
            borderColor: !activeResume ? "rgba(79,142,247,0.3)" : undefined, 
            padding: "32px", position: "relative", overflow: "hidden", animationDelay: "0.4s" 
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ padding: "10px", background: "var(--bg-3)", borderRadius: "12px", color: "var(--text)" }}>
                <FileText size={24} strokeWidth={1.5} />
              </div>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 700, color: "var(--text)" }}>
                {activeResume ? "Resume Analyzed" : "Step 1: Upload Resume"}
              </h3>
            </div>
            <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "24px" }}>
              {activeResume ? activeResume.summary || "Your resume has been analyzed. View your skill gaps and role fit." : "Upload your PDF resume to get an AI-powered skill analysis and discover your true role-fit."}
            </p>
            <Link href="/resume" style={{ textDecoration: "none" }}>
              <button className={!activeResume ? "btn-primary" : "btn-ghost"} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", padding: "12px 24px" }}>
                {activeResume ? "View Analysis" : "Upload Now"} <ArrowRight size={16} />
              </button>
            </Link>
          </div>

          {/* Roadmap Action */}
          <div className="card animate-fade-up" style={{ 
            background: activeResume && !activeRoadmap ? "linear-gradient(145deg, rgba(124,58,237,0.1), rgba(124,58,237,0.02))" : undefined, 
            borderColor: activeResume && !activeRoadmap ? "rgba(124,58,237,0.3)" : undefined, 
            padding: "32px", position: "relative", overflow: "hidden", animationDelay: "0.5s" 
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ padding: "10px", background: "var(--bg-3)", borderRadius: "12px", color: "var(--text)" }}>
                <MapIcon size={24} strokeWidth={1.5} />
              </div>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 700, color: "var(--text)" }}>
                {activeRoadmap ? "Continue Roadmap" : "Step 2: Generate Roadmap"}
              </h3>
            </div>
            <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "24px" }}>
              {activeRoadmap ? `You are on Week ${completedWeeks + 1} of ${totalWeeks}. Keep the momentum going!` : "Get a personalized week-by-week prep plan designed specifically to fill your skill gaps."}
            </p>
            <Link href="/roadmap" style={{ textDecoration: "none" }}>
              <button className={activeResume && !activeRoadmap ? "btn-primary" : "btn-ghost"} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", padding: "12px 24px" }}>
                {activeRoadmap ? "Continue Learning" : "Generate Roadmap"} <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>

        {/* GitHub Detailed View */}
        {githubScore && (
          <div className="card animate-fade-up" style={{ padding: "32px", marginBottom: "40px", animationDelay: "0.55s", border: "1px solid rgba(245,158,11,0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <div style={{ padding: "10px", background: "rgba(245,158,11,0.1)", borderRadius: "12px", color: "#F59E0B" }}>
                <GitBranch size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 700 }}>GitHub Profile Insights</h2>
                <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>Score: {githubScore.overallScore}/100 • Handle: @{githubScore.githubHandle}</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
              {/* Left Column: Breakdown */}
              <div style={{ background: "var(--bg-3)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border)" }}>
                <h3 style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>Score Breakdown</h3>
                {Object.entries(githubScore.breakdown as Record<string, number> || {}).map(([key, val]) => (
                  <div key={key} style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "14px" }}>
                    <span style={{ color: "var(--text-muted)", textTransform: "capitalize" }}>{key}</span>
                    <span style={{ fontWeight: 600, color: "var(--text)" }}>{val} / 25</span>
                  </div>
                ))}
              </div>

              {/* Right Column: Feedback Overview */}
              <div style={{ background: "var(--bg-3)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border)" }}>
                <h3 style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>AI Feedback Summary</h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                  {githubScore.markdownFeedback?.replace(/[#*_`]/g, '') || "No detailed feedback generated yet."}
                </p>
                <div style={{ marginTop: "16px", display: "flex" }}>
                  <Link href="/github-score" style={{ textDecoration: "none" }}>
                    <button className="btn-ghost" style={{ padding: "8px 16px", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                      View Full Analysis <ArrowRight size={14} />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Section */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
          
          {/* Tracker Overview */}
          <div className="card animate-fade-up" style={{ padding: "32px", animationDelay: "0.6s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <KanbanSquare size={20} color="var(--text)" />
                <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: 700 }}>Recent Applications</h2>
              </div>
              <Link href="/tracker" style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#4F8EF7", fontWeight: 600, textDecoration: "none" }}>
                View Board <ArrowUpRight size={14} />
              </Link>
            </div>

            {applications.length === 0 ? (
              <div style={{ 
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", 
                padding: "48px 24px", background: "var(--bg-3)", borderRadius: "12px", border: "1px dashed var(--border)" 
              }}>
                <Inbox size={40} color="var(--text-dim)" strokeWidth={1} style={{ marginBottom: "16px" }} />
                <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)", marginBottom: "8px" }}>No applications tracked</h3>
                <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px", textAlign: "center", maxWidth: "300px" }}>
                  Your kanban board is empty. Start tracking your applications to stay organized.
                </p>
                <Link href="/tracker" style={{ textDecoration: "none" }}>
                  <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", padding: "10px 20px" }}>
                    <PlusCircle size={16} /> Add Application
                  </button>
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {applications.slice(0, 4).map((app) => (
                  <div key={app.id} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "16px", background: "var(--bg-3)", borderRadius: "12px",
                    border: "1px solid var(--border)", transition: "all 0.2s"
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "15px", color: "var(--text)", marginBottom: "4px" }}>{app.company}</div>
                      <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>{app.role}</div>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions / Up-sell */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="card animate-fade-up" style={{ padding: "32px", position: "relative", overflow: "hidden", animationDelay: "0.7s" }}>
              <Sparkles size={120} color="var(--border-bright)" style={{ position: "absolute", bottom: "-20px", right: "-20px", opacity: 0.5 }} />
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--text)", marginBottom: "12px" }}>
                Job Description Matcher
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "24px" }}>
                Paste a JD and let AI compare it against your resume to find exact keyword gaps.
              </p>
              <Link href="/matcher" style={{ textDecoration: "none" }}>
                <button className="btn-primary" style={{ width: "100%" }}>
                  Try Matcher →
                </button>
              </Link>
            </div>

            <div className="card animate-fade-up" style={{ padding: "32px", animationDelay: "0.8s" }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--text)", marginBottom: "12px" }}>
                Mock Interviews
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "24px" }}>
                Practice answering role-specific questions generated by Gemini AI.
              </p>
              <Link href="/interview" style={{ textDecoration: "none" }}>
                <button className="btn-ghost" style={{ width: "100%", fontSize: "14px" }}>
                  Start Practice
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    WISHLIST: { bg: "rgba(107,122,153,0.15)", color: "#6B7A99", border: "rgba(107,122,153,0.3)" },
    APPLIED: { bg: "rgba(79,142,247,0.15)", color: "#4F8EF7", border: "rgba(79,142,247,0.3)" },
    SCREEN: { bg: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "rgba(245,158,11,0.3)" },
    INTERVIEW: { bg: "rgba(124,58,237,0.15)", color: "#7C3AED", border: "rgba(124,58,237,0.3)" },
    OFFER: { bg: "rgba(16,185,129,0.15)", color: "#10B981", border: "rgba(16,185,129,0.3)" },
    REJECTED: { bg: "rgba(239,68,68,0.15)", color: "#EF4444", border: "rgba(239,68,68,0.3)" },
    WITHDRAWN: { bg: "rgba(107,122,153,0.1)", color: "#6B7A99", border: "rgba(107,122,153,0.2)" },
  };
  const s = styles[status] || styles.APPLIED;
  return (
    <span style={{
      fontSize: "11px", fontWeight: 700, padding: "6px 12px", borderRadius: "100px",
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      textTransform: "uppercase", letterSpacing: "0.05em"
    }}>
      {status}
    </span>
  );
}
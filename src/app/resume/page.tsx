// src/app/resume/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";

const TARGET_ROLES = [
  "Full Stack Developer", "Frontend Developer", "Backend Developer",
  "Software Engineer", "DevOps Engineer", "Data Scientist",
  "Machine Learning Engineer", "Mobile Developer",
];

export default function ResumePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState(TARGET_ROLES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") setFile(dropped);
    else setError("Only PDF files are supported");
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("targetRole", targetRole);
      const res = await fetch("/api/resume/analyze", { method: "POST", body: formData });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setAnalysis(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <main style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: "80px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 32px" }}>

          <div style={{ marginBottom: "40px" }}>
            <p style={{ fontSize: "13px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
              STEP 1
            </p>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "32px", fontWeight: 800, marginBottom: "8px" }}>
              Resume Analysis
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
              Upload your PDF resume for AI-powered skill analysis and role-fit scoring.
            </p>
          </div>

          {!analysis ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

              {/* Role selector */}
              <div className="card">
                <label style={{ fontSize: "13px", color: "var(--text-muted)", display: "block", marginBottom: "10px", fontWeight: 500 }}>
                  Target Role
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {TARGET_ROLES.map((r) => (
                    <button
                      key={r}
                      onClick={() => setTargetRole(r)}
                      style={{
                        padding: "7px 16px", borderRadius: "100px", fontSize: "13px",
                        fontWeight: 500, cursor: "pointer", transition: "all 0.2s",
                        border: targetRole === r ? "1px solid #4F8EF7" : "1px solid var(--border)",
                        background: targetRole === r ? "rgba(79,142,247,0.15)" : "transparent",
                        color: targetRole === r ? "#4F8EF7" : "var(--text-muted)",
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drop zone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                style={{
                  border: `2px dashed ${dragOver ? "#4F8EF7" : file ? "#10B981" : "var(--border)"}`,
                  borderRadius: "16px", padding: "60px 40px", textAlign: "center",
                  background: dragOver ? "rgba(79,142,247,0.05)" : file ? "rgba(16,185,129,0.05)" : "var(--bg-2)",
                  transition: "all 0.2s", cursor: "pointer"
                }}
                onClick={() => !file && document.getElementById("file-input")?.click()}
              >
                {file ? (
                  <div>
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
                    <p style={{ fontWeight: 600, color: "#10B981", fontSize: "16px", marginBottom: "4px" }}>{file.name}</p>
                    <p style={{ fontSize: "13px", color: "var(--text-dim)", marginBottom: "16px" }}>
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="btn-ghost"
                      style={{ fontSize: "13px" }}
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>📄</div>
                    <p style={{ fontWeight: 600, fontSize: "16px", marginBottom: "8px" }}>
                      Drop your resume here
                    </p>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px" }}>
                      PDF only, max 5MB
                    </p>
                    <button className="btn-ghost" style={{ fontSize: "14px" }}>
                      Browse files
                    </button>
                  </div>
                )}
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf"
                  style={{ display: "none" }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }}
                />
              </div>

              {error && (
                <div style={{
                  padding: "14px 18px", borderRadius: "10px",
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                  color: "#EF4444", fontSize: "14px"
                }}>
                  {error}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={!file || loading}
                className="btn-primary"
                style={{ width: "100%", padding: "16px", fontSize: "16px", borderRadius: "12px" }}
              >
                {loading ? "🤖 Analyzing with AI..." : "Analyze Resume →"}
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Score */}
              <div className="card" style={{ position: "relative", overflow: "hidden" }}>
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                  background: "linear-gradient(90deg, #4F8EF7, #7C3AED)"
                }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                  <div>
                    <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>
                      Overall Profile Strength
                    </h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>{analysis.summary}</p>
                  </div>
                  <div style={{
                    fontFamily: "Syne, sans-serif", fontSize: "48px", fontWeight: 800,
                    background: "linear-gradient(135deg, #4F8EF7, #7C3AED)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    lineHeight: 1, flexShrink: 0, marginLeft: "24px"
                  }}>
                    {analysis.overallStrength}
                    <span style={{ fontSize: "20px" }}>/100</span>
                  </div>
                </div>
                <div style={{ height: "8px", background: "var(--bg-3)", borderRadius: "100px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${analysis.overallStrength}%`,
                    background: "linear-gradient(90deg, #4F8EF7, #7C3AED)",
                    borderRadius: "100px", transition: "width 1s ease"
                  }} />
                </div>
              </div>

              {/* Role Fit */}
              <div className="card">
                <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>
                  Role Fit Scores
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {(analysis.roleFitScores || []).map((role: any) => (
                    <div key={role.role}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ fontWeight: 600, fontSize: "15px" }}>{role.role}</span>
                        <span style={{
                          fontWeight: 700, fontSize: "15px",
                          color: role.score >= 70 ? "#10B981" : role.score >= 50 ? "#F59E0B" : "#EF4444"
                        }}>
                          {role.score}%
                        </span>
                      </div>
                      <div style={{ height: "6px", background: "var(--bg-3)", borderRadius: "100px", overflow: "hidden", marginBottom: "8px" }}>
                        <div style={{
                          height: "100%", width: `${role.score}%`, borderRadius: "100px",
                          background: role.score >= 70 ? "#10B981" : role.score >= 50 ? "#F59E0B" : "#EF4444",
                          transition: "width 1s ease"
                        }} />
                      </div>
                      {role.gaps?.length > 0 && (
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {role.gaps.slice(0, 3).map((gap: string) => (
                            <span key={gap} style={{
                              fontSize: "12px", padding: "3px 10px", borderRadius: "100px",
                              background: "rgba(239,68,68,0.1)", color: "#EF4444",
                              border: "1px solid rgba(239,68,68,0.2)"
                            }}>
                              ✗ {gap}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="card">
                <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>
                  Detected Skills
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {[
                    { label: "Technical", items: analysis.skills?.technical || [], color: "#4F8EF7", bg: "rgba(79,142,247,0.1)" },
                    { label: "Tools", items: analysis.skills?.tools || [], color: "#7C3AED", bg: "rgba(124,58,237,0.1)" },
                    { label: "Soft Skills", items: analysis.skills?.soft || [], color: "#10B981", bg: "rgba(16,185,129,0.1)" },
                  ].map(({ label, items, color, bg }) => items.length > 0 && (
                    <div key={label}>
                      <p style={{ fontSize: "12px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>
                        {label}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {items.map((skill: string) => (
                          <span key={skill} style={{
                            fontSize: "13px", padding: "5px 12px", borderRadius: "100px",
                            background: bg, color, border: `1px solid ${color}30`, fontWeight: 500
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Gaps */}
              {(analysis.topSkillGaps?.length > 0) && (
                <div className="card" style={{ borderColor: "rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.03)" }}>
                  <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: 700, marginBottom: "16px", color: "#EF4444" }}>
                    Top Skill Gaps
                  </h2>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {analysis.topSkillGaps.map((gap: string) => (
                      <span key={gap} style={{
                        fontSize: "13px", padding: "6px 14px", borderRadius: "100px",
                        background: "rgba(239,68,68,0.1)", color: "#EF4444",
                        border: "1px solid rgba(239,68,68,0.25)", fontWeight: 500
                      }}>
                        {gap}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <button
                onClick={() => router.push(`/roadmap?resumeId=${analysis.resumeId}&role=${encodeURIComponent(targetRole)}`)}
                className="btn-primary"
                style={{ width: "100%", padding: "16px", fontSize: "16px", borderRadius: "12px" }}
              >
                Generate My Personalized Roadmap →
              </button>

              <button
                onClick={() => { setAnalysis(null); setFile(null); }}
                className="btn-ghost"
                style={{ width: "100%", fontSize: "14px" }}
              >
                ↺ Analyze a different resume
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
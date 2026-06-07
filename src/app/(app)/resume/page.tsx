"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { UploadCloud, FileText, CheckCircle2, ArrowRight, RefreshCcw, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";

const TARGET_ROLES = [
  "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", 
  "DevOps Engineer", "Data Scientist", "Machine Learning Engineer", "Mobile Developer",
];

export default function ResumePage() {
  const router = useRouter();
  const { theme } = useTheme();
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

  const isDark = theme === "dark" || !theme;
  const skeletonBase = isDark ? "#1A1F2E" : "#E5E7EB";
  const skeletonHighlight = isDark ? "#2D3748" : "#F3F4F6";

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", padding: "48px 40px", flex: 1 }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <div style={{ padding: "4px 10px", background: "rgba(16,185,129,0.1)", borderRadius: "100px", border: "1px solid rgba(16,185,129,0.2)" }}>
              <span style={{ fontSize: "12px", color: "#10B981", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Step 1 of 3</span>
            </div>
          </div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "36px", fontWeight: 800, marginBottom: "12px", color: "var(--text)" }}>
            Resume Analysis
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "16px", maxWidth: "600px" }}>
            Upload your PDF resume. Our Gemini-powered AI will extract your skills, score your role-fit out of 100, and identify the exact gaps standing between you and an offer.
          </p>
        </div>

        {loading ? (
          <SkeletonTheme baseColor={skeletonBase} highlightColor={skeletonHighlight}>
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Sparkles size={48} color="#4F8EF7" className="animate-pulse" style={{ margin: "0 auto 20px" }} />
                <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>AI is analyzing your profile...</h2>
                <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>Extracting skills, computing ATS match, and generating your roadmap.</p>
              </div>
              <div className="card"><Skeleton height={80} borderRadius={12} /></div>
              <div className="card"><Skeleton height={150} borderRadius={12} /></div>
              <div className="card"><Skeleton height={200} borderRadius={12} /></div>
            </div>
          </SkeletonTheme>
        ) : !analysis ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Role selector */}
            <div className="card">
              <label style={{ fontSize: "14px", color: "var(--text)", display: "block", marginBottom: "16px", fontWeight: 600 }}>
                What role are you targeting?
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {TARGET_ROLES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setTargetRole(r)}
                    style={{
                      padding: "8px 18px", borderRadius: "100px", fontSize: "14px",
                      fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                      border: targetRole === r ? "1px solid #4F8EF7" : "1px solid var(--border)",
                      background: targetRole === r ? "rgba(79,142,247,0.15)" : "var(--bg-3)",
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
                borderRadius: "20px", padding: "80px 40px", textAlign: "center",
                background: dragOver ? "rgba(79,142,247,0.05)" : file ? "rgba(16,185,129,0.05)" : "var(--bg-2)",
                transition: "all 0.2s ease", cursor: "pointer", position: "relative", overflow: "hidden"
              }}
              onClick={() => !file && document.getElementById("file-input")?.click()}
            >
              {file ? (
                <div className="animate-fade-in">
                  <CheckCircle2 size={64} color="#10B981" strokeWidth={1.5} style={{ margin: "0 auto 20px" }} />
                  <p style={{ fontWeight: 700, color: "var(--text)", fontSize: "20px", marginBottom: "8px" }}>{file.name}</p>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>
                    {(file.size / 1024).toFixed(1)} KB • Ready for analysis
                  </p>
                  <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); window.open(URL.createObjectURL(file), "_blank"); }}
                      className="btn-primary"
                      style={{ fontSize: "14px", padding: "8px 16px" }}
                    >
                      View PDF
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="btn-ghost"
                      style={{ fontSize: "14px", padding: "8px 16px" }}
                    >
                      Remove file
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <UploadCloud size={64} color={dragOver ? "#4F8EF7" : "var(--text-dim)"} strokeWidth={1.5} style={{ margin: "0 auto 20px" }} />
                  <p style={{ fontWeight: 700, fontSize: "20px", color: "var(--text)", marginBottom: "12px" }}>
                    Drag & Drop your resume here
                  </p>
                  <p style={{ color: "var(--text-muted)", fontSize: "15px", marginBottom: "24px" }}>
                    Supports PDF formats up to 5MB
                  </p>
                  <button className="btn-primary" style={{ fontSize: "15px" }}>
                    Browse Files
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
              <div className="animate-fade-in" style={{
                padding: "16px 20px", borderRadius: "12px",
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                color: "#EF4444", fontSize: "15px", display: "flex", alignItems: "center", gap: "12px"
              }}>
                <span style={{ fontSize: "20px" }}>⚠️</span> {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className="btn-primary"
              style={{ width: "100%", padding: "20px", fontSize: "18px", borderRadius: "16px", display: "flex", justifyContent: "center", alignItems: "center", gap: "12px" }}
            >
              Analyze Resume <Sparkles size={20} />
            </button>
          </div>
        ) : (
          <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Score */}
            <div className="card" style={{ position: "relative", overflow: "hidden", padding: "32px" }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "4px",
                background: "linear-gradient(90deg, #4F8EF7, #7C3AED)"
              }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
                <div style={{ paddingRight: "40px" }}>
                  <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "24px", fontWeight: 800, marginBottom: "8px", color: "var(--text)" }}>
                    Profile Strength
                  </h2>
                  <p style={{ color: "var(--text-muted)", fontSize: "16px", lineHeight: 1.6 }}>{analysis.summary}</p>
                </div>
                <div style={{
                  fontFamily: "Syne, sans-serif", fontSize: "64px", fontWeight: 800,
                  background: "linear-gradient(135deg, #4F8EF7, #7C3AED)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  lineHeight: 1, flexShrink: 0
                }}>
                  {analysis.overallStrength}
                  <span style={{ fontSize: "24px", color: "var(--text-dim)" }}>/100</span>
                </div>
              </div>
              <div style={{ height: "12px", background: "var(--bg-3)", borderRadius: "100px", overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${analysis.overallStrength}%`,
                  background: "linear-gradient(90deg, #4F8EF7, #7C3AED)",
                  borderRadius: "100px", transition: "width 1s ease"
                }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              {/* Role Fit */}
              <div className="card">
                <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 700, marginBottom: "24px", color: "var(--text)" }}>
                  Role Fit Scores
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {(analysis.roleFitScores || []).map((role: any) => (
                    <div key={role.role}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <span style={{ fontWeight: 600, fontSize: "15px", color: "var(--text)" }}>{role.role}</span>
                        <span style={{
                          fontWeight: 700, fontSize: "16px",
                          color: role.score >= 70 ? "#10B981" : role.score >= 50 ? "#F59E0B" : "#EF4444"
                        }}>
                          {role.score}%
                        </span>
                      </div>
                      <div style={{ height: "8px", background: "var(--bg-3)", borderRadius: "100px", overflow: "hidden", marginBottom: "12px" }}>
                        <div style={{
                          height: "100%", width: `${role.score}%`, borderRadius: "100px",
                          background: role.score >= 70 ? "#10B981" : role.score >= 50 ? "#F59E0B" : "#EF4444",
                          transition: "width 1s ease"
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Gaps */}
              <div className="card" style={{ borderColor: "rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.02)" }}>
                <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 700, marginBottom: "20px", color: "#EF4444" }}>
                  Top Skill Gaps
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {analysis.topSkillGaps?.map((gap: string) => (
                    <span key={gap} style={{
                      fontSize: "14px", padding: "8px 16px", borderRadius: "100px",
                      background: "rgba(239,68,68,0.1)", color: "#EF4444",
                      border: "1px solid rgba(239,68,68,0.25)", fontWeight: 600
                    }}>
                      ✗ {gap}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="card">
              <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 700, marginBottom: "24px", color: "var(--text)" }}>
                Detected Skills
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {[
                  { label: "Technical", items: analysis.skills?.technical || [], color: "#4F8EF7", bg: "rgba(79,142,247,0.1)" },
                  { label: "Tools", items: analysis.skills?.tools || [], color: "#7C3AED", bg: "rgba(124,58,237,0.1)" },
                  { label: "Soft Skills", items: analysis.skills?.soft || [], color: "#10B981", bg: "rgba(16,185,129,0.1)" },
                ].map(({ label, items, color, bg }) => items.length > 0 && (
                  <div key={label}>
                    <p style={{ fontSize: "13px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px", fontWeight: 600 }}>
                      {label}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                      {items.map((skill: string) => (
                        <span key={skill} style={{
                          fontSize: "14px", padding: "6px 16px", borderRadius: "100px",
                          background: bg, color, border: `1px solid ${color}30`, fontWeight: 600
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
              <button
                onClick={() => router.push(`/roadmap?resumeId=${analysis.resumeId}&role=${encodeURIComponent(targetRole)}`)}
                className="btn-primary"
                style={{ flex: 2, padding: "20px", fontSize: "16px", borderRadius: "16px", display: "flex", justifyContent: "center", alignItems: "center", gap: "12px" }}
              >
                Generate My Personalized Roadmap <ArrowRight size={20} />
              </button>
              <button
                onClick={() => { setAnalysis(null); setFile(null); }}
                className="btn-ghost"
                style={{ flex: 1, padding: "20px", fontSize: "15px", borderRadius: "16px", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}
              >
                <RefreshCcw size={18} /> Analyze Another
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
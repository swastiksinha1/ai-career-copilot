// src/app/roadmap/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const taskTypeColors: Record<string, { bg: string; color: string }> = {
  learn: { bg: "rgba(79,142,247,0.1)", color: "#4F8EF7" },
  build: { bg: "rgba(16,185,129,0.1)", color: "#10B981" },
  practice: { bg: "rgba(124,58,237,0.1)", color: "#7C3AED" },
  apply: { bg: "rgba(245,158,11,0.1)", color: "#F59E0B" },
};

function RoadmapContent() {
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("resumeId");
  const role = searchParams.get("role") || "Software Engineer";

  const [weeks, setWeeks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);
  const [durationWeeks, setDurationWeeks] = useState(8);

  useEffect(() => { fetchExistingRoadmap(); }, []);

  const fetchExistingRoadmap = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/roadmap/generate");
      const data = await res.json();
      if (data.success && data.data?.weeks) {
        setWeeks(mapWeeks(data.data.weeks));
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const mapWeeks = (raw: any[]) => raw.map((w: any) => ({
    ...w,
    tasks: Array.isArray(w.tasks)
      ? w.tasks.map((t: any, i: number) => ({
          id: t.id || `task-${i}`,
          task: t.task,
          type: t.type || "learn",
          completed: t.completed || false,
          resources: t.resources || [],
        }))
      : [],
  }));

  const generateRoadmap = async () => {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole: role, durationWeeks }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setWeeks(mapWeeks(data.data.weeks));
      setExpandedWeek(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const toggleTask = (weekIndex: number, taskId: string) => {
    setWeeks((prev) => prev.map((week, i) =>
      i === weekIndex
        ? { ...week, tasks: week.tasks.map((t: any) => t.id === taskId ? { ...t, completed: !t.completed } : t) }
        : week
    ));
  };

  const completedCount = weeks.reduce((acc, w) => acc + w.tasks.filter((t: any) => t.completed).length, 0);
  const totalCount = weeks.reduce((acc, w) => acc + w.tasks.length, 0);
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (loading) {
    return (
        <div style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>Loading roadmap...</p>
        </div>
    );
  }

  return (
      <main style={{ minHeight: "100vh", background: "var(--bg)", padding: "0" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 32px" }}>

          {/* Header */}
          <div style={{ marginBottom: "40px" }}>
            <p style={{ fontSize: "13px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
              STEP 2
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "32px", fontWeight: 800, marginBottom: "8px" }}>
                  Your Roadmap
                </h1>
                <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
                  {weeks.length > 0 ? `Targeting: ${role}` : "Generate your personalized week-by-week plan"}
                </p>
              </div>
              {weeks.length > 0 && (
                <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "24px" }}>
                  <div style={{
                    fontFamily: "Syne, sans-serif", fontSize: "36px", fontWeight: 800,
                    background: "linear-gradient(135deg, #4F8EF7, #7C3AED)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                  }}>
                    {progress}%
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-dim)" }}>complete</div>
                </div>
              )}
            </div>
          </div>

          {/* Progress bar */}
          {weeks.length > 0 && (
            <div style={{ marginBottom: "32px" }}>
              <div style={{ height: "6px", background: "var(--bg-3)", borderRadius: "100px", overflow: "hidden", marginBottom: "8px" }}>
                <div style={{
                  height: "100%", width: `${progress}%`,
                  background: "linear-gradient(90deg, #4F8EF7, #7C3AED)",
                  borderRadius: "100px", transition: "width 0.5s ease"
                }} />
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-dim)" }}>
                {completedCount}/{totalCount} tasks completed
              </p>
            </div>
          )}

          {error && (
            <div style={{
              padding: "14px 18px", borderRadius: "10px", marginBottom: "24px",
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              color: "#EF4444", fontSize: "14px"
            }}>
              {error}
            </div>
          )}

          {/* Generate controls */}
          {weeks.length === 0 && (
            <div className="card no-print" style={{ marginBottom: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <label style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)" }}>
                Preparation Duration: {durationWeeks} Week{durationWeeks > 1 ? "s" : ""}
              </label>
              <input 
                type="range" min="1" max="8" 
                value={durationWeeks} 
                onChange={(e) => setDurationWeeks(parseInt(e.target.value))}
                style={{ accentColor: "#4F8EF7", cursor: "pointer" }}
              />
              <button
                onClick={generateRoadmap}
                disabled={generating}
                className="btn-primary"
                style={{ width: "100%", padding: "16px", fontSize: "16px", borderRadius: "12px", marginTop: "8px" }}
              >
                {generating ? "🤖 Generating your roadmap..." : `Generate ${durationWeeks}-Week Roadmap for ${role} →`}
              </button>
            </div>
          )}

          {/* Week Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {weeks.map((week, weekIndex) => {
              const weekCompleted = week.tasks.filter((t: any) => t.completed).length;
              const weekTotal = week.tasks.length;
              const isExpanded = expandedWeek === week.weekNumber;
              const weekProgress = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;

              return (
                <div key={week.weekNumber} style={{
                  background: "var(--bg-2)", borderRadius: "14px", overflow: "hidden",
                  border: `1px solid ${week.isCompleted ? "rgba(16,185,129,0.3)" : "var(--border)"}`,
                  transition: "border-color 0.2s"
                }}>
                  <button
                    onClick={() => setExpandedWeek(isExpanded ? null : week.weekNumber)}
                    style={{
                      width: "100%", padding: "18px 20px", display: "flex",
                      alignItems: "center", justifyContent: "space-between",
                      background: "transparent", border: "none", cursor: "pointer",
                      color: "var(--text)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      {/* Week number */}
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
                        background: week.isCompleted ? "rgba(16,185,129,0.15)" : "rgba(79,142,247,0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "14px",
                        color: week.isCompleted ? "#10B981" : "#4F8EF7"
                      }}>
                        {week.isCompleted ? "✓" : `W${week.weekNumber}`}
                      </div>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "15px", marginBottom: "2px" }}>
                          {week.title}
                        </div>
                        <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{week.focus}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: weekCompleted === weekTotal && weekTotal > 0 ? "#10B981" : "var(--text-muted)" }}>
                          {weekCompleted}/{weekTotal}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>done</div>
                      </div>
                      <div style={{ width: "40px", height: "40px", position: "relative" }}>
                        <svg width="40" height="40" style={{ transform: "rotate(-90deg)" }}>
                          <circle cx="20" cy="20" r="16" fill="none" stroke="var(--bg-3)" strokeWidth="3" />
                          <circle cx="20" cy="20" r="16" fill="none"
                            stroke={weekCompleted === weekTotal && weekTotal > 0 ? "#10B981" : "#4F8EF7"}
                            strokeWidth="3"
                            strokeDasharray={`${2 * Math.PI * 16}`}
                            strokeDashoffset={`${2 * Math.PI * 16 * (1 - weekProgress / 100)}`}
                            strokeLinecap="round"
                            style={{ transition: "stroke-dashoffset 0.5s ease" }}
                          />
                        </svg>
                      </div>
                      <span style={{ color: "var(--text-dim)", fontSize: "12px" }}>{isExpanded ? "▲" : "▼"}</span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      {week.tasks.map((task: any) => {
                        const tc = taskTypeColors[task.type] || taskTypeColors.learn;
                        return (
                          <div key={task.id} style={{
                            display: "flex", gap: "14px", alignItems: "flex-start",
                            padding: "14px 16px", borderRadius: "10px",
                            background: task.completed ? "rgba(16,185,129,0.04)" : "var(--bg-3)",
                            border: `1px solid ${task.completed ? "rgba(16,185,129,0.15)" : "var(--border)"}`,
                            opacity: task.completed ? 0.7 : 1, transition: "all 0.2s"
                          }}>
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => toggleTask(weekIndex, task.id)}
                              style={{ marginTop: "2px", width: "16px", height: "16px", cursor: "pointer", accentColor: "#4F8EF7", flexShrink: 0 }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{
                                fontSize: "14px", lineHeight: 1.5,
                                color: task.completed ? "var(--text-dim)" : "var(--text)",
                                textDecoration: task.completed ? "line-through" : "none",
                                marginBottom: "8px"
                              }}>
                                {task.task}
                              </p>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                <span style={{
                                  fontSize: "11px", padding: "3px 10px", borderRadius: "100px",
                                  background: tc.bg, color: tc.color, fontWeight: 600,
                                  textTransform: "uppercase", letterSpacing: "0.05em"
                                }}>
                                  {task.type}
                                </span>
                                {task.resources?.slice(0, 2).map((r: string, i: number) => (
                                  <a key={i} href={r.startsWith("http") ? r : "#"} target="_blank" rel="noreferrer"
                                    style={{ fontSize: "12px", color: "#4F8EF7", textDecoration: "none" }}
                                    onMouseOver={e => (e.target as HTMLElement).style.textDecoration = "underline"}
                                    onMouseOut={e => (e.target as HTMLElement).style.textDecoration = "none"}
                                  >
                                    {r.startsWith("http") ? new URL(r).hostname : r}
                                  </a>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Regenerate */}
          {/* Regenerate & PDF Export */}
          {weeks.length > 0 && (
            <div className="no-print" style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "16px", background: "var(--bg-2)", padding: "24px", borderRadius: "16px", border: "1px solid var(--border)" }}>
              <label style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>
                Adjust Duration: {durationWeeks} Week{durationWeeks > 1 ? "s" : ""}
              </label>
              <input 
                type="range" min="1" max="8" 
                value={durationWeeks} 
                onChange={(e) => setDurationWeeks(parseInt(e.target.value))}
                style={{ accentColor: "#4F8EF7", cursor: "pointer", marginBottom: "8px" }}
              />
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={generateRoadmap}
                  disabled={generating}
                  className="btn-ghost"
                  style={{ flex: 1, fontSize: "14px" }}
                >
                  {generating ? "Regenerating..." : `↻ Regenerate`}
                </button>
                <button
                  onClick={() => window.print()}
                  className="btn-primary"
                  style={{ flex: 1, fontSize: "14px", padding: "12px" }}
                >
                  Download PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
  );
}

export default function RoadmapPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading...</p>
      </div>
    }>
      <RoadmapContent />
    </Suspense>
  );
}
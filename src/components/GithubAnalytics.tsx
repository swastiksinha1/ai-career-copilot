"use client";

import { useState } from "react";
import { GitBranch, Loader2, User, Sparkles, Star, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";

export function GithubAnalytics({ initialScore }: { initialScore: any }) {
  const [score, setScore] = useState(initialScore);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!username) return;
    setLoading(true);
    try {
      const res = await fetch("/api/github/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
      });
      const data = await res.json();
      if (data.success) setScore(data.data);
    } finally {
      setLoading(false);
    }
  };

  const markdownComponents = {
    h1: ({node, ...props}: any) => <h1 style={{fontSize: '24px', fontWeight: 800, color: 'var(--text)', marginTop: '24px', marginBottom: '16px', fontFamily: "Syne, sans-serif"}} {...props} />,
    h2: ({node, ...props}: any) => <h2 style={{fontSize: '20px', fontWeight: 700, color: 'var(--text)', marginTop: '24px', marginBottom: '16px', fontFamily: "Syne, sans-serif"}} {...props} />,
    h3: ({node, ...props}: any) => <h3 style={{fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginTop: '20px', marginBottom: '12px'}} {...props} />,
    ul: ({node, ...props}: any) => <ul style={{paddingLeft: '24px', marginBottom: '20px', listStyleType: 'disc', color: 'var(--text-muted)'}} {...props} />,
    ol: ({node, ...props}: any) => <ol style={{paddingLeft: '24px', marginBottom: '20px', listStyleType: 'decimal', color: 'var(--text-muted)'}} {...props} />,
    li: ({node, ...props}: any) => <li style={{marginBottom: '8px', lineHeight: 1.6}} {...props} />,
    p: ({node, ...props}: any) => <p style={{marginBottom: '16px', color: 'var(--text-muted)', lineHeight: 1.7, fontSize: "15px"}} {...props} />,
    strong: ({node, ...props}: any) => <strong style={{color: 'var(--text)', fontWeight: 700}} {...props} />,
    blockquote: ({node, ...props}: any) => <blockquote style={{borderLeft: '4px solid #F59E0B', paddingLeft: '16px', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '16px'}} {...props} />,
    code: ({node, inline, ...props}: any) => inline 
      ? <code style={{background: 'rgba(245,158,11,0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', color: '#F59E0B', fontFamily: 'monospace'}} {...props} />
      : <pre style={{background: 'var(--bg-3)', padding: '16px', borderRadius: '12px', overflowX: 'auto', marginBottom: '16px', border: '1px solid var(--border)'}}><code style={{fontSize: '13px', fontFamily: 'monospace', color: 'var(--text)'}} {...props} /></pre>,
  };

  return (
    <div className="card animate-fade-up" style={{ width: "100%", maxWidth: "900px", margin: "0 auto", padding: "40px" }}>
      
      {score ? (
        <div className="animate-fade-in">
          {/* Header Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ padding: "10px", background: "rgba(245,158,11,0.1)", borderRadius: "12px", color: "#F59E0B" }}>
                  <GitBranch size={24} />
                </div>
                <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {score.profileName || "GitHub Profile"}
                </div>
              </div>
              <a href={`https://github/${score.githubHandle}`} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "6px", color: "#4F8EF7", textDecoration: "none", fontWeight: 600, fontSize: "15px", marginBottom: "8px" }}>
                @{score.githubHandle}
              </a>
              <p style={{ fontSize: "14px", color: "var(--text-dim)" }}>
                Last analyzed: {new Date(score.scoredAt).toISOString().split('T')[0]}
              </p>
            </div>
            
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Overall Score</div>
              <div style={{ fontSize: "56px", fontWeight: 800, color: "#F59E0B", fontFamily: "Syne, sans-serif", lineHeight: 1 }}>
                {score.overallScore}<span style={{ fontSize: "24px", color: "var(--text-dim)", fontWeight: 600 }}>/100</span>
              </div>
            </div>
          </div>
          
          {/* Score Breakdown Grid */}
          <div style={{ marginBottom: "40px" }}>
            <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <GitBranch size={16} /> Metrics Breakdown
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
              {Object.entries(score.breakdown || {}).map(([k, v]) => (
                <div key={k} style={{ display: "flex", flexDirection: "column", gap: "8px", background: "var(--bg-3)", padding: "20px", borderRadius: "16px", border: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                    {k.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span style={{ fontSize: "28px", fontWeight: 800, color: "var(--text)", fontFamily: "Syne, sans-serif" }}>
                    {String(v)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Repositories */}
          {score.topRepos && score.topRepos.length > 0 && (
            <div style={{ marginBottom: "40px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Star size={16} /> Top Repositories
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                {score.topRepos.map((repo: any, i: number) => (
                  <div key={i} style={{ padding: "24px", background: "var(--bg-3)", borderRadius: "16px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "12px", transition: "transform 0.2s", cursor: "default" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span style={{ fontWeight: 700, color: "var(--text)", fontSize: "16px", fontFamily: "Syne, sans-serif" }}>{repo.name}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#F59E0B", fontWeight: 700, background: "rgba(245,158,11,0.1)", padding: "4px 8px", borderRadius: "100px" }}>
                        <Star size={12} fill="#F59E0B" color="#F59E0B" /> {repo.stars}
                      </span>
                    </div>
                    {repo.description && <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>{repo.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Feedback Sections */}
          {score.markdownFeedback && (
            <div style={{ marginBottom: "40px" }}>
              <h4 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text)", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
                <Sparkles size={20} color="#F59E0B" /> Comprehensive AI Assessment
              </h4>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px", padding: "10px" }}>
                {score.markdownFeedback.split(/(?=###)/).map((section: string, idx: number) => {
                  if (!section.trim()) return null;
                  return (
                    <div key={idx} className="card animate-fade-up" style={{ padding: "32px", position: "relative", overflow: "hidden", animationDelay: `${0.1 * idx}s`, display: "flex", flexDirection: "column", height: "320px" }}>
                      <div style={{ position: "relative", zIndex: 1, flex: 1, overflow: "hidden" }}>
                        <ReactMarkdown components={markdownComponents}>
                          {section}
                        </ReactMarkdown>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button onClick={() => setScore(null)} className="btn-ghost" style={{ fontSize: "14px", padding: "12px 24px", display: "flex", alignItems: "center", gap: "8px" }}>
              <RefreshCw size={16} /> Analyze Another Profile
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px", alignItems: "center", padding: "40px 20px", textAlign: "center" }}>
          <div style={{ padding: "20px", background: "rgba(245,158,11,0.1)", borderRadius: "50%", color: "#F59E0B", marginBottom: "8px" }}>
            <GitBranch size={48} strokeWidth={1.5} />
          </div>
          <h2 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text)", fontFamily: "Syne, sans-serif" }}>Analyze Your GitHub</h2>
          <p style={{ fontSize: "16px", color: "var(--text-muted)", lineHeight: 1.6, maxWidth: "500px", marginBottom: "16px" }}>
            Enter your GitHub username to get an AI-powered score based on your commit activity, top repositories, and overall code quality.
          </p>
          <div style={{ display: "flex", gap: "12px", width: "100%", maxWidth: "500px", flexDirection: "column" }}>
            <input 
              type="text" 
              placeholder="e.g. torvalds" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              onKeyDown={e => e.key === "Enter" && analyze()}
              className="vit-input"
              style={{ flex: 1, padding: "16px 20px", borderRadius: "12px", background: "var(--bg-3)", color: "var(--text)", border: "1px solid var(--border)", fontSize: "16px", textAlign: "center", fontWeight: 500 }} 
            />
            <button onClick={analyze} disabled={loading || !username} className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "16px", borderRadius: "12px", fontSize: "16px", fontWeight: 600, background: "linear-gradient(135deg, #F59E0B, #D97706)", boxShadow: "0 8px 25px rgba(245,158,11,0.3)" }}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={20} /> Generate Analysis</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

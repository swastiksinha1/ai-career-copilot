"use client";

import { useState } from "react";
import { Briefcase, Loader2, FileUp, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

export function LinkedinAnalytics({ initialScore }: { initialScore: any }) {
  const [score, setScore] = useState(initialScore);
  const [loading, setLoading] = useState(false);

  const analyze = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/linkedin/score", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success) setScore(data.data);
    } finally {
      setLoading(false);
    }
  };

  const markdownComponents = {
    h3: ({node, ...props}: any) => <h3 style={{fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginTop: '16px', marginBottom: '8px'}} {...props} />,
    ul: ({node, ...props}: any) => <ul style={{paddingLeft: '20px', marginBottom: '16px', listStyleType: 'disc', color: 'var(--text-muted)'}} {...props} />,
    li: ({node, ...props}: any) => <li style={{marginBottom: '4px'}} {...props} />,
    p: ({node, ...props}: any) => <p style={{marginBottom: '12px', color: 'var(--text-muted)', lineHeight: 1.6}} {...props} />,
    strong: ({node, ...props}: any) => <strong style={{color: 'var(--text)', fontWeight: 600}} {...props} />
  };

  return (
    <div className="card" style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px", maxWidth: "800px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <Briefcase size={28} color="#0A66C2" />
        <h3 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text)" }}>LinkedIn Analysis</h3>
      </div>
      
      {score ? (
        <div>
          {score.profileName && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", padding: "8px 12px", background: "rgba(10,102,194,0.1)", borderRadius: "8px", color: "#0A66C2", width: "fit-content" }}>
              <User size={16} />
              <span style={{ fontSize: "14px", fontWeight: 600 }}>{score.profileName}</span>
            </div>
          )}
          <div style={{ fontSize: "40px", fontWeight: 800, color: "#0A66C2", marginBottom: "24px", fontFamily: "Syne, sans-serif" }}>
            {score.overallScore}<span style={{ fontSize: "20px", color: "var(--text-muted)", fontWeight: 600 }}>/100</span>
          </div>
          
          <div style={{ marginBottom: "24px" }}>
            <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Score Breakdown</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
              {Object.entries(score.breakdown).map(([k, v]) => (
                <div key={k} style={{ fontSize: "14px", color: "var(--text-muted)", display: "flex", justifyContent: "space-between", background: "var(--bg-3)", padding: "12px", borderRadius: "8px" }}>
                  <span>{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span style={{ fontWeight: 700, color: "var(--text)" }}>{String(v)}</span>
                </div>
              ))}
            </div>
          </div>

          {score.markdownFeedback && (
            <div style={{ marginBottom: "24px", background: "var(--bg-3)", padding: "24px", borderRadius: "12px", border: "1px solid var(--border)" }}>
              <ReactMarkdown components={markdownComponents}>
                {score.markdownFeedback}
              </ReactMarkdown>
            </div>
          )}

          <button onClick={() => setScore(null)} className="btn-ghost" style={{ fontSize: "14px", padding: "12px 24px" }}>Analyze Another Profile</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.6 }}>Save your LinkedIn profile as a PDF and upload it here for a detailed AI review.</p>
          <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", border: "2px dashed var(--border)", borderRadius: "12px", background: "var(--bg-3)", cursor: "pointer", opacity: loading ? 0.5 : 1, transition: "all 0.2s" }}>
            {loading ? <Loader2 className="animate-spin" size={32} color="var(--text-dim)" /> : <FileUp size={32} color="var(--text-dim)" />}
            <span style={{ fontSize: "15px", color: "var(--text)", marginTop: "16px", fontWeight: 600 }}>{loading ? "Analyzing PDF..." : "Click to upload PDF"}</span>
            <span style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>Only PDF files are supported</span>
            <input type="file" accept="application/pdf" onChange={analyze} disabled={loading} style={{ display: "none" }} />
          </label>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Sparkles, FileText, CheckCircle2 } from "lucide-react";

export default function MatcherPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste a job description first.");
      return;
    }
    
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/matcher/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to analyze");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          setResult((prev) => prev + chunk);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "48px 40px", flex: 1, background: "var(--bg)", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <div style={{ padding: "4px 10px", background: "rgba(124,58,237,0.1)", borderRadius: "100px", border: "1px solid rgba(124,58,237,0.2)" }}>
              <span style={{ fontSize: "12px", color: "#7C3AED", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>AI Matcher</span>
            </div>
          </div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "36px", fontWeight: 800, marginBottom: "12px", color: "var(--text)" }}>
            Job Description Matcher
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "16px", maxWidth: "600px" }}>
            Paste the Job Description for a role you want. Our AI will instantly compare it against your uploaded resume and stream the keyword gaps.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "start" }}>
          
          {/* Input Section */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <label style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)" }}>
              Target Job Description
            </label>
            <textarea
              className="custom-input"
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              style={{
                width: "100%", height: "300px", padding: "16px", borderRadius: "12px",
                fontSize: "15px", lineHeight: 1.6, resize: "none", fontFamily: "inherit"
              }}
            />
            {error && (
              <div style={{ color: "#EF4444", fontSize: "14px", fontWeight: 500 }}>
                {error}
              </div>
            )}
            <button
              onClick={handleAnalyze}
              disabled={loading || !jobDescription.trim()}
              className="btn-primary"
              style={{ padding: "16px", fontSize: "16px", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}
            >
              {loading ? (
                <>Analyzing with Gemini... <Sparkles size={18} className="animate-pulse" /></>
              ) : (
                <>Analyze Fit <FileText size={18} /></>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="card" style={{ 
            height: "100%", minHeight: "410px", 
            background: "linear-gradient(145deg, var(--bg-2), var(--bg))",
            position: "relative", overflow: "hidden" 
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #4F8EF7, #7C3AED)" }} />
            
            {!result && !loading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <Sparkles size={48} color="var(--accent)" style={{ marginBottom: "16px", opacity: 0.5 }} />
                <p style={{ color: "var(--text)", fontSize: "16px", fontWeight: 500 }}>Awaiting job description...</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <CheckCircle2 size={20} color="#10B981" />
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)" }}>AI Analysis Report</h3>
                </div>
                <div style={{ 
                  flex: 1, overflowY: "auto", paddingRight: "8px",
                  fontSize: "15px", lineHeight: 1.8, color: "var(--text)", whiteSpace: "pre-wrap"
                }}>
                  {result}
                  {loading && <span className="animate-pulse" style={{ display: "inline-block", width: "8px", height: "16px", background: "#4F8EF7", marginLeft: "4px", verticalAlign: "middle" }} />}
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { Sparkles, PenTool, CheckCircle2 } from "lucide-react";

export default function CoverLetterPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [keySkills, setKeySkills] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste a job description first.");
      return;
    }
    
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          jobDescription,
          targetRole,
          keySkills,
          githubUrl,
          linkedinUrl 
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate");
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
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: "8px",
    background: "var(--bg-3)", color: "var(--text)", border: "1px solid var(--border)",
    fontSize: "14px", fontFamily: "inherit", marginBottom: "16px"
  };

  return (
    <main style={{ padding: "48px 40px", flex: 1, background: "var(--bg)", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <div className="no-print" style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <div style={{ padding: "4px 10px", background: "rgba(16,185,129,0.1)", borderRadius: "100px", border: "1px solid rgba(16,185,129,0.2)" }}>
              <span style={{ fontSize: "12px", color: "#10B981", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>AI Writer</span>
            </div>
          </div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "36px", fontWeight: 800, marginBottom: "12px", color: "var(--text)" }}>
            Cover Letter Generator
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "16px", maxWidth: "600px" }}>
            Configure your target role, key skills, and paste the Job Description. Our AI will draft a highly personalized, compelling cover letter based on your uploaded resume.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "start" }}>
          
          <datalist id="rolesList">
            <option value="Software Engineer" />
            <option value="Frontend Developer" />
            <option value="Backend Developer" />
            <option value="Full Stack Developer" />
            <option value="Data Scientist" />
            <option value="Machine Learning Engineer" />
            <option value="Product Manager" />
            <option value="UI/UX Designer" />
            <option value="DevOps Engineer" />
            <option value="Cloud Architect" />
            <option value="Cyber Security Analyst" />
            <option value="Mobile Developer" />
          </datalist>

          <datalist id="skillsList">
            <option value="React, Node.js, TypeScript, Next.js" />
            <option value="Python, Django, FastAPI" />
            <option value="Java, Spring Boot, Microservices" />
            <option value="C++, C#" />
            <option value="AWS, Azure, GCP" />
            <option value="Docker, Kubernetes, CI/CD" />
            <option value="SQL, PostgreSQL, MongoDB" />
            <option value="Machine Learning, PyTorch, TensorFlow" />
            <option value="Figma, UI/UX Design" />
            <option value="Go, Rust" />
          </datalist>

          {/* Input Section */}
          <div className="card no-print" style={{ display: "flex", flexDirection: "column" }}>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", marginBottom: "8px", display: "block" }}>Target Role (Optional)</label>
                <input type="text" list="rolesList" placeholder="e.g. Senior Frontend Engineer" value={targetRole} onChange={e => setTargetRole(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", marginBottom: "8px", display: "block" }}>Key Skills to Highlight</label>
                <input type="text" list="skillsList" placeholder="e.g. React, TypeScript, Node.js" value={keySkills} onChange={e => setKeySkills(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", marginBottom: "8px", display: "block" }}>GitHub Profile (Optional)</label>
                <input type="url" placeholder="https://github.com/username" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", marginBottom: "8px", display: "block" }}>LinkedIn Profile (Optional)</label>
                <input type="url" placeholder="https://linkedin.com/in/username" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <label style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)", marginBottom: "8px", display: "block" }}>
              Target Job Description
            </label>
            <textarea
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              style={{
                width: "100%", height: "250px", padding: "16px", borderRadius: "12px",
                background: "var(--bg-3)", color: "var(--text)", border: "1px solid var(--border)",
                fontSize: "14px", lineHeight: 1.6, resize: "none", fontFamily: "inherit", marginBottom: "16px"
              }}
            />
            {error && (
              <div style={{ color: "#EF4444", fontSize: "14px", fontWeight: 500 }}>
                {error}
              </div>
            )}
            <button
              onClick={handleGenerate}
              disabled={loading || !jobDescription.trim()}
              className="btn-primary"
              style={{ padding: "16px", fontSize: "16px", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}
            >
              {loading ? (
                <>Drafting Cover Letter... <Sparkles size={18} className="animate-pulse" /></>
              ) : (
                <>Generate Letter <PenTool size={18} /></>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="card" style={{ 
            height: "100%", minHeight: "410px", 
            background: "linear-gradient(145deg, var(--bg-2), var(--bg))",
            position: "relative", overflow: "hidden", display: "flex", flexDirection: "column"
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #10B981, #3B82F6)" }} />
            
            {!result && !loading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", opacity: 0.6, flex: 1 }}>
                <Sparkles size={48} color="var(--text-dim)" style={{ marginBottom: "16px" }} />
                <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>Ready to write...</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle2 size={20} color="#10B981" />
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)" }}>Generated Draft</h3>
                  </div>
                  {result && !loading && (
                    <div className="no-print" style={{ display: "flex", gap: "8px" }}>
                      <button 
                        onClick={() => window.print()}
                        className="btn-ghost" style={{ padding: "6px 12px", fontSize: "12px" }}
                      >
                        Download PDF
                      </button>
                      <button 
                        onClick={() => navigator.clipboard.writeText(result)}
                        className="btn-ghost" style={{ padding: "6px 12px", fontSize: "12px" }}
                      >
                        Copy Text
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ 
                  flex: 1, overflowY: "auto", paddingRight: "8px",
                  fontSize: "15px", lineHeight: 1.8, color: "var(--text)", whiteSpace: "pre-wrap"
                }}>
                  {result}
                  {loading && <span className="animate-pulse" style={{ display: "inline-block", width: "8px", height: "16px", background: "#10B981", marginLeft: "4px", verticalAlign: "middle" }} />}
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </main>
  );
}

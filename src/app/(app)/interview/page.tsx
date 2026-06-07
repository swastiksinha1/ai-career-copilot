"use client";

import { useState } from "react";
import { Sparkles, Mic, Play, MessageSquare, CheckCircle2 } from "lucide-react";

export default function InterviewPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [loadingEval, setLoadingEval] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateQuestion = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste a job description or role first.");
      return;
    }
    
    setLoadingQuestion(true);
    setError("");
    setQuestion("");
    setAnswer("");
    setFeedback("");

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "question", jobDescription })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate question");
      setQuestion(data.question);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error generating question");
    } finally {
      setLoadingQuestion(false);
    }
  };

  const handleEvaluate = async () => {
    if (!answer.trim()) {
      setError("Please provide an answer first.");
      return;
    }
    
    setLoadingEval(true);
    setError("");
    setFeedback("");

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "evaluate", jobDescription, question, answer })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to evaluate");
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
          setFeedback((prev) => prev + chunk);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Evaluation failed");
    } finally {
      setLoadingEval(false);
    }
  };

  return (
    <main style={{ padding: "48px 40px", flex: 1, background: "var(--bg)", minHeight: "100vh" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <div style={{ padding: "4px 10px", background: "rgba(245,158,11,0.1)", borderRadius: "100px", border: "1px solid rgba(245,158,11,0.2)" }}>
              <span style={{ fontSize: "12px", color: "#F59E0B", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Mock Interviews</span>
            </div>
          </div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "36px", fontWeight: 800, marginBottom: "12px", color: "var(--text)" }}>
            AI Interview Simulator
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "16px", maxWidth: "600px" }}>
            Generate realistic, scenario-based interview questions tailored to your target job, and get instant feedback on your answers.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Step 1: Context */}
          <div className="card">
            <label style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)", marginBottom: "8px", display: "block" }}>
              1. Job Description or Target Role
            </label>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
              Paste the JD so the AI can generate a highly relevant question.
            </p>
            <textarea
              placeholder="e.g. Senior Frontend Engineer looking for React, TypeScript, and performance optimization experience..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              style={{
                width: "100%", height: "120px", padding: "16px", borderRadius: "12px",
                background: "var(--bg-3)", color: "var(--text)", border: "1px solid var(--border)",
                fontSize: "14px", lineHeight: 1.6, resize: "none", fontFamily: "inherit", marginBottom: "16px"
              }}
            />
            <button
              onClick={handleGenerateQuestion}
              disabled={loadingQuestion || !jobDescription.trim()}
              className="btn-primary"
              style={{ padding: "12px 24px", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", width: "fit-content" }}
            >
              {loadingQuestion ? <>Generating... <Sparkles size={16} className="animate-pulse" /></> : <>Generate Question <Play size={16} /></>}
            </button>
          </div>

          {/* Step 2: Question & Answer */}
          {question && (
            <div className="card animate-fade-in" style={{ border: "1px solid rgba(79,142,247,0.3)", background: "rgba(79,142,247,0.02)" }}>
              <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
                <div style={{ padding: "12px", background: "rgba(79,142,247,0.1)", borderRadius: "12px", height: "fit-content" }}>
                  <Mic size={24} color="#4F8EF7" />
                </div>
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>AI Interviewer</h3>
                  <p style={{ fontSize: "16px", color: "var(--text)", lineHeight: 1.6, fontWeight: 500 }}>{question}</p>
                </div>
              </div>

              <div style={{ marginLeft: "56px" }}>
                <textarea
                  placeholder="Type your answer here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  style={{
                    width: "100%", height: "150px", padding: "16px", borderRadius: "12px",
                    background: "var(--bg-3)", color: "var(--text)", border: "1px solid var(--border)",
                    fontSize: "14px", lineHeight: 1.6, resize: "none", fontFamily: "inherit", marginBottom: "16px"
                  }}
                />
                <button
                  onClick={handleEvaluate}
                  disabled={loadingEval || !answer.trim()}
                  className="btn-primary"
                  style={{ background: "linear-gradient(135deg, #10B981, #059669)", padding: "12px 24px", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {loadingEval ? <>Evaluating... <Sparkles size={16} className="animate-pulse" /></> : <>Evaluate My Answer <CheckCircle2 size={16} /></>}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Feedback */}
          {(feedback || loadingEval) && (
            <div className="card animate-fade-in" style={{ 
              background: "linear-gradient(145deg, var(--bg-2), var(--bg))",
              position: "relative", overflow: "hidden" 
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #10B981, #3B82F6)" }} />
              
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <MessageSquare size={20} color="#10B981" />
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)" }}>AI Evaluation</h3>
              </div>
              <div style={{ 
                fontSize: "15px", lineHeight: 1.8, color: "var(--text)", whiteSpace: "pre-wrap"
              }}>
                {feedback}
                {loadingEval && <span className="animate-pulse" style={{ display: "inline-block", width: "8px", height: "16px", background: "#10B981", marginLeft: "4px", verticalAlign: "middle" }} />}
              </div>
            </div>
          )}

          {error && (
            <div style={{ color: "#EF4444", fontSize: "14px", fontWeight: 500, padding: "12px", background: "rgba(239,68,68,0.1)", borderRadius: "8px" }}>
              {error}
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

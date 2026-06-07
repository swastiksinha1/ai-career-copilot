"use client";

import { useState } from "react";
import { Brain, CheckCircle, XCircle, ArrowRight, RefreshCcw } from "lucide-react";

type Question = {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
};

export default function QuizPage() {
  const [role, setRole] = useState("Software Engineer");
  const [numQuestions, setNumQuestions] = useState(5);
  
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState("");

  const startQuiz = async () => {
    setGenerating(true);
    setError("");
    setQuestions([]);
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsFinished(false);

    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole: role, numQuestions }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      
      setQuestions(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate quiz");
    } finally {
      setGenerating(false);
    }
  };

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return; // Prevent double answering
    setSelectedOption(idx);
    
    if (idx === questions[currentIdx].correctOptionIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = async () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
    } else {
      // Finished
      setIsFinished(true);
      // Save result
      try {
        await fetch("/api/quiz/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            targetRole: role, 
            score: score + (selectedOption === questions[currentIdx].correctOptionIndex ? 1 : 0), 
            totalQuestions: questions.length 
          }),
        });
      } catch (err) {
        console.error("Failed to save score", err);
      }
    }
  };

  // 1. Setup State
  if (questions.length === 0 && !generating) {
    return (
      <main style={{ minHeight: "100vh", padding: "40px 32px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <Brain size={32} color="#4F8EF7" />
            <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "32px", fontWeight: 800 }}>Role Quiz</h1>
          </div>
          <p style={{ color: "var(--text-muted)", marginBottom: "32px", lineHeight: 1.6 }}>
            Test your knowledge with an AI-generated quiz tailored exactly to the role you're applying for.
          </p>

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

          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, fontSize: "14px" }}>Target Role</label>
              <input 
                type="text" 
                list="rolesList"
                value={role} 
                onChange={e => setRole(e.target.value)}
                style={{ width: "100%", padding: "14px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: "15px" }}
              />
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, fontSize: "14px" }}>Number of Questions: {numQuestions}</label>
              <input 
                type="range" min="3" max="10" 
                value={numQuestions} 
                onChange={e => setNumQuestions(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "#4F8EF7" }}
              />
            </div>

            {error && <div style={{ color: "#EF4444", fontSize: "14px" }}>{error}</div>}

            <button onClick={startQuiz} className="btn-primary" style={{ padding: "16px", fontSize: "16px", marginTop: "8px" }}>
              Generate Quiz →
            </button>
          </div>
        </div>
      </main>
    );
  }

  // 2. Generating State
  if (generating) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <Brain size={48} color="#4F8EF7" style={{ margin: "0 auto 16px", animation: "pulse 2s infinite" }} />
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>Crafting Questions...</h2>
          <p style={{ color: "var(--text-muted)" }}>Generating tailored questions for {role}</p>
        </div>
      </main>
    );
  }

  // 3. Results State
  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    let message = "Keep studying!";
    if (percentage >= 80) message = "Excellent work!";
    else if (percentage >= 60) message = "Good effort!";

    return (
      <main style={{ minHeight: "100vh", padding: "40px 32px" }}>
        <div style={{ maxWidth: "600px", margin: "40px auto", textAlign: "center" }}>
          <div style={{
            width: "120px", height: "120px", borderRadius: "50%", margin: "0 auto 24px",
            background: "rgba(79,142,247,0.1)", display: "flex", alignItems: "center", justifyContent: "center",
            border: "4px solid #4F8EF7"
          }}>
            <span style={{ fontSize: "36px", fontWeight: 800, color: "#4F8EF7" }}>{score}/{questions.length}</span>
          </div>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "32px", fontWeight: 800, marginBottom: "8px" }}>{message}</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "40px" }}>You scored {percentage}% on the {role} quiz.</p>
          
          <button onClick={() => { setQuestions([]); setIsFinished(false); }} className="btn-primary" style={{ padding: "16px 32px", display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <RefreshCcw size={18} /> Try Another Quiz
          </button>
        </div>
      </main>
    );
  }

  // 4. Active Quiz State
  const currentQ = questions[currentIdx];

  return (
    <main style={{ minHeight: "100vh", padding: "40px 32px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        
        {/* Progress Bar */}
        <div style={{ marginBottom: "32px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ flex: 1, height: "6px", background: "var(--bg-3)", borderRadius: "100px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${((currentIdx) / questions.length) * 100}%`, background: "linear-gradient(90deg, #4F8EF7, #7C3AED)", transition: "width 0.3s" }} />
          </div>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-dim)" }}>{currentIdx + 1} / {questions.length}</span>
        </div>

        {/* Question */}
        <h2 style={{ fontSize: "22px", fontWeight: 700, lineHeight: 1.5, marginBottom: "32px", color: "var(--text)" }}>
          {currentQ.questionText}
        </h2>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
          {currentQ.options.map((opt, i) => {
            const isSelected = selectedOption === i;
            const isCorrect = i === currentQ.correctOptionIndex;
            const showCorrectness = selectedOption !== null;

            let bg = "var(--bg-2)";
            let border = "1px solid var(--border)";
            let icon = null;

            if (showCorrectness) {
              if (isCorrect) {
                bg = "rgba(16,185,129,0.1)";
                border = "1px solid rgba(16,185,129,0.5)";
                icon = <CheckCircle size={18} color="#10B981" />;
              } else if (isSelected && !isCorrect) {
                bg = "rgba(239,68,68,0.1)";
                border = "1px solid rgba(239,68,68,0.5)";
                icon = <XCircle size={18} color="#EF4444" />;
              }
            } else if (isSelected) {
              bg = "rgba(79,142,247,0.1)";
              border = "1px solid #4F8EF7";
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={selectedOption !== null}
                style={{
                  width: "100%", textAlign: "left", padding: "16px 20px", borderRadius: "12px",
                  background: bg, border, color: "var(--text)", fontSize: "16px", cursor: selectedOption === null ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.2s"
                }}
              >
                <span>{opt}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {/* Explanation & Next */}
        {selectedOption !== null && (
          <div style={{ 
            padding: "20px", borderRadius: "12px", background: "var(--bg-3)", 
            border: "1px solid var(--border)", animation: "fadeIn 0.3s"
          }}>
            <h4 style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "8px" }}>Explanation</h4>
            <p style={{ fontSize: "15px", lineHeight: 1.6, color: "var(--text)", marginBottom: "20px" }}>
              {currentQ.explanation}
            </p>
            <button onClick={nextQuestion} className="btn-primary" style={{ padding: "12px 24px", display: "inline-flex", alignItems: "center", gap: "8px" }}>
              {currentIdx === questions.length - 1 ? "Finish Quiz" : "Next Question"} <ArrowRight size={18} />
            </button>
          </div>
        )}

      </div>
    </main>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";

const faqs = [
  {
    q: "Is AI Career Copilot free to use?",
    a: "Yes — you can sign up and start using the core tools immediately. Advanced AI features use your own API keys or our shared quota.",
  },
  {
    q: "Do I need a GitHub account?",
    a: "Only for the GitHub Score Analyzer. All other tools — Resume Tailor, Cover Letter Generator, Application Tracker, and Weekly Roadmap — work without GitHub.",
  },
  {
    q: "How does the Resume Tailor work?",
    a: "Paste a job description alongside your resume. Our AI identifies the skill gaps and rewrites your bullet points to match the role's requirements and beat ATS filters.",
  },
  {
    q: "How long does it take to get a Weekly Roadmap?",
    a: "Under 3 minutes. Upload your resume, and the AI generates a full 7-day personalized prep plan based on your specific gaps.",
  },
  {
    q: "Is my resume data stored?",
    a: "Resume content is processed in memory for analysis and not permanently stored on our servers. Only your application tracker data is persisted to your account.",
  },
  {
    q: "Can I use it for non-tech jobs?",
    a: "Absolutely. Resume Tailor, Cover Letter Generator, and Application Tracker work for any industry. GitHub Score and the coding roadmap are optimized for tech roles.",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: "-40px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={() => setOpen(!open)}
      style={{
        background: open ? "rgba(127,119,221,0.06)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${open ? "rgba(127,119,221,0.3)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 16,
        padding: "20px 24px",
        cursor: "pointer",
        transition: "all 0.25s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${index * 0.07}s`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 600, color: "#fff", margin: 0, lineHeight: 1.4 }}>
          {q}
        </h3>
        <span style={{
          color: "#7F77DD", fontSize: 20, lineHeight: 1,
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          transition: "transform 0.25s ease",
          flexShrink: 0,
        }}>+</span>
      </div>
      {open && (
        <p style={{
          fontFamily: "DM Sans, sans-serif", fontSize: 14,
          color: "rgba(255,255,255,0.55)", lineHeight: 1.65,
          marginTop: 12, marginBottom: 0,
        }}>
          {a}
        </p>
      )}
    </div>
  );
}

export function FAQSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTitleVisible(true); obs.disconnect(); } },
      { rootMargin: "-40px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="faq" style={{ padding: "80px 24px", position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div
          ref={titleRef}
          style={{
            textAlign: "center", marginBottom: 48,
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, fontWeight: 500, color: "rgba(127,119,221,0.8)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
            Got Questions?
          </p>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1, margin: 0 }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

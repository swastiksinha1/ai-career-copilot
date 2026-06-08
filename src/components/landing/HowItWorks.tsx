"use client";

import { useEffect, useRef, useState } from "react";
import { FileUp, Sparkles, Map } from "lucide-react";

const steps = [
  { num: "01", icon: FileUp,    title: "Upload Your Resume",        desc: "Drop in your existing resume. No formatting needed — just paste or upload." },
  { num: "02", icon: Sparkles,  title: "AI Analyzes the Gap",       desc: "We compare your profile against role requirements and surface real gaps." },
  { num: "03", icon: Map,       title: "Get Your Weekly Roadmap",    desc: "Receive a personalized 7-day prep plan tailored specifically to you." },
];

function AnimatedCard({ step, index }: { step: typeof steps[0], index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: "-60px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20,
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        position: "relative",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.96)",
        transition: `opacity 0.55s cubic-bezier(.22,1.4,.36,1) ${index * 0.15}s, transform 0.55s cubic-bezier(.22,1.4,.36,1) ${index * 0.15}s`,
      }}
    >
      {/* Background number watermark */}
      <span style={{
        position: "absolute", top: 16, right: 20,
        fontFamily: "Syne, sans-serif", fontSize: 64, fontWeight: 800,
        color: "rgba(127,119,221,0.06)", lineHeight: 1, userSelect: "none",
        pointerEvents: "none",
      }}>
        {step.num}
      </span>

      {/* Icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: "rgba(127,119,221,0.12)",
        border: "1px solid rgba(127,119,221,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <step.icon size={20} color="#7F77DD" />
      </div>

      {/* Step badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6, width: "fit-content",
        background: "rgba(127,119,221,0.1)", border: "1px solid rgba(127,119,221,0.15)",
        borderRadius: 20, padding: "4px 10px",
      }}>
        <span style={{ fontFamily: "Syne, sans-serif", fontSize: 11, fontWeight: 700, color: "#7F77DD", letterSpacing: "0.06em" }}>
          Step {step.num}
        </span>
      </div>

      <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", margin: 0 }}>
        {step.title}
      </h3>
      <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0 }}>
        {step.desc}
      </p>
    </div>
  );
}

export function HowItWorks() {
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
    <section id="how-it-works" style={{ padding: "80px 24px", position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Heading */}
        <div
          ref={titleRef}
          style={{
            textAlign: "center", marginBottom: 64,
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, fontWeight: 500, color: "rgba(127,119,221,0.8)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
            Simple Process
          </p>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            How It Works
          </h2>
        </div>

        {/* Steps grid — each card pops in on scroll */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {steps.map((step, i) => (
            <AnimatedCard key={step.num} step={step} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}

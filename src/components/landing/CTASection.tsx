"use client";

import { useRef, useState, useEffect } from "react";
import { SignUpButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { isSignedIn } = useAuth();

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
    <section style={{ padding: "60px 24px 80px", position: "relative", zIndex: 2 }}>
      <style>{`
        @keyframes ctaGlow {
          0%, 100% { box-shadow: 0 0 60px rgba(83,74,183,0.15), inset 0 0 60px rgba(83,74,183,0.04); }
          50%       { box-shadow: 0 0 100px rgba(83,74,183,0.28), inset 0 0 80px rgba(83,74,183,0.08); }
        }
        @keyframes btnPopIn {
          0%   { opacity: 0; transform: scale(0.82) translateY(8px); }
          65%  { transform: scale(1.06) translateY(-2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 8px 8px 18px rgba(0,0,0,0.85), -8px -8px 18px rgba(40,28,55,0.65), 0 0 0px rgba(127,119,221,0); }
          50%       { box-shadow: 8px 8px 28px rgba(0,0,0,0.9), -8px -8px 28px rgba(40,28,55,0.8), 0 0 32px rgba(127,119,221,0.45); }
        }
        .cta-card {
          animation: ctaGlow 4s ease-in-out infinite;
        }
        .cta-btn-primary {
          animation: btnPopIn 0.5s cubic-bezier(0.22,1.4,0.36,1) both,
                     pulseGlow 2.8s ease-in-out 0.5s infinite;
        }
        .cta-btn-primary:hover {
          transform: translateY(-3px) scale(1.04) !important;
          box-shadow: 10px 10px 24px rgba(0,0,0,0.9), -10px -10px 24px rgba(40,28,55,0.85),
                      0 0 40px rgba(127,119,221,0.55) !important;
        }
        .cta-btn-primary:active { transform: scale(0.97) !important; }
      `}</style>

      <div
        ref={ref}
        className="cta-card"
        style={{
          maxWidth: 860, margin: "0 auto",
          background: "rgba(127,119,221,0.05)",
          border: "1px solid rgba(127,119,221,0.2)",
          borderRadius: 28,
          padding: "clamp(40px,6vw,72px) clamp(24px,6vw,72px)",
          textAlign: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
          transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(.22,1.4,.36,1)",
        }}
      >
        {/* Radial accent */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "100%", height: "100%",
          background: "radial-gradient(ellipse at center, rgba(83,74,183,0.12) 0%, transparent 65%)",
          pointerEvents: "none", borderRadius: 28,
        }} />

        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, fontWeight: 500, color: "rgba(127,119,221,0.8)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16, position: "relative" }}>
          Start Today — It&apos;s Free
        </p>

        <h2 style={{
          fontFamily: "Syne, sans-serif",
          fontSize: "clamp(28px,4.5vw,52px)",
          fontWeight: 800, color: "#fff",
          letterSpacing: "-0.03em", lineHeight: 1.1,
          marginBottom: 16, position: "relative",
        }}>
          Ready to <span className="shimmer-text">Dominate</span><br />
          Your Job Search?
        </h2>

        <p style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "clamp(14px,1.5vw,17px)",
          color: "rgba(255,255,255,0.5)", lineHeight: 1.65,
          maxWidth: 480, margin: "0 auto 36px", position: "relative",
        }}>
          Join thousands of engineers who are optimizing their resume, 
          GitHub, and prep plan — all in one place.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
          {isSignedIn ? (
            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <button
                className="cta-btn-primary"
                style={{
                  background: "#120e1a",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 18, color: "#fff",
                  fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16,
                  padding: "15px 40px", cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: 8,
                  animation: "none",
                }}
              >
                Enter Dashboard →
              </button>
            </Link>
          ) : (
            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
              <button
                className="cta-btn-primary"
                style={{
                  background: "#120e1a",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 18, color: "#fff",
                  fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16,
                  padding: "15px 40px", cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: 8,
                  animation: "none",
                }}
              >
                Get started for free ✨
              </button>
            </SignUpButton>
          )}
        </div>
      </div>
    </section>
  );
}

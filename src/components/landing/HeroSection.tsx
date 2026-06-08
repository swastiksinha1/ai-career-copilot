"use client";

import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const primaryBtn: React.CSSProperties = {
  background: "#120e1a",
  boxShadow: "8px 8px 18px rgba(0,0,0,0.85), -8px -8px 18px rgba(40,28,55,0.65)",
  border: "1px solid rgba(255,255,255,0.05)",
  borderRadius: 18,
  color: "#fff",
  fontFamily: "Syne, sans-serif",
  fontWeight: 700,
  fontSize: 16,
  padding: "15px 36px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  transition: "transform 0.25s cubic-bezier(.22,1.4,.36,1), box-shadow 0.25s ease",
  letterSpacing: "-0.01em",
  whiteSpace: "nowrap" as const,
  animation: "btnPopIn 0.5s cubic-bezier(0.22, 1.4, 0.36, 1) both",
};

const ghostBtn: React.CSSProperties = {
  ...primaryBtn,
  background: "rgba(255,255,255,0.03)",
  boxShadow: "none",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "rgba(255,255,255,0.7)",
  fontWeight: 500,
  animationDelay: "0.1s",
};

export function HeroSection() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  // Auto-redirect to dashboard if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Don't redirect automatically on landing — only redirect after signing in
    }
  }, [isLoaded, isSignedIn]);

  return (
    <section style={{
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 24px 60px",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes btnPopIn {
          0%   { opacity: 0; transform: scale(0.82) translateY(8px); }
          65%  { transform: scale(1.06) translateY(-2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 8px 8px 18px rgba(0,0,0,0.85), -8px -8px 18px rgba(40,28,55,0.65), 0 0 0px rgba(127,119,221,0); }
          50%       { box-shadow: 8px 8px 28px rgba(0,0,0,0.9),  -8px -8px 28px rgba(40,28,55,0.8),  0 0 32px rgba(127,119,221,0.45); }
        }
        @keyframes ghostFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-3px); }
        }

        /* Primary CTA — pop in then pulse forever */
        .btn-primary-cta {
          animation: btnPopIn 0.5s cubic-bezier(0.22,1.4,0.36,1) both,
                     pulseGlow 2.8s ease-in-out 0.6s infinite;
        }
        .btn-primary-cta:hover {
          transform: translateY(-3px) scale(1.04) !important;
          box-shadow: 10px 10px 24px rgba(0,0,0,0.9), -10px -10px 24px rgba(40,28,55,0.85),
                      0 0 40px rgba(127,119,221,0.55) !important;
        }
        .btn-primary-cta:active { transform: scale(0.97) !important; }

        /* Ghost / Sign In button — pop in then float gently */
        .btn-ghost-cta {
          animation: btnPopIn 0.5s cubic-bezier(0.22,1.4,0.36,1) 0.12s both,
                     ghostFloat 3.2s ease-in-out 0.8s infinite;
        }
        .btn-ghost-cta:hover {
          transform: translateY(-3px) scale(1.04) !important;
          border-color: rgba(255,255,255,0.35) !important;
          background: rgba(255,255,255,0.07) !important;
        }
        .btn-ghost-cta:active { transform: scale(0.97) !important; }

        /* Enter Dashboard — same as primary but extra pop */
        .btn-dashboard {
          animation: btnPopIn 0.55s cubic-bezier(.22,1.4,.36,1) both,
                     pulseGlow 2.8s ease-in-out 0.6s infinite;
        }
        .btn-dashboard:hover {
          transform: translateY(-3px) scale(1.04) !important;
          box-shadow: 10px 10px 24px rgba(0,0,0,0.9), -10px -10px 24px rgba(40,28,55,0.85),
                      0 0 40px rgba(127,119,221,0.55) !important;
        }
        .btn-dashboard:active { transform: scale(0.97) !important; }
      `}</style>
      {/* Aurora glow */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -60%)",
        width: "min(800px, 100vw)",
        height: "min(800px, 100vw)",
        borderRadius: "50%",
        background: "radial-gradient(ellipse at center, rgba(83,74,183,0.18) 0%, transparent 65%)",
        pointerEvents: "none",
        zIndex: 1,
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 800, width: "100%", textAlign: "center", margin: "0 auto" }}>

        {/* Eyebrow */}
        <p style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: 13,
          fontWeight: 500,
          color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: 24,
        }}>
          AI Career Copilot · Placement OS
        </p>

        {/* Headline */}
        <h1 style={{
          fontFamily: "Syne, sans-serif",
          fontSize: "clamp(32px,5.5vw,68px)",
          fontWeight: 800,
          lineHeight: 1.1,
          color: "#fff",
          letterSpacing: "-0.04em",
          marginBottom: 20,
        }}>
          Find Your Path.<br />
          Analyze, Optimize,<br />
          Track &amp; <span className="shimmer-text">Dominate.</span>
        </h1>

        {/* Subtext */}
        <p style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "clamp(14px,1.5vw,17px)",
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.65,
          maxWidth: 520,
          margin: "0 auto 36px",
        }}>
          Your ultimate placement OS — tailor resumes, simulate interviews,
          track applications, and let AI automate your job hunt.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          {isSignedIn ? (
            // Logged in state — show "Enter Dashboard"
            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <button className="btn-dashboard" style={{ ...primaryBtn, animation: "none" }}>
                Enter Dashboard →
              </button>
            </Link>
          ) : (
            // Logged out state
            <>
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="btn-primary-cta" style={{ ...primaryBtn, animation: "none" }}>Get started ✨</button>
              </SignUpButton>
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="btn-ghost-cta" style={{ ...ghostBtn, animation: "none" }}>Sign In</button>
              </SignInButton>
            </>
          )}
        </div>

      </div>
    </section>
  );
}

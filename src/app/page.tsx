// src/app/page.tsx
import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function LandingPage() {
  const { userId } = await auth();
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "24px 48px", borderBottom: "1px solid var(--border)",
        position: "relative", zIndex: 10
      }}>
        <span style={{
          fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "22px",
          background: "linear-gradient(135deg, #4F8EF7, #7C3AED)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>
          Career Copilot
        </span>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {!userId && (
            <>
              <SignInButton mode="modal">
                <button className="btn-ghost">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn-primary">Get Started Free →</button>
              </SignUpButton>
            </>
          )}
          {userId && (
            <Link href="/dashboard">
              <button className="btn-primary">Go to Dashboard →</button>
            </Link>
          )}
        </div>
      </nav>

      {/* Background glow */}
      <div style={{
        position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(79,142,247,0.08) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      {/* Hero */}
      <section style={{
        maxWidth: "800px", margin: "0 auto", padding: "100px 48px 80px",
        textAlign: "center", position: "relative"
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "6px 16px", borderRadius: "100px",
          border: "1px solid rgba(79,142,247,0.3)",
          background: "rgba(79,142,247,0.08)",
          marginBottom: "32px"
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4F8EF7" }} />
          <span style={{ fontSize: "13px", color: "#4F8EF7", fontWeight: 500 }}>
            Full placement OS — not just a resume checker
          </span>
        </div>

        <h1 style={{
          fontFamily: "Syne, sans-serif", fontSize: "clamp(40px, 6vw, 72px)",
          fontWeight: 800, lineHeight: 1.1, marginBottom: "24px",
          color: "var(--text)"
        }}>
          Land your dream role
          <br />
          <span className="gradient-text">faster with AI</span>
        </h1>

        <p style={{
          fontSize: "18px", color: "var(--text-muted)", lineHeight: 1.7,
          marginBottom: "48px", maxWidth: "560px", margin: "0 auto 48px"
        }}>
          Upload your resume once. Get a personalized roadmap, track every application,
          and score your GitHub — all in one place.
        </p>

        {!userId && (
          <SignUpButton mode="modal">
            <button className="btn-primary" style={{ fontSize: "17px", padding: "16px 40px" }}>
              Start for free →
            </button>
          </SignUpButton>
        )}
        {userId && (
          <Link href="/dashboard">
            <button className="btn-primary" style={{ fontSize: "17px", padding: "16px 40px" }}>
              Go to Dashboard →
            </button>
          </Link>
        )}

        <p style={{ marginTop: "16px", fontSize: "13px", color: "var(--text-dim)" }}>
          No credit card required
        </p>
      </section>

      {/* Features */}
      <section style={{
        maxWidth: "1100px", margin: "0 auto", padding: "0 48px 100px",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px"
      }}>
        {[
          { icon: "📄", title: "Resume Analysis", desc: "AI extracts skills, scores role-fit 0–100, identifies exact gaps to fill", color: "#4F8EF7" },
          { icon: "🗺️", title: "Personalized Roadmap", desc: "Week-by-week prep plan tailored to your gaps and target role", color: "#7C3AED" },
          { icon: "📋", title: "Application Tracker", desc: "Kanban board from Wishlist → Offer. Never lose track again.", color: "#10B981" },
          { icon: "🐙", title: "GitHub Scorer", desc: "Specific, actionable feedback to boost your profile score", color: "#F59E0B" },
        ].map((f) => (
          <div key={f.title} className="card" style={{ position: "relative", overflow: "hidden" }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "2px",
              background: `linear-gradient(90deg, ${f.color}, transparent)`
            }} />
            <div style={{ fontSize: "32px", marginBottom: "16px" }}>{f.icon}</div>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>
              {f.title}
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
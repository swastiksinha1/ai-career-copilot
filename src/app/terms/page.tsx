import Link from "next/link";

export default function TermsOfService() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#000000", color: "#ffffff", padding: "64px 24px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", display: "inline-block", marginBottom: "48px", fontSize: "14px" }} className="hover:text-white transition-colors">
          &larr; Back to Home
        </Link>
        <h1 style={{ fontSize: "40px", fontWeight: 600, marginBottom: "32px", letterSpacing: "-0.02em" }}>Terms of Service</h1>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", lineHeight: 1.6, display: "flex", flexDirection: "column", gap: "24px" }}>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 style={{ fontSize: "24px", color: "#ffffff", fontWeight: 600, marginTop: "16px", letterSpacing: "-0.01em" }}>1. Acceptance of Terms</h2>
          <p>By accessing and using AI Career Copilot, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.</p>
          
          <h2 style={{ fontSize: "24px", color: "#ffffff", fontWeight: 600, marginTop: "16px", letterSpacing: "-0.01em" }}>2. Use of Service</h2>
          <p>You agree to use our AI tools and platform only for lawful purposes and in a way that does not infringe the rights of others. You are responsible for all activity that occurs under your account.</p>

          <h2 style={{ fontSize: "24px", color: "#ffffff", fontWeight: 600, marginTop: "16px", letterSpacing: "-0.01em" }}>3. Intellectual Property</h2>
          <p>The platform, its original content, features, and functionality are owned by AI Career Copilot and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#000000", color: "#ffffff", padding: "64px 24px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", display: "inline-block", marginBottom: "48px", fontSize: "14px" }} className="hover:text-white transition-colors">
          &larr; Back to Home
        </Link>
        <h1 style={{ fontSize: "40px", fontWeight: 600, marginBottom: "32px", letterSpacing: "-0.02em" }}>Privacy Policy</h1>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", lineHeight: 1.6, display: "flex", flexDirection: "column", gap: "24px" }}>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 style={{ fontSize: "24px", color: "#ffffff", fontWeight: 600, marginTop: "16px", letterSpacing: "-0.01em" }}>1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you create an account, update your profile, or use our AI features. This includes your resume data, interaction logs, and application preferences.</p>
          
          <h2 style={{ fontSize: "24px", color: "#ffffff", fontWeight: 600, marginTop: "16px", letterSpacing: "-0.01em" }}>2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, including generating AI career roadmaps, interview prep simulations, and resume analysis algorithms.</p>

          <h2 style={{ fontSize: "24px", color: "#ffffff", fontWeight: 600, marginTop: "16px", letterSpacing: "-0.01em" }}>3. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect the security of your personal information against unauthorized access or modification. We do not sell your personal resume data to third parties.</p>
        </div>
      </div>
    </main>
  );
}

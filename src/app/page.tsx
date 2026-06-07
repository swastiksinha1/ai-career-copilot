import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

const animations = `
  @keyframes floatStar {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-20px) scale(1.1); }
  }
`;

function StarSparkle({ top, left, size, opacity, delay }: { top: string, left: string, size: number, opacity: number, delay: string }) {
  return (
    <svg 
      style={{ 
        position: "absolute", top, left, width: size, height: size, opacity,
        animation: "floatStar 8s ease-in-out infinite",
        animationDelay: delay
      }} 
      viewBox="0 0 24 24" fill="currentColor" className="text-white"
    >
      <path d="M12 0C12 0 12 9 24 12C24 12 12 15 12 24C12 24 12 15 0 12C0 12 12 9 12 0Z" />
    </svg>
  );
}

export default async function LandingPage() {
  const { userId } = await auth();
  return (
    <main style={{ 
      minHeight: "100vh", 
      backgroundColor: "#000000", 
      color: "#ffffff",
      overflow: "hidden",
      position: "relative",
      fontFamily: "Inter, sans-serif"
    }}>
      <style>{animations}</style>
      {/* Soft Radial Glow at Bottom Center */}
      <div style={{
        position: "absolute",
        bottom: "-30%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        height: "60vh",
        background: "radial-gradient(circle at bottom, rgba(255,255,255,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      {/* Floating Stars */}
      <StarSparkle top="15%" left="8%" size={16} opacity={0.6} delay="0s" />
      <StarSparkle top="25%" left="32%" size={24} opacity={0.8} delay="1s" />
      <StarSparkle top="45%" left="18%" size={12} opacity={0.4} delay="2.5s" />
      <StarSparkle top="75%" left="10%" size={20} opacity={0.7} delay="0.5s" />
      
      <StarSparkle top="20%" left="65%" size={14} opacity={0.5} delay="1.5s" />
      <StarSparkle top="35%" left="92%" size={22} opacity={0.9} delay="3s" />
      <StarSparkle top="80%" left="85%" size={16} opacity={0.6} delay="0.8s" />

      {/* Nav */}
      <nav style={{
        display: "grid", 
        gridTemplateColumns: "1fr auto 1fr", 
        alignItems: "center",
        padding: "32px 48px",
        position: "relative", zIndex: 10
      }}>
        {/* Left Links */}
        <div style={{ display: "flex", gap: "12px", fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
          <Link href="/dashboard" className="hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all duration-300" style={{ textDecoration: "none", color: "inherit" }}>Dashboard</Link>
          <Link href="/resume" className="hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all duration-300" style={{ textDecoration: "none", color: "inherit" }}>Resume Setup</Link>
          <Link href="/interview" className="hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all duration-300" style={{ textDecoration: "none", color: "inherit" }}>Mock Interview</Link>
        </div>

        {/* Center Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center" }}>
          <Image src="/logo.png" alt="Logo" width={32} height={32} style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.2))" }} />
          <span style={{
            fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "18px",
            color: "#ffffff", letterSpacing: "-0.01em"
          }}>
            AI Career Copilot
          </span>
        </div>
        
        {/* Right side - Socials & Sign In */}
        <div style={{ display: "flex", gap: "24px", alignItems: "center", justifyContent: "flex-end" }}>
          <div style={{ display: "flex", gap: "16px", color: "rgba(255,255,255,0.6)", alignItems: "center" }}>
            <a href="https://github.com/swastiksinha1" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="hover:text-white transition-colors cursor-pointer">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
            <a href="https://instagram.com/ig_swastik" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="hover:text-white transition-colors cursor-pointer">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
          
          {!userId ? (
            <SignInButton mode="modal">
              <button className="hover:-translate-y-1 hover:shadow-lg transition-all" style={{
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                color: "white", padding: "10px 24px", borderRadius: "8px",
                border: "none", fontSize: "14px", fontWeight: 600, cursor: "pointer",
                boxShadow: "0 4px 14px rgba(59, 130, 246, 0.3)",
              }}>
                Get Started
              </button>
            </SignInButton>
          ) : (
            <Link href="/dashboard">
              <button className="hover:-translate-y-1 hover:shadow-lg transition-all" style={{
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                color: "white", padding: "10px 24px", borderRadius: "8px",
                border: "none", fontSize: "14px", fontWeight: 600, cursor: "pointer",
                boxShadow: "0 4px 14px rgba(59, 130, 246, 0.3)",
              }}>
                Dashboard
              </button>
            </Link>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        maxWidth: "900px", margin: "0 auto", padding: "60px 24px 120px",
        textAlign: "center", position: "relative", zIndex: 10
      }}>
        
        {/* Glowing Aura behind text */}
        <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", height: "100%", zIndex: -1, pointerEvents: "none", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ position: "absolute", width: "400px", height: "400px", background: "rgba(96, 165, 250, 0.15)", filter: "blur(120px)", borderRadius: "50%", animation: "floatStar 8s ease-in-out infinite" }} />
          <div style={{ position: "absolute", width: "300px", height: "300px", background: "rgba(167, 139, 250, 0.15)", filter: "blur(100px)", borderRadius: "50%", animation: "floatStar 12s ease-in-out infinite reverse", marginLeft: "200px" }} />
        </div>

        <p style={{
          fontSize: "13px", color: "rgba(255,255,255,0.5)", fontWeight: 600,
          letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "24px"
        }}>
          AI Career Copilot
        </p>

        <h1 className="transition-all duration-700 hover:drop-shadow-[0_0_40px_rgba(96,165,250,0.4)] hover:-translate-y-2 cursor-default" style={{
          fontFamily: "Inter, sans-serif", fontSize: "clamp(48px, 7vw, 84px)",
          fontWeight: 600, lineHeight: 1.1, marginBottom: "32px", letterSpacing: "-0.04em",
          color: "#ffffff"
        }}>
          Find Your Path.<br/>
          Analyze, Optimize,<br/>
          Track & <span className="transition-all duration-700 hover:brightness-125" style={{
            background: "linear-gradient(to right, #60a5fa, #a78bfa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>Dominate.</span>
        </h1>

        <p style={{
          fontSize: "16px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6,
          marginBottom: "48px", maxWidth: "600px", margin: "0 auto 48px", fontWeight: 400
        }}>
          Welcome to your ultimate placement OS. Effortlessly tailor resumes, 
          simulate interviews, and track applications in real-time. Let our AI extract knowledge 
          to automate your job hunt while you focus on interviews.
        </p>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          {!userId ? (
            <SignUpButton mode="modal">
              <button className="hover:-translate-y-2 hover:scale-105 hover:shadow-[0_15px_40px_rgba(59,130,246,0.6)] transition-all duration-300" style={{
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                color: "white", padding: "16px 36px", borderRadius: "8px",
                border: "none", fontSize: "16px", fontWeight: 600, cursor: "pointer",
                boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)",
              }}>
                Get started ✨
              </button>
            </SignUpButton>
          ) : (
            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <button className="hover:-translate-y-2 hover:scale-105 hover:shadow-[0_15px_40px_rgba(59,130,246,0.6)] transition-all duration-300" style={{
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                color: "white", padding: "16px 36px", borderRadius: "8px",
                border: "none", fontSize: "16px", fontWeight: 600, cursor: "pointer",
                boxShadow: "0 4px 20px rgba(59, 130, 246, 0.3)",
              }}>
                Get started ✨
              </button>
            </Link>
          )}

          <Link href="/dashboard" style={{ textDecoration: "none" }}>
            <button className="hover:-translate-y-2 hover:scale-105 hover:shadow-[0_15px_40px_rgba(255,255,255,0.3)] transition-all duration-300" style={{
              background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)",
              color: "#111827", padding: "16px 36px", borderRadius: "8px",
              border: "none", fontSize: "16px", fontWeight: 600, cursor: "pointer",
              boxShadow: "0 4px 20px rgba(255, 255, 255, 0.0)",
            }}>
              Dashboard
            </button>
          </Link>
        </div>


      </section>

      {/* Minimalist Premium Footer */}
      <footer style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        padding: "32px 24px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        zIndex: 10
      }}>
        <div style={{ display: "flex", gap: "24px", color: "rgba(255,255,255,0.4)", fontSize: "13px", fontWeight: 500 }}>
          <Link href="/privacy" className="hover:text-white transition-colors" style={{ textDecoration: "none", color: "inherit" }}>Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors" style={{ textDecoration: "none", color: "inherit" }}>Terms of Service</Link>
          <a href="mailto:hello@example.com" className="hover:text-white transition-colors" style={{ textDecoration: "none", color: "inherit" }}>Contact</a>
        </div>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
          © {new Date().getFullYear()} AI Career Copilot. All rights reserved. Built for the modern engineer.
        </p>
      </footer>

    </main>
  );
}
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

const neoBtn: React.CSSProperties = {
  background: "#120e1a",
  boxShadow: "6px 6px 14px rgba(0,0,0,0.8), -6px -6px 14px rgba(40,28,55,0.6)",
  border: "1px solid rgba(255,255,255,0.05)",
  borderRadius: 14,
  color: "#fff",
  fontFamily: "Syne, sans-serif",
  fontWeight: 600,
  fontSize: 14,
  padding: "11px 24px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "transform 0.25s cubic-bezier(.22,1.4,.36,1), box-shadow 0.25s ease",
  letterSpacing: "-0.01em",
  animation: "btnPopIn 0.5s cubic-bezier(0.22, 1.4, 0.36, 1) both",
};

export function Navbar({ userId }: { userId: string | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <style>{`
        @keyframes btnPopIn {
          0%   { opacity: 0; transform: scale(0.82) translateY(8px); }
          65%  { transform: scale(1.06) translateY(-2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .nav-link-item {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          transition: color 0.2s;
          white-space: nowrap;
        }
        .nav-link-item:hover { color: #fff; }

        /* Desktop nav links: hidden below 1024px */
        .nav-desktop-links { display: none; }
        @media (min-width: 1024px) {
          .nav-desktop-links { display: flex; gap: 32px; align-items: center; }
        }

        /* Desktop CTA: hidden below 1024px */
        .nav-desktop-cta { display: none; }
        @media (min-width: 1024px) {
          .nav-desktop-cta { display: block; }
        }

        /* Mobile hamburger: shown below 1024px, hidden above */
        .nav-mobile-btn { display: flex; }
        @media (min-width: 1024px) {
          .nav-mobile-btn { display: none !important; }
        }
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? "rgba(8,8,16,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.3s ease",
      }}>
        <div style={{
          position: "relative",
          maxWidth: 1152, margin: "0 auto", padding: "0 24px",
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>

          {/* LEFT: Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", zIndex: 2, flexShrink: 0 }}>
            <Image src="/logo.png" alt="AI Career Copilot" width={36} height={36}
              style={{ borderRadius: 8, objectFit: "contain" }} />
            <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16, color: "#fff", letterSpacing: "-0.02em" }}>
              AI Career Copilot
            </span>
          </Link>

          {/* CENTER: Nav links (desktop only, absolutely centered) */}
          <div className="nav-desktop-links" style={{
            position: "absolute", left: "50%", transform: "translateX(-50%)",
          }}>
            {[["#features", "Features"], ["#how-it-works", "How It Works"], ["#tech-stack", "Tech Stack"]].map(([href, label]) => (
              <a key={href} href={href} className="nav-link-item">{label}</a>
            ))}
          </div>

          {/* RIGHT: desktop CTA + mobile hamburger */}
          <div style={{ display: "flex", alignItems: "center", zIndex: 2 }}>
            <div className="nav-desktop-cta" style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {isSignedIn ? (
                <>
                  <Link href="/dashboard">
                    <button style={neoBtn}>Dashboard</button>
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </>
              ) : (
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <button style={neoBtn}>Get Started</button>
                </SignInButton>
              )}
            </div>

            <button
              className="nav-mobile-btn"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              style={{
                background: "none", border: "none", color: "#fff",
                cursor: "pointer", padding: 10, borderRadius: 8,
                alignItems: "center", justifyContent: "center",
              }}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div style={{
          position: "fixed", top: 68, left: 0, right: 0, bottom: 0,
          background: "#0a0a14", zIndex: 49,
          display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 40, gap: 0,
        }}>
          {[["#features", "Features"], ["#how-it-works", "How It Works"], ["#tech-stack", "Tech Stack"]].map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 18,
              color: "rgba(255,255,255,0.8)", textDecoration: "none",
              padding: "16px 0", width: "80%", textAlign: "center",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              {label}
            </a>
          ))}
          <div style={{ marginTop: 28, width: "80%" }}>
            {!userId ? (
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <button style={{ ...neoBtn, width: "100%", padding: "16px 0" }}>Get Started</button>
              </SignInButton>
            ) : (
              <Link href="/dashboard" onClick={() => setOpen(false)}>
                <button style={{ ...neoBtn, width: "100%", padding: "16px 0" }}>Dashboard</button>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}

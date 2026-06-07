// src/components/NavBar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      background: "rgba(8,12,20,0.85)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
      height: "60px", display: "flex", alignItems: "center",
      padding: "0 32px", justifyContent: "space-between"
    }}>
      <Link href="/dashboard" style={{ textDecoration: "none" }}>
        <span style={{
          fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "20px",
          background: "linear-gradient(135deg, #4F8EF7, #7C3AED)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>
          Career Copilot
        </span>
      </Link>

      <SignedIn>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {[
            { href: "/dashboard", label: "Dashboard" },
            { href: "/resume", label: "Resume" },
            { href: "/roadmap", label: "Roadmap" },
            { href: "/tracker", label: "Tracker" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname === item.href ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>

      <SignedOut>
        <SignInButton mode="modal">
          <button className="btn-primary" style={{ padding: "8px 20px", fontSize: "14px" }}>
            Sign In
          </button>
        </SignInButton>
      </SignedOut>
    </nav>
  );
}
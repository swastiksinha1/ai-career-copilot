"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  FileText, 
  Map, 
  KanbanSquare, 
  Search,
  Mic,
  FileSignature,
  Moon,
  Sun,
  Briefcase,
  GitBranch,
  Brain
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/github-score", label: "GitHub Analytics", icon: GitBranch },
  { href: "/linkedin-score", label: "LinkedIn Analytics", icon: Briefcase },
  { href: "/resume", label: "Resume Analysis", icon: FileText },
  { href: "/matcher", label: "Job Matcher", icon: Search },
  { href: "/roadmap", label: "Prep Roadmap", icon: Map },
  { href: "/tracker", label: "App Tracker", icon: KanbanSquare },
  { href: "/interview", label: "Mock Interview", icon: Mic },
  { href: "/cover-letter", label: "Cover Letter", icon: FileSignature },
  { href: "/quiz", label: "Role Quiz", icon: Brain },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside style={{
      width: "260px",
      height: "100vh",
      position: "fixed",
      left: 0,
      top: 0,
      borderRight: "1px solid var(--border)",
      background: "var(--bg-2)",
      display: "flex",
      flexDirection: "column",
      padding: "24px 16px",
      zIndex: 40
    }}>
      <div style={{ marginBottom: "32px", paddingLeft: "8px" }}>
        <Link href="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
          <Image src="/logo.png" alt="Logo" width={36} height={36} style={{ objectFit: "contain", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" }} priority />
          <span style={{
            fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "20px",
            textShadow: "0 0 15px rgba(202, 61, 242, 0.4)"
          }}>
            <span style={{ color: "#ffffff" }}>AI </span>
            <span className="gradient-text">Career Copilot</span>
          </span>
        </Link>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "6px", flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 16px", borderRadius: "10px",
                textDecoration: "none", fontSize: "14px", fontWeight: 500,
                color: isActive ? "#fff" : "var(--text-muted)",
                background: isActive ? "linear-gradient(135deg, var(--accent), var(--accent-2))" : "transparent",
                transition: "all 0.2s ease"
              }}
              className={isActive ? "" : "hover-bg-accent"}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{
        marginTop: "auto", borderTop: "1px solid var(--border)",
        paddingTop: "16px", display: "flex", flexDirection: "column", gap: "16px"
      }}>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          style={{
            display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px",
            borderRadius: "10px", border: "none", background: "transparent",
            color: "var(--text-muted)", cursor: "pointer", fontSize: "14px", fontWeight: 500,
            textAlign: "left"
          }}
          className="hover-bg-accent"
        >
          {mounted ? (theme === "dark" ? <Sun size={18} /> : <Moon size={18} />) : <div style={{width: 18, height: 18}} />}
          {mounted ? (theme === "dark" ? "Light Mode" : "Dark Mode") : "Theme"}
        </button>
        
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 16px" }}>
          <UserButton afterSignOutUrl="/" />
          <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text)" }}>My Account</span>
        </div>
      </div>
    </aside>
  );
}

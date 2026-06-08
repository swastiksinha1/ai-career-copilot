"use client";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="animate-fade-in" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", flexDirection: "column", gap: "16px" }}>
      <Loader2 className="animate-spin" size={48} color="var(--accent)" />
      <p style={{ color: "var(--text-muted)", fontSize: "16px", fontWeight: 500, fontFamily: "Syne, sans-serif" }}>Loading workspace...</p>
    </div>
  );
}

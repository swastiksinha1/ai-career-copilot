"use client";

import { FileText, LayoutGrid, GitBranch, CalendarDays, FileEdit } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Resume Tailor AI",
    desc: "Paste a job description and instantly get AI-tailored bullet points optimized to beat ATS and match role requirements.",
    wide: true,
    mockup: true,
  },
  {
    icon: LayoutGrid,
    title: "Application Tracker",
    desc: "Track every application by status — Applied, Interview, Offer, or Rejected. Never lose sight of an opportunity.",
  },
  {
    icon: GitBranch,
    title: "GitHub Score Analyzer",
    desc: "We score your public repos so your code showcases the readiness tech recruiters are actually looking for.",
  },
  {
    icon: CalendarDays,
    title: "Weekly Roadmap",
    desc: "A personalized 7-day prep plan generated from your resume's gap analysis — always specific, never generic.",
  },
  {
    icon: FileEdit,
    title: "Cover Letter Generator",
    desc: "One-click, role-specific cover letters written in your voice, tailored to the exact position you're applying for.",
  },
];

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.025)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 20,
  padding: "28px",
  display: "flex",
  flexDirection: "column",
  gap: 14,
  transition: "border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
};

const iconBox: React.CSSProperties = {
  width: 44, height: 44, borderRadius: 12,
  background: "rgba(127,119,221,0.1)",
  border: "1px solid rgba(127,119,221,0.18)",
  display: "flex", alignItems: "center", justifyContent: "center",
  flexShrink: 0,
};

export function FeaturesBento() {
  return (
    <section id="features" style={{ padding: "80px 24px", position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, fontWeight: 500, color: "rgba(127,119,221,0.8)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
            Full Toolkit
          </p>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Everything You Need to Get Hired
          </h2>
        </div>

        <style>{`
          .bento-desktop { display: none; }
          .bento-mobile  { display: flex; flex-direction: column; gap: 16px; }
          @media (min-width: 768px) {
            .bento-desktop { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
            .bento-mobile  { display: none; }
          }
        `}</style>

        {/* Desktop Bento Grid */}
        <div className="bento-desktop">

          {/* Resume Tailor — wide hero card spanning 2 cols */}
          <div style={{ ...card, gridColumn: "1 / 3", flexDirection: "row", gap: 32, alignItems: "flex-start", display: "flex" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={iconBox}><FileText size={20} color="#7F77DD" /></div>
              <div>
                <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 8 }}>
                  {features[0].title}
                </h3>
                <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                  {features[0].desc}
                </p>
              </div>
            </div>
            {/* Mock terminal */}
            <div style={{
              flex: 1, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12, padding: "16px 18px", fontFamily: "monospace", fontSize: 12, minHeight: 120,
            }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,80,80,0.5)" }} />
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,200,60,0.5)" }} />
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(40,200,80,0.4)" }} />
              </div>
              <div style={{ color: "rgba(55,138,221,0.9)", marginBottom: 8 }}>{">"} AI-tailored bullets</div>
              <div style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>
                • Engineered REST APIs processing 10k+ req/day...<br />
                • Optimized DB queries — reduced latency 45%...<br />
                <span style={{ color: "#7F77DD" }}>▋</span>
              </div>
            </div>
          </div>

          {/* Application Tracker */}
          <div style={{ ...card, gridColumn: "3 / 4", gridRow: "1 / 2", display: "flex" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
              <div style={iconBox}><LayoutGrid size={20} color="#7F77DD" /></div>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>Application Tracker</h3>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                Track every application by status — Applied, Interview, Offer, or Rejected. Never lose sight of an opportunity.
              </p>
            </div>
          </div>

          {/* GitHub Score */}
          <div style={{ ...card, display: "flex" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
              <div style={iconBox}><GitBranch size={20} color="#7F77DD" /></div>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>GitHub Score Analyzer</h3>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                We score your public repos so your code showcases the readiness tech recruiters are actually looking for.
              </p>
            </div>
          </div>

          {/* Weekly Roadmap */}
          <div style={{ ...card, display: "flex" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
              <div style={iconBox}><CalendarDays size={20} color="#7F77DD" /></div>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>Weekly Roadmap</h3>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                A personalized 7-day prep plan generated from your resume's gap analysis — always specific, never generic.
              </p>
            </div>
          </div>

          {/* Cover Letter */}
          <div style={{ ...card, display: "flex" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
              <div style={iconBox}><FileEdit size={20} color="#7F77DD" /></div>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>Cover Letter Generator</h3>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                One-click, role-specific cover letters written in your voice, tailored to the exact position you're applying for.
              </p>
            </div>
          </div>

        </div>

        {/* Mobile Stacked Cards */}
        <div className="bento-mobile">
          {features.map((f, i) => (
            <div key={i} style={{ ...card, display: "flex" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
                <div style={iconBox}><f.icon size={20} color="#7F77DD" /></div>
                <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>{f.title}</h3>
                <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

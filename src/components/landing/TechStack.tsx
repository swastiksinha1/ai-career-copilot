export function TechStack() {
  const tech = ["Next.js 15", "Clerk", "Prisma", "Tailwind v4", "Gemini AI", "Vercel"];

  return (
    <section id="tech-stack" style={{ padding: "60px 24px", position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.3)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>
          Built With
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
          {tech.map(t => (
            <span key={t} style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: 13,
              color: "rgba(255,255,255,0.45)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 999,
              padding: "7px 16px",
              letterSpacing: "0.01em",
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

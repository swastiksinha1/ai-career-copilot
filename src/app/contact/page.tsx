export default function ContactPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#080810", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px" }}>
      <div style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, fontWeight: 500, color: "rgba(127,119,221,0.8)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>
          Get In Touch
        </p>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px,5vw,44px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 16 }}>
          Contact Us
        </h1>
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, marginBottom: 40 }}>
          Have a question, feedback, or just want to say hi? Reach out through any of the channels below.
        </p>

        <style>{`
          .contact-card {
            background: rgba(255,255,255,0.025);
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 16px;
            padding: 18px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            text-decoration: none;
            color: #fff;
            transition: border-color 0.2s ease, transform 0.2s ease;
          }
          .contact-card:hover {
            border-color: rgba(127,119,221,0.4);
            transform: translateY(-2px);
          }
        `}</style>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { label: "Instagram", handle: "@ig_swastik", href: "https://instagram.com/ig_swastik" },
            { label: "GitHub", handle: "github.com/swastiksinha1", href: "https://github.com" },
            { label: "LinkedIn", handle: "linkedin.com/in/swastik", href: "https://linkedin.com" },
          ].map(({ label, handle, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="contact-card">
              <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
              <span style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 600, color: "#7F77DD" }}>{handle}</span>
            </a>
          ))}
        </div>

        <div style={{ marginTop: 40 }}>
          <a href="/" style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

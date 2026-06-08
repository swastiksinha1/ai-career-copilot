"use client";

import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration = 1400) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(target);
      return;
    }
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !done.current) {
        done.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          setVal(Math.floor(p * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { rootMargin: "-60px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return { val, ref };
}

function StatCard({ value, prefix = "", label, sub }: { value: number, prefix?: string, label: string, sub: string }) {
  const { val, ref } = useCountUp(value);
  return (
    <div ref={ref} style={{
      background: "rgba(255,255,255,0.025)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 20,
      padding: "32px 24px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
    }}>
      <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "clamp(40px, 8vw, 56px)", color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>
        {prefix}{val}
      </div>
      <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: 11, color: "#7F77DD", letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 4 }}>
        {label}
      </div>
      <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
        {sub}
      </div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section style={{ padding: "80px 24px", position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          <StatCard value={5} label="Tools" sub="All-in-one placement toolkit" />
          <StatCard value={1} label="Upload" sub="Resume to full roadmap in one step" />
          <StatCard value={3} prefix="< " label="Min to Roadmap" sub="Fastest path from gap to plan" />
        </div>
      </div>
    </section>
  );
}

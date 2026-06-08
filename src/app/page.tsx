import { auth } from "@clerk/nextjs/server";
import { StarField } from "@/components/landing/StarField";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeaturesBento } from "@/components/landing/FeaturesBento";
import { StatsSection } from "@/components/landing/StatsSection";
import { TechStack } from "@/components/landing/TechStack";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default async function LandingPage() {
  const { userId } = await auth();

  return (
    <div
      className="landing-page-theme"
      style={{
        minHeight: "100vh",
        backgroundColor: "#080810",
        color: "#fff",
        overflowX: "hidden",
        position: "relative",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Starfield */}
      <StarField />

      {/* Sticky nav */}
      <Navbar userId={userId} />

      {/* Page content with fade-in entry animation */}
      <main style={{ position: "relative", zIndex: 2, animation: "pageFadeIn 0.7s ease both" }}>
        <style>{`
          @keyframes pageFadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <HeroSection />
        <HowItWorks />
        <FeaturesBento />
        <StatsSection />
        <TechStack />
        <FAQSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
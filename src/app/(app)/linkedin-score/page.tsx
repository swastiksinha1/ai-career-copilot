import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LinkedinAnalytics } from "@/components/LinkedinAnalytics";
import { Briefcase } from "lucide-react";

export default async function LinkedinScorePage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/");

  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      linkedinScores: { orderBy: { scoredAt: "desc" }, take: 1 },
    },
  });

  const linkedinScore = user?.linkedinScores[0];

  return (
    <main style={{ padding: "48px 40px", flex: 1, background: "var(--bg)", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
          <div style={{ padding: "12px", background: "rgba(10,102,194,0.1)", borderRadius: "12px", color: "#0A66C2" }}>
            <Briefcase size={28} />
          </div>
          <div>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "36px", fontWeight: 800, color: "var(--text)" }}>LinkedIn Analytics</h1>
            <p style={{ color: "var(--text-muted)", marginTop: "4px", fontSize: "16px" }}>Optimize your professional network and discoverability.</p>
          </div>
        </div>

        <LinkedinAnalytics initialScore={linkedinScore} />
        
      </div>
    </main>
  );
}

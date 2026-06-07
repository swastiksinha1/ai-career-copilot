import Sidebar from "@/components/Sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: "260px", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}

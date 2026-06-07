// src/app/tracker/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STATUSES = ["WISHLIST", "APPLIED", "SCREEN", "INTERVIEW", "OFFER", "REJECTED"];

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  WISHLIST: { color: "#6B7A99", bg: "rgba(107,122,153,0.1)", label: "Wishlist" },
  APPLIED: { color: "#4F8EF7", bg: "rgba(79,142,247,0.1)", label: "Applied" },
  SCREEN: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)", label: "Screen" },
  INTERVIEW: { color: "#7C3AED", bg: "rgba(124,58,237,0.1)", label: "Interview" },
  OFFER: { color: "#10B981", bg: "rgba(16,185,129,0.1)", label: "Offer 🎉" },
  REJECTED: { color: "#EF4444", bg: "rgba(239,68,68,0.1)", label: "Rejected" },
};

export default function TrackerPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ company: "", role: "", jobUrl: "", status: "APPLIED", notes: "", location: "", isRemote: false });
  const [saving, setSaving] = useState(false);
  const [activeStatus, setActiveStatus] = useState<string | null>(null);

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/applications");
      const data = await res.json();
      if (data.success) setApplications(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.company || !form.role) return;
    setSaving(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setApplications((prev) => [data.data, ...prev]);
        setForm({ company: "", role: "", jobUrl: "", status: "APPLIED", notes: "", location: "", isRemote: false });
        setShowForm(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    await fetch("/api/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  };

  const handleDelete = async (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/applications?id=${id}`, { method: "DELETE" });
  };

  const filtered = activeStatus ? applications.filter((a) => a.status === activeStatus) : applications;

  const counts = STATUSES.reduce((acc, s) => ({
    ...acc, [s]: applications.filter((a) => a.status === s).length
  }), {} as Record<string, number>);

  return (
      <main style={{ minHeight: "100vh", background: "var(--bg)", padding: "0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 32px" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
            <div>
              <p style={{ fontSize: "13px", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                STEP 3
              </p>
              <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "32px", fontWeight: 800, marginBottom: "8px" }}>
                Application Tracker
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
                {applications.length} application{applications.length !== 1 ? "s" : ""} tracked
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary"
              style={{ fontSize: "14px", flexShrink: 0 }}
            >
              + Add Application
            </button>
          </div>

          {/* Add Form */}
          {showForm && (
            <div className="card" style={{ marginBottom: "32px", borderColor: "rgba(79,142,247,0.3)" }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>
                New Application
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                {[
                  { key: "company", placeholder: "Company name *" },
                  { key: "role", placeholder: "Role / Position *" },
                  { key: "jobUrl", placeholder: "Job URL (optional)" },
                  { key: "location", placeholder: "Location (optional)" },
                ].map(({ key, placeholder }) => (
                  <input
                    key={key}
                    value={(form as any)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    style={{
                      background: "var(--bg-3)", border: "1px solid var(--border)",
                      borderRadius: "10px", padding: "12px 16px", color: "var(--text)",
                      fontSize: "14px", outline: "none", fontFamily: "DM Sans, sans-serif"
                    }}
                  />
                ))}
              </div>
              <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
                {STATUSES.map((s) => {
                  const sc = statusConfig[s];
                  return (
                    <button
                      key={s}
                      onClick={() => setForm((f) => ({ ...f, status: s }))}
                      style={{
                        padding: "6px 14px", borderRadius: "100px", fontSize: "13px",
                        fontWeight: 500, cursor: "pointer", transition: "all 0.2s",
                        border: form.status === s ? `1px solid ${sc.color}` : "1px solid var(--border)",
                        background: form.status === s ? sc.bg : "transparent",
                        color: form.status === s ? sc.color : "var(--text-muted)",
                      }}
                    >
                      {sc.label}
                    </button>
                  );
                })}
              </div>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Notes (optional)"
                rows={3}
                style={{
                  width: "100%", background: "var(--bg-3)", border: "1px solid var(--border)",
                  borderRadius: "10px", padding: "12px 16px", color: "var(--text)",
                  fontSize: "14px", outline: "none", resize: "vertical", marginBottom: "16px",
                  fontFamily: "DM Sans, sans-serif"
                }}
              />
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={handleAdd} disabled={saving || !form.company || !form.role} className="btn-primary" style={{ fontSize: "14px" }}>
                  {saving ? "Saving..." : "Save Application"}
                </button>
                <button onClick={() => setShowForm(false)} className="btn-ghost" style={{ fontSize: "14px" }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Status filter pills */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
            <button
              onClick={() => setActiveStatus(null)}
              style={{
                padding: "6px 14px", borderRadius: "100px", fontSize: "13px", fontWeight: 500,
                cursor: "pointer", transition: "all 0.2s",
                border: activeStatus === null ? "1px solid #4F8EF7" : "1px solid var(--border)",
                background: activeStatus === null ? "rgba(79,142,247,0.15)" : "transparent",
                color: activeStatus === null ? "#4F8EF7" : "var(--text-muted)",
              }}
            >
              All ({applications.length})
            </button>
            {STATUSES.filter((s) => counts[s] > 0).map((s) => {
              const sc = statusConfig[s];
              return (
                <button
                  key={s}
                  onClick={() => setActiveStatus(activeStatus === s ? null : s)}
                  style={{
                    padding: "6px 14px", borderRadius: "100px", fontSize: "13px", fontWeight: 500,
                    cursor: "pointer", transition: "all 0.2s",
                    border: activeStatus === s ? `1px solid ${sc.color}` : "1px solid var(--border)",
                    background: activeStatus === s ? sc.bg : "transparent",
                    color: activeStatus === s ? sc.color : "var(--text-muted)",
                  }}
                >
                  {sc.label} ({counts[s]})
                </button>
              );
            })}
          </div>

          {/* Applications List */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px", color: "var(--text-muted)" }}>
              Loading applications...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 40px", color: "var(--text-dim)" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
              <p style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: 700, marginBottom: "8px", color: "var(--text-muted)" }}>
                No applications yet
              </p>
              <p style={{ fontSize: "14px" }}>Click "Add Application" to start tracking</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {filtered.map((app) => {
                const sc = statusConfig[app.status] || statusConfig.APPLIED;
                return (
                  <div key={app.id} className="card" style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "16px" }}>
                            {app.company}
                          </span>
                          <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>· {app.role}</span>
                          {app.location && (
                            <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>📍 {app.location}</span>
                          )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span style={{ fontSize: "12px", color: "var(--text-dim)" }}>
                            {new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                          {app.jobUrl && (
                            <a href={app.jobUrl} target="_blank" rel="noreferrer"
                              style={{ fontSize: "12px", color: "#4F8EF7", textDecoration: "none" }}>
                              View job →
                            </a>
                          )}
                        </div>
                        {app.notes && (
                          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "8px", lineHeight: 1.5 }}>
                            {app.notes}
                          </p>
                        )}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          style={{
                            background: sc.bg, color: sc.color,
                            border: `1px solid ${sc.color}40`, borderRadius: "100px",
                            padding: "6px 12px", fontSize: "12px", fontWeight: 600,
                            cursor: "pointer", outline: "none",
                            fontFamily: "DM Sans, sans-serif"
                          }}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s} style={{ background: "var(--bg-2)", color: "var(--text)" }}>
                              {statusConfig[s].label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleDelete(app.id)}
                          style={{
                            background: "transparent", border: "1px solid var(--border)",
                            borderRadius: "8px", padding: "6px 10px", cursor: "pointer",
                            color: "var(--text-dim)", fontSize: "14px", transition: "all 0.2s"
                          }}
                          onMouseOver={(e) => { (e.target as HTMLElement).style.borderColor = "#EF4444"; (e.target as HTMLElement).style.color = "#EF4444"; }}
                          onMouseOut={(e) => { (e.target as HTMLElement).style.borderColor = "var(--border)"; (e.target as HTMLElement).style.color = "var(--text-dim)"; }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
  );
}
"use client";
import { SectionLabel, AccentLine, PriorityBadge, StatusDot } from "@/components/shared";

export default function OverviewTab({ data, setTab }) {
  const activeDecisions = data.decisions.filter(d => d.status === "active");

  return (
    <div>
      {/* Timeline */}
      <SectionLabel>Your Timeline</SectionLabel>
      <AccentLine />
      <div style={{ display: "flex", gap: 0, marginBottom: 56, overflowX: "auto", paddingBottom: 8 }}>
        {data.milestones.map((m, i) => (
          <div key={m.id} style={{ flex: "1 0 110px", textAlign: "center", position: "relative" }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", margin: "0 auto 10px",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700,
              background: m.status === "done" ? "#722F37" : "transparent",
              color: m.status === "done" ? "#FAF8F5" : m.status === "current" ? "#722F37" : "#ccc",
              border: m.status === "done" ? "2px solid #722F37" : m.status === "current" ? "2px solid #722F37" : "2px solid #ddd",
            }}>
              {m.status === "done" ? "✓" : `0${i + 1}`}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{m.label}</div>
            <div style={{ fontSize: 11, color: "#888" }}>{m.target}</div>
            {i < data.milestones.length - 1 && (
              <div style={{ position: "absolute", top: 17, left: "calc(50% + 22px)", right: "calc(-50% + 22px)", height: 1, background: m.status === "done" ? "#722F37" : "#ddd" }} />
            )}
          </div>
        ))}
      </div>

      {/* Needs Input */}
      {activeDecisions.length > 0 && (
        <div style={{ marginBottom: 56 }}>
          <SectionLabel>Needs Your Input</SectionLabel>
          <AccentLine />
          <div style={{ display: "grid", gap: 14 }}>
            {activeDecisions.slice(0, 4).map(d => (
              <div
                key={d.id}
                onClick={() => setTab("decisions")}
                style={{ border: "1px solid rgba(114,47,55,0.12)", padding: "22px 26px", cursor: "pointer", transition: "all 0.2s", background: "rgba(114,47,55,0.015)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#722F37"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(114,47,55,0.12)"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                  <div>
                    <PriorityBadge priority={d.priority} />
                    <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 21, fontWeight: 400, margin: "8px 0 4px" }}>{d.title}</h3>
                    <p style={{ fontSize: 13, color: "#666", margin: 0, lineHeight: 1.7 }}>{d.description}</p>
                  </div>
                  <div style={{ fontSize: 12, color: "#888", whiteSpace: "nowrap" }}>by {d.deadline}</div>
                </div>
              </div>
            ))}
            {activeDecisions.length > 4 && (
              <button onClick={() => setTab("decisions")} style={{ fontSize: 13, color: "#722F37", background: "none", border: "none", cursor: "pointer", padding: 8, textAlign: "center" }}>
                View all {activeDecisions.length} decisions →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Working on */}
      <div style={{ marginBottom: 56 }}>
        <SectionLabel>What We're Working On</SectionLabel>
        <AccentLine />
        {data.inProgress.map(p => (
          <div key={p.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "14px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
            <StatusDot />
            <div>
              <div style={{ fontSize: 14, lineHeight: 1.6 }}>{p.task}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>{p.owner} · Started {p.started}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Completed */}
      <div>
        <SectionLabel>Completed</SectionLabel>
        <AccentLine />
        {data.completed.map(c => (
          <div key={c.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
            <span style={{ color: "#5a8a5a", fontSize: 13, flexShrink: 0 }}>✓</span>
            <div style={{ flex: 1, fontSize: 13, color: "#666" }}>{c.task}</div>
            <div style={{ fontSize: 11, color: "#aaa", whiteSpace: "nowrap" }}>{c.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { SectionLabel, AccentLine, PriorityBadge, StatusDot } from "@/components/shared";
import Editable from "@/components/Editable";

export default function OverviewTab({ data, setTab, u }) {
  const [draggingMilestoneId, setDraggingMilestoneId] = useState(null);
  const activeDecisions = data.decisions.filter(d => d.status === "active");
  const updateMilestone = (id, field, value) => u(d => {
    const milestone = d.milestones.find(x => x.id === id);
    if (milestone) milestone[field] = value;
  });
  const removeMilestone = (id) => u(d => {
    d.milestones = d.milestones.filter(x => x.id !== id);
  });
  const addMilestone = () => u(d => {
    d.milestones.push({
      id: `m${Date.now()}`,
      label: "New Milestone",
      target: "TBD",
      status: "upcoming",
    });
  });
  const toggleMilestoneDone = (id) => u(d => {
    const milestone = d.milestones.find(x => x.id === id);
    if (!milestone) return;
    milestone.status = milestone.status === "done" ? "upcoming" : "done";
  });
  const reorderMilestones = (fromId, toId) => u(d => {
    const fromIndex = d.milestones.findIndex(x => x.id === fromId);
    const toIndex = d.milestones.findIndex(x => x.id === toId);
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;
    const [moved] = d.milestones.splice(fromIndex, 1);
    d.milestones.splice(toIndex, 0, moved);
  });

  return (
    <div>
      {/* Timeline */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <SectionLabel>Your Timeline</SectionLabel>
        <button
          onClick={addMilestone}
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            border: "1px solid rgba(114,47,55,0.28)",
            background: "transparent",
            color: "#722F37",
            cursor: "pointer",
            fontSize: 16,
            lineHeight: 1,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: -8,
          }}
          title="Add milestone"
        >
          +
        </button>
      </div>
      <AccentLine />
      <div style={{ display: "flex", gap: 0, marginBottom: 56, overflowX: "auto", paddingBottom: 8 }}>
        {data.milestones.map((m, i) => (
          <div
            key={m.id}
            draggable
            onDragStart={() => setDraggingMilestoneId(m.id)}
            onDragEnd={() => setDraggingMilestoneId(null)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (draggingMilestoneId && draggingMilestoneId !== m.id) reorderMilestones(draggingMilestoneId, m.id);
              setDraggingMilestoneId(null);
            }}
            style={{
              flex: "1 0 110px",
              textAlign: "center",
              position: "relative",
              cursor: "grab",
              opacity: draggingMilestoneId === m.id ? 0.6 : 1,
            }}
            title="Drag to reorder"
          >
            <button
              onClick={() => toggleMilestoneDone(m.id)}
              title={m.status === "done" ? "Click to mark as not done" : "Click to mark as done"}
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                margin: "0 auto 10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                background: m.status === "done" ? "#722F37" : "transparent",
                color: m.status === "done" ? "#FAF8F5" : "#bbb",
                border: m.status === "done" ? "2px solid #722F37" : "2px solid #ddd",
                fontFamily: "'Sen',sans-serif",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {m.status === "done" ? "✓" : `${i + 1}`.padStart(2, "0")}
            </button>
            <Editable
              value={m.label}
              onChange={v => updateMilestone(m.id, "label", v)}
              tag="div"
              style={{ fontSize: 12, fontWeight: 600, marginBottom: 2, display: "block" }}
            />
            <Editable
              value={m.target}
              onChange={v => updateMilestone(m.id, "target", v)}
              tag="div"
              style={{ fontSize: 11, color: "#888", display: "block" }}
            />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 6 }}>
              <button
                onClick={() => removeMilestone(m.id)}
                style={{ border: "none", background: "none", color: "#bbb", cursor: "pointer", fontSize: 12 }}
                title="Remove milestone"
              >
                ×
              </button>
            </div>
            {i < data.milestones.length - 1 && (
              <div style={{ position: "absolute", top: 17, left: "calc(50% + 22px)", right: "calc(-50% + 22px)", height: 1, background: m.status === "done" ? "#722F37" : "#ddd" }} />
            )}
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 46 }} />

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

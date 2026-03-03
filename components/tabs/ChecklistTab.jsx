"use client";
import { useState } from "react";
import { SectionLabel, AccentLine, StatusDot } from "@/components/shared";
import NotesPanel from "@/components/NotesPanel";

const timelineOrder = ["12+ Months", "9–12 Months", "6–9 Months", "3–6 Months", "1–3 Months", "1 Month", "Week Of"];

const categoryColors = {
  "Administration": { bg: "rgba(114,47,55,0.08)", color: "#722F37" },
  "Culture":        { bg: "rgba(139,90,160,0.08)", color: "#7B5B8D" },
  "Venue":          { bg: "rgba(60,120,80,0.08)",  color: "#3C7850" },
  "Internal":       { bg: "rgba(26,26,26,0.06)",   color: "#666" },
  "Vendors":        { bg: "rgba(184,151,126,0.12)", color: "#96734e" },
  "Guest Mgmt":     { bg: "rgba(60,100,160,0.08)", color: "#3C64A0" },
  "Attire":         { bg: "rgba(180,80,120,0.08)", color: "#A04870" },
  "Styling":        { bg: "rgba(200,140,60,0.08)", color: "#A07030" },
  "Decor":          { bg: "rgba(160,120,80,0.08)", color: "#8C6830" },
  "Logistics":      { bg: "rgba(80,80,140,0.08)",  color: "#50508C" },
  "Music":          { bg: "rgba(180,60,60,0.08)",  color: "#A03C3C" },
  "Experience":     { bg: "rgba(60,140,140,0.08)", color: "#3C8C8C" },
};

export default function ChecklistTab({ data, u }) {
  const [openNotesId, setOpenNotesId] = useState(null);

  const grouped = {};
  timelineOrder.forEach(t => { grouped[t] = data.checklist.filter(c => c.timeline === t); });

  const sendToProgress = (item) => {
    u(d => {
      const cl = d.checklist.find(x => x.id === item.id);
      if (cl) cl.status = "in-progress";
      const alreadyInProgress = d.inProgress.some(p => p.task === item.task);
      if (!alreadyInProgress) {
        d.inProgress.push({
          id: `p${Date.now()}`,
          task: item.task + (item.note ? ` (${item.note})` : ""),
          owner: "Juri",
          started: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          notes: item.notes ? [...item.notes] : [],
        });
      }
    });
  };

  const markDone = (id) => {
    u(d => {
      const cl = d.checklist.find(x => x.id === id);
      if (cl) cl.status = cl.status === "done" ? "not-started" : "done";
    });
  };

  const addNote = (id, note) => u(d => {
    const cl = d.checklist.find(x => x.id === id);
    if (cl) { if (!cl.notes) cl.notes = []; cl.notes.push(note); }
  });

  const statusIcon = (status) => {
    if (status === "done") return <span style={{ color: "#5a8a5a", fontSize: 13 }}>✓</span>;
    if (status === "in-progress") return <StatusDot />;
    return <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", border: "2px solid #ccc", marginRight: 10 }} />;
  };

  const total = data.checklist.length;
  const doneCount = data.checklist.filter(c => c.status === "done").length;
  const ipCount = data.checklist.filter(c => c.status === "in-progress").length;

  return (
    <div>
      <SectionLabel>Master Plan</SectionLabel>
      <AccentLine />
      <p style={{ fontSize: 14, color: "#888", lineHeight: 1.7, marginBottom: 8 }}>
        Everything that goes into planning your wedding, from first steps to the week of. Items move to the Tasks tab when we start working on them.
      </p>

      {/* Progress bar */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#888", marginBottom: 8 }}>
          <span>{doneCount} of {total} complete</span>
          <span>{ipCount} in progress</span>
        </div>
        <div style={{ height: 4, background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
          <div style={{ height: "100%", display: "flex" }}>
            <div style={{ width: `${(doneCount / total) * 100}%`, background: "#5a8a5a", transition: "width 0.3s" }} />
            <div style={{ width: `${(ipCount / total) * 100}%`, background: "#B8977E", transition: "width 0.3s" }} />
          </div>
        </div>
      </div>

      {timelineOrder.map(timeline => {
        const items = grouped[timeline];
        if (!items || items.length === 0) return null;
        return (
          <div key={timeline} style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 400 }}>{timeline}</span>
              <span style={{ fontSize: 11, color: "#aaa" }}>before wedding</span>
            </div>
            <div style={{ display: "grid", gap: 0 }}>
              {items.map(item => {
                const isOpen = openNotesId === item.id;
                const noteCount = (item.notes ?? []).length;
                const catStyle = categoryColors[item.category] || categoryColors["Internal"];
                return (
                  <div key={item.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
                      opacity: item.status === "done" ? 0.5 : 1,
                      transition: "opacity 0.2s",
                    }}>
                      <button onClick={() => markDone(item.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", flexShrink: 0 }}>
                        {statusIcon(item.status)}
                      </button>
                      <span style={{
                        display: "inline-block", fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
                        fontFamily: "'Sen',sans-serif", padding: "3px 8px", flexShrink: 0, minWidth: 70, textAlign: "center",
                        background: catStyle.bg, color: catStyle.color,
                      }}>
                        {item.category}
                      </span>
                      <div style={{ flex: 1, fontSize: 14, textDecoration: item.status === "done" ? "line-through" : "none", color: item.status === "done" ? "#999" : "#333" }}>
                        {item.task}
                      </div>
                      {item.note && (
                        <span style={{ fontSize: 12, color: "#aaa", flexShrink: 0, maxWidth: 200, textAlign: "right" }}>{item.note}</span>
                      )}
                      <button
                        onClick={() => setOpenNotesId(isOpen ? null : item.id)}
                        style={{ fontFamily: "'Sen',sans-serif", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", padding: "3px 8px", background: "none", border: "1px solid #ddd", cursor: "pointer", color: isOpen ? "#722F37" : "#aaa", borderColor: isOpen ? "#722F37" : "#ddd", flexShrink: 0 }}
                      >
                        Notes{noteCount > 0 ? ` (${noteCount})` : ""}
                      </button>
                      {item.status === "not-started" && (
                        <button
                          onClick={() => sendToProgress(item)}
                          style={{ fontFamily: "'Sen',sans-serif", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", padding: "4px 10px", background: "none", border: "1px solid #ddd", cursor: "pointer", color: "#888", whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.2s" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "#722F37"; e.currentTarget.style.color = "#722F37"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.color = "#888"; }}
                        >
                          Start →
                        </button>
                      )}
                      {item.status === "in-progress" && (
                        <span style={{ fontSize: 9, letterSpacing: 1, textTransform: "uppercase", color: "#B8977E", fontWeight: 600, flexShrink: 0 }}>In Progress</span>
                      )}
                    </div>
                    {isOpen && (
                      <div style={{ paddingLeft: 28, paddingBottom: 8 }}>
                        <NotesPanel notes={item.notes ?? []} onAddNote={note => addNote(item.id, note)} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

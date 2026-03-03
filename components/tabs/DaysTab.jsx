"use client";
import { useState } from "react";
import { SectionLabel, AccentLine, StatusDot } from "@/components/shared";
import Editable from "@/components/Editable";

export default function DaysTab({ data, u }) {
  const [selectedDay, setSelectedDay] = useState("day3");
  const day = data.days.find(d => d.id === selectedDay);

  const updateDayField = (field, value) => u(d => { const f = d.days.find(x => x.id === selectedDay); if (f) f[field] = value; });
  const updateTask = (taskId, field, value) => u(d => { const dy = d.days.find(x => x.id === selectedDay); if (dy) { const t = dy.tasks.find(x => x.id === taskId); if (t) t[field] = value; } });
  const addTask = () => u(d => { const dy = d.days.find(x => x.id === selectedDay); if (dy) dy.tasks.push({ id: `dt${Date.now()}`, text: "New task...", status: "todo" }); });
  const removeTask = (taskId) => u(d => { const dy = d.days.find(x => x.id === selectedDay); if (dy) dy.tasks = dy.tasks.filter(t => t.id !== taskId); });
  const addDecisionNeeded = () => u(d => { const dy = d.days.find(x => x.id === selectedDay); if (dy) dy.decisionsNeeded.push("New decision..."); });
  const removeDecisionNeeded = (i) => u(d => { const dy = d.days.find(x => x.id === selectedDay); if (dy) dy.decisionsNeeded.splice(i, 1); });
  const updateDecisionNeeded = (i, v) => u(d => { const dy = d.days.find(x => x.id === selectedDay); if (dy) dy.decisionsNeeded[i] = v; });

  return (
    <div>
      <SectionLabel>Wedding Week</SectionLabel>
      <AccentLine />

      {/* Day selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 40, overflowX: "auto", paddingBottom: 4 }}>
        {data.days.map(d => {
          const sel = d.id === selectedDay;
          const wedding = d.dayNum === 3;
          return (
            <button key={d.id} onClick={() => setSelectedDay(d.id)} style={{
              flex: "1 0 0", minWidth: 100, padding: "16px 12px", textAlign: "center", cursor: "pointer",
              background: sel ? (wedding ? "#722F37" : "#1a1a1a") : "transparent",
              color: sel ? "#FAF8F5" : "#1a1a1a",
              border: sel ? "none" : "1px solid rgba(0,0,0,0.1)",
              fontFamily: "'Sen',sans-serif", transition: "all 0.2s",
            }}>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: sel ? (wedding ? "rgba(250,248,245,0.7)" : "#B8977E") : "#888", marginBottom: 4 }}>Day {d.dayNum}</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 400 }}>{d.title}</div>
              <div style={{ fontSize: 10, color: sel ? "rgba(250,248,245,0.5)" : "#aaa", marginTop: 4 }}>{d.dateLabel}</div>
            </button>
          );
        })}
      </div>

      {day && (
        <div>
          {/* Day header */}
          {day.dayNum === 3 ? (
            <div style={{ background: "#722F37", color: "#FAF8F5", padding: "24px 28px", marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "rgba(250,248,245,0.6)", marginBottom: 6 }}>The Main Event</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 300 }}>{day.title}</div>
              <div style={{ fontSize: 13, color: "rgba(250,248,245,0.5)", marginTop: 4 }}>{day.dateLabel}</div>
            </div>
          ) : (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 300, marginBottom: 4 }}>{day.title}</div>
              <div style={{ fontSize: 13, color: "#888" }}>{day.dateLabel}</div>
            </div>
          )}

          {/* Summary */}
          <div style={{ marginBottom: 36 }}>
            <Editable value={day.summary} onChange={v => updateDayField("summary", v)} tag="p" multiline style={{ fontSize: 15, lineHeight: 1.8, color: "#444", display: "block", margin: 0 }} />
          </div>

          {/* Two columns */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
            {/* Tasks */}
            <div>
              <SectionLabel>Tasks</SectionLabel>
              <AccentLine />
              {day.tasks.map(t => (
                <div key={t.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                  <button onClick={() => updateTask(t.id, "status", t.status === "done" ? "todo" : "done")} style={{
                    width: 18, height: 18, borderRadius: "50%", flexShrink: 0, marginTop: 2, cursor: "pointer",
                    border: t.status === "done" ? "2px solid #5a8a5a" : "2px solid #ccc",
                    background: t.status === "done" ? "#5a8a5a" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", padding: 0,
                  }}>
                    {t.status === "done" ? "✓" : ""}
                  </button>
                  <Editable value={t.text} onChange={v => updateTask(t.id, "text", v)} tag="div" style={{
                    flex: 1, fontSize: 14, lineHeight: 1.6, display: "block",
                    textDecoration: t.status === "done" ? "line-through" : "none",
                    color: t.status === "done" ? "#aaa" : "#333",
                  }} />
                  <button onClick={() => removeTask(t.id)} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 14, padding: "0 2px", flexShrink: 0 }}>×</button>
                </div>
              ))}
              <button onClick={addTask} style={{ fontFamily: "'Sen',sans-serif", fontSize: 11, letterSpacing: 1, color: "#888", background: "none", border: "none", cursor: "pointer", padding: "12px 0", textTransform: "uppercase" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#722F37")} onMouseLeave={e => (e.currentTarget.style.color = "#888")}>+ Add Task</button>
            </div>

            {/* Decisions */}
            <div>
              <SectionLabel>Decisions Needed</SectionLabel>
              <AccentLine />
              {day.decisionsNeeded.length === 0 && <p style={{ fontSize: 13, color: "#aaa", fontStyle: "italic" }}>No outstanding decisions for this day.</p>}
              {day.decisionsNeeded.map((dn, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                  <StatusDot color="#B8977E" />
                  <Editable value={dn} onChange={v => updateDecisionNeeded(i, v)} tag="div" style={{ flex: 1, fontSize: 14, lineHeight: 1.6, display: "block" }} />
                  <button onClick={() => removeDecisionNeeded(i)} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 14, padding: "0 2px", flexShrink: 0 }}>×</button>
                </div>
              ))}
              <button onClick={addDecisionNeeded} style={{ fontFamily: "'Sen',sans-serif", fontSize: 11, letterSpacing: 1, color: "#888", background: "none", border: "none", cursor: "pointer", padding: "12px 0", textTransform: "uppercase" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#722F37")} onMouseLeave={e => (e.currentTarget.style.color = "#888")}>+ Add Decision</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

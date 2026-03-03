"use client";
import { useState } from "react";
import { SectionLabel, AccentLine, StatusDot } from "@/components/shared";
import Editable from "@/components/Editable";
import NotesPanel from "@/components/NotesPanel";

export default function ProgressTab({ data, u }) {
  const [openNotesId, setOpenNotesId] = useState(null);

  const updateInProgress = (id, field, value) => u(d => { const f = d.inProgress.find(x => x.id === id); if (f) f[field] = value; });
  const completeTask = (id) => u(d => {
    const t = d.inProgress.find(x => x.id === id);
    if (t) {
      d.completed.unshift({ id: `c${Date.now()}`, task: t.task, date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), notes: t.notes ?? [] });
      d.inProgress = d.inProgress.filter(x => x.id !== id);
    }
  });
  const removeInProgress = (id) => u(d => { d.inProgress = d.inProgress.filter(x => x.id !== id); });
  const addInProgress = () => u(d => { d.inProgress.push({ id: `p${Date.now()}`, task: "New task...", owner: "Juri", started: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), notes: [] }); });
  const removeCompleted = (id) => u(d => { d.completed = d.completed.filter(x => x.id !== id); });
  const addNoteToInProgress = (id, note) => u(d => { const f = d.inProgress.find(x => x.id === id); if (f) { if (!f.notes) f.notes = []; f.notes.push(note); } });
  const addNoteToCompleted = (id, note) => u(d => { const f = d.completed.find(x => x.id === id); if (f) { if (!f.notes) f.notes = []; f.notes.push(note); } });

  return (
    <div>
      <div style={{ marginBottom: 48 }}>
        <SectionLabel>In Progress</SectionLabel>
        <AccentLine />
        {data.inProgress.map(p => {
          const isOpen = openNotesId === p.id;
          const noteCount = (p.notes ?? []).length;
          return (
            <div key={p.id} style={{ padding: "16px 0", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <StatusDot />
                <div style={{ flex: 1 }}>
                  <Editable value={p.task} onChange={v => updateInProgress(p.id, "task", v)} tag="div" style={{ fontSize: 14, lineHeight: 1.6, display: "block" }} />
                  <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                    <Editable value={p.owner} onChange={v => updateInProgress(p.id, "owner", v)} style={{ fontSize: 12, color: "#888" }} /> · Started {p.started}
                  </div>
                </div>
                <button
                  onClick={() => setOpenNotesId(isOpen ? null : p.id)}
                  style={{ fontFamily: "'Sen',sans-serif", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", padding: "4px 8px", background: "none", border: "1px solid #ddd", cursor: "pointer", color: isOpen ? "#722F37" : "#aaa", borderColor: isOpen ? "#722F37" : "#ddd", flexShrink: 0 }}
                >
                  Notes{noteCount > 0 ? ` (${noteCount})` : ""}
                </button>
                <button onClick={() => completeTask(p.id)} style={{ fontFamily: "'Sen',sans-serif", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", padding: "5px 10px", background: "none", border: "1px solid #ddd", cursor: "pointer", color: "#888", whiteSpace: "nowrap", flexShrink: 0 }}>Done ✓</button>
                <button onClick={() => removeInProgress(p.id)} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 15, flexShrink: 0 }}>×</button>
              </div>
              {isOpen && (
                <div style={{ paddingLeft: 18 }}>
                  <NotesPanel notes={p.notes ?? []} onAddNote={note => addNoteToInProgress(p.id, note)} />
                </div>
              )}
            </div>
          );
        })}
        <button onClick={addInProgress} style={{ fontFamily: "'Sen',sans-serif", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", padding: "14px 0", background: "none", border: "none", cursor: "pointer", color: "#888", width: "100%", textAlign: "left" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#722F37")} onMouseLeave={e => (e.currentTarget.style.color = "#888")}>+ Add Task</button>
      </div>

      <div>
        <SectionLabel>Completed</SectionLabel>
        <AccentLine />
        {data.completed.map(c => {
          const isOpen = openNotesId === c.id;
          const noteCount = (c.notes ?? []).length;
          return (
            <div key={c.id} style={{ padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ color: "#5a8a5a", fontSize: 13, flexShrink: 0 }}>✓</span>
                <Editable value={c.task} onChange={v => u(d => { const f = d.completed.find(x => x.id === c.id); if (f) f.task = v; })} tag="div" style={{ flex: 1, fontSize: 13, color: "#666", display: "block" }} />
                <div style={{ fontSize: 11, color: "#aaa", whiteSpace: "nowrap" }}>{c.date}</div>
                <button
                  onClick={() => setOpenNotesId(isOpen ? null : c.id)}
                  style={{ fontFamily: "'Sen',sans-serif", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", padding: "3px 8px", background: "none", border: "1px solid #ddd", cursor: "pointer", color: isOpen ? "#722F37" : "#aaa", borderColor: isOpen ? "#722F37" : "#ddd", flexShrink: 0 }}
                >
                  Notes{noteCount > 0 ? ` (${noteCount})` : ""}
                </button>
                <button onClick={() => removeCompleted(c.id)} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 13, flexShrink: 0 }}>×</button>
              </div>
              {isOpen && (
                <div style={{ paddingLeft: 18 }}>
                  <NotesPanel notes={c.notes ?? []} onAddNote={note => addNoteToCompleted(c.id, note)} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

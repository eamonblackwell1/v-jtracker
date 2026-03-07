"use client";
import { useState } from "react";
import { SectionLabel, AccentLine, PriorityBadge } from "@/components/shared";
import Editable from "@/components/Editable";
import NotesPanel from "@/components/NotesPanel";

function DecisionCard({ d, openNotesId, onToggleNotes, updateDecision, removeDecision, addNote }) {
  const isOpen = openNotesId === d.id;
  const noteCount = (d.notes ?? []).length;
  return (
    <div style={{ border: "1px solid rgba(0,0,0,0.08)", padding: "24px 26px", marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <PriorityBadge priority={d.priority} />
          <select value={d.priority} onChange={e => updateDecision(d.id, "priority", e.target.value)} style={{ fontFamily: "'Sen',sans-serif", fontSize: 10, padding: "2px 6px", border: "1px solid #eee", background: "#fff", cursor: "pointer" }}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={() => onToggleNotes(d.id)}
            style={{ fontFamily: "'Sen',sans-serif", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", padding: "3px 10px", background: "none", border: "1px solid #ddd", cursor: "pointer", color: isOpen ? "#722F37" : "#888", borderColor: isOpen ? "#722F37" : "#ddd" }}
          >
            Notes{noteCount > 0 ? ` (${noteCount})` : ""}
          </button>
          <select value={d.status} onChange={e => updateDecision(d.id, "status", e.target.value)} style={{ fontFamily: "'Sen',sans-serif", fontSize: 11, padding: "4px 8px", border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}>
            <option value="active">Needs Input Now</option>
            <option value="on-horizon">On the Horizon</option>
            <option value="resolved">Resolved</option>
          </select>
          <button onClick={() => removeDecision(d.id)} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 16 }}>×</button>
        </div>
      </div>
      <Editable value={d.title} onChange={v => updateDecision(d.id, "title", v)} tag="h3" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 400, margin: "0 0 6px", display: "block" }} />
      <Editable value={d.description} onChange={v => updateDecision(d.id, "description", v)} tag="p" multiline style={{ fontSize: 13, color: "#666", margin: "0 0 10px", lineHeight: 1.7, display: "block" }} />
      <div style={{ fontSize: 12, color: "#888" }}>by <Editable value={d.deadline} onChange={v => updateDecision(d.id, "deadline", v)} style={{ fontSize: 12, color: "#888" }} /></div>
      {isOpen && (
        <NotesPanel
          notes={d.notes ?? []}
          onAddNote={note => addNote(d.id, note)}
        />
      )}
    </div>
  );
}

export default function DecisionsTab({ data, u }) {
  const [openNotesId, setOpenNotesId] = useState(null);

  const active = data.decisions.filter(d => d.status === "active");
  const horizon = data.decisions.filter(d => d.status === "on-horizon");
  const resolved = data.decisions.filter(d => d.status === "resolved");

  const updateDecision = (id, field, value) => u(d => { const f = d.decisions.find(x => x.id === id); if (f) f[field] = value; });
  const removeDecision = (id) => u(d => { d.decisions = d.decisions.filter(x => x.id !== id); });
  const addDecision = () => u(d => { d.decisions.push({ id: `d${Date.now()}`, title: "New Decision", description: "Click to edit...", deadline: "TBD", status: "on-horizon", priority: "medium", notes: [] }); });
  const addNote = (id, note) => u(d => { const f = d.decisions.find(x => x.id === id); if (f) { if (!f.notes) f.notes = []; f.notes.push(note); } });
  const toggleNotes = (id) => setOpenNotesId(prev => prev === id ? null : id);

  const renderSection = (label, items) => items.length > 0 && (
    <div key={label} style={{ marginBottom: 44 }}>
      <SectionLabel>{label}</SectionLabel>
      <AccentLine />
      {items.map(d => <DecisionCard key={d.id} d={d} openNotesId={openNotesId} onToggleNotes={toggleNotes} updateDecision={updateDecision} removeDecision={removeDecision} addNote={addNote} />)}
    </div>
  );

  return (
    <div>
      {renderSection("Needs Input Now", active)}
      {renderSection("On the Horizon", horizon)}
      {renderSection("Resolved", resolved)}
      <button
        onClick={addDecision}
        style={{ fontFamily: "'Sen',sans-serif", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", padding: "14px 28px", background: "none", border: "1px solid rgba(0,0,0,0.12)", cursor: "pointer", color: "#888", width: "100%", transition: "all 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#722F37"; e.currentTarget.style.color = "#722F37"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)"; e.currentTarget.style.color = "#888"; }}
      >
        + Add Decision
      </button>
    </div>
  );
}

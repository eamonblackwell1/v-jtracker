"use client";
import { useState } from "react";

export default function NotesPanel({ notes = [], onAddNote }) {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("Eamon & Juri");

  const handleAdd = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAddNote({
      id: `n${Date.now()}`,
      text: trimmed,
      timestamp: new Date().toISOString(),
      author: author.trim() || "Eamon & Juri",
    });
    setText("");
  };

  return (
    <div style={{ borderTop: "1px solid rgba(184,151,126,0.2)", marginTop: 12, paddingTop: 16, paddingBottom: 4 }}>
      {notes.length === 0 && (
        <p style={{ fontSize: 12, color: "#aaa", fontStyle: "italic", margin: "0 0 12px" }}>No notes yet.</p>
      )}
      {notes.map(n => (
        <div key={n.id} style={{ marginBottom: 12, paddingLeft: 12, borderLeft: "2px solid #B8977E" }}>
          <div style={{ fontSize: 11, color: "#aaa", marginBottom: 3, fontFamily: "'Sen',sans-serif" }}>
            {n.author} · {formatTimestamp(n.timestamp)}
          </div>
          <div style={{ fontSize: 13, color: "#444", lineHeight: 1.6 }}>{n.text}</div>
        </div>
      ))}

      {/* Add note form */}
      <div style={{ marginTop: 12 }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add a note..."
          style={{
            width: "100%", fontFamily: "'Sen',sans-serif", fontSize: 13, lineHeight: 1.6,
            border: "1px solid rgba(0,0,0,0.1)", padding: "8px 12px", resize: "vertical",
            minHeight: 60, outline: "none", boxSizing: "border-box", borderRadius: 0,
            background: "rgba(184,151,126,0.04)",
          }}
          onFocus={e => (e.currentTarget.style.borderColor = "#B8977E")}
          onBlur={e => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)")}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
          <input
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="Author"
            style={{
              fontFamily: "'Sen',sans-serif", fontSize: 12, border: "1px solid rgba(0,0,0,0.1)",
              padding: "5px 10px", flex: 1, outline: "none", borderRadius: 0,
            }}
          />
          <button
            onClick={handleAdd}
            style={{
              fontFamily: "'Sen',sans-serif", fontSize: 11, letterSpacing: 1, textTransform: "uppercase",
              padding: "6px 14px", background: "#722F37", border: "none", color: "#FAF8F5",
              cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            Add Note
          </button>
        </div>
      </div>
    </div>
  );
}

function formatTimestamp(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}

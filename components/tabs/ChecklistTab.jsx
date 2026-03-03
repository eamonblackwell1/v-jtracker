"use client";
import { useState } from "react";
import { SectionLabel, AccentLine, StatusDot } from "@/components/shared";
import NotesPanel from "@/components/NotesPanel";

const phaseOrder = ["12+", "12-6", "6-3", "3-2", "2-1", "WEEKS", "POST"];

const phaseLabels = {
  "12+": "12+ Months Before",
  "12-6": "12-6 Months Before",
  "6-3": "6-3 Months Before",
  "3-2": "3-2 Months Before",
  "2-1": "2-1 Months Before",
  WEEKS: "Final Weeks",
  POST: "Post-Wedding",
};

export default function ChecklistTab({ data, u }) {
  const [openNotesId, setOpenNotesId] = useState(null);

  const groupedByPhase = phaseOrder.map((phase) => {
    const items = data.checklist
      .filter((item) => resolvePhase(item) === phase)
      .sort((a, b) => (a.num ?? Number.POSITIVE_INFINITY) - (b.num ?? Number.POSITIVE_INFINITY));
    return {
      phase,
      categories: groupItemsByCategory(items),
    };
  });

  const sendToProgress = (item) => {
    u(d => {
      const cl = d.checklist.find(x => x.id === item.id);
      if (cl) cl.status = "in-progress";
      const alreadyInProgress = d.inProgress.some(p => p.task === item.task);
      if (!alreadyInProgress) {
        const detailText = (item.details ?? item.note ?? "").trim();
        d.inProgress.push({
          id: `p${Date.now()}`,
          task: detailText ? `${item.task} (${truncate(detailText, 72)})` : item.task,
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
  const doneWidth = total > 0 ? (doneCount / total) * 100 : 0;
  const inProgressWidth = total > 0 ? (ipCount / total) * 100 : 0;

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
            <div style={{ width: `${doneWidth}%`, background: "#5a8a5a", transition: "width 0.3s" }} />
            <div style={{ width: `${inProgressWidth}%`, background: "#B8977E", transition: "width 0.3s" }} />
          </div>
        </div>
      </div>

      {groupedByPhase.map(({ phase, categories }) => {
        if (categories.length === 0) return null;
        return (
          <div key={phase} style={{ marginBottom: 40 }}>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 400 }}>{phaseLabels[phase]}</span>
            </div>

            {categories.map(({ category, items }) => (
              <div key={`${phase}-${category}`} style={{ marginBottom: 18 }}>
                <div style={{ fontFamily: "'Sen',sans-serif", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#777", marginBottom: 8 }}>
                  {category}
                </div>
                <div style={{ display: "grid", gap: 0 }}>
                  {items.map(item => {
                    const isOpen = openNotesId === item.id;
                    const noteCount = (item.notes ?? []).length;
                    const detailsText = item.details ?? item.note ?? "";
                    return (
                      <div key={item.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                        <div
                          onClick={() => setOpenNotesId(isOpen ? null : item.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "12px 0",
                            opacity: item.status === "done" ? 0.5 : 1,
                            transition: "opacity 0.2s",
                            cursor: "pointer",
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markDone(item.id);
                            }}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", flexShrink: 0 }}
                          >
                            {statusIcon(item.status)}
                          </button>
                          <span style={{ fontSize: 12, color: "#999", minWidth: 30 }}>{item.num ? `${item.num}.` : ""}</span>
                          <OwnerPill owner={item.owner} />
                          <div style={{ flex: 1, fontSize: 14, textDecoration: item.status === "done" ? "line-through" : "none", color: item.status === "done" ? "#999" : "#333" }}>
                            {item.task}
                          </div>
                          {item.weddingDay && (
                            <span style={{ fontSize: 11, color: "#aaa", flexShrink: 0 }}>
                              {formatWeddingDay(item.weddingDay)}
                            </span>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenNotesId(isOpen ? null : item.id);
                            }}
                            style={{ fontFamily: "'Sen',sans-serif", fontSize: 9, letterSpacing: 1, textTransform: "uppercase", padding: "3px 8px", background: "none", border: "1px solid #ddd", cursor: "pointer", color: isOpen ? "#722F37" : "#aaa", borderColor: isOpen ? "#722F37" : "#ddd", flexShrink: 0 }}
                          >
                            Notes{noteCount > 0 ? ` (${noteCount})` : ""}
                          </button>
                          {item.status === "not-started" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                sendToProgress(item);
                              }}
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
                          <div style={{ paddingLeft: 28, paddingBottom: 10 }}>
                            {detailsText && (
                              <p style={{ fontSize: 13, color: "#777", lineHeight: 1.6, margin: "0 0 10px" }}>
                                {detailsText}
                              </p>
                            )}
                            <NotesPanel notes={item.notes ?? []} onAddNote={note => addNote(item.id, note)} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function groupItemsByCategory(items) {
  const map = new Map();
  items.forEach((item) => {
    const category = item.category || "Uncategorized";
    if (!map.has(category)) map.set(category, []);
    map.get(category).push(item);
  });
  return Array.from(map.entries()).map(([category, categoryItems]) => ({
    category,
    items: categoryItems,
  }));
}

function resolvePhase(item) {
  if (item.phase) return item.phase;
  const legacyTimelineToPhase = {
    "12+ Months": "12+",
    "9–12 Months": "12-6",
    "6–9 Months": "6-3",
    "3–6 Months": "3-2",
    "1–3 Months": "2-1",
    "1 Month": "WEEKS",
    "Week Of": "WEEKS",
  };
  return legacyTimelineToPhase[item.timeline] || "12+";
}

function formatWeddingDay(dayId) {
  return `Day ${String(dayId).replace("day", "")}`;
}

function truncate(text, max) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}...`;
}

function OwnerPill({ owner }) {
  const map = {
    us: { label: "MIJ", color: "#722F37", background: "rgba(114,47,55,0.08)", border: "none" },
    them: { label: "V&J", color: "#722F37", background: "transparent", border: "1px solid rgba(114,47,55,0.35)" },
    shared: { label: "Both", color: "#96734e", background: "rgba(184,151,126,0.12)", border: "none" },
  };
  const style = map[owner] || map.shared;
  return (
    <span style={{
      fontFamily: "'Sen',sans-serif",
      fontSize: 10,
      letterSpacing: 1,
      textTransform: "uppercase",
      padding: "2px 8px",
      color: style.color,
      background: style.background,
      border: style.border,
      whiteSpace: "nowrap",
      flexShrink: 0,
    }}>
      {style.label}
    </span>
  );
}

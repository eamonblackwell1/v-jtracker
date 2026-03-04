"use client";
import { useState } from "react";
import { SectionLabel, AccentLine } from "@/components/shared";
import Editable from "@/components/Editable";

const phaseOrder = ["12+", "12-6", "6-3", "3-2", "2-1", "WEEKS", "POST"];
const phaseLabels = {
  "12+": "12+ months",
  "12-6": "12-6 months",
  "6-3": "6-3 months",
  "3-2": "3-2 months",
  "2-1": "2-1 months",
  WEEKS: "Final weeks",
  POST: "Post-wedding",
};

const ownerOptions = [
  { value: "mij", label: "Married in Japan" },
  { value: "shared", label: "Shared" },
  { value: "vj", label: "Vanessa and Jeremy" },
];

const statusOptions = [
  { value: "not-started", label: "Not Started" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export default function ChecklistTab({ data, u }) {
  const [openTaskId, setOpenTaskId] = useState(null);
  const checklist = (data.checklist || [])
    .slice()
    .sort((a, b) => (a.num ?? Number.POSITIVE_INFINITY) - (b.num ?? Number.POSITIVE_INFINITY));

  const updateItem = (id, field, value) => u(d => {
    const item = d.checklist.find(x => x.id === id);
    if (item) item[field] = value;
  });
  const updateStatus = (id, nextStatus) => u(d => {
    const item = d.checklist.find(x => x.id === id);
    if (!item) return;
    item.status = nextStatus;

    if (nextStatus !== "in-progress") return;

    const existing = d.inProgress.find(x => x.sourceChecklistId === id);
    if (existing) {
      existing.task = item.task;
      existing.owner = ownerDisplayLabel(item.owner);
      return;
    }

    d.inProgress.push({
      id: `p${Date.now()}`,
      sourceChecklistId: id,
      task: item.task,
      owner: ownerDisplayLabel(item.owner),
      started: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      notes: Array.isArray(item.notes) ? [...item.notes] : [],
    });
  });

  return (
    <div>
      <SectionLabel>Master Plan</SectionLabel>
      <AccentLine />
      <p style={{ fontSize: 14, color: "#888", lineHeight: 1.7, marginBottom: 8 }}>
        Tasks are sourced from your workbook and organized as editable planning columns.
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["#", "Time", "Task", "Owner", "Status"].map((h, i) => (
              <th
                key={h}
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid rgba(0,0,0,0.1)",
                  fontSize: 11,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  textAlign: i === 2 ? "left" : "center",
                  fontWeight: 600,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {checklist.map(item => {
            const isOpen = openTaskId === item.id;
            const owner = normalizeOwner(item.owner);
            const status = normalizeStatus(item.status);
            return (
              <FragmentRow
                key={item.id}
                isOpen={isOpen}
                item={item}
                owner={owner}
                status={status}
                onToggle={() => setOpenTaskId(isOpen ? null : item.id)}
                onChange={updateItem}
                onStatusChange={updateStatus}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function FragmentRow({ item, owner, status, isOpen, onToggle, onChange, onStatusChange }) {
  return (
    <>
      <tr style={{ opacity: status === "done" ? 0.55 : 1 }}>
        <td style={{ padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.05)", textAlign: "center", fontSize: 12, color: "#888" }}>
          {item.num || "-"}
        </td>
        <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(0,0,0,0.05)", textAlign: "center" }}>
          <select
            value={normalizePhase(item.phase)}
            onChange={e => onChange(item.id, "phase", e.target.value)}
            style={{ fontFamily: "'Sen',sans-serif", fontSize: 12, padding: "4px 8px", border: "1px solid #ddd", background: "#fff" }}
          >
            {phaseOrder.map(p => (
              <option key={p} value={p}>{phaseLabels[p]}</option>
            ))}
          </select>
        </td>
        <td style={{ padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.05)", fontSize: 14 }}>
          <Editable
            value={item.task || ""}
            onChange={v => onChange(item.id, "task", v)}
            tag="div"
            style={{
              fontSize: 14,
              display: "block",
              textDecoration: status === "done" ? "line-through" : "none",
              color: status === "done" ? "#999" : "#333",
              cursor: "pointer",
            }}
          />
          <button
            onClick={onToggle}
            style={{ marginTop: 4, border: "none", background: "none", padding: 0, fontSize: 11, color: "#888", cursor: "pointer" }}
          >
            {isOpen ? "Hide notes" : "View notes"}
          </button>
        </td>
        <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(0,0,0,0.05)", textAlign: "center" }}>
          <select
            value={owner}
            onChange={e => onChange(item.id, "owner", e.target.value)}
            style={ownerSelectStyle(owner)}
          >
            {ownerOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </td>
        <td style={{ padding: "10px 8px", borderBottom: "1px solid rgba(0,0,0,0.05)", textAlign: "center" }}>
          <select
            value={status}
            onChange={e => onStatusChange(item.id, e.target.value)}
            style={{
              fontFamily: "'Sen',sans-serif",
              fontSize: 12,
              padding: "4px 8px",
              border: "1px solid #ddd",
              background: "#fff",
              color: status === "done" ? "#5a8a5a" : status === "in-progress" ? "#96734e" : "#777",
            }}
          >
            {statusOptions.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </td>
      </tr>
      {isOpen && (
        <tr>
          <td colSpan={5} style={{ padding: "10px 0 14px", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.7 }}>
              {item.details || "No notes for this task."}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function normalizeOwner(owner) {
  const key = String(owner || "").toLowerCase();
  if (key === "mij" || key === "us" || key.includes("married in japan")) return "mij";
  if (key === "vj" || key === "them" || key.includes("vanessa")) return "vj";
  return "shared";
}

function normalizeStatus(status) {
  const key = String(status || "").toLowerCase();
  if (key.includes("progress")) return "in-progress";
  if (key.includes("done")) return "done";
  return "not-started";
}

function normalizePhase(phase) {
  const key = String(phase || "").toLowerCase();
  if (key.includes("12+") || key === "12+") return "12+";
  if (key.includes("12-6") || key.includes("12–6")) return "12-6";
  if (key.includes("6-3") || key.includes("6–3")) return "6-3";
  if (key.includes("3-2") || key.includes("3–2")) return "3-2";
  if (key.includes("2-1") || key.includes("2–1")) return "2-1";
  if (key.includes("week")) return "WEEKS";
  if (key.includes("post")) return "POST";
  return "12+";
}

function ownerDisplayLabel(owner) {
  const normalized = normalizeOwner(owner);
  if (normalized === "mij") return "Married in Japan";
  if (normalized === "vj") return "Vanessa and Jeremy";
  return "Shared";
}

function ownerSelectStyle(owner) {
  if (owner === "mij") {
    return {
      fontFamily: "'Sen',sans-serif",
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      padding: "4px 8px",
      border: "none",
      color: "#722F37",
      background: "rgba(114,47,55,0.1)",
    };
  }
  if (owner === "vj") {
    return {
      fontFamily: "'Sen',sans-serif",
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      padding: "4px 8px",
      border: "1px solid rgba(114,47,55,0.3)",
      color: "#722F37",
      background: "transparent",
    };
  }
  return {
    fontFamily: "'Sen',sans-serif",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    padding: "4px 8px",
    border: "none",
    color: "#96734e",
    background: "rgba(184,151,126,0.18)",
  };
}

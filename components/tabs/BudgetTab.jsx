"use client";
import { SectionLabel, AccentLine } from "@/components/shared";
import Editable from "@/components/Editable";

export default function BudgetTab({ data, u }) {
  const updateBudgetItem = (id, field, value) => u(d => { const f = d.budget.find(x => x.id === id); if (f) f[field] = value; });
  const addBudgetItem = () => u(d => { d.budget.push({ id: `b${Date.now()}`, label: "New Category", low: 0, high: 0, status: "Not started" }); });
  const removeBudgetItem = (id) => u(d => { d.budget = d.budget.filter(x => x.id !== id); });

  const vendorLow = data.budget.reduce((s, b) => s + b.low, 0);
  const vendorHigh = data.budget.reduce((s, b) => s + b.high, 0);
  const totalLow = vendorLow + data.planningFee;
  const totalHigh = vendorHigh + data.planningFee;

  return (
    <div>
      <SectionLabel>Wedding Budget</SectionLabel>
      <AccentLine />
      <div style={{ marginBottom: 28 }}>
        <Editable value={data.budgetNote} onChange={v => u(d => { d.budgetNote = v; })} tag="p" multiline style={{ fontSize: 14, color: "#888", lineHeight: 1.7, display: "block", margin: 0 }} />
      </div>

      <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#722F37", marginBottom: 16, marginTop: 8 }}>Estimated Costs</div>
      <div style={{ width: 40, height: 2, background: "#722F37", marginBottom: 20 }} />

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
        <thead>
          <tr>
            {["Category", "Low Estimate", "High Estimate", "Status", ""].map((h, i) => (
              <th key={i} style={{ padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.1)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", textAlign: i === 0 ? "left" : i === 4 ? "center" : "right", fontWeight: 600, width: i === 0 ? "35%" : i === 4 ? "30px" : undefined }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.05)", fontSize: 14 }}>Planning Fee</td>
            <td style={{ padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.05)", fontSize: 14, textAlign: "right" }}>AU${data.planningFee.toLocaleString()}</td>
            <td style={{ padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.05)", fontSize: 14, textAlign: "right" }}>AU${data.planningFee.toLocaleString()}</td>
            <td style={{ padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.05)", fontSize: 12, textAlign: "right", color: "#5a8a5a" }}>Confirmed</td>
            <td style={{ padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.05)", width: 30 }}></td>
          </tr>
          {data.budget.map(b => (
            <tr key={b.id}>
              <td style={{ padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.05)", fontSize: 14 }}>
                <Editable value={b.label} onChange={v => updateBudgetItem(b.id, "label", v)} style={{ fontSize: 14 }} />
              </td>
              <td style={{ padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.05)", fontSize: 14, textAlign: "right" }}>
                AU$<Editable value={String(b.low)} onChange={v => updateBudgetItem(b.id, "low", parseInt(v.replace(/[^0-9]/g, "")) || 0)} style={{ fontSize: 14, display: "inline" }} />
              </td>
              <td style={{ padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.05)", fontSize: 14, textAlign: "right" }}>
                AU$<Editable value={String(b.high)} onChange={v => updateBudgetItem(b.id, "high", parseInt(v.replace(/[^0-9]/g, "")) || 0)} style={{ fontSize: 14, display: "inline" }} />
              </td>
              <td style={{ padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.05)", fontSize: 12, textAlign: "right", color: "#888" }}>
                <Editable value={b.status} onChange={v => updateBudgetItem(b.id, "status", v)} style={{ fontSize: 12, color: "#888" }} />
              </td>
              <td style={{ padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.05)", textAlign: "center" }}>
                <button onClick={() => removeBudgetItem(b.id)} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 14 }}>×</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ borderTop: "2px solid #722F37", paddingTop: 20, marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Estimated Total</span>
          <span style={{ fontSize: 15, fontWeight: 700 }}>AU${totalLow.toLocaleString()} – AU${totalHigh.toLocaleString()}</span>
        </div>
      </div>

      <button
        onClick={addBudgetItem}
        style={{ fontFamily: "'Sen',sans-serif", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", padding: "14px 28px", background: "none", border: "1px solid rgba(0,0,0,0.12)", cursor: "pointer", color: "#888", width: "100%", transition: "all 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#722F37"; e.currentTarget.style.color = "#722F37"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)"; e.currentTarget.style.color = "#888"; }}
      >
        + Add Category
      </button>
    </div>
  );
}

export function SectionLabel({ children }) {
  return (
    <div style={{ fontFamily: "'Sen',sans-serif", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "#722F37", marginBottom: 16 }}>
      {children}
    </div>
  );
}

export function AccentLine({ dark }) {
  return <div style={{ width: 40, height: 2, background: dark ? "#B8977E" : "#722F37", marginBottom: 28 }} />;
}

export function PriorityBadge({ priority }) {
  const c = {
    high: { bg: "rgba(114,47,55,0.1)", color: "#722F37", t: "High Priority" },
    medium: { bg: "rgba(184,151,126,0.15)", color: "#96734e", t: "Medium" },
    low: { bg: "rgba(26,26,26,0.06)", color: "#888", t: "Upcoming" },
  };
  const s = c[priority] || c.low;
  return (
    <span style={{ display: "inline-block", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'Sen',sans-serif", background: s.bg, color: s.color, padding: "4px 10px", fontWeight: 600 }}>
      {s.t}
    </span>
  );
}

export function StatusDot({ color = "#722F37" }) {
  return (
    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: color, marginRight: 10, flexShrink: 0 }} />
  );
}

export default function SaveIndicator({ status }) {
  if (status === "idle") return null;
  return (
    <span style={{
      fontFamily: "'Sen',sans-serif",
      fontSize: 11,
      letterSpacing: 2,
      textTransform: "uppercase",
      color: status === "saving" ? "rgba(250,248,245,0.35)" : "#B8977E",
      transition: "color 0.3s",
    }}>
      {status === "saving" ? "Saving..." : "Saved ✓"}
    </span>
  );
}

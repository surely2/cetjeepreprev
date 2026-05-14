import { useMemo } from "react";
import { Math } from "./Math.jsx";

const TAG_STYLES = {
  JEE: { bg: "rgba(251,191,36,0.15)", border: "rgba(251,191,36,0.4)", color: "#FBBF24" },
  CET: { bg: "rgba(52,211,153,0.15)", border: "rgba(52,211,153,0.4)", color: "#34D399" },
  NCERT: { bg: "rgba(167,139,250,0.15)", border: "rgba(167,139,250,0.4)", color: "#A78BFA" },
};

export function TagBadge({ tag }) {
  const s = TAG_STYLES[tag] || TAG_STYLES.JEE;
  return (
    <span style={{
      background: s.bg,
      border: `1px solid ${s.border}`,
      color: s.color,
      fontSize: "9px",
      fontWeight: 700,
      padding: "2px 7px",
      borderRadius: 99,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    }}>{tag}</span>
  );
}

export function WeightageBadge({ weightage }) {
  if (!weightage) return null;
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
      {weightage.jee && (
        <span style={{
          background: "rgba(251,191,36,0.12)",
          border: "1px solid rgba(251,191,36,0.3)",
          color: "#FBBF24",
          fontSize: "9px",
          fontWeight: 700,
          padding: "2px 6px",
          borderRadius: 99,
        }}>JEE: {weightage.jee}</span>
      )}
      {weightage.cet && (
        <span style={{
          background: "rgba(52,211,153,0.12)",
          border: "1px solid rgba(52,211,153,0.3)",
          color: "#34D399",
          fontSize: "9px",
          fontWeight: 700,
          padding: "2px 6px",
          borderRadius: 99,
        }}>CET: {weightage.cet}</span>
      )}
    </div>
  );
}

export function FormulaCard({ f, subjectColor, bookmarks, toggleBookmark }) {
  const id = f.label;
  const isBookmarked = bookmarks.has(id);

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${f.important ? subjectColor + "50" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 14,
      padding: "13px 16px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      transition: "all 0.2s",
      boxShadow: f.important ? `0 0 18px ${subjectColor}20` : "none",
      position: "relative",
    }} className="formula-card">

      {f.important && (
        <div style={{
          position: "absolute", top: 8, right: 8,
          background: "rgba(251,191,36,0.2)",
          border: "1px solid rgba(251,191,36,0.4)",
          color: "#FBBF24",
          fontSize: 8,
          padding: "1px 5px",
          borderRadius: 99,
          fontWeight: 700,
          letterSpacing: "0.1em",
        }}>★ KEY</div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, marginBottom: 6, letterSpacing: "0.05em" }}>
          {f.label}
        </div>
        <div style={{ overflowX: "auto", color: "#fff" }}>
          <Math tex={f.tex} display={true} />
        </div>
        <div style={{ display: "flex", gap: 5, marginTop: 6, flexWrap: "wrap" }}>
          {f.jee && <TagBadge tag="JEE" />}
          {f.cet && <TagBadge tag="CET" />}
        </div>
      </div>

      <button
        onClick={() => toggleBookmark(id)}
        style={{
          background: isBookmarked ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.05)",
          border: `1px solid ${isBookmarked ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.1)"}`,
          color: isBookmarked ? "#FBBF24" : "rgba(255,255,255,0.3)",
          borderRadius: 8,
          width: 30,
          height: 30,
          cursor: "pointer",
          fontSize: 14,
          flexShrink: 0,
          transition: "all 0.2s",
        }}
      >{isBookmarked ? "★" : "☆"}</button>
    </div>
  );
}

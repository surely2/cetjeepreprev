import { useState } from "react";
import { SUBJECTS, IMPORTANT_FORMULAS, ALL_FORMULAS_FLAT } from "../data/index.js";
import { FormulaCard } from "../components/FormulaCard.jsx";
import { Math } from "../components/Math.jsx";

function sm2Update(card, rating) {
  let { interval = 0, repetitions = 0, efactor = 2.5 } = card || {};
  let newInterval, newReps;

  if (rating >= 3) {
    if (repetitions === 0) newInterval = 1;
    else if (repetitions === 1) newInterval = 6;
    else newInterval = Math.round(interval * efactor);
    newReps = repetitions + 1;
  } else {
    newReps = 0;
    newInterval = 1;
  }

  const q = rating;
  let newEf = efactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (newEf < 1.3) newEf = 1.3;

  const dueDate = Date.now() + newInterval * 24 * 60 * 60 * 1000;

  return { interval: newInterval, repetitions: newReps, efactor: newEf, dueDate, lastReviewed: Date.now() };
}

export function RevisionView({ bookmarks, toggleBookmark, srData, setSrData }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showFormula, setShowFormula] = useState(false);
  const [filter, setFilter] = useState("important");
  const [subFilter, setSubFilter] = useState("all");
  const [rated, setRated] = useState(false);

  let pool = filter === "bookmarked"
    ? ALL_FORMULAS_FLAT.filter(f => bookmarks.has(f.label))
    : filter === "important"
    ? IMPORTANT_FORMULAS
    : ALL_FORMULAS_FLAT;

  if (subFilter !== "all") pool = pool.filter(f => f.subject === subFilter);

  const now = Date.now();
  const poolWithSR = pool.map(f => {
    const sr = srData[f.label] || { interval: 0, repetitions: 0, efactor: 2.5, dueDate: 0 };
    return { ...f, sr };
  });
  const duePool = poolWithSR.filter(f => f.sr.dueDate <= now).sort((a, b) => a.sr.dueDate - b.sr.dueDate);
  const queue = duePool.length > 0 ? duePool : poolWithSR;
  const current = queue[currentIdx] || queue[0];

  const next = () => { setCurrentIdx(i => (i + 1) % queue.length); setShowFormula(false); setRated(false); };
  const prev = () => { setCurrentIdx(i => (i - 1 + queue.length) % queue.length); setShowFormula(false); setRated(false); };

  const handleRate = (rating) => {
    if (rated) return;
    const updated = sm2Update(current.sr, rating);
    setSrData(prev => ({ ...prev, [current.label]: updated }));
    setRated(true);
    setTimeout(() => next(), 400);
  };

  if (pool.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px", color: "rgba(255,255,255,0.3)" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>📭</div>
        <div style={{ fontSize: 16 }}>No formulas in this set</div>
        <div style={{ fontSize: 13, marginTop: 8 }}>{filter === "bookmarked" ? "Bookmark some formulas first!" : "Try a different filter"}</div>
      </div>
    );
  }

  const s = SUBJECTS[current.subject];
  const isDue = (current.sr?.dueDate || 0) <= now;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
        <h2 style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 24, margin: 0 }}>🔄 Revision Mode <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>SM-2</span></h2>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[["important", "⭐ Key"], ["bookmarked", "★ Saved"], ["all", "All"]].map(([v, l]) => (
            <button key={v} onClick={() => { setFilter(v); setCurrentIdx(0); setShowFormula(false); setRated(false); }} style={{
              padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              background: filter === v ? "rgba(129,140,248,0.15)" : "transparent",
              border: `1px solid ${filter === v ? "rgba(129,140,248,0.4)" : "rgba(255,255,255,0.1)"}`,
              color: filter === v ? "#818CF8" : "rgba(255,255,255,0.4)",
            }}>{l}</button>
          ))}
          {["all", "physics", "chemistry", "mathematics"].map(f => (
            <button key={f} onClick={() => { setSubFilter(f); setCurrentIdx(0); setShowFormula(false); setRated(false); }} style={{
              padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              background: subFilter === f ? "rgba(255,255,255,0.08)" : "transparent",
              border: `1px solid ${subFilter === f ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)"}`,
              color: subFilter === f ? "#fff" : "rgba(255,255,255,0.35)",
            }}>{f === "all" ? "All" : SUBJECTS[f]?.icon}</button>
          ))}
        </div>
      </div>

      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, textAlign: "center", marginBottom: 14 }}>
        {currentIdx + 1} / {queue.length} {isDue && <span style={{ color: "#F87171" }}>· Due</span>}
      </div>

      <div
        onClick={() => !rated && setShowFormula(f => !f)}
        style={{
          background: showFormula
            ? `linear-gradient(135deg, ${s.bg}, rgba(255,255,255,0.02))`
            : "rgba(255,255,255,0.04)",
          border: `2px solid ${showFormula ? s.border : "rgba(255,255,255,0.1)"}`,
          borderRadius: 24,
          padding: "48px 36px",
          textAlign: "center",
          cursor: "pointer",
          minHeight: 200,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s",
          marginBottom: 16,
          boxShadow: showFormula ? `0 20px 60px ${s.glow}` : "none",
        }}
      >
        <div style={{ color: showFormula ? s.color : "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", marginBottom: 12 }}>
          {showFormula ? `${s.icon} ${s.label} · ${current.topic}` : "TAP TO REVEAL"}
        </div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginBottom: showFormula ? 20 : 0 }}>{current.label}</div>
        {showFormula && (
          <div style={{ fontSize: "1.6em", color: "#fff", overflowX: "auto", maxWidth: "100%" }}>
            <Math tex={current.tex} display={true} />
          </div>
        )}
        {!showFormula && (
          <div style={{ fontSize: 32, color: "rgba(255,255,255,0.15)", marginTop: 8 }}>?</div>
        )}
      </div>

      {showFormula && !rated && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, textAlign: "center", marginBottom: 10 }}>How well did you know this?</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "Again", color: "#F87171", rating: 1 },
              { label: "Hard", color: "#FB923C", rating: 2 },
              { label: "Good", color: "#FBBF24", rating: 3 },
              { label: "Easy", color: "#34D399", rating: 4 },
              { label: "Perfect", color: "#60A5FA", rating: 5 },
            ].map(btn => (
              <button key={btn.rating} onClick={() => handleRate(btn.rating)} style={{
                background: `${btn.color}15`,
                border: `1px solid ${btn.color}50`,
                color: btn.color,
                borderRadius: 10,
                padding: "10px 16px",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "inherit",
                minWidth: 70,
              }}>{btn.label}</button>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={prev} style={{
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
          color: "#fff", borderRadius: 12, padding: "12px 24px", cursor: "pointer",
          fontSize: 14, fontFamily: "inherit",
        }}>← Prev</button>
        <button onClick={() => toggleBookmark(current.label)} style={{
          background: bookmarks.has(current.label) ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.06)",
          border: `1px solid ${bookmarks.has(current.label) ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.12)"}`,
          color: bookmarks.has(current.label) ? "#FBBF24" : "rgba(255,255,255,0.5)",
          borderRadius: 12, padding: "12px 18px", cursor: "pointer", fontSize: 16, fontFamily: "inherit",
        }}>{bookmarks.has(current.label) ? "★" : "☆"}</button>
        <button onClick={next} style={{
          background: `${s.color}20`, border: `1px solid ${s.color}50`,
          color: s.color, borderRadius: 12, padding: "12px 24px", cursor: "pointer",
          fontSize: 14, fontFamily: "inherit", fontWeight: 600,
        }}>Next →</button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { SUBJECTS, IMPORTANT_FORMULAS, getDayFormula } from "../data/index.js";
import { FormulaCard, TagBadge } from "../components/FormulaCard.jsx";
import { Math } from "../components/Math.jsx";

export function FormulaOfTheDay({ bookmarks, toggleBookmark }) {
  const [currentFormula, setCurrentFormula] = useState(getDayFormula);

  const getRandomFormula = () => {
    const idx = Math.floor(Math.random() * IMPORTANT_FORMULAS.length);
    setCurrentFormula(IMPORTANT_FORMULAS[idx]);
  };

  const s = SUBJECTS[currentFormula.subject];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
        <h2 style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 24, margin: 0 }}>
          🌟 Formula of the Day
        </h2>
        <button
          onClick={getRandomFormula}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff",
            borderRadius: 10,
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
          }}
        >🔀 Randomize</button>
      </div>

      <div style={{
        background: `linear-gradient(135deg, ${s.bg}, rgba(255,255,255,0.02))`,
        border: `2px solid ${s.border}`,
        borderRadius: 24,
        padding: "40px 36px",
        textAlign: "center",
        boxShadow: `0 20px 60px ${s.glow}`,
        marginBottom: 24,
      }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>{s.icon}</div>
        <div style={{ color: s.color, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
          {s.label} · {currentFormula.topic}
        </div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 20 }}>{currentFormula.label}</div>
        <div style={{ fontSize: "1.8em", color: "#fff", overflowX: "auto" }}>
          <Math tex={currentFormula.tex} display={true} />
        </div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 16 }}>
          {currentFormula.jee && <TagBadge tag="JEE" />}
          {currentFormula.cet && <TagBadge tag="CET" />}
          {currentFormula.important && <TagBadge tag="★ KEY" />}
        </div>
      </div>

      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "20px 24px",
      }}>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 14 }}>
          📌 TODAY'S REVISION — IMPORTANT FORMULAS REVIEW
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {IMPORTANT_FORMULAS.slice(0, 5).map((f, i) => (
            <FormulaCard key={i} f={f} subjectColor={SUBJECTS[f.subject].color} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
          ))}
        </div>
      </div>
    </div>
  );
}

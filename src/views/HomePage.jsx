import { useMemo } from "react";
import { SUBJECTS, PHYSICS_DATA, CHEMISTRY_DATA, MATHEMATICS_DATA } from "../data/index.js";
import { TagBadge, WeightageBadge } from "../components/FormulaCard.jsx";

export function HomePage({ setSubject, setActiveTopic, setView }) {
  const stats = [
    { label: "Formulas", value: "500+", icon: "∑" },
    { label: "Topics", value: "37", icon: "📚" },
    { label: "Subjects", value: "3", icon: "⚗" },
    { label: "Tricks", value: "100+", icon: "⚡" },
  ];

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px" }} className="home-page">
      {/* Hero */}
      <div style={{
        textAlign: "center",
        marginBottom: 48,
        padding: "60px 40px",
        background: "radial-gradient(ellipse at 50% 0%, rgba(129,140,248,0.12), transparent 70%), rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 28,
        backdropFilter: "blur(20px)",
        position: "relative",
        overflow: "hidden",
      }} className="hero-section">
        <div style={{
          position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)",
          width: 300, height: 200,
          background: "radial-gradient(circle, rgba(129,140,248,0.2), transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ fontSize: 52, marginBottom: 16 }}>⚡</div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 42,
          fontWeight: 800,
          color: "#fff",
          margin: "0 0 12px",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }} className="hero-title">JEE Main × MHT CET</h1>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 16, margin: "0 0 8px" }}>
          Complete Formula Handbook & Quick Revision Guide
        </p>
        <p style={{ color: "rgba(129,140,248,0.8)", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Physics · Chemistry · Mathematics — Class 11 & 12
        </p>

        <div className="stats-row" style={{ display: "flex", gap: 16, marginTop: 32, justifyContent: "center", flexWrap: "wrap" }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 14,
              padding: "14px 24px",
              minWidth: 90,
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: "0.1em", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Cards */}
      <div className="subject-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {Object.entries(SUBJECTS).map(([key, s]) => {
          const dataMap = { physics: PHYSICS_DATA, chemistry: CHEMISTRY_DATA, mathematics: MATHEMATICS_DATA };
          const count = dataMap[key].length;
          return (
            <button
              key={key}
              onClick={() => { setSubject(key); setActiveTopic(dataMap[key][0]?.id || null); setView("study"); }}
              style={{
                background: s.bg,
                border: `1px solid ${s.border}`,
                borderRadius: 20,
                padding: "28px 20px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.25s",
                boxShadow: `0 8px 32px ${s.glow}`,
              }}
              className="subject-card"
            >
              <div style={{ fontSize: 36, marginBottom: 14 }}>{s.icon}</div>
              <div style={{ color: "#fff", fontSize: 17, fontWeight: 700, fontFamily: "'Playfair Display', serif", marginBottom: 6 }}>{s.label}</div>
              <div style={{ color: s.accent, fontSize: 12, opacity: 0.8 }}>{count} Topics</div>
            </button>
          );
        })}
      </div>

      {/* Quick Tips */}
      <div style={{
        background: "rgba(251,191,36,0.05)",
        border: "1px solid rgba(251,191,36,0.15)",
        borderRadius: 16,
        padding: "20px 24px",
      }}>
        <div style={{ color: "#FBBF24", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>💡 HOW TO USE</div>
        <div className="tips-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            "Select a subject from the sidebar",
            "Click topics to explore formulas",
            "Bookmark ★ important formulas",
            "Look for ★ KEY tag — high priority",
            "JEE tag = important for JEE Main",
            "CET tag = important for MHT CET",
            "⚠️ Avoid the common mistakes listed",
            "⚡ Tricks save time in exams",
          ].map((tip, i) => (
            <div key={i} style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, lineHeight: 1.6 }}>
              → {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

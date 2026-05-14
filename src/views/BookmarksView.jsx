import { useMemo } from "react";
import { SUBJECTS, PHYSICS_DATA, CHEMISTRY_DATA, MATHEMATICS_DATA } from "../data/index.js";
import { FormulaCard } from "../components/FormulaCard.jsx";

export function BookmarksView({ bookmarks, toggleBookmark, setView }) {
  if (bookmarks.size === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px", color: "rgba(255,255,255,0.3)" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>★</div>
        <div style={{ fontSize: 16 }}>No bookmarks yet</div>
        <div style={{ fontSize: 13, marginTop: 8 }}>Click ☆ on any formula to bookmark it</div>
      </div>
    );
  }

  const allFormulas = [];
  [
    ...PHYSICS_DATA.map(t => ({ ...t, subject: "physics" })),
    ...CHEMISTRY_DATA.map(t => ({ ...t, subject: "chemistry" })),
    ...MATHEMATICS_DATA.map(t => ({ ...t, subject: "mathematics" })),
  ].forEach(topic => {
    topic.sections.forEach(sec => {
      sec.formulas && sec.formulas.forEach(f => {
        if (bookmarks.has(f.label)) {
          allFormulas.push({ ...f, subject: topic.subject, topic: topic.title });
        }
      });
    });
  });

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
        <h2 style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 24, margin: 0 }}>
          ★ Bookmarked Formulas <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 16 }}>({allFormulas.length})</span>
        </h2>
        <button
          onClick={() => setView("cheatsheet")}
          style={{
            background: "rgba(129,140,248,0.15)",
            border: "1px solid rgba(129,140,248,0.4)",
            color: "#818CF8",
            borderRadius: 10,
            padding: "8px 14px",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
          }}
        >📄 Cheat Sheet</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {allFormulas.map((f, i) => (
          <div key={i}>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: "0.08em", marginBottom: 4 }}>
              {SUBJECTS[f.subject].icon} {SUBJECTS[f.subject].label} · {f.topic}
            </div>
            <FormulaCard f={f} subjectColor={SUBJECTS[f.subject].color} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
          </div>
        ))}
      </div>
    </div>
  );
}

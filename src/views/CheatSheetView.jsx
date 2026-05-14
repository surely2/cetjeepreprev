import { useState } from "react";
import { SUBJECTS, ALL_FORMULAS_FLAT, IMPORTANT_FORMULAS } from "../data/index.js";
import { Math } from "../components/Math.jsx";

export function CheatSheetView({ bookmarks, setView }) {
  const [mode, setMode] = useState("bookmarks");

  const formulas = mode === "bookmarks"
    ? ALL_FORMULAS_FLAT.filter(f => bookmarks.has(f.label))
    : IMPORTANT_FORMULAS;

  const bySubject = { physics: [], chemistry: [], mathematics: [] };
  formulas.forEach(f => { if (bySubject[f.subject]) bySubject[f.subject].push(f); });

  return (
    <div style={{ padding: "24px 24px 80px", maxWidth: 900, margin: "0 auto" }} className="cheatsheet-page">
      <div className="no-print" style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        <button onClick={() => window.print()} style={{
          background: "rgba(129,140,248,0.15)", border: "1px solid rgba(129,140,248,0.4)",
          color: "#818CF8", borderRadius: 10, padding: "10px 18px", cursor: "pointer",
          fontSize: 13, fontWeight: 700, fontFamily: "inherit",
        }}>🖨️ Print / Save as PDF</button>
        <button onClick={() => setMode(m => m === "bookmarks" ? "important" : "bookmarks")} style={{
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
          color: "#fff", borderRadius: 10, padding: "10px 18px", cursor: "pointer",
          fontSize: 13, fontFamily: "inherit",
        }}>{mode === "bookmarks" ? "★ Bookmarked" : "⭐ All Key"}</button>
        <button onClick={() => setView("bookmarks")} style={{
          background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.5)", borderRadius: 10, padding: "10px 18px", cursor: "pointer",
          fontSize: 13, fontFamily: "inherit",
        }}>✕ Close</button>
      </div>

      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#111", marginBottom: 20, textAlign: "center" }} className="print-dark">
        JEE × CET Formula Cheat Sheet
      </h1>

      {Object.entries(bySubject).map(([subKey, list]) => {
        if (list.length === 0) return null;
        const s = SUBJECTS[subKey];
        return (
          <div key={subKey} style={{ marginBottom: 24 }}>
            <h2 style={{ color: s.color, fontSize: 18, fontWeight: 700, marginBottom: 10, borderBottom: `2px solid ${s.border}`, paddingBottom: 6 }}>
              {s.icon} {s.label}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
              {list.map((f, i) => (
                <div key={i} style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding: "10px 12px",
                  background: "#fff",
                  breakInside: "avoid",
                }}>
                  <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 4, fontWeight: 600 }}>{f.label}</div>
                  <div style={{ fontSize: 13, color: "#111" }}>
                    <Math tex={f.tex} display={true} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {formulas.length === 0 && (
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: 40 }}>
          {mode === "bookmarks" ? "No bookmarks yet." : "No key formulas found."}
        </div>
      )}
    </div>
  );
}

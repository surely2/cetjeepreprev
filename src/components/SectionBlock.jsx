import { useState } from "react";
import { Math } from "./Math.jsx";
import { FormulaCard } from "./FormulaCard.jsx";

export function SectionBlock({ section, subjectColor, bookmarks, toggleBookmark }) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ marginBottom: 20 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12,
          padding: "12px 16px",
          color: "#fff",
          fontSize: 14,
          fontWeight: 600,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          textAlign: "left",
          transition: "all 0.2s",
        }}
        className="section-btn"
      >
        <span>{section.title}</span>
        <span style={{ 
          color: subjectColor, 
          transition: "transform 0.25s", 
          display: "inline-block", 
          transform: open ? "rotate(0)" : "rotate(-90deg)" 
        }}>▾</span>
      </button>

      {open && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
          {section.formulas && section.formulas.map((f, i) => (
            <FormulaCard key={i} f={f} subjectColor={subjectColor} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
          ))}

          {section.notes && section.notes.length > 0 && (
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
              padding: "13px 16px",
              marginTop: 4,
            }}>
              <div style={{ color: subjectColor, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>
                📝 NOTES
              </div>
              {section.notes.map((n, i) => (
                <div key={i} style={{ 
                  color: "rgba(255,255,255,0.65)", 
                  fontSize: 12.5, 
                  marginBottom: 4, 
                  lineHeight: 1.6, 
                  paddingLeft: 12, 
                  borderLeft: `2px solid ${subjectColor}50` 
                }}>
                  {n}
                </div>
              ))}
            </div>
          )}

          {section.mistakes && section.mistakes.length > 0 && (
            <div style={{
              background: "rgba(239,68,68,0.05)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 12,
              padding: "13px 16px",
            }}>
              <div style={{ color: "#F87171", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>
                ⚠️ COMMON MISTAKES
              </div>
              {section.mistakes.map((m, i) => (
                <div key={i} style={{ 
                  color: "rgba(255,255,255,0.6)", 
                  fontSize: 12.5, 
                  marginBottom: 4, 
                  lineHeight: 1.6, 
                  paddingLeft: 12, 
                  borderLeft: "2px solid rgba(239,68,68,0.4)" 
                }}>
                  {m}
                </div>
              ))}
            </div>
          )}

          {section.tricks && section.tricks.length > 0 && (
            <div style={{
              background: "rgba(251,146,60,0.05)",
              border: "1px solid rgba(251,146,60,0.2)",
              borderRadius: 12,
              padding: "13px 16px",
            }}>
              <div style={{ color: "#FB923C", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>
                ⚡ TRICKS & SHORTCUTS
              </div>
              {section.tricks.map((t, i) => (
                <div key={i} style={{ 
                  color: "rgba(255,255,255,0.6)", 
                  fontSize: 12.5, 
                  marginBottom: 4, 
                  lineHeight: 1.6, 
                  paddingLeft: 12, 
                  borderLeft: "2px solid rgba(251,146,60,0.4)" 
                }}>
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

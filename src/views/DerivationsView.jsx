import { useState } from "react";
import { SUBJECTS, DERIVATIONS_DATA } from "../data/index.js";
import { Math } from "../components/Math.jsx";

export function DerivationsView() {
  const [active, setActive] = useState(null);
  const [subFilter, setSubFilter] = useState("all");

  const filtered = subFilter === "all" ? DERIVATIONS_DATA : DERIVATIONS_DATA.filter(d => d.subject === subFilter);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
        <h2 style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 24, margin: 0 }}>📐 Derivations</h2>
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "physics", "chemistry", "mathematics"].map(f => (
            <button key={f} onClick={() => setSubFilter(f)} style={{
              padding: "5px 11px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              background: subFilter === f ? "rgba(129,140,248,0.15)" : "transparent",
              border: `1px solid ${subFilter === f ? "rgba(129,140,248,0.4)" : "rgba(255,255,255,0.1)"}`,
              color: subFilter === f ? "#818CF8" : "rgba(255,255,255,0.4)",
            }}>{f === "all" ? "All" : SUBJECTS[f]?.icon}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((d, i) => {
          const s = SUBJECTS[d.subject];
          const isOpen = active === i;
          return (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${isOpen ? s.border : "rgba(255,255,255,0.07)"}`,
              borderRadius: 16,
              overflow: "hidden",
              transition: "all 0.2s",
            }}>
              <button
                onClick={() => setActive(isOpen ? null : i)}
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{d.topic}</div>
                  <div style={{ fontSize: 11, color: s.color, marginTop: 2 }}>{s.label}</div>
                </div>
                <span style={{ color: s.color, transition: "transform 0.25s", display: "inline-block", transform: isOpen ? "rotate(0)" : "rotate(-90deg)" }}>▾</span>
              </button>

              {isOpen && (
                <div style={{ padding: "0 20px 20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {d.steps.map((step, j) => (
                      <div key={j} style={{
                        background: "rgba(255,255,255,0.04)",
                        border: `1px solid ${s.border}`,
                        borderRadius: 12,
                        padding: "14px 16px",
                        position: "relative",
                      }}>
                        <div style={{
                          position: "absolute",
                          top: -10, left: 14,
                          background: "#060610",
                          padding: "0 6px",
                          color: s.color,
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                        }}>STEP {j + 1}</div>
                        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginBottom: 8 }}>{step.heading}</div>
                        <div style={{ overflowX: "auto" }}>
                          <Math tex={step.tex} display={true} />
                        </div>
                      </div>
                    ))}
                    {d.note && (
                      <div style={{
                        marginTop: 10,
                        padding: "8px 12px",
                        background: "rgba(251,191,36,0.08)",
                        border: "1px solid rgba(251,191,36,0.2)",
                        borderRadius: 8,
                      }}>
                        <div style={{ color: "#FBBF24", fontSize: 10, fontWeight: 700, marginBottom: 4, letterSpacing: "0.1em" }}>NOTE</div>
                        <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{d.note}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

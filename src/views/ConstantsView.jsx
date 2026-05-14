import { useState } from "react";
import { SUBJECTS, CONSTANTS_DATA } from "../data/index.js";
import { Math } from "../components/Math.jsx";

export function ConstantsView() {
  const [subFilter, setSubFilter] = useState("physics");

  const constants = CONSTANTS_DATA[subFilter] || [];
  const s = SUBJECTS[subFilter];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
        <h2 style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 24, margin: 0 }}>🔢 Key Constants</h2>
        <div style={{ display: "flex", gap: 6 }}>
          {Object.entries(SUBJECTS).map(([key, sub]) => (
            <button key={key} onClick={() => setSubFilter(key)} style={{
              padding: "6px 12px", borderRadius: 9, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
              background: subFilter === key ? sub.bg : "transparent",
              border: `1px solid ${subFilter === key ? sub.border : "rgba(255,255,255,0.08)"}`,
              color: subFilter === key ? sub.color : "rgba(255,255,255,0.4)",
              fontWeight: subFilter === key ? 700 : 400,
            }}>{sub.icon} {sub.label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {constants.map((c, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${s.border}`,
            borderRadius: 14,
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: s.bg,
              border: `1px solid ${s.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: s.color,
              fontSize: 14,
              fontWeight: 800,
              fontFamily: "'Playfair Display', serif",
              flexShrink: 0,
            }}>{c.symbol.length <= 3 ? c.symbol : c.symbol.slice(0, 3)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginBottom: 4 }}>{c.name}</div>
              <div style={{ color: "#fff", overflowX: "auto" }}>
                <Math tex={c.tex} display={false} />
              </div>
            </div>
            <div style={{
              color: s.accent,
              fontSize: 12,
              fontWeight: 600,
              textAlign: "right",
              flexShrink: 0,
              maxWidth: 140,
              wordBreak: "break-word",
            }}>{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

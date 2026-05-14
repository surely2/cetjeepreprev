import { useState } from "react";
import { UNIT_DATA } from "../data/index.js";

export function UnitCheckerView() {
  const [search, setSearch] = useState("");
  const [selectedDim, setSelectedDim] = useState(null);

  const filtered = UNIT_DATA.filter(u =>
    u.quantity.toLowerCase().includes(search.toLowerCase()) ||
    u.siUnit.toLowerCase().includes(search.toLowerCase()) ||
    u.dim.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
        <h2 style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 24, margin: 0 }}>📏 Unit Checker</h2>
        <div style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
          gap: 8,
          minWidth: 200,
        }}>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>⌕</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search quantity or unit..."
            style={{ background: "transparent", border: "none", color: "#fff", fontSize: 12.5, outline: "none", width: "100%", fontFamily: "inherit" }}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
        {filtered.map((u, i) => (
          <div
            key={i}
            onClick={() => setSelectedDim(selectedDim === i ? null : i)}
            style={{
              background: selectedDim === i ? "rgba(129,140,248,0.08)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${selectedDim === i ? "rgba(129,140,248,0.3)" : "rgba(255,255,255,0.07)"}`,
              borderRadius: 14,
              padding: "14px 16px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{u.quantity}</div>
              <div style={{
                background: "rgba(129,140,248,0.12)",
                border: "1px solid rgba(129,140,248,0.25)",
                color: "#818CF8",
                fontSize: 9,
                padding: "2px 6px",
                borderRadius: 6,
                fontWeight: 700,
                letterSpacing: "0.06em",
                flexShrink: 0,
              }}>SI</div>
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginBottom: 6 }}>{u.formula}</div>
            <div style={{ color: "#34D399", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{u.siUnit}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>= {u.equivalent}</div>
            {selectedDim === i && (
              <div style={{
                marginTop: 10,
                padding: "8px 12px",
                background: "rgba(251,191,36,0.08)",
                border: "1px solid rgba(251,191,36,0.2)",
                borderRadius: 8,
              }}>
                <div style={{ color: "#FBBF24", fontSize: 10, fontWeight: 700, marginBottom: 4, letterSpacing: "0.1em" }}>DIMENSIONAL FORMULA</div>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontFamily: "monospace" }}>{u.dim}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.3)" }}>
          No results for "{search}"
        </div>
      )}
    </div>
  );
}

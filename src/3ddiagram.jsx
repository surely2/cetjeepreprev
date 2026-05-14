import { useState, useEffect, useRef, useCallback } from "react";

// ─── GRAPH VISUALIZER ─────────────────────────────────────────────────────────
// Clean 2D graph plotter for Maths, Physics & Chemistry syllabus curves

// ─── CANVAS PLOTTER ENGINE ────────────────────────────────────────────────────
function GraphCanvas({ graphs, xRange = [-6, 6], yRange = [-4, 4], width = 340, height = 260, labels = [], points = [], asymptotes = [] }) {
  const canvasRef = useRef(null);

  const toScreen = useCallback((x, y, w, h) => {
    const sx = ((x - xRange[0]) / (xRange[1] - xRange[0])) * w;
    const sy = h - ((y - yRange[0]) / (yRange[1] - yRange[0])) * h;
    return [sx, sy];
  }, [xRange, yRange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const W = width, H = height;
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    for (let x = Math.ceil(xRange[0]); x <= xRange[1]; x++) {
      const [sx] = toScreen(x, 0, W, H);
      ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, H); ctx.stroke();
    }
    for (let y = Math.ceil(yRange[0]); y <= yRange[1]; y++) {
      const [, sy] = toScreen(0, y, W, H);
      ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(W, sy); ctx.stroke();
    }

    // Axes
    const [ox, oy] = toScreen(0, 0, W, H);
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(W, oy); ctx.stroke();

    // Axis ticks + labels
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = `${Math.max(8, Math.round(W / 42))}px sans-serif`;
    ctx.textAlign = "center";
    for (let x = Math.ceil(xRange[0]); x <= xRange[1]; x++) {
      if (x === 0) continue;
      const [sx] = toScreen(x, 0, W, H);
      ctx.fillText(x, sx, Math.min(oy + 13, H - 4));
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(sx, oy - 3); ctx.lineTo(sx, oy + 3); ctx.stroke();
    }
    ctx.textAlign = "right";
    for (let y = Math.ceil(yRange[0]); y <= yRange[1]; y++) {
      if (y === 0) continue;
      const [, sy] = toScreen(0, y, W, H);
      ctx.fillText(y, Math.max(ox - 4, 18), sy + 4);
    }
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillText("x", W - 12, oy - 4);
    ctx.textAlign = "center";
    ctx.fillText("y", ox + 10, 10);

    // Asymptotes
    asymptotes.forEach(({ type, value, color = "rgba(255,100,100,0.35)" }) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      if (type === "vertical") {
        const [sx] = toScreen(value, 0, W, H);
        ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, H); ctx.stroke();
      } else if (type === "horizontal") {
        const [, sy] = toScreen(0, value, W, H);
        ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(W, sy); ctx.stroke();
      } else if (type === "oblique" && value.m !== undefined) {
        const x0 = xRange[0], x1 = xRange[1];
        const [sx0, sy0] = toScreen(x0, value.m * x0 + (value.c || 0), W, H);
        const [sx1, sy1] = toScreen(x1, value.m * x1 + (value.c || 0), W, H);
        ctx.beginPath(); ctx.moveTo(sx0, sy0); ctx.lineTo(sx1, sy1); ctx.stroke();
      }
      ctx.setLineDash([]);
    });

    // Curves
    graphs.forEach(({ fn, color = "#60A5FA", lineWidth = 2.2, dashed = false }) => {
      const steps = W * 2;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      if (dashed) ctx.setLineDash([5, 4]);
      else ctx.setLineDash([]);

      let started = false;
      let prevValid = false;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const x = xRange[0] + (i / steps) * (xRange[1] - xRange[0]);
        let y;
        try { y = fn(x); } catch { y = NaN; }
        const valid = isFinite(y) && !isNaN(y) && y >= yRange[0] - 1 && y <= yRange[1] + 1;
        const [sx, sy] = toScreen(x, y, W, H);
        if (valid) {
          if (!started || !prevValid) { ctx.moveTo(sx, sy); started = true; }
          else ctx.lineTo(sx, sy);
        }
        prevValid = valid;
      }
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Special points
    points.forEach(({ x, y, color = "#FBBF24", label: lbl, r = 4 }) => {
      const [sx, sy] = toScreen(x, y, W, H);
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();
      if (lbl) {
        ctx.fillStyle = color;
        ctx.font = `bold ${Math.max(9, Math.round(W / 38))}px sans-serif`;
        ctx.textAlign = "left";
        ctx.fillText(lbl, sx + 6, sy - 4);
      }
    });

    // Curve labels
    labels.forEach(({ text, x, y, color = "#fff" }) => {
      const [sx, sy] = toScreen(x, y, W, H);
      ctx.fillStyle = color;
      ctx.font = `bold ${Math.max(9, Math.round(W / 36))}px sans-serif`;
      ctx.textAlign = "left";
      ctx.fillText(text, sx, sy);
    });

  }, [graphs, xRange, yRange, width, height, labels, points, asymptotes, toScreen]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "auto",
        borderRadius: 10,
        display: "block",
        aspectRatio: `${width}/${height}`,
        maxWidth: width,
        margin: "0 auto",
      }}
    />
  );
}

// ─── GRAPH CARD ───────────────────────────────────────────────────────────────
function GraphCard({ title, equation, color = "#60A5FA", note, graphs, xRange, yRange, labels, points, asymptotes, badge }) {
  const containerRef = useRef(null);
  const [canvasW, setCanvasW] = useState(340);

  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width;
      if (w) setCanvasW(Math.min(Math.floor(w), 420));
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const h = Math.round(canvasW * 0.72);

  return (
    <div ref={containerRef} style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid rgba(255,255,255,0.08)`,
      borderRadius: 14,
      padding: "14px 14px 12px",
      display: "flex",
      flexDirection: "column",
      gap: 10,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>{title}</div>
          <div style={{ color, fontSize: 12, fontFamily: "monospace", marginTop: 2, wordBreak: "break-all" }}>{equation}</div>
        </div>
        {badge && (
          <span style={{
            background: `${color}22`, border: `1px solid ${color}44`,
            color, borderRadius: 6, fontSize: 10, fontWeight: 700, padding: "2px 7px", flexShrink: 0,
          }}>{badge}</span>
        )}
      </div>
      <GraphCanvas graphs={graphs} xRange={xRange} yRange={yRange} width={canvasW} height={h} labels={labels} points={points} asymptotes={asymptotes} />
      {note && <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, lineHeight: 1.5 }}>{note}</div>}
    </div>
  );
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
function SectionHeader({ icon, title, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0 12px" }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <div style={{ color, fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em" }}>{title}</div>
      <div style={{ flex: 1, height: 1, background: `${color}30`, borderRadius: 1 }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── TAB: TRIGONOMETRY ───────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function TrigGraphs() {
  const [param, setParam] = useState(1);
  const [phase, setPhase] = useState(0);

  const sinFn = x => param * Math.sin(x - phase * Math.PI / 6);
  const cosFn = x => param * Math.cos(x - phase * Math.PI / 6);

  return (
    <div>
      {/* Interactive sin/cos */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 14, marginBottom: 12 }}>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Interactive sin & cos</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Amplitude A = {param}</label>
            <input type="range" min="0.5" max="3" step="0.1" value={param} onChange={e => setParam(+e.target.value)} style={{ width: "100%", accentColor: "#60A5FA", marginTop: 4 }} />
          </div>
          <div>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Phase φ = {phase}π/6</label>
            <input type="range" min="-6" max="6" step="1" value={phase} onChange={e => setPhase(+e.target.value)} style={{ width: "100%", accentColor: "#A78BFA", marginTop: 4 }} />
          </div>
        </div>
        <GraphCard
          title="y = A·sin(x − φ) and y = A·cos(x − φ)"
          equation={`y = ${param}·sin(x − ${phase}π/6),  y = ${param}·cos(x − ${phase}π/6)`}
          color="#60A5FA"
          graphs={[
            { fn: sinFn, color: "#60A5FA", lineWidth: 2.4 },
            { fn: cosFn, color: "#A78BFA", lineWidth: 2.4, dashed: false },
          ]}
          xRange={[-7, 7]} yRange={[-3.5, 3.5]}
          note="Blue = sin  |  Purple = cos. Period = 2π, Range = [−A, A]"
          labels={[
            { text: "sin", x: 1.2, y: param + 0.2, color: "#60A5FA" },
            { text: "cos", x: 2.8 - phase * Math.PI / 6, y: param + 0.2, color: "#A78BFA" },
          ]}
          points={[
            { x: Math.PI / 2, y: param, color: "#60A5FA", label: `(π/2,${param})` },
            { x: -phase * Math.PI / 6, y: param, color: "#A78BFA" },
          ]}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12 }}>
        <GraphCard title="y = tan x" equation="y = tan x" color="#FBBF24" badge="⚠ discontinuous"
          graphs={[{ fn: x => {
            const t = Math.tan(x);
            const nearPole = Math.abs(Math.cos(x)) < 0.08;
            return nearPole ? NaN : t;
          }, color: "#FBBF24", lineWidth: 2.2 }]}
          xRange={[-5, 5]} yRange={[-4, 4]}
          asymptotes={[
            { type: "vertical", value: Math.PI / 2, color: "rgba(251,191,36,0.3)" },
            { type: "vertical", value: -Math.PI / 2, color: "rgba(251,191,36,0.3)" },
            { type: "vertical", value: 3 * Math.PI / 2, color: "rgba(251,191,36,0.3)" },
            { type: "vertical", value: -3 * Math.PI / 2, color: "rgba(251,191,36,0.3)" },
          ]}
          note="Vertical asymptotes at x = (2n+1)π/2. Period = π."
        />

        <GraphCard title="y = cot x" equation="y = cot x" color="#F472B6"
          graphs={[{ fn: x => {
            const nearPole = Math.abs(Math.sin(x)) < 0.08;
            return nearPole ? NaN : Math.cos(x) / Math.sin(x);
          }, color: "#F472B6", lineWidth: 2.2 }]}
          xRange={[-5, 5]} yRange={[-4, 4]}
          asymptotes={[
            { type: "vertical", value: 0, color: "rgba(244,114,182,0.3)" },
            { type: "vertical", value: Math.PI, color: "rgba(244,114,182,0.3)" },
            { type: "vertical", value: -Math.PI, color: "rgba(244,114,182,0.3)" },
          ]}
          note="Vertical asymptotes at x = nπ. Period = π."
        />

        <GraphCard title="y = sec x" equation="y = sec x = 1/cos x" color="#34D399"
          graphs={[{ fn: x => {
            const c = Math.cos(x);
            return Math.abs(c) < 0.08 ? NaN : 1 / c;
          }, color: "#34D399", lineWidth: 2 },
          { fn: Math.cos, color: "rgba(52,211,153,0.25)", lineWidth: 1.5, dashed: true }]}
          xRange={[-7, 7]} yRange={[-4, 4]}
          note="Range: (−∞,−1]∪[1,+∞). Dashed = cos x for reference."
        />

        <GraphCard title="y = cosec x" equation="y = cosec x = 1/sin x" color="#FB923C"
          graphs={[{ fn: x => {
            const s = Math.sin(x);
            return Math.abs(s) < 0.08 ? NaN : 1 / s;
          }, color: "#FB923C", lineWidth: 2 },
          { fn: Math.sin, color: "rgba(251,146,60,0.25)", lineWidth: 1.5, dashed: true }]}
          xRange={[-7, 7]} yRange={[-4, 4]}
          note="Range: (−∞,−1]∪[1,+∞). Dashed = sin x for reference."
        />

        <GraphCard title="y = sin⁻¹ x (arcsin)" equation="y = sin⁻¹ x,  x ∈ [−1, 1]" color="#60A5FA" badge="inverse"
          graphs={[{ fn: x => (x >= -1 && x <= 1) ? Math.asin(x) : NaN, color: "#60A5FA", lineWidth: 2.5 }]}
          xRange={[-2, 2]} yRange={[-2, 2]}
          points={[{ x: -1, y: -Math.PI / 2, color: "#60A5FA", label: "(−1,−π/2)" }, { x: 1, y: Math.PI / 2, color: "#60A5FA", label: "(1,π/2)" }]}
          note="Domain: [−1,1]. Range: [−π/2, π/2] ≈ [−1.57, 1.57]."
        />

        <GraphCard title="y = cos⁻¹ x (arccos)" equation="y = cos⁻¹ x,  x ∈ [−1, 1]" color="#A78BFA" badge="inverse"
          graphs={[{ fn: x => (x >= -1 && x <= 1) ? Math.acos(x) : NaN, color: "#A78BFA", lineWidth: 2.5 }]}
          xRange={[-2, 2]} yRange={[-0.5, 3.8]}
          points={[{ x: -1, y: Math.PI, color: "#A78BFA", label: "(−1,π)" }, { x: 1, y: 0, color: "#A78BFA", label: "(1,0)" }]}
          note="Domain: [−1,1]. Range: [0, π] ≈ [0, 3.14]."
        />

        <GraphCard title="y = tan⁻¹ x (arctan)" equation="y = tan⁻¹ x" color="#FBBF24" badge="inverse"
          graphs={[{ fn: Math.atan, color: "#FBBF24", lineWidth: 2.5 }]}
          xRange={[-6, 6]} yRange={[-2, 2]}
          asymptotes={[
            { type: "horizontal", value: Math.PI / 2, color: "rgba(251,191,36,0.3)" },
            { type: "horizontal", value: -Math.PI / 2, color: "rgba(251,191,36,0.3)" },
          ]}
          note="Domain: ℝ. Range: (−π/2, π/2). Horizontal asymptotes at ±π/2."
        />

        <GraphCard title="y = |sin x|" equation="y = |sin x|" color="#F472B6"
          graphs={[{ fn: x => Math.abs(Math.sin(x)), color: "#F472B6", lineWidth: 2 }]}
          xRange={[-7, 7]} yRange={[-0.3, 1.5]}
          note="Always ≥ 0. Period = π (half of sin x). Touches x-axis at nπ."
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── TAB: CONICS ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function ConicGraphs() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);

  const c_ell = Math.sqrt(Math.max(0, a * a - b * b));
  const c_hyp = Math.sqrt(a * a + b * b);

  return (
    <div>
      {/* Interactive ellipse/hyperbola */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 14, marginBottom: 12 }}>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Interactive Ellipse & Hyperbola</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>a = {a}</label>
            <input type="range" min="1" max="4" step="0.5" value={a} onChange={e => setA(+e.target.value)} style={{ width: "100%", accentColor: "#60A5FA", marginTop: 4 }} />
          </div>
          <div>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>b = {b}</label>
            <input type="range" min="0.5" max="3.5" step="0.5" value={b} onChange={e => setB(+e.target.value)} style={{ width: "100%", accentColor: "#34D399", marginTop: 4 }} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12 }}>
          <GraphCard
            title={`Ellipse: x²/${a}² + y²/${b}² = 1`}
            equation={`e = c/a = ${(c_ell / a).toFixed(2)}  |  c = ${c_ell.toFixed(2)}`}
            color="#60A5FA" badge="e < 1"
            graphs={[
              { fn: x => (Math.abs(x) <= a) ? b * Math.sqrt(1 - (x * x) / (a * a)) : NaN, color: "#60A5FA", lineWidth: 2.5 },
              { fn: x => (Math.abs(x) <= a) ? -b * Math.sqrt(1 - (x * x) / (a * a)) : NaN, color: "#60A5FA", lineWidth: 2.5 },
            ]}
            xRange={[-5, 5]} yRange={[-3.5, 3.5]}
            points={[
              { x: c_ell, y: 0, color: "#FBBF24", label: `F₁(${c_ell.toFixed(1)},0)` },
              { x: -c_ell, y: 0, color: "#FBBF24", label: `F₂` },
              { x: a, y: 0, color: "#60A5FA", label: `(${a},0)` },
              { x: -a, y: 0, color: "#60A5FA", label: `(−${a},0)` },
              { x: 0, y: b, color: "#34D399", label: `(0,${b})` },
            ]}
            note={`Foci at (±${c_ell.toFixed(2)},0). Sum of focal distances = 2a = ${2 * a}.`}
          />
          <GraphCard
            title={`Hyperbola: x²/${a}² − y²/${b}² = 1`}
            equation={`e = ${(c_hyp / a).toFixed(2)}  |  asymptotes: y = ±${(b / a).toFixed(2)}x`}
            color="#F472B6" badge="e > 1"
            graphs={[
              { fn: x => (Math.abs(x) >= a) ? b * Math.sqrt((x * x) / (a * a) - 1) : NaN, color: "#F472B6", lineWidth: 2.5 },
              { fn: x => (Math.abs(x) >= a) ? -b * Math.sqrt((x * x) / (a * a) - 1) : NaN, color: "#F472B6", lineWidth: 2.5 },
            ]}
            xRange={[-5, 5]} yRange={[-4, 4]}
            asymptotes={[
              { type: "oblique", value: { m: b / a, c: 0 }, color: "rgba(244,114,182,0.35)" },
              { type: "oblique", value: { m: -b / a, c: 0 }, color: "rgba(244,114,182,0.35)" },
            ]}
            points={[
              { x: a, y: 0, color: "#F472B6", label: `(${a},0)` },
              { x: -a, y: 0, color: "#F472B6", label: `(−${a},0)` },
              { x: c_hyp, y: 0, color: "#FBBF24", label: `F₁` },
              { x: -c_hyp, y: 0, color: "#FBBF24", label: `F₂` },
            ]}
            note={`Asymptotes y = ±(b/a)x dashed. Foci at (±${c_hyp.toFixed(2)},0).`}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12 }}>
        <GraphCard title="Parabola: y² = 4ax (a=1)" equation="y² = 4x → opens right. Focus (1,0)" color="#FBBF24"
          graphs={[
            { fn: x => x >= 0 ? 2 * Math.sqrt(x) : NaN, color: "#FBBF24", lineWidth: 2.5 },
            { fn: x => x >= 0 ? -2 * Math.sqrt(x) : NaN, color: "#FBBF24", lineWidth: 2.5 },
          ]}
          xRange={[-1.5, 5]} yRange={[-4, 4]}
          points={[{ x: 1, y: 0, color: "#FBBF24", label: "F(1,0)" }, { x: 0, y: 0, color: "#fff", label: "V" }]}
          asymptotes={[{ type: "vertical", value: -1, color: "rgba(251,191,36,0.3)" }]}
          note="Directrix x = −1. Vertex at origin. Latus rectum = 4a = 4."
        />

        <GraphCard title="Parabola: x² = 4ay (a=1)" equation="x² = 4y → opens up. Focus (0,1)" color="#34D399"
          graphs={[{ fn: x => x * x / 4, color: "#34D399", lineWidth: 2.5 }]}
          xRange={[-5, 5]} yRange={[-1, 5]}
          points={[{ x: 0, y: 1, color: "#FBBF24", label: "F(0,1)" }, { x: 0, y: 0, color: "#fff", label: "V" }]}
          note="Directrix y = −1. Opens upward. Axis of symmetry = y-axis."
        />

        <GraphCard title="Parabola: y² = −4ax (a=1)" equation="y² = −4x → opens left" color="#FB923C"
          graphs={[
            { fn: x => x <= 0 ? 2 * Math.sqrt(-x) : NaN, color: "#FB923C", lineWidth: 2.5 },
            { fn: x => x <= 0 ? -2 * Math.sqrt(-x) : NaN, color: "#FB923C", lineWidth: 2.5 },
          ]}
          xRange={[-5, 1.5]} yRange={[-4, 4]}
          points={[{ x: -1, y: 0, color: "#FBBF24", label: "F(−1,0)" }]}
          note="Focus at (−a,0). Directrix x = a. Opens left."
        />

        <GraphCard title="Rectangular Hyperbola: xy = 1" equation="xy = c² with c=1" color="#A78BFA"
          graphs={[
            { fn: x => x === 0 ? NaN : (Math.abs(x) < 0.05 ? NaN : 1 / x), color: "#A78BFA", lineWidth: 2.2 },
          ]}
          xRange={[-5, 5]} yRange={[-4, 4]}
          asymptotes={[
            { type: "vertical", value: 0, color: "rgba(167,139,250,0.3)" },
            { type: "horizontal", value: 0, color: "rgba(167,139,250,0.3)" },
          ]}
          note="Asymptotes are coordinate axes. Eccentricity e = √2."
        />

        <GraphCard title="Circle: x² + y² = r²" equation="x² + y² = 9, r = 3" color="#60A5FA"
          graphs={[
            { fn: x => Math.abs(x) <= 3 ? Math.sqrt(9 - x * x) : NaN, color: "#60A5FA", lineWidth: 2.5 },
            { fn: x => Math.abs(x) <= 3 ? -Math.sqrt(9 - x * x) : NaN, color: "#60A5FA", lineWidth: 2.5 },
          ]}
          xRange={[-4.5, 4.5]} yRange={[-3.5, 3.5]}
          points={[{ x: 0, y: 0, color: "#FBBF24", label: "O(0,0)" }, { x: 3, y: 0, color: "#60A5FA", label: "(3,0)" }]}
          note="Center (0,0), radius = 3. e = 0 (special conic)."
        />

        <GraphCard title="General Conics Summary" equation="h²−ab: <0 ellipse, =0 parabola, >0 hyperbola" color="#FBBF24"
          graphs={[
            { fn: x => Math.abs(x) <= 2.5 ? 1.5 * Math.sqrt(1 - x * x / 6.25) : NaN, color: "#60A5FA", lineWidth: 2 },
            { fn: x => Math.abs(x) <= 2.5 ? -1.5 * Math.sqrt(1 - x * x / 6.25) : NaN, color: "#60A5FA", lineWidth: 2 },
            { fn: x => x >= 0 ? 1.5 * Math.sqrt(x) : NaN, color: "#FBBF24", lineWidth: 2 },
            { fn: x => x >= 0 ? -1.5 * Math.sqrt(x) : NaN, color: "#FBBF24", lineWidth: 2 },
            { fn: x => Math.abs(x) >= 1.5 ? 1.2 * Math.sqrt(x * x / 2.25 - 1) : NaN, color: "#F472B6", lineWidth: 2 },
            { fn: x => Math.abs(x) >= 1.5 ? -1.2 * Math.sqrt(x * x / 2.25 - 1) : NaN, color: "#F472B6", lineWidth: 2 },
          ]}
          xRange={[-5, 5]} yRange={[-3, 3]}
          labels={[
            { text: "Ellipse", x: -0.6, y: 1.7, color: "#60A5FA" },
            { text: "Parabola", x: 2.5, y: 2.2, color: "#FBBF24" },
            { text: "Hyperbola", x: 2.8, y: 0.8, color: "#F472B6" },
          ]}
          note="All three conics shown together for comparison."
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── TAB: ALGEBRA / FUNCTIONS ─────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function AlgebraGraphs() {
  return (
    <div>
      <SectionHeader icon="📈" title="Standard Functions" color="#A78BFA" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12 }}>

        <GraphCard title="y = xⁿ family" equation="y = x, x², x³, x⁴" color="#A78BFA"
          graphs={[
            { fn: x => x, color: "#60A5FA", lineWidth: 1.8 },
            { fn: x => x * x, color: "#A78BFA", lineWidth: 2 },
            { fn: x => x * x * x, color: "#FBBF24", lineWidth: 2 },
            { fn: x => x * x * x * x, color: "#34D399", lineWidth: 2 },
          ]}
          xRange={[-2.5, 2.5]} yRange={[-4, 4]}
          labels={[
            { text: "x", x: 1.6, y: 1.4, color: "#60A5FA" },
            { text: "x²", x: 1.6, y: 2.8, color: "#A78BFA" },
            { text: "x³", x: 1.4, y: -2.8, color: "#FBBF24" },
            { text: "x⁴", x: 1.8, y: 3.5, color: "#34D399" },
          ]}
          note="Odd powers: pass through origin, point symmetry. Even powers: parabola-like, axis symmetry."
        />

        <GraphCard title="y = eˣ and y = ln x" equation="Natural exponential & logarithm" color="#34D399"
          graphs={[
            { fn: x => Math.exp(x), color: "#34D399", lineWidth: 2.2 },
            { fn: x => x > 0 ? Math.log(x) : NaN, color: "#FBBF24", lineWidth: 2.2 },
            { fn: x => x, color: "rgba(255,255,255,0.15)", lineWidth: 1.5, dashed: true },
          ]}
          xRange={[-3, 4]} yRange={[-3, 4]}
          points={[
            { x: 0, y: 1, color: "#34D399", label: "(0,1)" },
            { x: 1, y: 0, color: "#FBBF24", label: "(1,0)" },
          ]}
          note="Green = eˣ. Yellow = ln x. They're reflections over y = x (dashed)."
        />

        <GraphCard title="y = aˣ (a>1 and 0<a<1)" equation="Growth vs decay: 2ˣ and (0.5)ˣ" color="#60A5FA"
          graphs={[
            { fn: x => Math.pow(2, x), color: "#60A5FA", lineWidth: 2.2 },
            { fn: x => Math.pow(0.5, x), color: "#FB923C", lineWidth: 2.2 },
          ]}
          xRange={[-4, 4]} yRange={[-0.5, 5]}
          points={[
            { x: 0, y: 1, color: "#fff", label: "(0,1)" },
          ]}
          asymptotes={[{ type: "horizontal", value: 0, color: "rgba(255,255,255,0.15)" }]}
          note="Blue = 2ˣ (growth). Orange = 0.5ˣ (decay). Both pass through (0,1)."
        />

        <GraphCard title="y = 1/x and y = 1/x²" equation="Rational functions" color="#F472B6"
          graphs={[
            { fn: x => Math.abs(x) < 0.05 ? NaN : 1 / x, color: "#F472B6", lineWidth: 2 },
            { fn: x => Math.abs(x) < 0.05 ? NaN : 1 / (x * x), color: "#FBBF24", lineWidth: 2 },
          ]}
          xRange={[-4, 4]} yRange={[-4, 4]}
          asymptotes={[
            { type: "vertical", value: 0, color: "rgba(244,114,182,0.3)" },
            { type: "horizontal", value: 0, color: "rgba(244,114,182,0.2)" },
          ]}
          note="Pink = 1/x (odd fn). Yellow = 1/x² (even fn, always ≥ 0)."
        />

        <GraphCard title="y = √x and y = ∛x" equation="Root functions" color="#34D399"
          graphs={[
            { fn: x => x >= 0 ? Math.sqrt(x) : NaN, color: "#34D399", lineWidth: 2.2 },
            { fn: x => x >= 0 ? Math.cbrt(x) : -Math.cbrt(-x), color: "#A78BFA", lineWidth: 2.2 },
          ]}
          xRange={[-3, 5]} yRange={[-2.5, 2.5]}
          note="Green = √x (domain x≥0). Purple = ∛x (domain ℝ, odd function)."
        />

        <GraphCard title="y = |x| and y = [x] (floor)" equation="Absolute value & greatest integer" color="#FBBF24"
          graphs={[
            { fn: x => Math.abs(x), color: "#FBBF24", lineWidth: 2.2 },
            { fn: x => Math.floor(x), color: "#F472B6", lineWidth: 2 },
          ]}
          xRange={[-4, 4]} yRange={[-3, 4]}
          note="Yellow = |x|, V-shape at origin. Pink = ⌊x⌋, staircase (right-continuous)."
        />

        <GraphCard title="y = x·sin(x)" equation="Damped oscillation shape" color="#60A5FA"
          graphs={[
            { fn: x => x * Math.sin(x), color: "#60A5FA", lineWidth: 2 },
            { fn: x => x, color: "rgba(255,255,255,0.15)", lineWidth: 1, dashed: true },
            { fn: x => -x, color: "rgba(255,255,255,0.15)", lineWidth: 1, dashed: true },
          ]}
          xRange={[-8, 8]} yRange={[-8, 8]}
          note="Envelope = ±x. Oscillates within envelope. Useful for understanding modulated signals."
        />

        <GraphCard title="Signum & Step functions" equation="sgn(x) and u(x)" color="#A78BFA"
          graphs={[
            { fn: x => Math.abs(x) < 0.05 ? 0 : Math.sign(x), color: "#A78BFA", lineWidth: 2.2 },
            { fn: x => x < 0 ? 0 : 1, color: "#34D399", lineWidth: 2.2 },
          ]}
          xRange={[-4, 4]} yRange={[-1.5, 1.8]}
          note="Purple = sgn(x) ∈ {−1,0,1}. Green = Heaviside step u(x)."
        />
      </div>

      <SectionHeader icon="📉" title="Straight Lines & Quadratics" color="#60A5FA" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12 }}>
        <GraphCard title="y = mx + c family" equation="Lines with different slopes" color="#60A5FA"
          graphs={[
            { fn: x => 2 * x - 1, color: "#60A5FA", lineWidth: 2 },
            { fn: x => -x + 2, color: "#F472B6", lineWidth: 2 },
            { fn: x => 0.5 * x + 0, color: "#34D399", lineWidth: 2 },
            { fn: x => 3, color: "#FBBF24", lineWidth: 1.8 },
          ]}
          xRange={[-4, 4]} yRange={[-4, 5]}
          labels={[
            { text: "m=2", x: 1, y: 3.5, color: "#60A5FA" },
            { text: "m=−1", x: -0.5, y: 3.5, color: "#F472B6" },
            { text: "m=0.5", x: 2.5, y: 1.9, color: "#34D399" },
            { text: "y=3", x: 2.5, y: 3.2, color: "#FBBF24" },
          ]}
          note="Slope m = tan θ. Parallel lines have equal slopes. m₁m₂ = −1 for perpendicular."
        />

        <GraphCard title="Quadratic y = ax² + bx + c" equation="y = x²−2x−1 (discriminant > 0)" color="#A78BFA"
          graphs={[
            { fn: x => x * x - 2 * x - 1, color: "#A78BFA", lineWidth: 2.5 },
          ]}
          xRange={[-2.5, 4.5]} yRange={[-3.5, 5]}
          points={[
            { x: 1, y: -2, color: "#FBBF24", label: "vertex" },
            { x: 1 + Math.sqrt(2), y: 0, color: "#A78BFA", label: "x₁" },
            { x: 1 - Math.sqrt(2), y: 0, color: "#A78BFA", label: "x₂" },
          ]}
          note="Vertex at (h,k) = (1,−2). D = b²−4ac > 0 → 2 real roots."
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── TAB: PHYSICS GRAPHS ─────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function PhysicsGraphs() {
  return (
    <div>
      <SectionHeader icon="🏃" title="Kinematics & Mechanics" color="#3B82F6" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12 }}>

        <GraphCard title="s–t graphs (kinematics)" equation="Uniform and accelerated motion" color="#60A5FA"
          graphs={[
            { fn: x => x >= 0 ? 1.5 * x : NaN, color: "#60A5FA", lineWidth: 2, },
            { fn: x => x >= 0 ? 0.5 * x * x : NaN, color: "#FBBF24", lineWidth: 2 },
            { fn: x => x >= 0 ? 3 * x - 0.5 * x * x : NaN, color: "#34D399", lineWidth: 2 },
          ]}
          xRange={[-0.5, 5]} yRange={[-0.5, 8]}
          labels={[
            { text: "uniform", x: 3.5, y: 5.5, color: "#60A5FA" },
            { text: "accel.", x: 3.5, y: 7.5, color: "#FBBF24" },
            { text: "decel.", x: 2.3, y: 5.0, color: "#34D399" },
          ]}
          note="Slope of s–t = velocity. Straight line → constant v. Curve → acceleration."
        />

        <GraphCard title="v–t graphs (kinematics)" equation="Velocity vs time" color="#34D399"
          graphs={[
            { fn: x => x >= 0 ? 2 : NaN, color: "#60A5FA", lineWidth: 2 },
            { fn: x => x >= 0 ? 0.8 * x : NaN, color: "#FBBF24", lineWidth: 2 },
            { fn: x => (x >= 0 && x <= 4) ? 4 - x : NaN, color: "#34D399", lineWidth: 2 },
          ]}
          xRange={[-0.5, 5.5]} yRange={[-0.5, 4.5]}
          labels={[
            { text: "const v", x: 3.5, y: 2.3, color: "#60A5FA" },
            { text: "a=const", x: 3.5, y: 3.5, color: "#FBBF24" },
            { text: "decel.", x: 1, y: 3.5, color: "#34D399" },
          ]}
          note="Slope of v–t = acceleration. Area under v–t = displacement."
        />

        <GraphCard title="Projectile trajectory" equation="y = x·tanθ − gx²/(2u²cos²θ)" color="#FBBF24"
          graphs={[
            { fn: x => (x >= 0 && x <= 4) ? x * 1 - 0.5 * x * x * 0.5 : NaN, color: "#FBBF24", lineWidth: 2.5 },
            { fn: x => (x >= 0 && x <= 5.5) ? x * 1.2 - 0.5 * x * x * 0.42 : NaN, color: "#60A5FA", lineWidth: 2 },
          ]}
          xRange={[-0.5, 6]} yRange={[-0.5, 2.5]}
          note="Parabolic path. Max range at θ=45°. Same range for θ and (90°−θ)."
        />

        <GraphCard title="Spring: F = −kx (Hooke's Law)" equation="Force vs displacement, k=1.5" color="#34D399"
          graphs={[
            { fn: x => -1.5 * x, color: "#34D399", lineWidth: 2.5 },
          ]}
          xRange={[-3, 3]} yRange={[-4, 4]}
          note="Linear restoring force. Slope = −k. PE = ½kx² (parabola in U–x graph)."
          points={[{ x: 0, y: 0, color: "#34D399", label: "eq." }]}
        />

        <GraphCard title="Gravitational g vs r" equation="g = GM/r²  (outside) and g = GMr/R³ (inside)" color="#A78BFA"
          graphs={[
            { fn: x => x > 0 ? 1 / (x * x) : NaN, color: "#A78BFA", lineWidth: 2.2 },
            { fn: x => (x >= 0 && x <= 1) ? x : NaN, color: "#FBBF24", lineWidth: 2.2 },
          ]}
          xRange={[-0.2, 4]} yRange={[-0.2, 3]}
          points={[{ x: 1, y: 1, color: "#fff", label: "R (surface)" }]}
          note="Yellow = inside Earth (g ∝ r). Purple = outside (g ∝ 1/r²). Max at surface."
        />

        <GraphCard title="SHM: x, v, a vs t" equation="x = A·cos(ωt)" color="#60A5FA"
          graphs={[
            { fn: x => x >= 0 ? 2 * Math.cos(x) : NaN, color: "#60A5FA", lineWidth: 2 },
            { fn: x => x >= 0 ? -2 * Math.sin(x) : NaN, color: "#34D399", lineWidth: 2 },
            { fn: x => x >= 0 ? -2 * Math.cos(x) : NaN, color: "#F472B6", lineWidth: 1.8, dashed: false },
          ]}
          xRange={[-0.3, 7]} yRange={[-2.5, 2.5]}
          labels={[
            { text: "x", x: 0.5, y: 2.2, color: "#60A5FA" },
            { text: "v", x: 1.1, y: -2.2, color: "#34D399" },
            { text: "a", x: Math.PI, y: 2.2, color: "#F472B6" },
          ]}
          note="Blue = displacement. Green = velocity (90° ahead). Pink = acceleration (180° out of phase)."
        />
      </div>

      <SectionHeader icon="🌡" title="Thermodynamics Graphs" color="#FB923C" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12 }}>

        <GraphCard title="P–V diagrams (thermodynamic processes)" equation="Isothermal: PV=const | Adiabatic: PVᵞ=const" color="#FB923C"
          graphs={[
            { fn: x => x > 0.2 ? 2 / x : NaN, color: "#60A5FA", lineWidth: 2.2 },
            { fn: x => x > 0.3 ? 1.5 / Math.pow(x, 1.4) : NaN, color: "#FB923C", lineWidth: 2.2 },
          ]}
          xRange={[0, 4]} yRange={[0, 5]}
          labels={[
            { text: "Isothermal", x: 2, y: 1.3, color: "#60A5FA" },
            { text: "Adiabatic", x: 1.5, y: 0.7, color: "#FB923C" },
          ]}
          note="Adiabatic is steeper than isothermal. Area under P–V = work done by gas."
        />

        <GraphCard title="Newton's Law of Cooling" equation="T = T₀ + (Tᵢ−T₀)e^(−kt)" color="#34D399"
          graphs={[
            { fn: x => x >= 0 ? 1 + 3 * Math.exp(-0.5 * x) : NaN, color: "#34D399", lineWidth: 2.5 },
          ]}
          xRange={[-0.5, 8]} yRange={[-0.2, 4.5]}
          asymptotes={[{ type: "horizontal", value: 1, color: "rgba(52,211,153,0.3)" }]}
          note="Exponential decay toward ambient temperature T₀ (dashed). Rate ∝ temperature excess."
          points={[{ x: 0, y: 4, color: "#34D399", label: "Tᵢ" }]}
        />

        <GraphCard title="Wien's Displacement: Intensity vs λ" equation="Blackbody radiation spectrum" color="#FBBF24"
          graphs={[
            { fn: x => x > 0.2 ? 2 * x * x * x / (Math.exp(2 / x) - 1) * 2 : NaN, color: "#FBBF24", lineWidth: 2.2 },
            { fn: x => x > 0.1 ? x * x * x / (Math.exp(1.5 / x) - 1) * 2.5 : NaN, color: "#FB923C", lineWidth: 2, dashed: false },
          ]}
          xRange={[0, 5]} yRange={[0, 3]}
          labels={[
            { text: "High T", x: 1.5, y: 2.6, color: "#FBBF24" },
            { text: "Low T", x: 2.2, y: 1.2, color: "#FB923C" },
          ]}
          note="Peak λ shifts left (shorter λ, bluer) for higher T. Wien: λₘT = 2.898×10⁻³ m·K."
        />
      </div>

      <SectionHeader icon="⚡" title="Electricity & Magnetism" color="#FBBF24" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12 }}>

        <GraphCard title="Ohm's Law: V–I graph" equation="V = IR (linear), resistor" color="#FBBF24"
          graphs={[
            { fn: x => x >= 0 ? 2 * x : NaN, color: "#FBBF24", lineWidth: 2.5 },
            { fn: x => x >= 0 ? 0.5 * x : NaN, color: "#60A5FA", lineWidth: 2, dashed: false },
          ]}
          xRange={[-0.3, 4]} yRange={[-0.3, 5]}
          labels={[
            { text: "R=2Ω", x: 1.5, y: 3.5, color: "#FBBF24" },
            { text: "R=0.5Ω", x: 3, y: 1.8, color: "#60A5FA" },
          ]}
          note="Slope = R (resistance). Steeper slope = higher resistance."
        />

        <GraphCard title="Charging & discharging capacitor" equation="q = Q₀(1−e^(−t/RC))  and  q = Q₀e^(−t/RC)" color="#A78BFA"
          graphs={[
            { fn: x => x >= 0 ? 2 * (1 - Math.exp(-x)) : NaN, color: "#A78BFA", lineWidth: 2.2 },
            { fn: x => x >= 0 ? 2 * Math.exp(-x) : NaN, color: "#F472B6", lineWidth: 2.2 },
          ]}
          xRange={[-0.3, 6]} yRange={[-0.2, 2.5]}
          asymptotes={[{ type: "horizontal", value: 2, color: "rgba(167,139,250,0.3)" }]}
          note="Purple = charging (→Q₀). Pink = discharging (→0). Time constant τ = RC."
        />

        <GraphCard title="AC signals: sin wave" equation="V = Vₘsin(ωt),  I = Iₘsin(ωt+φ)" color="#60A5FA"
          graphs={[
            { fn: x => 2 * Math.sin(x), color: "#60A5FA", lineWidth: 2.2 },
            { fn: x => 1.5 * Math.sin(x + Math.PI / 4), color: "#FBBF24", lineWidth: 2 },
          ]}
          xRange={[-0.5, 7.5]} yRange={[-2.5, 2.5]}
          note="Blue = voltage. Yellow = current (leading by π/4). Vrms = Vₘ/√2."
        />

        <GraphCard title="Electric field: point charge E vs r" equation="E = kq/r² (inverse square)" color="#34D399"
          graphs={[{ fn: x => x > 0.15 ? 1 / (x * x) : NaN, color: "#34D399", lineWidth: 2.5 }]}
          xRange={[0, 5]} yRange={[-0.2, 5]}
          note="E ∝ 1/r². Diverges at r→0. Field lines radiate outward from positive charge."
        />
      </div>

      <SectionHeader icon="💡" title="Optics" color="#A78BFA" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12 }}>
        <GraphCard title="Lens formula: image distance v vs u" equation="1/v − 1/u = 1/f,  f=2" color="#A78BFA"
          graphs={[{
            fn: u => {
              if (Math.abs(u) < 0.1 || u === 2) return NaN;
              const v = 1 / (1 / 2 + 1 / u);
              return (isFinite(v) && Math.abs(v) < 10) ? v : NaN;
            }, color: "#A78BFA", lineWidth: 2.2
          }]}
          xRange={[-8, 8]} yRange={[-8, 8]}
          asymptotes={[
            { type: "vertical", value: -2, color: "rgba(167,139,250,0.3)" },
            { type: "horizontal", value: 2, color: "rgba(167,139,250,0.3)" },
          ]}
          note="Asymptotes when object/image at focal point. Sign convention: distances measured from lens."
        />

        <GraphCard title="YDSE fringe intensity" equation="I = 4I₀·cos²(δ/2)" color="#FBBF24"
          graphs={[{ fn: x => 4 * Math.cos(x / 2) ** 2, color: "#FBBF24", lineWidth: 2.5 }]}
          xRange={[-7, 7]} yRange={[-0.3, 4.5]}
          note="Peaks at δ = 2nπ (bright fringes). Zeros at δ = (2n+1)π (dark fringes). β = λD/d."
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── TAB: CHEMISTRY GRAPHS ────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function ChemGraphs() {
  return (
    <div>
      <SectionHeader icon="⚗" title="Atomic Structure" color="#10B981" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12 }}>

        <GraphCard title="Bohr energy levels: Eₙ vs n" equation="Eₙ = −13.6/n² eV" color="#34D399"
          graphs={[{
            fn: x => (x >= 1 && x <= 6) ? -13.6 / (x * x) : NaN,
            color: "#34D399", lineWidth: 0
          }]}
          xRange={[0, 7]} yRange={[-14, 1]}
          points={[
            { x: 1, y: -13.6, color: "#34D399", label: "n=1 (−13.6 eV)", r: 5 },
            { x: 2, y: -3.4, color: "#34D399", label: "n=2 (−3.4)", r: 5 },
            { x: 3, y: -13.6 / 9, color: "#34D399", label: "n=3", r: 5 },
            { x: 4, y: -13.6 / 16, color: "#60A5FA", label: "n=4", r: 4 },
            { x: 5, y: -13.6 / 25, color: "#60A5FA", label: "n=5", r: 4 },
          ]}
          asymptotes={[{ type: "horizontal", value: 0, color: "rgba(52,211,153,0.3)" }]}
          note="Energies converge to 0 (ionization) as n→∞. Ground state n=1 is lowest."
        />

        <GraphCard title="Photoelectric effect: KE vs ν" equation="KE = hν − φ (threshold ν₀)" color="#FBBF24"
          graphs={[
            { fn: x => x >= 2 ? (x - 2) : NaN, color: "#FBBF24", lineWidth: 2.5 },
          ]}
          xRange={[-0.3, 5]} yRange={[-0.5, 3]}
          points={[{ x: 2, y: 0, color: "#FBBF24", label: "ν₀ (threshold)" }]}
          asymptotes={[{ type: "horizontal", value: 0, color: "rgba(255,255,255,0.1)" }]}
          note="Slope = h (Planck's constant). X-intercept = threshold frequency ν₀. KE independent of intensity."
        />

        <GraphCard title="de Broglie: λ vs mv (momentum)" equation="λ = h/p = h/(mv)" color="#A78BFA"
          graphs={[{ fn: x => x > 0.1 ? 1 / x : NaN, color: "#A78BFA", lineWidth: 2.5 }]}
          xRange={[0, 5]} yRange={[0, 5]}
          note="Wavelength decreases as momentum increases (inverse relation). λ→0 for macroscopic objects."
        />
      </div>

      <SectionHeader icon="⚖" title="Equilibrium & Thermodynamics" color="#10B981" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12 }}>

        <GraphCard title="Reaction coordinate diagram" equation="ΔH = E_products − E_reactants" color="#FB923C"
          graphs={[
            { fn: x => (x >= 0 && x <= 5) ? 3 * Math.exp(-0.5 * (x - 2) ** 2) - 1 : NaN, color: "#F472B6", lineWidth: 2.5 },
          ]}
          xRange={[-0.3, 5.3]} yRange={[-1.5, 2.5]}
          points={[
            { x: 0, y: 0.5, color: "#34D399", label: "Reactants" },
            { x: 2, y: 2.06, color: "#F472B6", label: "Ea (transition)" },
            { x: 4.5, y: -0.6, color: "#FB923C", label: "Products (exo)" },
          ]}
          note="Pink curve = energy profile. Ea = activation energy. ΔH < 0 shown (exothermic)."
        />

        <GraphCard title="Rate laws: [A] vs t" equation="Zero, 1st & 2nd order reactions" color="#34D399"
          graphs={[
            { fn: x => x >= 0 ? Math.max(0, 2 - 0.4 * x) : NaN, color: "#60A5FA", lineWidth: 2 },
            { fn: x => x >= 0 ? 2 * Math.exp(-0.5 * x) : NaN, color: "#34D399", lineWidth: 2 },
            { fn: x => x >= 0 ? 2 / (1 + 2 * x) : NaN, color: "#FB923C", lineWidth: 2 },
          ]}
          xRange={[-0.3, 6]} yRange={[-0.2, 2.5]}
          labels={[
            { text: "0th", x: 1, y: 1.7, color: "#60A5FA" },
            { text: "1st", x: 2.5, y: 0.8, color: "#34D399" },
            { text: "2nd", x: 4, y: 0.4, color: "#FB923C" },
          ]}
          note="0th: linear decay. 1st: exponential (t½ = ln2/k). 2nd: slowest decay."
        />

        <GraphCard title="Arrhenius: ln k vs 1/T" equation="ln k = ln A − Ea/(RT)" color="#A78BFA"
          graphs={[{ fn: x => -2 * x + 3, color: "#A78BFA", lineWidth: 2.5 }]}
          xRange={[0, 3]} yRange={[-3, 3]}
          note="Slope = −Ea/R. Y-intercept = ln A. Plot of ln k vs 1/T is a straight line."
        />

        <GraphCard title="pH vs volume (acid-base titration)" equation="Strong acid titrated with strong base" color="#34D399"
          graphs={[{
            fn: x => {
              if (x < 0 || x > 4) return NaN;
              if (Math.abs(x - 2) < 0.05) return 7;
              if (x < 2) return 1 - 2 * Math.log10(2 - x + 0.01);
              return 13 + 2 * Math.log10(x - 2 + 0.01);
            }, color: "#34D399", lineWidth: 2.5
          }]}
          xRange={[-0.2, 4.2]} yRange={[0, 14]}
          points={[
            { x: 2, y: 7, color: "#FBBF24", label: "equiv. pt (pH=7)" },
          ]}
          asymptotes={[{ type: "horizontal", value: 7, color: "rgba(251,191,36,0.2)" }]}
          note="Rapid pH jump at equivalence point. Buffer region has gradual slope."
        />

        <GraphCard title="Van't Hoff: ln Kc vs 1/T" equation="ln K = −ΔH°/RT + ΔS°/R" color="#FBBF24"
          graphs={[
            { fn: x => -1.5 * x + 2, color: "#FBBF24", lineWidth: 2.2 },
            { fn: x => 1.5 * x - 1, color: "#F472B6", lineWidth: 2.2 },
          ]}
          xRange={[0, 3]} yRange={[-4, 3]}
          labels={[
            { text: "Exothermic", x: 1, y: 0.7, color: "#FBBF24" },
            { text: "Endothermic", x: 0.3, y: -0.7, color: "#F472B6" },
          ]}
          note="Yellow = exothermic (K decreases as T increases). Pink = endothermic (K increases)."
        />

        <GraphCard title="Maxwell-Boltzmann distribution" equation="Fraction of molecules vs speed" color="#60A5FA"
          graphs={[
            { fn: x => x > 0 ? 2 * x * x * Math.exp(-0.4 * x * x) : NaN, color: "#60A5FA", lineWidth: 2.2 },
            { fn: x => x > 0 ? 2 * x * x * Math.exp(-0.25 * x * x) : NaN, color: "#F472B6", lineWidth: 2, dashed: false },
          ]}
          xRange={[0, 5]} yRange={[0, 1.5]}
          labels={[
            { text: "High T", x: 3.5, y: 0.7, color: "#F472B6" },
            { text: "Low T", x: 1.8, y: 1.3, color: "#60A5FA" },
          ]}
          note="Higher T: flatter, broader, peak shifts right. Area under curve = constant (all molecules)."
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── TAB: CALCULUS ────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
function CalculusGraphs() {
  return (
    <div>
      <SectionHeader icon="∫" title="Differentiation" color="#8B5CF6" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12 }}>

        <GraphCard title="Function & its derivative" equation="f(x) = x³−3x and f'(x) = 3x²−3" color="#A78BFA"
          graphs={[
            { fn: x => x * x * x - 3 * x, color: "#A78BFA", lineWidth: 2.5 },
            { fn: x => 3 * x * x - 3, color: "#FBBF24", lineWidth: 2, dashed: false },
          ]}
          xRange={[-3, 3]} yRange={[-5, 5]}
          points={[
            { x: -1, y: 2, color: "#A78BFA", label: "local max" },
            { x: 1, y: -2, color: "#A78BFA", label: "local min" },
            { x: -1, y: 0, color: "#FBBF24", label: "f'=0" },
            { x: 1, y: 0, color: "#FBBF24", label: "f'=0" },
          ]}
          note="Purple = f(x). Yellow = f'(x). Where f' = 0 → turning points of f."
        />

        <GraphCard title="Increasing/decreasing behavior" equation="f'(x) > 0: increasing | f'(x) < 0: decreasing" color="#34D399"
          graphs={[
            { fn: x => 0.5 * x * x - x - 1, color: "#34D399", lineWidth: 2.5 },
            { fn: x => x - 1, color: "#FBBF24", lineWidth: 1.8, dashed: false },
          ]}
          xRange={[-2, 4]} yRange={[-3, 3]}
          points={[{ x: 1, y: -1.5, color: "#FBBF24", label: "minimum" }]}
          note="Green parabola. At x=1, f'=0 (vertex). Yellow = tangent slope at vertex."
        />

        <GraphCard title="Concavity & inflection point" equation="f(x) = x³, f''(x) = 6x" color="#60A5FA"
          graphs={[
            { fn: x => x * x * x, color: "#60A5FA", lineWidth: 2.5 },
            { fn: x => 6 * x, color: "#F472B6", lineWidth: 1.8 },
          ]}
          xRange={[-2.5, 2.5]} yRange={[-5, 5]}
          points={[{ x: 0, y: 0, color: "#FBBF24", label: "inflection" }]}
          note="Blue = x³. Pink = f''(x) = 6x. Inflection point where f'' changes sign (x=0)."
        />
      </div>

      <SectionHeader icon="∫" title="Integration" color="#8B5CF6" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12 }}>

        <GraphCard title="Area under curve: ∫₀² x² dx" equation="∫₀² x² dx = [x³/3]₀² = 8/3" color="#A78BFA"
          graphs={[{ fn: x => x * x, color: "#A78BFA", lineWidth: 2.5 }]}
          xRange={[-0.5, 3]} yRange={[-0.3, 5]}
          points={[
            { x: 0, y: 0, color: "#34D399", label: "a=0" },
            { x: 2, y: 4, color: "#34D399", label: "b=2" },
          ]}
          note="Shaded area between x=0 and x=2 = 8/3 ≈ 2.67. Area = ∫f(x)dx."
        />

        <GraphCard title="Fundamental theorem of calculus" equation="d/dx[∫ₐˣ f(t)dt] = f(x)" color="#34D399"
          graphs={[
            { fn: x => Math.sin(x), color: "#34D399", lineWidth: 2.2 },
            { fn: x => 1 - Math.cos(x), color: "#FBBF24", lineWidth: 2.2 },
          ]}
          xRange={[-1, 7.5]} yRange={[-1.5, 2.5]}
          note="Green = f(x) = sin x. Yellow = F(x) = ∫₀ˣ sin t dt = 1−cos x. dF/dx = f(x)."
        />

        <GraphCard title="Improper integral: 1/x² (convergent)" equation="∫₁^∞ 1/x² dx = 1" color="#FB923C"
          graphs={[{ fn: x => x > 0.2 ? 1 / (x * x) : NaN, color: "#FB923C", lineWidth: 2.5 }]}
          xRange={[0, 5]} yRange={[0, 5]}
          note="Converges to 1. ∫₁^∞ xⁿ dx diverges for n ≥ −1, converges for n < −1."
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
export function Diagrams3DView() {
  const [tab, setTab] = useState("trig");

  const tabs = [
    { id: "trig", icon: "〰️", label: "Trig" },
    { id: "conics", icon: "⬭", label: "Conics" },
    { id: "algebra", icon: "f(x)", label: "Functions" },
    { id: "calculus", icon: "∫", label: "Calculus" },
    { id: "physics", icon: "⚛", label: "Physics" },
    { id: "chem", icon: "⚗", label: "Chemistry" },
  ];

  const renderTab = () => {
    if (tab === "trig") return <TrigGraphs />;
    if (tab === "conics") return <ConicGraphs />;
    if (tab === "algebra") return <AlgebraGraphs />;
    if (tab === "calculus") return <CalculusGraphs />;
    if (tab === "physics") return <PhysicsGraphs />;
    if (tab === "chem") return <ChemGraphs />;
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "20px 12px 40px" }}>
      {/* Header */}
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 4, fontWeight: 800 }}>
          📊 Graphs & Curves
        </h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
          Maths · Physics · Chemistry — all important graphs for JEE/CET
        </p>
      </div>

      {/* Tab bar */}
      <div style={{
        display: "flex",
        gap: 6,
        marginBottom: 18,
        overflowX: "auto",
        paddingBottom: 4,
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        WebkitOverflowScrolling: "touch",
      }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              border: `1px solid ${tab === t.id ? "rgba(129,140,248,0.5)" : "rgba(255,255,255,0.09)"}`,
              background: tab === t.id ? "rgba(129,140,248,0.15)" : "rgba(255,255,255,0.03)",
              color: tab === t.id ? "#818CF8" : "rgba(255,255,255,0.45)",
              fontSize: 12,
              fontWeight: tab === t.id ? 700 : 400,
              cursor: "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "all 0.18s",
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderTab()}
    </div>
  );
}

import { PHYSICS_DATA } from './physicsData.js';
import { CHEMISTRY_DATA } from './chemistryData.js';
import { MATHEMATICS_DATA } from './mathData.js';

const IMPORTANT_FORMULAS = ALL_FORMULAS_FLAT.filter(f => f.important);

function getDayFormula() {
  const dayIndex = new Date().getDate() % IMPORTANT_FORMULAS.length;
  return IMPORTANT_FORMULAS[dayIndex];
}

const ALL_FORMULAS_FLAT = [
  ...PHYSICS_DATA.flatMap(t => t.sections.flatMap(s => (s.formulas || []).map(f => ({ ...f, subject: "physics", topic: t.title })))),
  ...CHEMISTRY_DATA.flatMap(t => t.sections.flatMap(s => (s.formulas || []).map(f => ({ ...f, subject: "chemistry", topic: t.title })))),
  ...MATHEMATICS_DATA.flatMap(t => t.sections.flatMap(s => (s.formulas || []).map(f => ({ ...f, subject: "mathematics", topic: t.title })))),
];

const IMPORTANT_FORMULAS = ALL_FORMULAS_FLAT.filter(f => f.important);

function getDayFormula() {
  const dayIndex = new Date().getDate() % IMPORTANT_FORMULAS.length;
  return IMPORTANT_FORMULAS[dayIndex];
}

// ─── QUIZ DATA ──────────────────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  { q: "Which formula gives the range of a projectile?", options: ["R = u²sin2θ/g", "R = u²sinθ/g", "R = u²/2g", "R = u sinθ × T"], correct: 0, subject: "physics", explanation: "R = u²sin2θ/g. Maximum range when θ = 45°." },
  { q: "What is the escape velocity from Earth?", options: ["√(GM/R)", "√(2GM/R)", "√(2gR²)", "√(GM/2R)"], correct: 1, subject: "physics", explanation: "vₑ = √(2GM/R) = √(2gR) ≈ 11.2 km/s" },
  { q: "Kepler's 3rd law states:", options: ["T ∝ r", "T² ∝ r²", "T² ∝ r³", "T ∝ r²"], correct: 2, subject: "physics", explanation: "T² ∝ r³ — the square of the period is proportional to the cube of the orbital radius." },
  { q: "For a spring-mass system, the time period is:", options: ["2π√(k/m)", "2π√(m/k)", "2π√(g/l)", "π√(m/k)"], correct: 1, subject: "physics", explanation: "T = 2π√(m/k). Heavier mass → longer period; stiffer spring → shorter period." },
  { q: "Bernoulli's theorem: at higher velocity, pressure is:", options: ["Higher", "Lower", "Same", "Zero"], correct: 1, subject: "physics", explanation: "Higher velocity → lower pressure. This explains lift on aircraft wings." },
  { q: "Fringe width in YDSE is:", options: ["λd/D", "λD/d", "dD/λ", "λ/(dD)"], correct: 1, subject: "physics", explanation: "β = λD/d. D = screen distance, d = slit separation, λ = wavelength." },
  { q: "Energy of electron in nth Bohr orbit of H:", options: ["+13.6/n² eV", "-13.6/n eV", "-13.6/n² eV", "+13.6n² eV"], correct: 2, subject: "chemistry", explanation: "Eₙ = −13.6/n² eV. Negative sign indicates bound state." },
  { q: "Kp = Kc when:", options: ["Δng > 0", "Δng < 0", "Δng = 0", "T = 0 K"], correct: 2, subject: "chemistry", explanation: "Kp = Kc(RT)^Δng. When Δng = 0, (RT)⁰ = 1, so Kp = Kc." },
  { q: "Henderson-Hasselbalch equation gives:", options: ["pOH of buffer", "pH of buffer", "Kw value", "Solubility"], correct: 1, subject: "chemistry", explanation: "pH = pKa + log([salt]/[acid]). Used for buffer pH calculations." },
  { q: "Gibbs free energy: spontaneous reaction requires:", options: ["ΔG > 0", "ΔG = 0", "ΔG < 0", "ΔH > 0"], correct: 2, subject: "chemistry", explanation: "ΔG < 0 for spontaneous process. ΔG = 0 at equilibrium." },
  { q: "Degree of unsaturation (DBE) for C₆H₆ is:", options: ["2", "3", "4", "5"], correct: 2, subject: "chemistry", explanation: "DBE = (2×6 + 2 − 6)/2 = (14−6)/2 = 4. Benzene has 3 double bonds + 1 ring." },
  { q: "n-factor of KMnO₄ in acidic medium:", options: ["1", "3", "5", "7"], correct: 2, subject: "chemistry", explanation: "Mn goes from +7 to +2 in acidic medium. Change = 5, so n-factor = 5." },
  { q: "sin⁻¹x + cos⁻¹x equals:", options: ["π", "π/4", "π/2", "2π"], correct: 2, subject: "mathematics", explanation: "sin⁻¹x + cos⁻¹x = π/2 for x ∈ [−1, 1]. A fundamental inverse trig identity." },
  { q: "Sum of all ⁿCr (r = 0 to n) equals:", options: ["n!", "2ⁿ", "nⁿ", "n²"], correct: 1, subject: "mathematics", explanation: "∑ⁿCr = 2ⁿ. Each element is either selected or not → 2 choices × n times." },
  { q: "Binomial variance for n trials, probability p is:", options: ["np", "npq", "√(npq)", "n²p"], correct: 1, subject: "mathematics", explanation: "Variance = npq where q = 1−p. Mean = np, SD = √(npq)." },
  { q: "For perpendicular lines: m₁m₂ equals:", options: ["0", "1", "−1", "∞"], correct: 2, subject: "mathematics", explanation: "m₁m₂ = −1 for perpendicular lines. Slopes are negative reciprocals." },
  { q: "For pair of straight lines ax² + 2hxy + by² = 0, perpendicular condition:", options: ["h² = ab", "a = b", "a + b = 0", "h = 0"], correct: 2, subject: "mathematics", explanation: "a + b = 0 for perpendicular pair. The angle between them is 90°." },
  { q: "l² + m² + n² for direction cosines equals:", options: ["0", "2", "1", "3"], correct: 2, subject: "mathematics", explanation: "l² + m² + n² = 1. This is the defining property of direction cosines." },
  { q: "Shortest distance formula applies to:", options: ["Parallel lines", "Intersecting lines", "Skew lines", "Coplanar lines"], correct: 2, subject: "mathematics", explanation: "Skew lines are non-parallel, non-intersecting lines in 3D. They have a unique shortest distance." },
  { q: "Stokes' law drag force on a sphere:", options: ["F = 4πηrv", "F = 6πηrv", "F = 3πηrv", "F = πηr²v"], correct: 1, subject: "physics", explanation: "F = 6πηrv. Proportional to r (not r²) and v." },
];


const DERIVATIONS_DATA = [
  {
    subject: "physics",
    topic: "Escape Velocity",
    steps: [
      { heading: "Start with energy conservation", tex: "\\text{KE} = \\text{Gravitational PE gain}" },
      { heading: "At surface", tex: "\\frac{1}{2}mv_e^2 = \\frac{GMm}{R}" },
      { heading: "Cancel m and solve", tex: "v_e^2 = \\frac{2GM}{R}" },
      { heading: "Final result", tex: "v_e = \\sqrt{\\frac{2GM}{R}} = \\sqrt{2gR}" },
    ],
    note: "Since g = GM/R², we can also write vₑ = √(2gR)"
  },
  {
    subject: "physics",
    topic: "Kinetic Energy from Work-Energy Theorem",
    steps: [
      { heading: "Apply Newton's 2nd law", tex: "F = ma" },
      { heading: "Use v² = u² + 2as", tex: "a = \\frac{v^2 - u^2}{2s}" },
      { heading: "Work = Force × displacement", tex: "W = Fs = m \\cdot \\frac{v^2-u^2}{2s} \\cdot s" },
      { heading: "Simplify", tex: "W = \\frac{1}{2}mv^2 - \\frac{1}{2}mu^2 = \\Delta KE" },
    ],
    note: "Work done = change in kinetic energy — the Work-Energy Theorem"
  },
  {
    subject: "chemistry",
    topic: "Henderson-Hasselbalch Equation",
    steps: [
      { heading: "Weak acid equilibrium", tex: "HA \\rightleftharpoons H^+ + A^-" },
      { heading: "Ka expression", tex: "K_a = \\frac{[H^+][A^-]}{[HA]}" },
      { heading: "Solve for [H⁺]", tex: "[H^+] = K_a \\cdot \\frac{[HA]}{[A^-]}" },
      { heading: "Take negative log", tex: "\\text{pH} = \\text{p}K_a + \\log\\frac{[A^-]}{[HA]}" },
    ],
    note: "For a buffer, [A⁻] ≈ [salt] and [HA] ≈ [acid]"
  },
  {
    subject: "chemistry",
    topic: "Kp from Kc",
    steps: [
      { heading: "For reaction aA + bB ⇌ cC + dD, Kc is", tex: "K_c = \\frac{[C]^c[D]^d}{[A]^a[B]^b}" },
      { heading: "Ideal gas: concentration = P/RT", tex: "[X] = \\frac{P_X}{RT}" },
      { heading: "Substitute into Kc", tex: "K_c = K_p \\cdot (RT)^{-(\\Delta n_g)}" },
      { heading: "Therefore", tex: "K_p = K_c(RT)^{\\Delta n_g}" },
    ],
    note: "Δng = moles of gaseous products − gaseous reactants"
  },
  {
    subject: "mathematics",
    topic: "Quadratic Formula",
    steps: [
      { heading: "Start with standard form", tex: "ax^2 + bx + c = 0" },
      { heading: "Divide by a", tex: "x^2 + \\frac{b}{a}x + \\frac{c}{a} = 0" },
      { heading: "Complete the square", tex: "\\left(x + \\frac{b}{2a}\\right)^2 = \\frac{b^2 - 4ac}{4a^2}" },
      { heading: "Take square root and solve", tex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" },
    ],
    note: "Discriminant D = b²−4ac: D > 0 (two real roots), D = 0 (equal roots), D < 0 (no real roots)"
  },
  {
    subject: "mathematics",
    topic: "Distance from a Point to a Line",
    steps: [
      { heading: "Line: ax + by + c = 0, Point: (x₁, y₁)", tex: "\\text{Line: } ax + by + c = 0" },
      { heading: "Foot of perpendicular satisfies", tex: "\\frac{x - x_1}{a} = \\frac{y - y_1}{b} = -\\frac{ax_1+by_1+c}{a^2+b^2}" },
      { heading: "Let k = −(ax₁+by₁+c)/(a²+b²)", tex: "k = -\\frac{ax_1+by_1+c}{a^2+b^2}" },
      { heading: "Distance = |k|·√(a²+b²)", tex: "d = \\frac{|ax_1+by_1+c|}{\\sqrt{a^2+b^2}}" },
    ],
    note: "Always use absolute value — distance is always positive"
  },
];

const UNIT_DATA = [
  { quantity: "Force", formula: "F = ma", siUnit: "Newton (N)", equivalent: "kg·m/s²", dim: "[M L T⁻²]" },
  { quantity: "Energy / Work", formula: "W = Fd", siUnit: "Joule (J)", equivalent: "kg·m²/s²", dim: "[M L² T⁻²]" },
  { quantity: "Power", formula: "P = W/t", siUnit: "Watt (W)", equivalent: "kg·m²/s³", dim: "[M L² T⁻³]" },
  { quantity: "Pressure", formula: "P = F/A", siUnit: "Pascal (Pa)", equivalent: "N/m² = kg/(m·s²)", dim: "[M L⁻¹ T⁻²]" },
  { quantity: "Velocity", formula: "v = d/t", siUnit: "m/s", equivalent: "m·s⁻¹", dim: "[L T⁻¹]" },
  { quantity: "Acceleration", formula: "a = Δv/Δt", siUnit: "m/s²", equivalent: "m·s⁻²", dim: "[L T⁻²]" },
  { quantity: "Momentum", formula: "p = mv", siUnit: "kg·m/s", equivalent: "N·s", dim: "[M L T⁻¹]" },
  { quantity: "Impulse", formula: "J = FΔt", siUnit: "N·s", equivalent: "kg·m/s", dim: "[M L T⁻¹]" },
  { quantity: "Torque", formula: "τ = rF", siUnit: "N·m", equivalent: "kg·m²/s²", dim: "[M L² T⁻²]" },
  { quantity: "Angular momentum", formula: "L = Iω", siUnit: "kg·m²/s", equivalent: "J·s", dim: "[M L² T⁻¹]" },
  { quantity: "Frequency", formula: "f = 1/T", siUnit: "Hertz (Hz)", equivalent: "s⁻¹", dim: "[T⁻¹]" },
  { quantity: "Angular frequency", formula: "ω = 2πf", siUnit: "rad/s", equivalent: "s⁻¹", dim: "[T⁻¹]" },
  { quantity: "Spring constant", formula: "F = kx", siUnit: "N/m", equivalent: "kg/s²", dim: "[M T⁻²]" },
  { quantity: "Charge", formula: "Q = It", siUnit: "Coulomb (C)", equivalent: "A·s", dim: "[A T]" },
  { quantity: "Electric field", formula: "E = F/q", siUnit: "N/C = V/m", equivalent: "kg·m/(A·s³)", dim: "[M L T⁻³ A⁻¹]" },
  { quantity: "Voltage / EMF", formula: "V = W/q", siUnit: "Volt (V)", equivalent: "J/C = kg·m²/(A·s³)", dim: "[M L² T⁻³ A⁻¹]" },
  { quantity: "Resistance", formula: "R = V/I", siUnit: "Ohm (Ω)", equivalent: "V/A = kg·m²/(A²·s³)", dim: "[M L² T⁻³ A⁻²]" },
  { quantity: "Capacitance", formula: "C = Q/V", siUnit: "Farad (F)", equivalent: "C/V = A²·s⁴/(kg·m²)", dim: "[M⁻¹ L⁻² T⁴ A²]" },
  { quantity: "Magnetic field", formula: "F = qvB", siUnit: "Tesla (T)", equivalent: "kg/(A·s²) = Wb/m²", dim: "[M T⁻² A⁻¹]" },
  { quantity: "Inductance", formula: "V = L(dI/dt)", siUnit: "Henry (H)", equivalent: "kg·m²/(A²·s²)", dim: "[M L² T⁻² A⁻²]" },
  { quantity: "Surface tension", formula: "T = F/l", siUnit: "N/m", equivalent: "J/m²", dim: "[M T⁻²]" },
  { quantity: "Viscosity", formula: "F = ηA(dv/dx)", siUnit: "Pa·s", equivalent: "kg/(m·s)", dim: "[M L⁻¹ T⁻¹]" },
  { quantity: "Gravitational constant", formula: "F = Gm₁m₂/r²", siUnit: "N·m²/kg²", equivalent: "m³/(kg·s²)", dim: "[M⁻¹ L³ T⁻²]" },
  { quantity: "Planck's constant", formula: "E = hf", siUnit: "J·s", equivalent: "kg·m²/s", dim: "[M L² T⁻¹]" },
  { quantity: "Boltzmann constant", formula: "E = kBT", siUnit: "J/K", equivalent: "kg·m²/(s²·K)", dim: "[M L² T⁻² Θ⁻¹]" },
];

function UnitCheckerView() {
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

// ─── CONSTANTS VIEW ──────────────────────────────────────────────────────────
function ConstantsView() {
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

// ─── CHEAT SHEET / PDF EXPORT VIEW ─────────────────────────────────────────
function CheatSheetView({ bookmarks, setView }) {
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

// ─── MOBILE BOTTOM NAV ─────────────────────────────────────────────────────
function MobileBottomNav({ view, setView, subject, bookmarks, setMobileDrawerOpen, setMobileNavOpen }) {
  return (
    <div className="mobile-bottom-nav" style={{
      display: "none",
      position: "fixed",
      bottom: 0, left: 0, right: 0,
      background: "rgba(6,6,16,0.95)",
      backdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(255,255,255,0.08)",
      padding: "8px 0 max(8px, env(safe-area-inset-bottom))",
      zIndex: 100,
      justifyContent: "space-around",
      alignItems: "center",
    }}>
      {[
        { id: "home", icon: "🏠", label: "Home" },
        { id: "study", icon: "📑", label: "Topics", action: () => { setView("study"); setMobileDrawerOpen(true); } },
        { id: "quiz", icon: "🧠", label: "Quiz" },
        { id: "revision", icon: "🔄", label: "Revise" },
        { id: "more", icon: "☰", label: "More", action: () => setMobileNavOpen(true) },
      ].map(nav => (
        <button
          key={nav.id}
          onClick={() => nav.action ? nav.action() : setView(nav.id)}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "6px 0",
            color: view === nav.id ? SUBJECTS[subject].color : "rgba(255,255,255,0.35)",
            transition: "all 0.18s",
          }}
        >
          <span style={{ fontSize: 20 }}>{nav.icon}</span>
          <span style={{ fontSize: 10, fontWeight: view === nav.id ? 700 : 400, letterSpacing: "0.05em" }}>{nav.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── MOBILE DRAWER OVERLAY ─────────────────────────────────────────────────
function MobileDrawer({ open, onClose, children }) {
  if (!open) return null;
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 50,
          backdropFilter: "blur(4px)",
        }}
      />
      <div style={{
        position: "fixed",
        top: 0, left: 0, bottom: 0,
        width: "min(280px, 85vw)",
        zIndex: 60,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}>
        {children}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12, right: -44,
            width: 36, height: 36,
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "50%",
            color: "#fff",
            fontSize: 18,
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >✕</button>
      </div>
    </>
  );
}

// ─── MAIN NAV DRAWER (Mobile) ──────────────────────────────────────────────
function MainNavDrawer({ open, onClose, view, setView, subject, bookmarks }) {
  if (!open) return null;
  const items = [
    { id: "home", label: "🏠 Home" },
    { id: "study", label: `${SUBJECTS[subject].icon} Study` },
    { id: "fotd", label: "🌟 Formula of the Day" },
    { id: "quiz", label: "🧠 Quiz" },
    { id: "revision", label: "🔄 Revision" },
    { id: "bookmarks", label: `★ Bookmarks (${bookmarks.size})` },
    { id: "progress", label: "📊 Progress" },
    { id: "derivations", label: "📐 Derivations" },
    { id: "units", label: "📏 Unit Checker" },
    { id: "constants", label: "🔢 Constants" },
    { id: "cheatsheet", label: "📄 Cheat Sheet" },
  ];

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 70, backdropFilter: "blur(4px)" }} />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: "min(300px, 85vw)", zIndex: 80,
        background: "rgba(10,10,20,0.95)", backdropFilter: "blur(30px)",
        borderLeft: "1px solid rgba(255,255,255,0.08)",
        padding: "24px 20px", overflowY: "auto",
        display: "flex", flexDirection: "column", gap: 4,
      }}>
        <div style={{ color: "#fff", fontSize: 18, fontWeight: 800, fontFamily: "'Playfair Display', serif", marginBottom: 20 }}>
          Menu
        </div>
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => { setView(item.id); onClose(); }}
            style={{
              width: "100%", textAlign: "left", padding: "12px 14px", borderRadius: 10,
              border: `1px solid ${view === item.id ? "rgba(129,140,248,0.3)" : "transparent"}`,
              background: view === item.id ? "rgba(129,140,248,0.12)" : "transparent",
              color: view === item.id ? "#818CF8" : "rgba(255,255,255,0.7)",
              fontSize: 14, fontWeight: view === item.id ? 600 : 400,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >{item.label}</button>
        ))}
        <button
          onClick={onClose}
          style={{
            marginTop: "auto",
            width: "100%", padding: "12px", borderRadius: 10,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: 13,
          }}
        >Close Menu</button>
      </div>
    </>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────
export default function App() {
  const [subject, setSubject] = useState("physics");
  const [activeTopic, setActiveTopic] = useState(null);
  const [view, setView] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Persistent state
  const [bookmarksArr, setBookmarksArr] = usePersistentState("jee-cet-bookmarks", []);
  const bookmarks = useMemo(() => new Set(bookmarksArr), [bookmarksArr]);
  const [progress, setProgress] = usePersistentState("jee-cet-progress", {
    quizAttempted: 0,
    quizCorrect: 0,
    topicsVisited: [],
    quizHistory: [],
    studySessions: [],
    lastActiveDate: null,
    streak: 0,
    formulaViews: 0,
    subjectStats: { physics: 0, chemistry: 0, mathematics: 0 },
    dailyActivity: {},
  });
  const [srData, setSrData] = usePersistentState("jee-cet-sr", {});

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Streak tracking
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setProgress(p => {
      if (p.lastActiveDate === today) return p;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newStreak = p.lastActiveDate === yesterday ? (p.streak || 0) + 1 : 1;
      return { ...p, lastActiveDate: today, streak: newStreak };
    });
  }, []);

  const toggleBookmark = useCallback((id) => {
    setBookmarksArr(prev => {
      const exists = prev.includes(id);
      if (exists) return prev.filter(x => x !== id);
      return [...prev, id];
    });
  }, [setBookmarksArr]);

  const handleTopicSelect = useCallback((topicId, subjectKey) => {
    setActiveTopic(topicId);
    setView("study");
    const dataMap = { physics: PHYSICS_DATA, chemistry: CHEMISTRY_DATA, mathematics: MATHEMATICS_DATA };
    const topic = (dataMap[subjectKey || subject] || []).find(t => t.id === topicId);
    if (topic) {
      setProgress(p => ({
        ...p,
        topicsVisited: p.topicsVisited.includes(topic.title) ? p.topicsVisited : [...p.topicsVisited, topic.title],
      }));
    }
  }, [subject, setProgress]);

  const dataMap = { physics: PHYSICS_DATA, chemistry: CHEMISTRY_DATA, mathematics: MATHEMATICS_DATA };

  // Search across all data
  const searchResults = searchQuery.length > 1
    ? (() => {
        const q = searchQuery.toLowerCase();
        const results = [];
        Object.entries(dataMap).forEach(([sub, topics]) => {
          topics.forEach(topic => {
            topic.sections.forEach(sec => {
              sec.formulas && sec.formulas.forEach(f => {
                if (f.label.toLowerCase().includes(q) || f.tex.toLowerCase().includes(q)) {
                  results.push({ ...f, subject: sub, topic: topic.title, topicId: topic.id });
                }
              });
            });
          });
        });
        return results;
      })()
    : [];

  const currentTopic = activeTopic && dataMap[subject]?.find(t => t.id === activeTopic);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: #060610; font-family: 'DM Sans', sans-serif; color: #fff; min-height: 100vh; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      .formula-card:hover { background: rgba(255,255,255,0.07) !important; transform: translateY(-1px); }
      .section-btn:hover { background: rgba(255,255,255,0.08) !important; }
      .topic-btn:hover { color: rgba(255,255,255,0.85) !important; background: rgba(255,255,255,0.04) !important; }
      .subject-card:hover { transform: translateY(-3px); opacity: 0.9; }
      .nav-btn:hover { background: rgba(255,255,255,0.08) !important; }
      .katex { font-size: 1em !important; }
      .katex-display { text-align: left !important; margin: 4px 0 !important; }

      /* ── Mobile responsive styles ── */
      @media (max-width: 767px) {
        .desktop-sidebar { display: none !important; }
        .mobile-bottom-nav { display: flex !important; }
        .main-scroll-area { padding-bottom: 72px !important; }
        .topbar-nav-buttons { display: none !important; }
        .topbar-breadcrumb { display: none !important; }
        .subject-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
        .hero-section { padding: 36px 20px !important; margin-bottom: 28px !important; }
        .hero-title { font-size: 28px !important; }
        .tips-grid { grid-template-columns: 1fr !important; }
        .home-page { padding: 20px 16px !important; }
        .study-overview-grid { grid-template-columns: 1fr !important; }
        .main-content-inner { padding: 16px 12px !important; }
        .stats-row { gap: 10px !important; }
        .stats-row > div { padding: 10px 14px !important; min-width: 70px !important; }
      }

      @media (min-width: 768px) {
        .mobile-bottom-nav { display: none !important; }
        .mobile-menu-btn { display: none !important; }
      }

      /* Print styles for Cheat Sheet */
      @media print {
        .no-print { display: none !important; }
        body { background: #fff !important; color: #000 !important; }
        .cheatsheet-page { padding: 20px !important; }
        .cheatsheet-page h1, .cheatsheet-page h2 { color: #000 !important; }
        .cheatsheet-page .katex { color: #000 !important; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const sidebarEl = (
    <Sidebar
      subject={subject}
      setSubject={(s) => { setSubject(s); setView("study"); }}
      activeTopic={activeTopic}
      setActiveTopic={(id) => { handleTopicSelect(id); }}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onTopicSelect={isMobile ? () => setMobileDrawerOpen(false) : undefined}
    />
  );

  const NAV_ITEMS = [
    { id: "home", label: "🏠 Home" },
    { id: "study", label: `${SUBJECTS[subject].icon} ${SUBJECTS[subject].label}` },
    { id: "fotd", label: "🌟 Today" },
    { id: "quiz", label: "🧠 Quiz" },
    { id: "revision", label: "🔄 Revision" },
    { id: "derivations", label: "📐 Derivations" },
    { id: "units", label: "📏 Units" },
    { id: "constants", label: "🔢 Constants" },
    { id: "progress", label: `📊 Progress` },
    { id: "bookmarks", label: `★ (${bookmarks.size})` },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#060610" }}>
      {/* Animated background */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at 20% 20%, rgba(59,130,246,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(139,92,246,0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.03) 0%, transparent 60%)",
      }} />

      {/* Desktop Sidebar */}
      {sidebarOpen && !isMobile && (
        <div className="desktop-sidebar" style={{ position: "relative", zIndex: 10 }}>
          {sidebarEl}
        </div>
      )}

      {/* Mobile Topic Drawer */}
      {isMobile && (
        <MobileDrawer open={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)}>
          {sidebarEl}
        </MobileDrawer>
      )}

      {/* Mobile Main Nav Drawer */}
      <MainNavDrawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        view={view}
        setView={setView}
        subject={subject}
        bookmarks={bookmarks}
      />

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative", zIndex: 1 }}>
        {/* Topbar */}
        <div style={{
          height: 54,
          background: "rgba(6,6,16,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 8,
          position: "sticky",
          top: 0,
          zIndex: 10,
          flexShrink: 0,
          overflowX: "auto",
        }}>
          <button
            onClick={() => isMobile ? setMobileNavOpen(true) : setSidebarOpen(o => !o)}
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 14, flexShrink: 0 }}
          >☰</button>

          {/* Desktop nav buttons */}
          <div className="topbar-nav-buttons" style={{ display: "flex", gap: 4, overflowX: "auto", flexShrink: 1 }}>
            {NAV_ITEMS.map(nav => (
              <button
                key={nav.id}
                onClick={() => setView(nav.id)}
                className="nav-btn"
                style={{
                  padding: "5px 10px",
                  borderRadius: 8,
                  border: `1px solid ${view === nav.id ? SUBJECTS[subject].border : "rgba(255,255,255,0.07)"}`,
                  background: view === nav.id ? SUBJECTS[subject].bg : "transparent",
                  color: view === nav.id ? SUBJECTS[subject].color : "rgba(255,255,255,0.4)",
                  fontSize: 11,
                  fontWeight: view === nav.id ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.18s",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >{nav.label}</button>
            ))}
          </div>

          {isMobile && (
            <div style={{ fontSize: 15, fontWeight: 800, fontFamily: "'Playfair Display', serif", color: "#fff", letterSpacing: "-0.01em" }}>
              JEE<span style={{ color: "#818CF8" }}>×</span>CET
            </div>
          )}

          {currentTopic && view === "study" && !isMobile && (
            <div className="topbar-breadcrumb" style={{ marginLeft: "auto", color: "rgba(255,255,255,0.3)", fontSize: 12, flexShrink: 0 }}>
              {SUBJECTS[subject].icon} {SUBJECTS[subject].label} / {currentTopic.title}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="main-scroll-area" style={{ flex: 1, overflowY: "auto", padding: "0 4px" }}>
          {/* Search results */}
          {searchQuery.length > 1 && (
            <div className="main-content-inner" style={{ maxWidth: 800, margin: "0 auto", padding: "24px 20px" }}>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 16 }}>
                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for "{searchQuery}"
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {searchResults.map((f, i) => (
                  <div key={i}>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, marginBottom: 4 }}>
                      {SUBJECTS[f.subject].icon} {SUBJECTS[f.subject].label} · {f.topic}
                    </div>
                    <FormulaCard f={f} subjectColor={SUBJECTS[f.subject].color} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
                  </div>
                ))}
                {searchResults.length === 0 && (
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, textAlign: "center", padding: "40px 0" }}>
                    No formulas found for "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Views */}
          {!searchQuery.length && (
            <>
              {view === "home" && <HomePage setSubject={setSubject} setActiveTopic={(id) => { setActiveTopic(id); setView("study"); }} setView={setView} />}
              {view === "bookmarks" && <BookmarksView bookmarks={bookmarks} toggleBookmark={toggleBookmark} setView={setView} />}
              {view === "quiz" && <QuizView progress={progress} setProgress={setProgress} />}
              {view === "progress" && <ProgressView progress={progress} bookmarks={bookmarks} srData={srData} />}
              {view === "revision" && <RevisionView bookmarks={bookmarks} toggleBookmark={toggleBookmark} srData={srData} setSrData={setSrData} />}
              {view === "fotd" && <FormulaOfTheDayView bookmarks={bookmarks} toggleBookmark={toggleBookmark} />}
              {view === "derivations" && <DerivationsView />}
              {view === "units" && <UnitCheckerView />}
              {view === "constants" && <ConstantsView />}
              {view === "cheatsheet" && <CheatSheetView bookmarks={bookmarks} setView={setView} />}
              {view === "study" && (
                <div className="main-content-inner" style={{ maxWidth: 800, margin: "0 auto", padding: "28px 20px" }}>
                  {!activeTopic ? (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                        <span style={{ fontSize: 36 }}>{SUBJECTS[subject].icon}</span>
                        <div>
                          <h2 style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800 }}>{SUBJECTS[subject].label}</h2>
                          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Select a topic from the sidebar</div>
                        </div>
                      </div>
                      <div className="study-overview-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                        {(dataMap[subject] || []).map(topic => (
                          <button
                            key={topic.id}
                            onClick={() => handleTopicSelect(topic.id)}
                            style={{
                              background: SUBJECTS[subject].bg,
                              border: `1px solid ${SUBJECTS[subject].border}`,
                              borderRadius: 14,
                              padding: "18px 20px",
                              cursor: "pointer",
                              textAlign: "left",
                              transition: "all 0.2s",
                              color: "#fff",
                            }}
                            className="subject-card"
                          >
                            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{topic.title}</div>
                            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                              {topic.tags.map(t => <TagBadge key={t} tag={t} />)}
                              <WeightageBadge weightage={topic.weightage} />
                            </div>
                            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 8 }}>
                              {topic.sections.reduce((acc, s) => acc + (s.formulas?.length || 0), 0)} formulas
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : currentTopic ? (
                    <TopicView topic={currentTopic} subject={subject} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
                  ) : null}
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav
          view={view}
          setView={setView}
          subject={subject}
          bookmarks={bookmarks}
          setMobileDrawerOpen={setMobileDrawerOpen}
          setMobileNavOpen={setMobileNavOpen}
        />
      </div>
    </div>
  );
}

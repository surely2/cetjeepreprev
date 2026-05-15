import { useState, useEffect, useRef, useCallback, useMemo } from "react";

import { Diagrams3DView } from "./3ddiagram";

// ─── KaTeX via CDN (loaded in useEffect) ───────────────────────────────────
function useMathReady() {
  const [ready, setReady] = useState(typeof window !== "undefined" && !!window.katex);
  useEffect(() => {
    if (window.katex) { setReady(true); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js";
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, []);
  return ready;
}

function Math({ tex, display = false }) {
  const ref = useRef(null);
  const mathReady = useMathReady();
  useEffect(() => {
    if (!mathReady || !ref.current || !window.katex) return;
    try {
      window.katex.render(tex, ref.current, {
        displayMode: display,
        throwOnError: false,
        trust: true,
        strict: false,
      });
    } catch (e) { ref.current.textContent = tex; }
  }, [tex, display, mathReady]);
  return <span ref={ref} className={display ? "block my-2" : "inline"} />;
}

// ─── PERSISTENT STATE HOOK ─────────────────────────────────────────────────
function usePersistentState(key, initialValue) {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (e) {
      return initialValue;
    }
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);
  return [state, setState];
}

// ─── DATA ──────────────────────────────────────────────────────────────────

const SUBJECTS = {
  physics: {
    label: "Physics",
    icon: "⚛",
    color: "#3B82F6",
    glow: "rgba(59,130,246,0.35)",
    accent: "#60A5FA",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.25)",
  },
  chemistry: {
    label: "Chemistry",
    icon: "⚗",
    color: "#10B981",
    glow: "rgba(16,185,129,0.35)",
    accent: "#34D399",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.25)",
  },
  mathematics: {
    label: "Mathematics",
    icon: "∑",
    color: "#8B5CF6",
    glow: "rgba(139,92,246,0.35)",
    accent: "#A78BFA",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.25)",
  },
};

const PHYSICS_DATA = [
  {
    id: "mechanics",
    title: "Mechanics",
    tags: ["JEE", "CET", "NCERT"],
    weightage: { jee: "12%", cet: "15%" },
    sections: [
      {
        title: "Kinematics – Key Equations",
        formulas: [
          { label: "First equation of motion", tex: "v = u + at", jee: true, cet: true },
          { label: "Second equation of motion", tex: "s = ut + \\frac{1}{2}at^2", jee: true, cet: true },
          { label: "Third equation of motion", tex: "v^2 = u^2 + 2as", jee: true, cet: true },
          { label: "Displacement in nth second", tex: "s_n = u + \\frac{a(2n-1)}{2}", jee: true, cet: false },
          { label: "Range of projectile", tex: "R = \\frac{u^2 \\sin 2\\theta}{g}", jee: true, cet: true },
          { label: "Maximum height", tex: "H = \\frac{u^2 \\sin^2\\theta}{2g}", jee: true, cet: true },
          { label: "Time of flight", tex: "T = \\frac{2u\\sin\\theta}{g}", jee: true, cet: true },
          { label: "Maximum range (θ=45°)", tex: "R_{max} = \\frac{u^2}{g}", jee: true, cet: true },
          { label: "Relative velocity", tex: "\\vec{v}_{AB} = \\vec{v}_A - \\vec{v}_B", jee: true, cet: true },
        ],
        notes: [
          "At maximum height: vertical velocity = 0, horizontal velocity = u cosθ",
          "For same range: angles θ and (90°−θ) give same R",
          "Acceleration due to gravity g = 9.8 m/s² ≈ 10 m/s² (CET approx)",
        ],
        mistakes: ["Confusing displacement with distance in nth second formula", "Forgetting that g acts downward only"],
        tricks: ["R is maximum at 45° — memorize this"],
      },
      {
        title: "Newton's Laws & Forces",
        formulas: [
          { label: "Newton's 2nd Law", tex: "\\vec{F} = m\\vec{a}", jee: true, cet: true, important: true },
          { label: "Weight", tex: "W = mg", jee: true, cet: true },
          { label: "Friction (kinetic)", tex: "f_k = \\mu_k N", jee: true, cet: true },
          { label: "Friction (static max)", tex: "f_s \\leq \\mu_s N", jee: true, cet: true },
          { label: "Banking angle", tex: "\\tan\\theta = \\frac{v^2}{rg}", jee: true, cet: true },
          { label: "Pseudo force (non-inertial frame)", tex: "F_{pseudo} = -ma_0", jee: true, cet: false },
        ],
        notes: [
          "μs > μk always",
          "Normal force ≠ weight when surface is inclined or accelerating",
          "Banking: no friction assumed unless stated",
        ],
        mistakes: ["Taking g = 10 when exact value needed", "Ignoring pseudo force in accelerating frames"],
        tricks: ["For connected blocks on smooth surface: a = F/(m₁+m₂), T = m₂a"],
      },
      {
        title: "Work, Energy & Power",
        formulas: [
          { label: "Work done", tex: "W = \\vec{F} \\cdot \\vec{d} = Fd\\cos\\theta", jee: true, cet: true, important: true },
          { label: "Kinetic Energy", tex: "KE = \\frac{1}{2}mv^2", jee: true, cet: true },
          { label: "Work-Energy theorem", tex: "W_{net} = \\Delta KE", jee: true, cet: true, important: true },
          { label: "Potential Energy (gravity)", tex: "PE = mgh", jee: true, cet: true },
          { label: "Elastic PE (spring)", tex: "U = \\frac{1}{2}kx^2", jee: true, cet: true },
          { label: "Power", tex: "P = \\frac{W}{t} = \\vec{F} \\cdot \\vec{v}", jee: true, cet: true },
          { label: "Efficiency", tex: "\\eta = \\frac{P_{output}}{P_{input}} \\times 100\\%", jee: false, cet: true },
        ],
        notes: [
          "Conservative forces: work done is path-independent",
          "Spring constant k: unit N/m",
          "1 kWh = 3.6 × 10⁶ J",
        ],
        mistakes: ["Using wrong angle in W = Fd cosθ", "Forgetting that friction does negative work"],
        tricks: ["Gravitational PE: reference can be any point; only ΔPE matters"],
      },
      {
        title: "Momentum & Collisions",
        formulas: [
          { label: "Linear momentum", tex: "\\vec{p} = m\\vec{v}", jee: true, cet: true },
          { label: "Impulse", tex: "J = \\vec{F} \\cdot \\Delta t = \\Delta\\vec{p}", jee: true, cet: true },
          { label: "Coefficient of restitution", tex: "e = \\frac{v_2 - v_1}{u_1 - u_2}", jee: true, cet: true, important: true },
          { label: "Elastic collision (equal masses)", tex: "v_1' = u_2, \\quad v_2' = u_1", jee: true, cet: true },
          { label: "Perfectly inelastic collision", tex: "m_1 u_1 + m_2 u_2 = (m_1+m_2)v", jee: true, cet: true },
        ],
        notes: [
          "e = 1: perfectly elastic, e = 0: perfectly inelastic",
          "Momentum always conserved if no external force",
          "KE conserved only in elastic collision",
        ],
        mistakes: ["Confusing e formula direction", "Forgetting to check if system is isolated"],
        tricks: ["For elastic collision between equal masses: velocities exchange"],
      },
      {
        title: "Rotational Motion",
        formulas: [
          { label: "Torque", tex: "\\tau = r \\times F = I\\alpha", jee: true, cet: true, important: true },
          { label: "Angular momentum", tex: "L = I\\omega = mvr", jee: true, cet: true },
          { label: "Rotational KE", tex: "KE_{rot} = \\frac{1}{2}I\\omega^2", jee: true, cet: true },
          { label: "MI of rod (center)", tex: "I = \\frac{ML^2}{12}", jee: true, cet: true },
          { label: "MI of disk (center)", tex: "I = \\frac{MR^2}{2}", jee: true, cet: true },
          { label: "MI of ring (center)", tex: "I = MR^2", jee: true, cet: true },
          { label: "MI of solid sphere", tex: "I = \\frac{2}{5}MR^2", jee: true, cet: true },
          { label: "MI of hollow sphere", tex: "I = \\frac{2}{3}MR^2", jee: true, cet: true },
          { label: "Parallel axis theorem", tex: "I = I_{cm} + Md^2", jee: true, cet: true, important: true },
          { label: "Perpendicular axis theorem", tex: "I_z = I_x + I_y", jee: true, cet: true },
          { label: "Rolling without slipping", tex: "v = R\\omega", jee: true, cet: true },
        ],
        notes: [
          "Perp. axis theorem only for 2D laminas",
          "Rolling: total KE = ½mv² + ½Iω²",
          "Conservation of L when τ_ext = 0",
        ],
        mistakes: ["Applying perp. axis theorem to 3D bodies", "Wrong MI formula for different axes"],
        tricks: ["Hollow > Solid for same shape: hollow has more MI"],
      },
      {
        title: "Gravitation",
        formulas: [
          { label: "Newton's law of gravitation", tex: "F = G\\frac{m_1 m_2}{r^2}", jee: true, cet: true, important: true },
          { label: "Gravitational field", tex: "g = \\frac{GM}{R^2}", jee: true, cet: true },
          { label: "Escape velocity", tex: "v_e = \\sqrt{\\frac{2GM}{R}} = \\sqrt{2gR}", jee: true, cet: true, important: true },
          { label: "Orbital velocity", tex: "v_0 = \\sqrt{\\frac{GM}{r}}", jee: true, cet: true },
          { label: "Orbital period", tex: "T = 2\\pi\\sqrt{\\frac{r^3}{GM}}", jee: true, cet: true },
          { label: "Kepler's 3rd law", tex: "T^2 \\propto r^3", jee: true, cet: true, important: true },
          { label: "Gravitational PE", tex: "U = -\\frac{GMm}{r}", jee: true, cet: true },
          { label: "Binding energy", tex: "BE = \\frac{GMm}{2r}", jee: true, cet: false },
          { label: "g variation with height", tex: "g_h = g\\left(1 - \\frac{2h}{R}\\right)", jee: true, cet: true },
          { label: "g variation with depth", tex: "g_d = g\\left(1 - \\frac{d}{R}\\right)", jee: true, cet: true },
        ],
        notes: [
          "G = 6.67 × 10⁻¹¹ N m²/kg²",
          "Escape velocity from Earth ≈ 11.2 km/s",
          "Orbital velocity ≈ 7.9 km/s (near Earth surface)",
          "g = 0 at center of Earth",
        ],
        mistakes: ["Using r from center vs surface", "Sign of U (always negative)"],
        tricks: ["vₑ = √2 × v₀ (escape = √2 × orbital near surface)"],
      },
    ],
  },
  {
    id: "elasticity",
    title: "Elasticity",
    tags: ["CET", "JEE"],
    weightage: { jee: "2%", cet: "3%" },
    sections: [
      {
        title: "Stress, Strain & Moduli",
        formulas: [
          { label: "Stress", tex: "\\sigma = \\frac{F}{A}", jee: true, cet: true },
          { label: "Longitudinal Strain", tex: "\\varepsilon = \\frac{\\Delta L}{L}", jee: true, cet: true },
          { label: "Young's Modulus", tex: "Y = \\frac{\\sigma}{\\varepsilon} = \\frac{FL}{A\\Delta L}", jee: true, cet: true, important: true },
          { label: "Bulk Modulus", tex: "B = -\\frac{\\Delta P}{\\Delta V/V}", jee: true, cet: true },
          { label: "Shear Modulus", tex: "G = \\frac{F/A}{\\Delta x/L}", jee: true, cet: false },
          { label: "Poisson's Ratio", tex: "\\sigma_P = -\\frac{\\Delta r / r}{\\Delta L / L}", jee: true, cet: false },
          { label: "Elastic PE density", tex: "u = \\frac{1}{2} \\times \\text{stress} \\times \\text{strain}", jee: true, cet: true },
        ],
        notes: [
          "Steel has higher Y than rubber — stiffer material",
          "Y of steel ≈ 2 × 10¹¹ Pa",
          "0 ≤ σ_Poisson ≤ 0.5 for real materials",
        ],
        mistakes: ["Confusing bulk modulus sign", "Area in stress = cross-sectional area"],
        tricks: ["Elastic PE = ½ × stress × strain × volume"],
      },
    ],
  },
  {
    id: "fluids",
    title: "Fluid Mechanics",
    tags: ["JEE", "CET"],
    weightage: { jee: "4%", cet: "5%" },
    sections: [
      {
        title: "Pressure & Buoyancy",
        formulas: [
          { label: "Pressure", tex: "P = \\frac{F}{A}", jee: true, cet: true },
          { label: "Hydrostatic pressure", tex: "P = P_0 + \\rho g h", jee: true, cet: true, important: true },
          { label: "Archimedes principle", tex: "F_b = \\rho_{fluid} \\cdot V_{sub} \\cdot g", jee: true, cet: true, important: true },
          { label: "Pascal's law", tex: "\\frac{F_1}{A_1} = \\frac{F_2}{A_2}", jee: true, cet: true },
        ],
        notes: ["Pressure depends only on depth, not on shape/area of container", "Floating: weight = buoyant force"],
        mistakes: ["Using total volume instead of submerged volume in Fb"],
        tricks: ["Fractional depth submerged = ρ_object/ρ_fluid"],
      },
      {
        title: "Continuity & Bernoulli",
        formulas: [
          { label: "Continuity equation", tex: "A_1 v_1 = A_2 v_2", jee: true, cet: true, important: true },
          { label: "Bernoulli's theorem", tex: "P + \\frac{1}{2}\\rho v^2 + \\rho g h = \\text{const}", jee: true, cet: true, important: true },
          { label: "Torricelli's theorem", tex: "v = \\sqrt{2gh}", jee: true, cet: true },
          { label: "Venturimeter", tex: "v_1 = A_2\\sqrt{\\frac{2g\\Delta h}{A_1^2 - A_2^2}}", jee: true, cet: false },
        ],
        notes: [
          "Bernoulli valid for ideal fluid (non-viscous, incompressible, streamline)",
          "Torricelli: speed of efflux from hole at depth h",
        ],
        mistakes: ["Applying Bernoulli to viscous flow", "Wrong sign of h in Bernoulli"],
        tricks: ["Higher velocity → Lower pressure (Bernoulli key insight)"],
      },
    ],
  },
  {
    id: "surface",
    title: "Surface Tension",
    tags: ["CET", "JEE"],
    weightage: { jee: "2%", cet: "3%" },
    sections: [
      {
        title: "Surface Tension Formulas",
        formulas: [
          { label: "Surface tension", tex: "T = \\frac{F}{l}", jee: true, cet: true },
          { label: "Surface energy", tex: "E = T \\times \\Delta A", jee: true, cet: true },
          { label: "Excess pressure (bubble)", tex: "\\Delta P = \\frac{4T}{r}", jee: true, cet: true, important: true },
          { label: "Excess pressure (drop)", tex: "\\Delta P = \\frac{2T}{r}", jee: true, cet: true, important: true },
          { label: "Capillary rise", tex: "h = \\frac{2T\\cos\\theta}{r\\rho g}", jee: true, cet: true, important: true },
          { label: "Work done in blowing bubble", tex: "W = 8\\pi r^2 T", jee: true, cet: true },
        ],
        notes: [
          "Bubble (soap) has 2 surfaces → 4T/r; drop has 1 surface → 2T/r",
          "θ < 90°: wets surface, rises; θ > 90°: doesn't wet, falls (mercury)",
          "Water-glass: θ ≈ 0°; Mercury-glass: θ ≈ 135°",
        ],
        mistakes: ["Using 2T/r for soap bubble (should be 4T/r)"],
        tricks: ["Bubble = 2 surfaces = 2× excess pressure of a drop"],
      },
    ],
  },
  {
    id: "viscosity",
    title: "Viscosity",
    tags: ["CET"],
    weightage: { jee: "1%", cet: "2%" },
    sections: [
      {
        title: "Viscous Flow",
        formulas: [
          { label: "Viscous force (Newton's law)", tex: "F = -\\eta A \\frac{dv}{dx}", jee: false, cet: true },
          { label: "Stokes' law", tex: "F = 6\\pi\\eta r v", jee: true, cet: true, important: true },
          { label: "Terminal velocity", tex: "v_t = \\frac{2r^2(\\rho - \\sigma)g}{9\\eta}", jee: true, cet: true, important: true },
          { label: "Poiseuille's formula", tex: "Q = \\frac{\\pi P r^4}{8\\eta l}", jee: true, cet: false },
          { label: "Reynolds number", tex: "R_e = \\frac{\\rho v D}{\\eta}", jee: true, cet: false },
        ],
        notes: [
          "Terminal velocity: drag force + buoyancy = weight",
          "Re < 2000: laminar; Re > 3000: turbulent",
          "Viscosity decreases with temp for liquids; increases for gases",
        ],
        mistakes: ["Forgetting buoyancy in terminal velocity derivation"],
        tricks: ["vt ∝ r² — doubling radius quadruples terminal velocity"],
      },
    ],
  },
  {
    id: "shm",
    title: "Simple Harmonic Motion",
    tags: ["JEE", "CET"],
    weightage: { jee: "4%", cet: "5%" },
    sections: [
      {
        title: "SHM Fundamentals",
        formulas: [
          { label: "SHM condition", tex: "a = -\\omega^2 x", jee: true, cet: true, important: true },
          { label: "Displacement", tex: "x = A\\sin(\\omega t + \\phi)", jee: true, cet: true },
          { label: "Velocity", tex: "v = A\\omega\\cos(\\omega t + \\phi) = \\omega\\sqrt{A^2 - x^2}", jee: true, cet: true, important: true },
          { label: "Angular frequency", tex: "\\omega = 2\\pi f = \\frac{2\\pi}{T}", jee: true, cet: true },
          { label: "Simple pendulum period", tex: "T = 2\\pi\\sqrt{\\frac{l}{g}}", jee: true, cet: true, important: true },
          { label: "Spring-mass period", tex: "T = 2\\pi\\sqrt{\\frac{m}{k}}", jee: true, cet: true, important: true },
          { label: "KE in SHM", tex: "KE = \\frac{1}{2}m\\omega^2(A^2 - x^2)", jee: true, cet: true },
          { label: "PE in SHM", tex: "PE = \\frac{1}{2}m\\omega^2 x^2", jee: true, cet: true },
          { label: "Total energy", tex: "E = \\frac{1}{2}m\\omega^2 A^2", jee: true, cet: true, important: true },
          { label: "Springs in series", tex: "\\frac{1}{k_{eff}} = \\frac{1}{k_1} + \\frac{1}{k_2}", jee: true, cet: true },
          { label: "Springs in parallel", tex: "k_{eff} = k_1 + k_2", jee: true, cet: true },
        ],
        notes: [
          "At equilibrium (x=0): KE max, PE = 0",
          "At amplitude (x=A): KE = 0, PE max",
          "Total energy independent of x — constant",
          "Simple pendulum: T independent of mass and amplitude (small angles)",
        ],
        mistakes: ["Using T = 2π√(l/g) for large angles", "Sign errors in SHM equation"],
        tricks: ["v_max = Aω at x = 0", "a_max = Aω² at x = ±A"],
      },
    ],
  },
  {
    id: "waves",
    title: "Waves & Sound",
    tags: ["JEE", "CET"],
    weightage: { jee: "4%", cet: "5%" },
    sections: [
      {
        title: "Wave Properties",
        formulas: [
          { label: "Wave equation", tex: "y = A\\sin(kx - \\omega t)", jee: true, cet: true },
          { label: "Wave speed", tex: "v = f\\lambda = \\frac{\\omega}{k}", jee: true, cet: true },
          { label: "Speed in string", tex: "v = \\sqrt{\\frac{T}{\\mu}}", jee: true, cet: true, important: true },
          { label: "Speed of sound (Newton-Laplace)", tex: "v = \\sqrt{\\frac{\\gamma P}{\\rho}}", jee: true, cet: true },
          { label: "Speed of sound at temp T", tex: "v_T = v_0\\sqrt{\\frac{T}{273}}", jee: true, cet: true },
          { label: "Sound: v at 0°C", tex: "v_0 = 332 \\text{ m/s}", jee: true, cet: true },
        ],
        notes: ["μ = mass per unit length of string", "γ = 1.4 for diatomic gas (air)"],
        mistakes: ["Using Newton's formula (without γ)"],
        tricks: ["v increases ~0.6 m/s per °C rise in temperature"],
      },
      {
        title: "Standing Waves & Resonance",
        formulas: [
          { label: "String (both ends fixed) — nth harmonic", tex: "f_n = \\frac{n}{2L}\\sqrt{\\frac{T}{\\mu}}", jee: true, cet: true, important: true },
          { label: "Open pipe — nth harmonic", tex: "f_n = \\frac{nv}{2L}", jee: true, cet: true },
          { label: "Closed pipe — nth harmonic (odd only)", tex: "f_n = \\frac{(2n-1)v}{4L}", jee: true, cet: true, important: true },
          { label: "Beat frequency", tex: "f_{beat} = |f_1 - f_2|", jee: true, cet: true },
          { label: "Doppler effect", tex: "f' = f\\frac{v \\pm v_o}{v \\mp v_s}", jee: true, cet: true, important: true },
        ],
        notes: [
          "Closed pipe: only odd harmonics present",
          "Open pipe: all harmonics present",
          "Beat: periodic variation of loudness",
          "Doppler: + in numerator when observer moves toward source",
        ],
        mistakes: ["Wrong sign in Doppler formula", "Confusing open/closed pipe harmonics"],
        tricks: ["Doppler: numerator sign same as observer direction toward source; denominator opposite to source direction toward observer"],
      },
    ],
  },
  {
    id: "optics",
    title: "Ray Optics",
    tags: ["JEE", "CET"],
    weightage: { jee: "6%", cet: "8%" },
    sections: [
      {
        title: "Mirrors & Refraction",
        formulas: [
          { label: "Mirror formula", tex: "\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}", jee: true, cet: true, important: true },
          { label: "Magnification (mirror)", tex: "m = -\\frac{v}{u}", jee: true, cet: true },
          { label: "Snell's law", tex: "n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2", jee: true, cet: true, important: true },
          { label: "Critical angle", tex: "\\sin C = \\frac{1}{n}", jee: true, cet: true },
          { label: "Lens formula", tex: "\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}", jee: true, cet: true, important: true },
          { label: "Lensmaker's formula", tex: "\\frac{1}{f} = (n-1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)", jee: true, cet: true },
          { label: "Power of lens", tex: "P = \\frac{1}{f(\\text{in m})}", jee: true, cet: true },
          { label: "Lenses in contact", tex: "P = P_1 + P_2", jee: true, cet: true },
          { label: "Refractive index", tex: "n = \\frac{c}{v} = \\frac{\\sin i}{\\sin r}", jee: true, cet: true },
        ],
        notes: [
          "Sign convention: distances measured from pole/optical center",
          "Real image: negative v for mirror, positive v for lens",
          "Diopter = m⁻¹ (unit of power)",
          "n_glass ≈ 1.5, n_water = 1.33",
        ],
        mistakes: ["Wrong sign in lens formula", "Confusing mirror and lens formulae"],
        tricks: ["Lens formula: v−u in denominator; Mirror: v+u"],
      },
      {
        title: "Prism & Dispersion",
        formulas: [
          { label: "Prism formula (min deviation)", tex: "n = \\frac{\\sin\\frac{A+\\delta_m}{2}}{\\sin\\frac{A}{2}}", jee: true, cet: true, important: true },
          { label: "Deviation by prism (small angle)", tex: "\\delta = (n-1)A", jee: true, cet: true },
          { label: "Dispersive power", tex: "\\omega = \\frac{n_V - n_R}{n_Y - 1}", jee: true, cet: false },
        ],
        notes: [
          "At min deviation: r₁ = r₂ = A/2",
          "VIBGYOR: violet bends most, red least",
          "Dispersion: different colors have different n",
        ],
        mistakes: ["Using exact formula when small angle given"],
        tricks: ["Minimum deviation: ray passes symmetrically through prism"],
      },
    ],
  },
  {
    id: "wave_optics",
    title: "Wave Optics",
    tags: ["JEE", "CET"],
    weightage: { jee: "4%", cet: "5%" },
    sections: [
      {
        title: "Interference & Diffraction",
        formulas: [
          { label: "Fringe width (YDSE)", tex: "\\beta = \\frac{\\lambda D}{d}", jee: true, cet: true, important: true },
          { label: "Path difference (constructive)", tex: "\\Delta x = n\\lambda", jee: true, cet: true },
          { label: "Path difference (destructive)", tex: "\\Delta x = (2n-1)\\frac{\\lambda}{2}", jee: true, cet: true },
          { label: "Single slit: min diffraction", tex: "a\\sin\\theta = n\\lambda", jee: true, cet: true },
          { label: "Resolving power (telescope)", tex: "\\theta = \\frac{1.22\\lambda}{D}", jee: true, cet: false },
          { label: "Malus's law", tex: "I = I_0 \\cos^2\\theta", jee: true, cet: true, important: true },
          { label: "Brewster's law", tex: "\\tan i_B = n", jee: true, cet: true },
        ],
        notes: [
          "Coherent sources: same frequency, constant phase difference",
          "In YDSE: d = slit separation, D = screen distance",
          "Malus law: intensity after polarizer = I₀cos²θ",
          "At Brewster angle: reflected ray is fully polarized",
        ],
        mistakes: ["Confusing d and D in fringe width formula", "Path difference vs phase difference (Δφ = 2πΔx/λ)"],
        tricks: ["Fringe width ∝ λ — larger λ = wider fringes (red > violet)"],
      },
    ],
  },
  {
    id: "thermal",
    title: "Thermal Expansion & Calorimetry",
    tags: ["JEE", "CET"],
    weightage: { jee: "5%", cet: "6%" },
    sections: [
      {
        title: "Thermal Expansion",
        formulas: [
          { label: "Linear expansion", tex: "\\Delta L = L_0 \\alpha \\Delta T", jee: true, cet: true },
          { label: "Area expansion", tex: "\\Delta A = A_0 \\cdot 2\\alpha \\cdot \\Delta T", jee: true, cet: true },
          { label: "Volume expansion", tex: "\\Delta V = V_0 \\gamma \\Delta T", jee: true, cet: true, important: true },
          { label: "Relation", tex: "\\gamma = 3\\alpha = \\frac{3}{2}\\beta", jee: true, cet: true, important: true },
        ],
        notes: ["α: linear, β: areal, γ: volume coefficient", "For liquids: only volume expansion relevant", "Real expansion of liquid = apparent + expansion of container"],
        mistakes: ["Using linear formula for volume", "Forgetting real vs apparent expansion"],
        tricks: ["γ = 3α — always: remember 1:2:3 ratio for α:β:γ"],
      },
      {
        title: "Calorimetry",
        formulas: [
          { label: "Heat absorbed/released", tex: "Q = mc\\Delta T", jee: true, cet: true, important: true },
          { label: "Latent heat", tex: "Q = mL", jee: true, cet: true },
          { label: "Newton's law of cooling", tex: "\\frac{dT}{dt} = -k(T - T_0)", jee: true, cet: true },
          { label: "Wien's displacement law", tex: "\\lambda_m T = b = 2.898 \\times 10^{-3} \\text{ m·K}", jee: true, cet: true },
          { label: "Stefan's law", tex: "E = \\sigma T^4", jee: true, cet: true },
          { label: "Stefan-Boltzmann constant", tex: "\\sigma = 5.67 \\times 10^{-8} \\text{ W m}^{-2} \\text{K}^{-4}", jee: true, cet: false },
        ],
        notes: [
          "Specific heat of water = 4200 J/kg·K",
          "Latent heat of fusion of ice = 336 kJ/kg",
          "Latent heat of vaporization of water = 2260 kJ/kg",
          "Perfect blackbody: emissivity e = 1",
        ],
        mistakes: ["Using wrong unit for temperature (°C vs K in Stefan/Wien)"],
        tricks: ["Wien: hotter object → smaller λ_max → bluer color"],
      },
    ],
  },
];

const CHEMISTRY_DATA = [
  {
    id: "mole",
    title: "Mole Concept",
    tags: ["JEE", "CET", "NCERT"],
    weightage: { jee: "5%", cet: "6%" },
    sections: [
      {
        title: "Fundamental Relations",
        formulas: [
          { label: "Number of moles", tex: "n = \\frac{m}{M} = \\frac{N}{N_A}", jee: true, cet: true, important: true },
          { label: "Avogadro's number", tex: "N_A = 6.022 \\times 10^{23}", jee: true, cet: true },
          { label: "Molar volume (STP)", tex: "V_m = 22.4 \\text{ L/mol}", jee: true, cet: true },
          { label: "Molarity", tex: "M = \\frac{\\text{moles of solute}}{\\text{volume of solution (L)}}", jee: true, cet: true, important: true },
          { label: "Molality", tex: "m = \\frac{\\text{moles of solute}}{\\text{mass of solvent (kg)}}", jee: true, cet: true },
          { label: "Mole fraction", tex: "\\chi_A = \\frac{n_A}{n_A + n_B}", jee: true, cet: true },
          { label: "Normality", tex: "N = M \\times n_{factor}", jee: true, cet: true },
          { label: "% w/v", tex: "\\%\\frac{w}{v} = \\frac{\\text{mass of solute (g)}}{\\text{vol. of solution (mL)}} \\times 100", jee: false, cet: true },
        ],
        notes: [
          "STP (IUPAC 2010): 0°C, 1 bar → 22.7 L/mol",
          "Old STP: 0°C, 1 atm → 22.4 L/mol (commonly used in problems)",
          "n-factor for acids = basicity; for bases = acidity; for redox = change in oxidation state",
        ],
        mistakes: ["Using mL instead of L for molarity", "Confusing molarity with molality"],
        tricks: ["Moles = given grams / molar mass — always first step"],
      },
      {
        title: "Limiting Reagent & Yield",
        formulas: [
          { label: "% yield", tex: "\\% \\text{ yield} = \\frac{\\text{actual yield}}{\\text{theoretical yield}} \\times 100", jee: true, cet: true },
          { label: "% purity", tex: "\\% \\text{ purity} = \\frac{\\text{pure substance}}{\\text{total mass}} \\times 100", jee: false, cet: true },
        ],
        notes: [
          "Limiting reagent: gives least moles of product",
          "Excess reagent: left over after reaction",
        ],
        mistakes: ["Forgetting to find limiting reagent before calculating product"],
        tricks: ["Divide moles of each reactant by stoichiometric coefficient → smallest value = limiting reagent"],
      },
    ],
  },
  {
    id: "atomic",
    title: "Atomic Structure",
    tags: ["JEE", "CET"],
    weightage: { jee: "4%", cet: "5%" },
    sections: [
      {
        title: "Bohr Model & Hydrogen Atom",
        formulas: [
          { label: "Energy of nth orbit", tex: "E_n = -\\frac{13.6}{n^2} \\text{ eV}", jee: true, cet: true, important: true },
          { label: "Radius of nth orbit", tex: "r_n = 0.529 \\times n^2 \\text{ Å (H atom)}", jee: true, cet: true },
          { label: "Velocity in nth orbit", tex: "v_n = \\frac{2.18 \\times 10^6}{n} \\text{ m/s}", jee: true, cet: false },
          { label: "Wave number (Rydberg)", tex: "\\bar{\\nu} = R_H\\left(\\frac{1}{n_1^2} - \\frac{1}{n_2^2}\\right)", jee: true, cet: true, important: true },
          { label: "Rydberg constant", tex: "R_H = 1.097 \\times 10^7 \\text{ m}^{-1}", jee: true, cet: false },
          { label: "de Broglie wavelength", tex: "\\lambda = \\frac{h}{mv} = \\frac{h}{p}", jee: true, cet: true, important: true },
          { label: "Heisenberg uncertainty", tex: "\\Delta x \\cdot \\Delta p \\geq \\frac{h}{4\\pi}", jee: true, cet: true },
          { label: "Photoelectric effect", tex: "E = h\\nu = \\phi + KE_{max}", jee: true, cet: true, important: true },
        ],
        notes: [
          "Series: Lyman (UV, n₁=1), Balmer (visible, n₁=2), Paschen (IR, n₁=3), Brackett (n₁=4), Pfund (n₁=5)",
          "h = 6.626 × 10⁻³⁴ J·s (Planck's constant)",
          "Stopping potential: eV₀ = KE_max",
          "Threshold frequency: ν₀ = φ/h",
        ],
        mistakes: ["Negative sign in energy: E₁ = −13.6 eV, not positive", "Confusing wave number and wavelength"],
        tricks: ["Energy difference → photon energy → wavelength λ = hc/E"],
      },
      {
        title: "Quantum Numbers & Electronic Config",
        formulas: [
          { label: "Max electrons in shell", tex: "= 2n^2", jee: true, cet: true },
          { label: "Max electrons in subshell", tex: "= 2(2l+1)", jee: true, cet: true },
          { label: "Number of orbitals in subshell", tex: "= 2l+1", jee: true, cet: true },
        ],
        notes: [
          "n: principal (1,2,3...), l: azimuthal (0 to n−1), m: magnetic (−l to +l), s: spin (±½)",
          "l = 0(s), 1(p), 2(d), 3(f)",
          "Aufbau: fill lowest energy first; 1s 2s 2p 3s 3p 4s 3d 4p...",
          "Hund's rule: maximize unpaired electrons in degenerate orbitals",
          "Pauli exclusion: no two electrons have same 4 quantum numbers",
          "Exception: Cr = [Ar]3d⁵4s¹; Cu = [Ar]3d¹⁰4s¹ (half-filled/fully-filled stability)",
        ],
        mistakes: ["Writing Cr as [Ar]3d⁴4s² (incorrect)", "Forgetting exceptions for Cr, Cu, Mo, Ag"],
        tricks: ["(n+l) rule: lower (n+l) fills first; same (n+l) → lower n fills first"],
      },
    ],
  },
  {
    id: "periodic",
    title: "Periodic Table",
    tags: ["JEE", "CET"],
    weightage: { jee: "2%", cet: "3%" },
    sections: [
      {
        title: "Interactive Periodic Table",
        formulas: [],
        notes: [
          "Click the button below to view the full interactive periodic table with all 118 elements.",
          "Filter by element category: Alkali Metals, Halogens, Noble Gases, Transition Metals, etc.",
          "Hover over any element to see its atomic number, symbol, and name.",
          "Lanthanides (Row 8) and Actinides (Row 9) are shown separately below the main table.",
        ],
        mistakes: [],
        tricks: ["Use the category filter to quickly find elements by group — great for JEE/CET questions!"],
      },
      {
        title: "Periodic Trends",
        formulas: [],
        notes: [
          "Atomic radius: increases down group, decreases across period (left to right)",
          "Ionization energy: decreases down group, increases across period",
          "IE exception: N > O (half-filled 2p is extra stable)",
          "Electron affinity: increases across period (F exception: F < Cl due to small size)",
          "Electronegativity: F is highest (4.0 Pauling scale)",
          "Metallic character: increases down group, decreases across period",
        ],
        mistakes: ["Saying F has highest EA (actually Cl has higher EA than F)", "Forgetting IE anomaly at Group 15 vs 16"],
        tricks: ["Smallest atom: He; Largest atom: Fr; Most electronegative: F"],
      },
    ],
  },
  {
    id: "bonding",
    title: "Chemical Bonding",
    tags: ["JEE", "CET"],
    weightage: { jee: "4%", cet: "5%" },
    sections: [
      {
        title: "VSEPR & Hybridization",
        formulas: [
          { label: "Formal charge", tex: "FC = V - N - \\frac{B}{2}", jee: true, cet: true },
          { label: "Bond order", tex: "BO = \\frac{\\text{bonding e}^- - \\text{antibonding e}^-}{2}", jee: true, cet: true },
          { label: "Dipole moment", tex: "\\mu = q \\times d", jee: true, cet: true },
        ],
        notes: [
          "VSEPR: lone pairs cause more repulsion than bond pairs",
          "sp: linear (180°), sp²: trigonal planar (120°), sp³: tetrahedral (109.5°)",
          "sp³d: trigonal bipyramidal, sp³d²: octahedral",
          "Bond order ↑ → bond length ↓, bond energy ↑",
          "Examples: BF₃ (sp², no dipole), NH₃ (sp³, has dipole), H₂O (sp³, bent)",
          "CO₂: linear, nonpolar despite polar bonds",
        ],
        mistakes: ["Predicting bent shape for CO₂ (it's linear)", "Ignoring lone pairs in hybridization count"],
        tricks: ["Hybridization = ½(V + bonds + lone pairs - charge) for central atom"],
      },
    ],
  },
  {
    id: "thermo_chem",
    title: "Thermodynamics",
    tags: ["JEE", "CET"],
    weightage: { jee: "5%", cet: "6%" },
    sections: [
      {
        title: "Laws & Key Equations",
        formulas: [
          { label: "First law", tex: "\\Delta U = q + w = q - P\\Delta V", jee: true, cet: true, important: true },
          { label: "Enthalpy", tex: "H = U + PV \\Rightarrow \\Delta H = \\Delta U + \\Delta n_g RT", jee: true, cet: true, important: true },
          { label: "Gibbs free energy", tex: "\\Delta G = \\Delta H - T\\Delta S", jee: true, cet: true, important: true },
          { label: "Spontaneity", tex: "\\Delta G < 0 \\text{ (spontaneous)}", jee: true, cet: true },
          { label: "Entropy change", tex: "\\Delta S = \\frac{q_{rev}}{T}", jee: true, cet: false },
          { label: "Hess's law", tex: "\\Delta H_{rxn} = \\sum \\Delta H_f(\\text{products}) - \\sum \\Delta H_f(\\text{reactants})", jee: true, cet: true, important: true },
          { label: "Bond enthalpy", tex: "\\Delta H = \\sum \\text{bonds broken} - \\sum \\text{bonds formed}", jee: true, cet: true },
          { label: "Work done by gas", tex: "w = -P_{ext}\\Delta V", jee: true, cet: true },
          { label: "Cp - Cv", tex: "C_p - C_v = R", jee: true, cet: false },
        ],
        notes: [
          "ΔH < 0: exothermic; ΔH > 0: endothermic",
          "Standard state: 25°C, 1 bar",
          "Δng = moles of gaseous products − moles of gaseous reactants",
          "ΔG = 0 at equilibrium",
          "Third law: entropy of perfect crystal at 0 K = 0",
        ],
        mistakes: ["Sign of work: w = −PΔV (work done BY system)", "Forgetting to count only gaseous moles for Δng"],
        tricks: ["ΔG < 0, ΔH < 0, ΔS > 0: always spontaneous"],
      },
    ],
  },
  {
    id: "equilibrium",
    title: "Chemical Equilibrium",
    tags: ["JEE", "CET"],
    weightage: { jee: "5%", cet: "6%" },
    sections: [
      {
        title: "Equilibrium Constants",
        formulas: [
          { label: "Kc expression", tex: "K_c = \\frac{[C]^c[D]^d}{[A]^a[B]^b}", jee: true, cet: true, important: true },
          { label: "Kp from Kc", tex: "K_p = K_c(RT)^{\\Delta n_g}", jee: true, cet: true, important: true },
          { label: "Relation with ΔG°", tex: "\\Delta G^\\circ = -RT\\ln K", jee: true, cet: false },
          { label: "Reaction quotient", tex: "Q_c < K_c: \\text{ forward favored}", jee: true, cet: true },
          { label: "Degree of dissociation (α)", tex: "K_c = \\frac{c\\alpha^2}{1-\\alpha} \\approx c\\alpha^2 \\text{ (if } \\alpha \\ll 1)", jee: true, cet: true },
        ],
        notes: [
          "Le Chatelier's principle: system shifts to counteract change",
          "Increasing pressure: favors fewer moles of gas side",
          "Adding inert gas at constant V: no effect on equilibrium",
          "K depends only on temperature, not concentrations",
          "Kp = Kc when Δng = 0",
        ],
        mistakes: ["Including solids/pure liquids in K expression", "Confusing Q and K"],
        tricks: ["Kp > Kc when Δng > 0; Kp < Kc when Δng < 0"],
      },
    ],
  },
  {
    id: "ionic_eq",
    title: "Ionic Equilibrium",
    tags: ["JEE", "CET"],
    weightage: { jee: "4%", cet: "5%" },
    sections: [
      {
        title: "pH, Buffers & Solubility",
        formulas: [
          { label: "pH definition", tex: "\\text{pH} = -\\log[\\text{H}^+]", jee: true, cet: true, important: true },
          { label: "pOH definition", tex: "\\text{pOH} = -\\log[\\text{OH}^-]", jee: true, cet: true },
          { label: "pH + pOH at 25°C", tex: "\\text{pH} + \\text{pOH} = 14", jee: true, cet: true, important: true },
          { label: "Kw at 25°C", tex: "K_w = [H^+][OH^-] = 10^{-14}", jee: true, cet: true },
          { label: "Weak acid pH", tex: "\\text{pH} = \\frac{1}{2}(\\text{p}K_a - \\log c)", jee: true, cet: true },
          { label: "Henderson-Hasselbalch", tex: "\\text{pH} = \\text{p}K_a + \\log\\frac{[\\text{salt}]}{[\\text{acid}]}", jee: true, cet: true, important: true },
          { label: "Solubility product", tex: "K_{sp} = [A^+]^m [B^-]^n", jee: true, cet: true, important: true },
          { label: "Common ion effect", tex: "\\text{Adding common ion} \\Rightarrow K_{sp} \\downarrow \\text{ solubility}", jee: true, cet: true },
        ],
        notes: [
          "pH < 7: acidic; pH > 7: basic; pH = 7: neutral (at 25°C)",
          "Buffer: resists change in pH (weak acid + its salt)",
          "Degree of hydrolysis: h = √(Kh/c)",
          "Salt of weak acid + strong base: pH > 7",
          "Salt of strong acid + weak base: pH < 7",
        ],
        mistakes: ["Saying neutral water always has pH=7 (true only at 25°C)", "Wrong formula for solubility from Ksp"],
        tricks: ["pH of 10⁻⁸ M HCl ≈ 7 (contribution of water, not less than 7)"],
      },
    ],
  },
  {
    id: "redox",
    title: "Redox Reactions",
    tags: ["JEE", "CET"],
    weightage: { jee: "3%", cet: "4%" },
    sections: [
      {
        title: "Oxidation States & Balancing",
        formulas: [
          { label: "n-factor (redox)", tex: "n = \\text{change in oxidation state} \\times \\text{atoms undergoing change}", jee: true, cet: true, important: true },
          { label: "Equivalents balance", tex: "n_1 \\times N_1 = n_2 \\times N_2", jee: true, cet: true },
          { label: "n-factor for KMnO4 (acidic)", tex: "n = 5 \\text{ (Mn: +7 → +2)}", jee: true, cet: true },
          { label: "n-factor for KMnO4 (neutral)", tex: "n = 3 \\text{ (Mn: +7 → +4)}", jee: true, cet: true },
          { label: "n-factor for KMnO4 (basic)", tex: "n = 1 \\text{ (Mn: +7 → +6)}", jee: true, cet: true },
          { label: "n-factor for K2Cr2O7", tex: "n = 6 \\text{ (Cr: +6 → +3)}", jee: true, cet: true },
        ],
        notes: [
          "Oxidation state rules: O = −2 (except peroxide: −1), H = +1 (except hydrides: −1), F = −1",
          "Sum of oxidation states in neutral compound = 0",
          "Sum of oxidation states in ion = charge of ion",
        ],
        mistakes: ["Wrong OS for oxygen in peroxides", "Missing disproportionation reactions"],
        tricks: ["Oxidation = loss of electrons (OIL); Reduction = gain of electrons (RIG)"],
      },
    ],
  },
  {
    id: "coord",
    title: "Coordination Compounds",
    tags: ["JEE", "CET"],
    weightage: { jee: "3%", cet: "4%" },
    sections: [
      {
        title: "Nomenclature & VBT",
        formulas: [],
        notes: [
          "IUPAC: anionic ligands first (alphabetical), then cationic; metal name + oxidation state",
          "Ligand denticity: mono (H₂O, NH₃, Cl⁻), bi (en, ox²⁻), poly (EDTA: hexadentate)",
          "VBT hybridization: d²sp³ = inner orbital (octahedral, low spin), sp³d² = outer orbital (high spin)",
          "[Co(NH₃)₆]³⁺: d²sp³, diamagnetic | [CoF₆]³⁻: sp³d², paramagnetic",
          "EAN rule: effective atomic number = metal electrons + ligand electrons",
          "Crystal field: Δ₀ determines high/low spin in octahedral complexes",
          "Spectrochemical series (weak to strong field): I⁻ < Br⁻ < Cl⁻ < F⁻ < OH⁻ < C₂O₄²⁻ < H₂O < NH₃ < en < CN⁻ < CO",
          "CFSE (octahedral, d⁶ low spin): −2.4Δ₀",
        ],
        mistakes: ["Naming cation before anion in complex", "Confusing inner and outer orbital complexes"],
        tricks: ["Strong field ligands: CO, CN⁻, en, NH₃ — cause low spin"],
      },
    ],
  },
  {
    id: "goc",
    title: "General Organic Chemistry (GOC)",
    tags: ["JEE", "CET"],
    weightage: { jee: "4%", cet: "5%" },
    sections: [
      {
        title: "Electronic Effects",
        formulas: [
          { label: "Inductive effect order (+I)", tex: "\\text{Alkyl} > H > \\text{Halogens}", jee: true, cet: true },
          { label: "Resonance stability (carbanion)", tex: "CH_2^- < \\text{allylic} < \\text{benzylic} < \\text{beside C=O}", jee: true, cet: true },
        ],
        notes: [
          "+I groups (electron donating): −OR, −OH, −NHR, −NH₂, alkyl groups",
          "−I groups (electron withdrawing): −NO₂, −CN, −COOH, −X (halogens)",
          "+M groups: −OH, −OR, −NH₂, −X (donate by resonance)",
          "−M groups: −NO₂, −CHO, −COOH, −C≡N (withdraw by resonance)",
          "Carbocation stability: 3° > 2° > 1° > CH₃⁺; allylic > secondary",
          "Free radical stability: 3° > 2° > 1°",
          "Carbanion stability (reverse of carbocation): more substituents = less stable",
          "Hyperconjugation: σ electrons of C−H delocalize into empty p orbital",
        ],
        mistakes: ["Confusing inductive and mesomeric effect magnitudes", "F: −I but +M (halogen paradox)"],
        tricks: ["Stability of carbocation: more hyperconjugating H's → more stable"],
      },
    ],
  },
  {
    id: "isomerism",
    title: "Isomerism",
    tags: ["JEE", "CET"],
    weightage: { jee: "3%", cet: "4%" },
    sections: [
      {
        title: "Structural & Stereoisomerism",
        formulas: [
          { label: "Degree of unsaturation (DBE)", tex: "DBE = \\frac{2C + 2 + N - H - X}{2}", jee: true, cet: true, important: true },
        ],
        notes: [
          "Structural isomers: same molecular formula, different connectivity",
          "Chain, position, functional group, ring-chain isomers",
          "Geometrical (cis-trans): restricted rotation (double bonds, rings)",
          "Optical isomerism: non-superimposable mirror images (enantiomers)",
          "Chiral center: 4 different groups attached to carbon",
          "Number of stereoisomers ≤ 2ⁿ where n = chiral centers",
          "Meso compound: has chiral centers but internally compensated (optically inactive)",
          "Enantiomers: same physical properties, opposite optical rotation",
          "Diastereomers: different physical properties, not mirror images",
          "R/S configuration: Cahn-Ingold-Prelog rules (by decreasing priority)",
        ],
        mistakes: ["Calling meso compound optically active", "Forgetting geometric isomerism in rings"],
        tricks: ["DBE = 1: one double bond or ring; DBE = 4: benzene ring"],
      },
    ],
  },
];

const MATHEMATICS_DATA = [
  {
    id: "trigonometry",
    title: "Trigonometry",
    tags: ["JEE", "CET"],
    weightage: { jee: "6%", cet: "8%" },
    sections: [
      {
        title: "Trigonometric Values Table",
        formulas: [
          { label: "sin 0°", tex: "\sin 0^\circ = 0", jee: true, cet: true, important: true },
          { label: "sin 30°", tex: "\sin 30^\circ = \frac{1}{2}", jee: true, cet: true, important: true },
          { label: "sin 45°", tex: "\sin 45^\circ = \frac{1}{\sqrt{2}}", jee: true, cet: true, important: true },
          { label: "sin 60°", tex: "\sin 60^\circ = \frac{\sqrt{3}}{2}", jee: true, cet: true, important: true },
          { label: "sin 90°", tex: "\sin 90^\circ = 1", jee: true, cet: true, important: true },
          { label: "cos 0°", tex: "\cos 0^\circ = 1", jee: true, cet: true, important: true },
          { label: "cos 30°", tex: "\cos 30^\circ = \frac{\sqrt{3}}{2}", jee: true, cet: true, important: true },
          { label: "cos 45°", tex: "\cos 45^\circ = \frac{1}{\sqrt{2}}", jee: true, cet: true, important: true },
          { label: "cos 60°", tex: "\cos 60^\circ = \frac{1}{2}", jee: true, cet: true, important: true },
          { label: "cos 90°", tex: "\cos 90^\circ = 0", jee: true, cet: true, important: true },
          { label: "tan 0°", tex: "\tan 0^\circ = 0", jee: true, cet: true, important: true },
          { label: "tan 30°", tex: "\tan 30^\circ = \frac{1}{\sqrt{3}}", jee: true, cet: true, important: true },
          { label: "tan 45°", tex: "\tan 45^\circ = 1", jee: true, cet: true, important: true },
          { label: "tan 60°", tex: "\tan 60^\circ = \sqrt{3}", jee: true, cet: true, important: true },
          { label: "tan 90°", tex: "\tan 90^\circ = \infty", jee: true, cet: true, important: true },
        ],
        notes: [
          "Click the 📐 Trig button in the top bar for the full interactive trigonometric values table.",
          "Memorize sin/cos/tan for 0°, 30°, 45°, 60°, 90° — these appear in almost every JEE/CET paper.",
          "ASTC rule: All positive (Q1), Sin positive (Q2), Tan positive (Q3), Cos positive (Q4).",
          "For angles > 90°, use reference angle and apply ASTC sign rules.",
          "Complementary angles: sin(90°–θ) = cos θ, cos(90°–θ) = sin θ, tan(90°–θ) = cot θ.",
        ],
        mistakes: ["Confusing sin 30° (1/2) with sin 60° (√3/2)", "Forgetting sign changes in Q2/Q3/Q4"],
        tricks: ["Remember: sin increases 0→1, cos decreases 1→0 from 0° to 90°", "tan = sin/cos — derive if you forget"],
      },
      {
        title: "Fundamental Identities",
        formulas: [
          { label: "Pythagorean identity", tex: "\\sin^2\\theta + \\cos^2\\theta = 1", jee: true, cet: true, important: true },
          { label: "tan identity", tex: "1 + \\tan^2\\theta = \\sec^2\\theta", jee: true, cet: true },
          { label: "cot identity", tex: "1 + \\cot^2\\theta = \\csc^2\\theta", jee: true, cet: true },
          { label: "sin(A±B)", tex: "\\sin(A \\pm B) = \\sin A\\cos B \\pm \\cos A\\sin B", jee: true, cet: true, important: true },
          { label: "cos(A±B)", tex: "\\cos(A \\pm B) = \\cos A\\cos B \\mp \\sin A\\sin B", jee: true, cet: true, important: true },
          { label: "tan(A+B)", tex: "\\tan(A+B) = \\frac{\\tan A + \\tan B}{1 - \\tan A \\tan B}", jee: true, cet: true },
          { label: "tan(A-B)", tex: "\\tan(A-B) = \\frac{\\tan A - \\tan B}{1 + \\tan A \\tan B}", jee: true, cet: true },
          { label: "Double angle: sin", tex: "\\sin 2A = 2\\sin A\\cos A", jee: true, cet: true, important: true },
          { label: "Double angle: cos", tex: "\\cos 2A = \\cos^2 A - \\sin^2 A = 2\\cos^2 A - 1 = 1 - 2\\sin^2 A", jee: true, cet: true, important: true },
          { label: "Double angle: tan", tex: "\\tan 2A = \\frac{2\\tan A}{1-\\tan^2 A}", jee: true, cet: true },
          { label: "Half angle sin²", tex: "\\sin^2 A = \\frac{1 - \\cos 2A}{2}", jee: true, cet: true, important: true },
          { label: "Half angle cos²", tex: "\\cos^2 A = \\frac{1 + \\cos 2A}{2}", jee: true, cet: true, important: true },
          { label: "Product to sum: sin·cos", tex: "2\\sin A\\cos B = \\sin(A+B) + \\sin(A-B)", jee: true, cet: true },
          { label: "Sum to product: sin+sin", tex: "\\sin C + \\sin D = 2\\sin\\frac{C+D}{2}\\cos\\frac{C-D}{2}", jee: true, cet: true, important: true },
          { label: "Sum to product: cos+cos", tex: "\\cos C + \\cos D = 2\\cos\\frac{C+D}{2}\\cos\\frac{C-D}{2}", jee: true, cet: true },
          { label: "Triple angle: sin", tex: "\\sin 3A = 3\\sin A - 4\\sin^3 A", jee: true, cet: true },
          { label: "Triple angle: cos", tex: "\\cos 3A = 4\\cos^3 A - 3\\cos A", jee: true, cet: true },
          { label: "Triple angle: tan", tex: "\\tan 3A = \\frac{3\\tan A - \\tan^3 A}{1 - 3\\tan^2 A}", jee: true, cet: false },
        ],
        notes: [
          "ASTC rule: All positive (Q1), Sin positive (Q2), Tan positive (Q3), Cos positive (Q4)",
          "sin is odd: sin(−θ) = −sinθ; cos is even: cos(−θ) = cosθ",
          "sin 30° = 1/2, sin 45° = 1/√2, sin 60° = √3/2",
          "Range: sin, cos ∈ [−1, 1]; tan, cot ∈ (−∞, ∞); sec, csc ∈ (−∞,−1]∪[1,∞)",
        ],
        mistakes: ["Wrong sign in cos(A−B) vs cos(A+B)", "Forgetting which quadrant determines sign"],
        tricks: ["ASTC — All Students Take Calculus: which functions positive in each quadrant"],
      },
      {
        title: "Inverse Trig & Solutions",
        formulas: [
          { label: "sin⁻¹ range", tex: "\\sin^{-1}: \\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]", jee: true, cet: true },
          { label: "cos⁻¹ range", tex: "\\cos^{-1}: [0, \\pi]", jee: true, cet: true },
          { label: "tan⁻¹ range", tex: "\\tan^{-1}: \\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)", jee: true, cet: true },
          { label: "sin⁻¹ + cos⁻¹", tex: "\\sin^{-1}x + \\cos^{-1}x = \\frac{\\pi}{2}", jee: true, cet: true, important: true },
          { label: "tan⁻¹ + cot⁻¹", tex: "\\tan^{-1}x + \\cot^{-1}x = \\frac{\\pi}{2}", jee: true, cet: true },
          { label: "tan⁻¹x + tan⁻¹y", tex: "\\tan^{-1}x + \\tan^{-1}y = \\tan^{-1}\\frac{x+y}{1-xy} \\quad (xy<1)", jee: true, cet: true, important: true },
          { label: "General solution: sinθ = sinα", tex: "\\theta = n\\pi + (-1)^n \\alpha", jee: true, cet: false },
          { label: "General solution: cosθ = cosα", tex: "\\theta = 2n\\pi \\pm \\alpha", jee: true, cet: false },
          { label: "General solution: tanθ = tanα", tex: "\\theta = n\\pi + \\alpha", jee: true, cet: false },
          { label: "Sine rule", tex: "\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R", jee: true, cet: true, important: true },
          { label: "Cosine rule", tex: "\\cos A = \\frac{b^2 + c^2 - a^2}{2bc}", jee: true, cet: true, important: true },
        ],
        notes: [
          "Principal value: unique value in restricted range",
          "R = circumradius of triangle",
          "For tan⁻¹x + tan⁻¹y: if xy > 1 and x, y > 0: add π",
        ],
        mistakes: ["Wrong range for inverse trig functions", "Forgetting adjustment for tan⁻¹ sum when xy > 1"],
        tricks: ["sin⁻¹(sinx) = x only when x ∈ [−π/2, π/2]"],
      },
    ],
  },
  {
    id: "pnc",
    title: "Permutations & Combinations",
    tags: ["JEE", "CET"],
    weightage: { jee: "4%", cet: "5%" },
    sections: [
      {
        title: "Core Formulas",
        formulas: [
          { label: "Factorial", tex: "n! = n \\times (n-1) \\times \\cdots \\times 1", jee: true, cet: true },
          { label: "Permutation", tex: "^nP_r = \\frac{n!}{(n-r)!}", jee: true, cet: true, important: true },
          { label: "Combination", tex: "^nC_r = \\frac{n!}{r!(n-r)!}", jee: true, cet: true, important: true },
          { label: "Symmetry", tex: "^nC_r = {}^nC_{n-r}", jee: true, cet: true },
          { label: "Pascal identity", tex: "^nC_r + {}^nC_{r-1} = {}^{n+1}C_r", jee: true, cet: true },
          { label: "Sum of combinations", tex: "\\sum_{r=0}^{n} {}^nC_r = 2^n", jee: true, cet: true, important: true },
          { label: "Circular permutation", tex: "(n-1)!", jee: true, cet: true },
          { label: "Circular with identical orientation", tex: "\\frac{(n-1)!}{2}", jee: true, cet: false },
          { label: "Arrangements with repetition", tex: "n^r", jee: true, cet: true },
          { label: "Derangements", tex: "D_n = n!\\sum_{k=0}^{n}\\frac{(-1)^k}{k!}", jee: true, cet: false },
        ],
        notes: [
          "0! = 1 by definition",
          "nCr = 0 when r > n",
          "Circular permutation: fix one person, arrange rest",
          "Identical objects: n!/(p!q!r!) where p, q, r are counts of each identical type",
        ],
        mistakes: ["Circular arrangement: forgetting to divide by n", "Using permutation when order doesn't matter"],
        tricks: ["Gap method: n objects, place r in n+1 gaps → ⁽ⁿ⁺¹⁾Cᵣ"],
      },
    ],
  },
  {
    id: "probability",
    title: "Probability",
    tags: ["JEE", "CET"],
    weightage: { jee: "4%", cet: "5%" },
    sections: [
      {
        title: "Probability Fundamentals",
        formulas: [
          { label: "Classical probability", tex: "P(A) = \\frac{\\text{favorable outcomes}}{\\text{total outcomes}}", jee: true, cet: true, important: true },
          { label: "Complementary", tex: "P(A') = 1 - P(A)", jee: true, cet: true },
          { label: "Addition rule", tex: "P(A\\cup B) = P(A) + P(B) - P(A\\cap B)", jee: true, cet: true, important: true },
          { label: "Mutually exclusive", tex: "P(A\\cup B) = P(A) + P(B)", jee: true, cet: true },
          { label: "Conditional probability", tex: "P(A|B) = \\frac{P(A\\cap B)}{P(B)}", jee: true, cet: true, important: true },
          { label: "Multiplication rule", tex: "P(A\\cap B) = P(A) \\cdot P(B|A)", jee: true, cet: true },
          { label: "Independent events", tex: "P(A\\cap B) = P(A) \\cdot P(B)", jee: true, cet: true, important: true },
          { label: "Bayes' theorem", tex: "P(A_i|B) = \\frac{P(A_i)P(B|A_i)}{\\sum_j P(A_j)P(B|A_j)}", jee: true, cet: false },
          { label: "Total probability", tex: "P(B) = \\sum_i P(A_i)\\cdot P(B|A_i)", jee: true, cet: false },
        ],
        notes: [
          "0 ≤ P(A) ≤ 1 always",
          "P(S) = 1, P(∅) = 0",
          "Mutually exclusive ≠ independent",
          "Odds in favor: P(A)/P(A') = favorable:unfavorable",
        ],
        mistakes: ["Confusing mutually exclusive with independent", "Adding probabilities of non-mutually exclusive events"],
        tricks: ["P(at least one) = 1 − P(none) — much easier"],
      },
    ],
  },
  {
    id: "prob_dist",
    title: "Probability Distribution & Binomial",
    tags: ["JEE", "CET"],
    weightage: { jee: "3%", cet: "4%" },
    sections: [
      {
        title: "Discrete Distributions",
        formulas: [
          { label: "Expected value", tex: "E(X) = \\mu = \\sum x_i \\cdot P(x_i)", jee: true, cet: true, important: true },
          { label: "Variance", tex: "\\text{Var}(X) = E(X^2) - [E(X)]^2", jee: true, cet: true, important: true },
          { label: "Standard deviation", tex: "\\sigma = \\sqrt{\\text{Var}(X)}", jee: true, cet: true },
          { label: "Binomial: P(X=r)", tex: "P(X=r) = {}^nC_r p^r q^{n-r}, \\quad q = 1-p", jee: true, cet: true, important: true },
          { label: "Binomial mean", tex: "\\mu = np", jee: true, cet: true, important: true },
          { label: "Binomial variance", tex: "\\sigma^2 = npq", jee: true, cet: true, important: true },
          { label: "Binomial SD", tex: "\\sigma = \\sqrt{npq}", jee: true, cet: true },
          { label: "Most probable value (binomial)", tex: "r = (n+1)p - 1 \\text{ to } (n+1)p", jee: true, cet: false },
        ],
        notes: [
          "Binomial: fixed n trials, independent, constant p",
          "n trials, p = success probability, q = 1−p = failure probability",
          "Mean > Variance: not binomial",
          "Poisson: λ = np (rare events, large n, small p)",
        ],
        mistakes: ["Using np as variance (it's npq)", "Forgetting q = 1−p"],
        tricks: ["Mean = np, Variance = npq, SD = √(npq) — the three binomial constants"],
      },
    ],
  },
  {
    id: "matrices",
    title: "Matrices",
    tags: ["JEE", "CET"],
    weightage: { jee: "3%", cet: "4%" },
    sections: [
      {
        title: "Matrix Algebra",
        formulas: [
          { label: "Matrix addition", tex: "(A+B)_{ij} = A_{ij} + B_{ij}", jee: true, cet: true },
          { label: "Matrix multiplication", tex: "(AB)_{ij} = \\sum_k A_{ik}B_{kj}", jee: true, cet: true },
          { label: "Transpose", tex: "(A^T)_{ij} = A_{ji}", jee: true, cet: true },
          { label: "(AB)T", tex: "(AB)^T = B^T A^T", jee: true, cet: true, important: true },
          { label: "Symmetric matrix", tex: "A^T = A", jee: true, cet: true },
          { label: "Skew-symmetric", tex: "A^T = -A \\Rightarrow a_{ii} = 0", jee: true, cet: true },
          { label: "Orthogonal matrix", tex: "A^T A = AA^T = I \\Rightarrow A^T = A^{-1}", jee: true, cet: false },
          { label: "Inverse (2×2)", tex: "A^{-1} = \\frac{1}{|A|}\\begin{bmatrix}d & -b\\\\ -c & a\\end{bmatrix}", jee: true, cet: true, important: true },
          { label: "A·A⁻¹", tex: "AA^{-1} = A^{-1}A = I", jee: true, cet: true },
          { label: "Trace", tex: "\\text{tr}(A) = \\sum_i a_{ii}", jee: true, cet: false },
        ],
        notes: [
          "m×n matrix: m rows, n columns; AB defined if inner dimensions match",
          "AB ≠ BA in general (matrix multiplication non-commutative)",
          "Null matrix: all entries 0; Identity: diagonal 1s, rest 0",
          "A matrix is invertible iff |A| ≠ 0",
          "Every square matrix = symmetric part + skew-symmetric part",
        ],
        mistakes: ["AB = BA assumption", "Wrong order in (AB)T = BT AT"],
        tricks: ["(AB)T = BT AT — order reverses! Same as (AB)⁻¹ = B⁻¹A⁻¹"],
      },
    ],
  },
  {
    id: "determinants",
    title: "Determinants",
    tags: ["JEE", "CET"],
    weightage: { jee: "3%", cet: "4%" },
    sections: [
      {
        title: "Determinant Properties & System of Equations",
        formulas: [
          { label: "2×2 determinant", tex: "\\begin{vmatrix}a & b\\\\ c & d\\end{vmatrix} = ad - bc", jee: true, cet: true, important: true },
          { label: "3×3 expansion", tex: "|A| = a_{11}M_{11} - a_{12}M_{12} + a_{13}M_{13}", jee: true, cet: true },
          { label: "|kA| for n×n", tex: "|kA| = k^n |A|", jee: true, cet: true, important: true },
          { label: "Transpose property", tex: "|A^T| = |A|", jee: true, cet: true },
          { label: "Product", tex: "|AB| = |A||B|", jee: true, cet: true, important: true },
          { label: "Area of triangle", tex: "\\Delta = \\frac{1}{2}\\begin{vmatrix}x_1 & y_1 & 1\\\\ x_2 & y_2 & 1\\\\ x_3 & y_3 & 1\\end{vmatrix}", jee: true, cet: true, important: true },
          { label: "Cramer's rule", tex: "x = \\frac{D_x}{D}, \\; y = \\frac{D_y}{D}, \\; z = \\frac{D_z}{D}", jee: true, cet: true, important: true },
          { label: "Adjugate", tex: "A^{-1} = \\frac{1}{|A|}\\text{adj}(A)", jee: true, cet: true },
        ],
        notes: [
          "If two rows/columns are identical: |A| = 0",
          "Row/column swap: |A| changes sign",
          "Row/column scalar multiplication: |A| multiplied by that scalar",
          "D = 0, Dx = Dy = Dz = 0: infinite solutions",
          "D = 0, any Di ≠ 0: no solution",
          "D ≠ 0: unique solution",
        ],
        mistakes: ["Forgetting sign in cofactor expansion", "Multiplying entire determinant by k instead of just one row"],
        tricks: ["Sarrus rule for 3×3: fast diagonal expansion"],
      },
    ],
  },
  {
    id: "straight_lines",
    title: "Straight Lines",
    tags: ["JEE", "CET"],
    weightage: { jee: "3%", cet: "4%" },
    sections: [
      {
        title: "Equations & Properties",
        formulas: [
          { label: "Distance formula", tex: "d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}", jee: true, cet: true },
          { label: "Section formula (internal)", tex: "\\left(\\frac{m x_2 + n x_1}{m+n}, \\frac{m y_2 + n y_1}{m+n}\\right)", jee: true, cet: true },
          { label: "Slope", tex: "m = \\tan\\theta = \\frac{y_2 - y_1}{x_2 - x_1}", jee: true, cet: true },
          { label: "Slope-intercept form", tex: "y = mx + c", jee: true, cet: true, important: true },
          { label: "Point-slope form", tex: "y - y_1 = m(x - x_1)", jee: true, cet: true },
          { label: "Two-intercept form", tex: "\\frac{x}{a} + \\frac{y}{b} = 1", jee: true, cet: true },
          { label: "General form", tex: "ax + by + c = 0", jee: true, cet: true },
          { label: "Distance: point to line", tex: "d = \\frac{|ax_1 + by_1 + c|}{\\sqrt{a^2+b^2}}", jee: true, cet: true, important: true },
          { label: "Angle between lines", tex: "\\tan\\theta = \\left|\\frac{m_1 - m_2}{1 + m_1 m_2}\\right|", jee: true, cet: true, important: true },
          { label: "Parallel lines condition", tex: "m_1 = m_2", jee: true, cet: true },
          { label: "Perpendicular lines condition", tex: "m_1 m_2 = -1", jee: true, cet: true, important: true },
          { label: "Foot of perpendicular", tex: "\\frac{x-x_1}{a} = \\frac{y-y_1}{b} = -\\frac{ax_1+by_1+c}{a^2+b^2}", jee: true, cet: false },
        ],
        notes: [
          "Concurrent lines: all pass through one point",
          "Collinear points: area of triangle = 0",
          "Family of lines: L₁ + λL₂ = 0",
        ],
        mistakes: ["Wrong sign in distance formula (must use absolute value)", "Confusing parallel (m₁=m₂) with coincident (ratio condition)"],
        tricks: ["Three lines concurrent ⟺ determinant of coefficients = 0"],
      },
    ],
  },
  {
    id: "pair_lines",
    title: "Pair of Straight Lines",
    tags: ["JEE", "CET"],
    weightage: { jee: "2%", cet: "3%" },
    sections: [
      {
        title: "Combined Equation",
        formulas: [
          { label: "General pair", tex: "ax^2 + 2hxy + by^2 = 0", jee: true, cet: true, important: true },
          { label: "Sum of slopes", tex: "m_1 + m_2 = -\\frac{2h}{b}", jee: true, cet: true },
          { label: "Product of slopes", tex: "m_1 m_2 = \\frac{a}{b}", jee: true, cet: true },
          { label: "Angle between pair", tex: "\\tan\\theta = \\frac{2\\sqrt{h^2-ab}}{a+b}", jee: true, cet: true, important: true },
          { label: "Condition for perpendicular", tex: "a + b = 0", jee: true, cet: true, important: true },
          { label: "Condition for coincident", tex: "h^2 = ab", jee: true, cet: true },
          { label: "General 2nd degree conic", tex: "ax^2 + 2hxy + by^2 + 2gx + 2fy + c = 0", jee: true, cet: true },
          { label: "Condition: pair of lines (Δ=0)", tex: "\\Delta = abc + 2fgh - af^2 - bg^2 - ch^2 = 0", jee: true, cet: true, important: true },
          { label: "Angle bisectors", tex: "\\frac{x^2 - y^2}{a - b} = \\frac{xy}{h}", jee: true, cet: true },
        ],
        notes: [
          "ax² + 2hxy + by² = 0: homogeneous (passes through origin)",
          "Pair of lines: one is y = m₁x, other y = m₂x",
          "h² > ab: real and distinct lines; h² = ab: coincident; h² < ab: imaginary",
        ],
        mistakes: ["Confusing angle bisector formula", "Using wrong Δ formula for 2nd degree"],
        tricks: ["θ = 90° iff a + b = 0 — perpendicular pair condition"],
      },
    ],
  },
  {
    id: "circles",
    title: "Circles",
    tags: ["JEE", "CET"],
    weightage: { jee: "3%", cet: "4%" },
    sections: [
      {
        title: "Equations & Properties",
        formulas: [
          { label: "Standard form", tex: "(x-h)^2 + (y-k)^2 = r^2", jee: true, cet: true, important: true },
          { label: "General form", tex: "x^2 + y^2 + 2gx + 2fy + c = 0", jee: true, cet: true, important: true },
          { label: "Center & radius (general)", tex: "\\text{Center}=(-g,-f), \\; r=\\sqrt{g^2+f^2-c}", jee: true, cet: true, important: true },
          { label: "Tangent at point (x₁,y₁)", tex: "xx_1 + yy_1 + g(x+x_1) + f(y+y_1) + c = 0", jee: true, cet: true, important: true },
          { label: "Length of tangent", tex: "L = \\sqrt{x_1^2 + y_1^2 + 2gx_1 + 2fy_1 + c}", jee: true, cet: true },
          { label: "Chord of contact", tex: "xx_1 + yy_1 = r^2 \\text{ (from external point)}", jee: true, cet: true },
          { label: "Power of a point", tex: "= x_1^2 + y_1^2 + 2gx_1 + 2fy_1 + c", jee: true, cet: false },
          { label: "Radical axis", tex: "S_1 - S_2 = 0", jee: true, cet: false },
          { label: "Family of circles", tex: "S_1 + \\lambda S_2 = 0 \\text{ (through intersection)}", jee: true, cet: false },
        ],
        notes: [
          "Circle passes through origin: c = 0",
          "Circle touches x-axis: |f| = √(g²+f²−c) → f² = c",
          "Circle touches y-axis: g² = c",
          "Two circles intersect: |r₁−r₂| < d < r₁+r₂",
          "External tangency: d = r₁+r₂; Internal: d = |r₁−r₂|",
        ],
        mistakes: ["Sign of center in general form: (−g, −f) not (g, f)", "Wrong radius formula"],
        tricks: ["Tangent at origin on x² + y² = r²: tangent is x = 0 or y = 0 (axis)"],
      },
    ],
  },
  {
    id: "conics",
    title: "Conic Sections",
    tags: ["JEE", "CET"],
    weightage: { jee: "4%", cet: "5%" },
    sections: [
      {
        title: "Parabola, Ellipse & Hyperbola",
        formulas: [
          { label: "Parabola: standard", tex: "y^2 = 4ax", jee: true, cet: true, important: true },
          { label: "Focus & directrix (y²=4ax)", tex: "\\text{Focus}=(a,0), \\; x=-a", jee: true, cet: true },
          { label: "Ellipse: standard", tex: "\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1, \\; a>b", jee: true, cet: true, important: true },
          { label: "Ellipse: foci", tex: "c = \\sqrt{a^2 - b^2}, \\; e = \\frac{c}{a} < 1", jee: true, cet: true, important: true },
          { label: "Ellipse: sum of focal distances", tex: "PF_1 + PF_2 = 2a", jee: true, cet: true, important: true },
          { label: "Hyperbola: standard", tex: "\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1", jee: true, cet: true, important: true },
          { label: "Hyperbola: relation", tex: "b^2 = a^2(e^2-1), \\; e>1", jee: true, cet: true },
          { label: "Rectangular hyperbola", tex: "xy = c^2", jee: true, cet: true },
          { label: "Hyperbola: asymptotes", tex: "y = \\pm \\frac{b}{a}x", jee: true, cet: true },
          { label: "Parabola tangent (y²=4ax)", tex: "y = mx + \\frac{a}{m}", jee: true, cet: true },
          { label: "Ellipse tangent", tex: "\\frac{xx_1}{a^2} + \\frac{yy_1}{b^2} = 1", jee: true, cet: true },
          { label: "Directrix of ellipse", tex: "x = \\pm \\frac{a}{e}", jee: true, cet: false },
        ],
        notes: [
          "Eccentricity: e = 0 (circle), 0 < e < 1 (ellipse), e = 1 (parabola), e > 1 (hyperbola)",
          "Latus rectum (y²=4ax): length = 4a",
          "Latus rectum (ellipse): length = 2b²/a",
          "Conjugate hyperbola: −x²/a² + y²/b² = 1",
        ],
        mistakes: ["Confusing a and b in ellipse (a > b for x²/a² + y²/b² = 1)", "Wrong eccentricity condition"],
        tricks: ["y² = 4ax: vertex at origin, opens right; −4ax: opens left"],
      },
    ],
  },
  {
    id: "vectors",
    title: "Vectors",
    tags: ["JEE", "CET"],
    weightage: { jee: "4%", cet: "5%" },
    sections: [
      {
        title: "Vector Operations",
        formulas: [
          { label: "Magnitude", tex: "|\\vec{a}| = \\sqrt{a_x^2 + a_y^2 + a_z^2}", jee: true, cet: true },
          { label: "Unit vector", tex: "\\hat{a} = \\frac{\\vec{a}}{|\\vec{a}|}", jee: true, cet: true },
          { label: "Dot product", tex: "\\vec{a} \\cdot \\vec{b} = |a||b|\\cos\\theta = a_x b_x + a_y b_y + a_z b_z", jee: true, cet: true, important: true },
          { label: "Cross product magnitude", tex: "|\\vec{a} \\times \\vec{b}| = |a||b|\\sin\\theta", jee: true, cet: true, important: true },
          { label: "Cross product (determinant)", tex: "\\vec{a} \\times \\vec{b} = \\begin{vmatrix}\\hat{i} & \\hat{j} & \\hat{k}\\\\ a_1 & a_2 & a_3\\\\ b_1 & b_2 & b_3\\end{vmatrix}", jee: true, cet: true },
          { label: "Scalar triple product", tex: "[\\vec{a}\\, \\vec{b}\\, \\vec{c}] = \\vec{a}\\cdot(\\vec{b}\\times\\vec{c})", jee: true, cet: false },
          { label: "Volume of parallelepiped", tex: "V = |[\\vec{a}\\, \\vec{b}\\, \\vec{c}]|", jee: true, cet: false },
          { label: "Projection of a on b", tex: "\\text{proj} = \\frac{\\vec{a}\\cdot\\vec{b}}{|\\vec{b}|}", jee: true, cet: true },
          { label: "Area of triangle", tex: "= \\frac{1}{2}|\\vec{AB} \\times \\vec{AC}|", jee: true, cet: true, important: true },
          { label: "Area of parallelogram", tex: "= |\\vec{a} \\times \\vec{b}|", jee: true, cet: true },
          { label: "Angle between vectors", tex: "\\cos\\theta = \\frac{\\vec{a}\\cdot\\vec{b}}{|a||b|}", jee: true, cet: true, important: true },
          { label: "Perpendicular condition", tex: "\\vec{a}\\cdot\\vec{b} = 0", jee: true, cet: true, important: true },
          { label: "Parallel condition", tex: "\\vec{a}\\times\\vec{b} = \\vec{0}", jee: true, cet: true },
          { label: "Position vector division", tex: "\\vec{r} = \\frac{m\\vec{b}+n\\vec{a}}{m+n}", jee: true, cet: true },
        ],
        notes: [
          "î·î = ĵ·ĵ = k̂·k̂ = 1; î·ĵ = 0",
          "î×ĵ = k̂; ĵ×k̂ = î; k̂×î = ĵ",
          "Dot product is commutative; cross product is anti-commutative",
          "a×b = −b×a",
          "Coplanar vectors: [a b c] = 0",
        ],
        mistakes: ["Dot product gives scalar; cross product gives vector", "Wrong sign: a×b = −(b×a)"],
        tricks: ["î×ĵ=k̂: cyclic right-hand rule; reversing order negates"],
      },
    ],
  },
  {
    id: "3d_geometry",
    title: "3D Geometry",
    tags: ["JEE", "CET"],
    weightage: { jee: "5%", cet: "6%" },
    sections: [
      {
        title: "Direction Cosines & Direction Ratios",
        formulas: [
          { label: "Direction cosines", tex: "l = \\cos\\alpha,\\; m = \\cos\\beta,\\; n = \\cos\\gamma", jee: true, cet: true, important: true },
          { label: "DC relation", tex: "l^2 + m^2 + n^2 = 1", jee: true, cet: true, important: true },
          { label: "DC from DR", tex: "l = \\frac{a}{\\sqrt{a^2+b^2+c^2}},\\; m = \\frac{b}{\\sqrt{a^2+b^2+c^2}},\\; n = \\frac{c}{\\sqrt{a^2+b^2+c^2}}", jee: true, cet: true },
          { label: "Angle between two lines (DC)", tex: "\\cos\\theta = l_1 l_2 + m_1 m_2 + n_1 n_2", jee: true, cet: true, important: true },
          { label: "Angle between two lines (DR)", tex: "\\cos\\theta = \\frac{a_1 a_2 + b_1 b_2 + c_1 c_2}{\\sqrt{a_1^2+b_1^2+c_1^2}\\sqrt{a_2^2+b_2^2+c_2^2}}", jee: true, cet: true },
          { label: "Perpendicular lines (DR)", tex: "a_1 a_2 + b_1 b_2 + c_1 c_2 = 0", jee: true, cet: true },
          { label: "Parallel lines (DR)", tex: "\\frac{a_1}{a_2} = \\frac{b_1}{b_2} = \\frac{c_1}{c_2}", jee: true, cet: true },
        ],
        notes: [
          "Direction cosines are the cosines of angles made with +ve x, y, z axes",
          "Direction ratios are proportional to direction cosines",
          "If (l,m,n) are DC then (al, am, an) are DR for any a ≠ 0",
        ],
        mistakes: ["Confusing DC and DR — DC must satisfy l²+m²+n²=1", "Wrong sign of angle between lines"],
        tricks: ["DC = unit vector components along the line"],
      },
      {
        title: "Lines in 3D",
        formulas: [
          { label: "Vector form of line", tex: "\\vec{r} = \\vec{a} + \\lambda\\vec{b}", jee: true, cet: true, important: true },
          { label: "Cartesian form (symmetric)", tex: "\\frac{x-x_1}{a} = \\frac{y-y_1}{b} = \\frac{z-z_1}{c}", jee: true, cet: true, important: true },
          { label: "Line through two points (vector)", tex: "\\vec{r} = \\vec{a} + \\lambda(\\vec{b}-\\vec{a})", jee: true, cet: true },
          { label: "Line through two points (Cartesian)", tex: "\\frac{x-x_1}{x_2-x_1} = \\frac{y-y_1}{y_2-y_1} = \\frac{z-z_1}{z_2-z_1}", jee: true, cet: true },
          { label: "Shortest distance (skew lines, vector)", tex: "d = \\frac{|(\\vec{b_2}-\\vec{b_1})\\cdot(\\vec{d_1}\\times\\vec{d_2})|}{|\\vec{d_1}\\times\\vec{d_2}|}", jee: true, cet: false, important: true },
          { label: "Shortest distance (parallel lines)", tex: "d = \\frac{|\\vec{AB}\\times\\vec{b}|}{|\\vec{b}|}", jee: true, cet: false },
          { label: "Condition for coplanar lines", tex: "(\\vec{b_2}-\\vec{b_1})\\cdot(\\vec{d_1}\\times\\vec{d_2}) = 0", jee: true, cet: false },
        ],
        notes: [
          "Skew lines: non-intersecting, non-parallel — unique to 3D",
          "Shortest distance between skew lines is along the common perpendicular",
          "Coplanar lines: intersecting or parallel",
        ],
        mistakes: ["Trying to find intersection of skew lines — they don't intersect", "Wrong numerator in skew-line distance formula"],
        tricks: ["If cross product of direction vectors = 0 → lines are parallel"],
      },
      {
        title: "Planes in 3D",
        formulas: [
          { label: "General equation of plane", tex: "ax + by + cz + d = 0", jee: true, cet: true, important: true },
          { label: "Normal form of plane", tex: "\\hat{n}\\cdot\\vec{r} = p \\text{ (p = distance from origin)}", jee: true, cet: true },
          { label: "Intercept form", tex: "\\frac{x}{a} + \\frac{y}{b} + \\frac{z}{c} = 1", jee: true, cet: true },
          { label: "Plane through 3 points (vector)", tex: "(\\vec{r}-\\vec{a})\\cdot[(\\vec{b}-\\vec{a})\\times(\\vec{c}-\\vec{a})] = 0", jee: true, cet: false },
          { label: "Distance: point to plane", tex: "d = \\frac{|ax_1+by_1+cz_1+d|}{\\sqrt{a^2+b^2+c^2}}", jee: true, cet: true, important: true },
          { label: "Angle between two planes", tex: "\\cos\\theta = \\frac{|a_1 a_2+b_1 b_2+c_1 c_2|}{\\sqrt{\\sum a_1^2}\\sqrt{\\sum a_2^2}}", jee: true, cet: true, important: true },
          { label: "Angle between line and plane", tex: "\\sin\\theta = \\frac{|al+bm+cn|}{\\sqrt{a^2+b^2+c^2}\\sqrt{l^2+m^2+n^2}}", jee: true, cet: true, important: true },
          { label: "Perpendicular planes condition", tex: "a_1 a_2 + b_1 b_2 + c_1 c_2 = 0", jee: true, cet: true },
          { label: "Parallel planes condition", tex: "\\frac{a_1}{a_2} = \\frac{b_1}{b_2} = \\frac{c_1}{c_2} \\neq \\frac{d_1}{d_2}", jee: true, cet: true },
          { label: "Equation of plane parallel to given, through point", tex: "a(x-x_1)+b(y-y_1)+c(z-z_1) = 0", jee: true, cet: true },
          { label: "Family of planes through intersection", tex: "P_1 + \\lambda P_2 = 0", jee: true, cet: false },
        ],
        notes: [
          "Normal vector to ax+by+cz+d=0 is (a, b, c)",
          "Two planes are perpendicular if dot product of normals = 0",
          "Two planes are parallel if normals are proportional",
          "Foot of perpendicular from (x₁,y₁,z₁) to plane: use parametric method",
        ],
        mistakes: ["Using angle between planes formula for line-plane angle (use sinθ for line-plane)", "Not using absolute value in distance formula"],
        tricks: ["Distance from origin to ax+by+cz+d=0 is |d|/√(a²+b²+c²)"],
      },
      {
        title: "Sphere & Miscellaneous",
        formulas: [
          { label: "Equation of sphere (center-radius)", tex: "(x-a)^2+(y-b)^2+(z-c)^2 = r^2", jee: true, cet: false },
          { label: "General sphere equation", tex: "x^2+y^2+z^2+2ux+2vy+2wz+d=0", jee: true, cet: false },
          { label: "Center & radius of sphere", tex: "\\text{Center}=(-u,-v,-w),\\; r=\\sqrt{u^2+v^2+w^2-d}", jee: true, cet: false },
          { label: "3D distance formula", tex: "d=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}", jee: true, cet: true, important: true },
          { label: "Midpoint in 3D", tex: "M = \\left(\\frac{x_1+x_2}{2},\\frac{y_1+y_2}{2},\\frac{z_1+z_2}{2}\\right)", jee: true, cet: true },
          { label: "Section formula in 3D", tex: "P = \\left(\\frac{mx_2+nx_1}{m+n},\\frac{my_2+ny_1}{m+n},\\frac{mz_2+nz_1}{m+n}\\right)", jee: true, cet: true },
          { label: "Centroid of tetrahedron", tex: "G = \\left(\\frac{x_1+x_2+x_3+x_4}{4},\\frac{y_1+\\ldots}{4},\\frac{z_1+\\ldots}{4}\\right)", jee: true, cet: false },
        ],
        notes: [
          "Sphere passes through origin if d = 0",
          "Centroid of triangle in 3D: ((x₁+x₂+x₃)/3, (y₁+y₂+y₃)/3, (z₁+z₂+z₃)/3)",
          "Volume of tetrahedron = (1/6)|[AB AC AD]| (scalar triple product)",
        ],
        mistakes: ["Using 2D distance in 3D — must include z-component", "Sphere center sign: (−u,−v,−w) not (u,v,w)"],
        tricks: ["3D geometry largely extends 2D: replace (x,y) with (x,y,z) and add z-terms"],
      },
    ],
  },
];

// ─── CONSTANTS DATA ─────────────────────────────────────────────────────────
const CONSTANTS_DATA = {
  physics: [
    { symbol: "c", name: "Speed of light", value: "3 × 10⁸ m/s", tex: "c = 3 \\times 10^8 \\text{ m/s}" },
    { symbol: "g", name: "Acceleration due to gravity", value: "9.8 m/s² ≈ 10 m/s²", tex: "g = 9.8 \\text{ m/s}^2" },
    { symbol: "G", name: "Gravitational constant", value: "6.67 × 10⁻¹¹ N m²/kg²", tex: "G = 6.67 \\times 10^{-11} \\text{ N m}^2/\\text{kg}^2" },
    { symbol: "h", name: "Planck's constant", value: "6.626 × 10⁻³⁴ J·s", tex: "h = 6.626 \\times 10^{-34} \\text{ J·s}" },
    { symbol: "ε₀", name: "Permittivity of free space", value: "8.85 × 10⁻¹² F/m", tex: "\\varepsilon_0 = 8.85 \\times 10^{-12} \\text{ F/m}" },
    { symbol: "μ₀", name: "Permeability of free space", value: "4π × 10⁻⁷ T·m/A", tex: "\\mu_0 = 4\\pi \\times 10^{-7} \\text{ T·m/A}" },
    { symbol: "e", name: "Charge of electron", value: "1.6 × 10⁻¹⁹ C", tex: "e = 1.6 \\times 10^{-19} \\text{ C}" },
    { symbol: "mₑ", name: "Mass of electron", value: "9.11 × 10⁻³¹ kg", tex: "m_e = 9.11 \\times 10^{-31} \\text{ kg}" },
    { symbol: "mₚ", name: "Mass of proton", value: "1.67 × 10⁻²⁷ kg", tex: "m_p = 1.67 \\times 10^{-27} \\text{ kg}" },
    { symbol: "k", name: "Coulomb's constant", value: "9 × 10⁹ N m²/C²", tex: "k = 9 \\times 10^9 \\text{ N m}^2/\\text{C}^2" },
    { symbol: "σ", name: "Stefan-Boltzmann constant", value: "5.67 × 10⁻⁸ W m⁻² K⁻⁴", tex: "\\sigma = 5.67 \\times 10^{-8} \\text{ W m}^{-2}\\text{K}^{-4}" },
    { symbol: "R", name: "Universal gas constant", value: "8.314 J/(mol·K)", tex: "R = 8.314 \\text{ J mol}^{-1}\\text{K}^{-1}" },
    { symbol: "kB", name: "Boltzmann constant", value: "1.38 × 10⁻²³ J/K", tex: "k_B = 1.38 \\times 10^{-23} \\text{ J/K}" },
    { symbol: "1 eV", name: "Electron volt", value: "1.6 × 10⁻¹⁹ J", tex: "1\\text{ eV} = 1.6 \\times 10^{-19} \\text{ J}" },
    { symbol: "1 atm", name: "Standard atmosphere", value: "1.01 × 10⁵ Pa", tex: "1\\text{ atm} = 1.01 \\times 10^5 \\text{ Pa}" },
  ],
  chemistry: [
    { symbol: "NA", name: "Avogadro's number", value: "6.022 × 10²³ mol⁻¹", tex: "N_A = 6.022 \\times 10^{23} \\text{ mol}^{-1}" },
    { symbol: "R", name: "Gas constant", value: "8.314 J/(mol·K) = 0.0821 L·atm/(mol·K)", tex: "R = 8.314 \\text{ J mol}^{-1}\\text{K}^{-1}" },
    { symbol: "Vm(STP)", name: "Molar volume at STP", value: "22.4 L/mol (old) / 22.7 L/mol (IUPAC)", tex: "V_m = 22.4 \\text{ L/mol}" },
    { symbol: "kB", name: "Boltzmann constant", value: "1.38 × 10⁻²³ J/K", tex: "k_B = 1.38 \\times 10^{-23} \\text{ J/K}" },
    { symbol: "h", name: "Planck's constant", value: "6.626 × 10⁻³⁴ J·s", tex: "h = 6.626 \\times 10^{-34} \\text{ J·s}" },
    { symbol: "c", name: "Speed of light", value: "3 × 10⁸ m/s = 3 × 10¹⁰ cm/s", tex: "c = 3 \\times 10^8 \\text{ m/s}" },
    { symbol: "e", name: "Charge of electron", value: "1.6 × 10⁻¹⁹ C", tex: "e = 1.6 \\times 10^{-19} \\text{ C}" },
    { symbol: "mₑ", name: "Mass of electron", value: "9.11 × 10⁻³¹ kg", tex: "m_e = 9.11 \\times 10^{-31} \\text{ kg}" },
    { symbol: "a₀", name: "Bohr radius", value: "0.529 Å", tex: "a_0 = 0.529 \\text{ Å}" },
    { symbol: "RH", name: "Rydberg constant", value: "1.097 × 10⁷ m⁻¹", tex: "R_H = 1.097 \\times 10^7 \\text{ m}^{-1}" },
    { symbol: "F", name: "Faraday constant", value: "96500 C/mol", tex: "F = 96500 \\text{ C/mol}" },
    { symbol: "Kw", name: "Ionic product of water (25°C)", value: "1 × 10⁻¹⁴", tex: "K_w = 10^{-14} \\text{ (at 25°C)}" },
    { symbol: "1 amu", name: "Atomic mass unit", value: "1.66 × 10⁻²⁷ kg", tex: "1\\text{ amu} = 1.66 \\times 10^{-27} \\text{ kg}" },
    { symbol: "1 cal", name: "Calorie", value: "4.184 J", tex: "1\\text{ cal} = 4.184 \\text{ J}" },
  ],
  mathematics: [
    { symbol: "π", name: "Pi", value: "3.14159...", tex: "\\pi = 3.14159\\ldots" },
    { symbol: "e", name: "Euler's number", value: "2.71828...", tex: "e = 2.71828\\ldots" },
    { symbol: "√2", name: "Square root of 2", value: "1.41421...", tex: "\\sqrt{2} = 1.41421\\ldots" },
    { symbol: "√3", name: "Square root of 3", value: "1.73205...", tex: "\\sqrt{3} = 1.73205\\ldots" },
    { symbol: "ln 2", name: "Natural log of 2", value: "0.6931...", tex: "\\ln 2 = 0.6931\\ldots" },
    { symbol: "log 2", name: "Log base 10 of 2", value: "0.3010", tex: "\\log_{10} 2 = 0.3010" },
    { symbol: "log 3", name: "Log base 10 of 3", value: "0.4771", tex: "\\log_{10} 3 = 0.4771" },
    { symbol: "1 radian", name: "Radian to degrees", value: "180°/π ≈ 57.3°", tex: "1 \\text{ rad} = \\frac{180^\\circ}{\\pi} \\approx 57.3^\\circ" },
    { symbol: "sin 30°", name: "sin 30°", value: "1/2", tex: "\\sin 30^\\circ = \\frac{1}{2}" },
    { symbol: "sin 45°", name: "sin 45°", value: "1/√2 ≈ 0.707", tex: "\\sin 45^\\circ = \\frac{1}{\\sqrt{2}}" },
    { symbol: "sin 60°", name: "sin 60°", value: "√3/2 ≈ 0.866", tex: "\\sin 60^\\circ = \\frac{\\sqrt{3}}{2}" },
    { symbol: "tan 30°", name: "tan 30°", value: "1/√3 ≈ 0.577", tex: "\\tan 30^\\circ = \\frac{1}{\\sqrt{3}}" },
    { symbol: "tan 60°", name: "tan 60°", value: "√3 ≈ 1.732", tex: "\\tan 60^\\circ = \\sqrt{3}" },
  ],
};


// ─── PERIODIC TABLE DATA ────────────────────────────────────────────────────
const PERIODIC_ELEMENTS = [
  {n:1,s:"H",name:"Hydrogen",cat:"nonmetal",row:1,col:1},{n:2,s:"He",name:"Helium",cat:"noble-gas",row:1,col:18},
  {n:3,s:"Li",name:"Lithium",cat:"alkali-metal",row:2,col:1},{n:4,s:"Be",name:"Beryllium",cat:"alkaline-earth",row:2,col:2},{n:5,s:"B",name:"Boron",cat:"metalloid",row:2,col:13},{n:6,s:"C",name:"Carbon",cat:"nonmetal",row:2,col:14},{n:7,s:"N",name:"Nitrogen",cat:"nonmetal",row:2,col:15},{n:8,s:"O",name:"Oxygen",cat:"nonmetal",row:2,col:16},{n:9,s:"F",name:"Fluorine",cat:"halogen",row:2,col:17},{n:10,s:"Ne",name:"Neon",cat:"noble-gas",row:2,col:18},
  {n:11,s:"Na",name:"Sodium",cat:"alkali-metal",row:3,col:1},{n:12,s:"Mg",name:"Magnesium",cat:"alkaline-earth",row:3,col:2},{n:13,s:"Al",name:"Aluminium",cat:"post-transition",row:3,col:13},{n:14,s:"Si",name:"Silicon",cat:"metalloid",row:3,col:14},{n:15,s:"P",name:"Phosphorus",cat:"nonmetal",row:3,col:15},{n:16,s:"S",name:"Sulfur",cat:"nonmetal",row:3,col:16},{n:17,s:"Cl",name:"Chlorine",cat:"halogen",row:3,col:17},{n:18,s:"Ar",name:"Argon",cat:"noble-gas",row:3,col:18},
  {n:19,s:"K",name:"Potassium",cat:"alkali-metal",row:4,col:1},{n:20,s:"Ca",name:"Calcium",cat:"alkaline-earth",row:4,col:2},{n:21,s:"Sc",name:"Scandium",cat:"transition-metal",row:4,col:3},{n:22,s:"Ti",name:"Titanium",cat:"transition-metal",row:4,col:4},{n:23,s:"V",name:"Vanadium",cat:"transition-metal",row:4,col:5},{n:24,s:"Cr",name:"Chromium",cat:"transition-metal",row:4,col:6},{n:25,s:"Mn",name:"Manganese",cat:"transition-metal",row:4,col:7},{n:26,s:"Fe",name:"Iron",cat:"transition-metal",row:4,col:8},{n:27,s:"Co",name:"Cobalt",cat:"transition-metal",row:4,col:9},{n:28,s:"Ni",name:"Nickel",cat:"transition-metal",row:4,col:10},{n:29,s:"Cu",name:"Copper",cat:"transition-metal",row:4,col:11},{n:30,s:"Zn",name:"Zinc",cat:"transition-metal",row:4,col:12},{n:31,s:"Ga",name:"Gallium",cat:"post-transition",row:4,col:13},{n:32,s:"Ge",name:"Germanium",cat:"metalloid",row:4,col:14},{n:33,s:"As",name:"Arsenic",cat:"metalloid",row:4,col:15},{n:34,s:"Se",name:"Selenium",cat:"nonmetal",row:4,col:16},{n:35,s:"Br",name:"Bromine",cat:"halogen",row:4,col:17},{n:36,s:"Kr",name:"Krypton",cat:"noble-gas",row:4,col:18},
  {n:37,s:"Rb",name:"Rubidium",cat:"alkali-metal",row:5,col:1},{n:38,s:"Sr",name:"Strontium",cat:"alkaline-earth",row:5,col:2},{n:39,s:"Y",name:"Yttrium",cat:"transition-metal",row:5,col:3},{n:40,s:"Zr",name:"Zirconium",cat:"transition-metal",row:5,col:4},{n:41,s:"Nb",name:"Niobium",cat:"transition-metal",row:5,col:5},{n:42,s:"Mo",name:"Molybdenum",cat:"transition-metal",row:5,col:6},{n:43,s:"Tc",name:"Technetium",cat:"transition-metal",row:5,col:7},{n:44,s:"Ru",name:"Ruthenium",cat:"transition-metal",row:5,col:8},{n:45,s:"Rh",name:"Rhodium",cat:"transition-metal",row:5,col:9},{n:46,s:"Pd",name:"Palladium",cat:"transition-metal",row:5,col:10},{n:47,s:"Ag",name:"Silver",cat:"transition-metal",row:5,col:11},{n:48,s:"Cd",name:"Cadmium",cat:"transition-metal",row:5,col:12},{n:49,s:"In",name:"Indium",cat:"post-transition",row:5,col:13},{n:50,s:"Sn",name:"Tin",cat:"post-transition",row:5,col:14},{n:51,s:"Sb",name:"Antimony",cat:"metalloid",row:5,col:15},{n:52,s:"Te",name:"Tellurium",cat:"metalloid",row:5,col:16},{n:53,s:"I",name:"Iodine",cat:"halogen",row:5,col:17},{n:54,s:"Xe",name:"Xenon",cat:"noble-gas",row:5,col:18},
  {n:55,s:"Cs",name:"Cesium",cat:"alkali-metal",row:6,col:1},{n:56,s:"Ba",name:"Barium",cat:"alkaline-earth",row:6,col:2},{n:57,s:"La",name:"Lanthanum",cat:"lanthanide",row:6,col:3},{n:72,s:"Hf",name:"Hafnium",cat:"transition-metal",row:6,col:4},{n:73,s:"Ta",name:"Tantalum",cat:"transition-metal",row:6,col:5},{n:74,s:"W",name:"Tungsten",cat:"transition-metal",row:6,col:6},{n:75,s:"Re",name:"Rhenium",cat:"transition-metal",row:6,col:7},{n:76,s:"Os",name:"Osmium",cat:"transition-metal",row:6,col:8},{n:77,s:"Ir",name:"Iridium",cat:"transition-metal",row:6,col:9},{n:78,s:"Pt",name:"Platinum",cat:"transition-metal",row:6,col:10},{n:79,s:"Au",name:"Gold",cat:"transition-metal",row:6,col:11},{n:80,s:"Hg",name:"Mercury",cat:"transition-metal",row:6,col:12},{n:81,s:"Tl",name:"Thallium",cat:"post-transition",row:6,col:13},{n:82,s:"Pb",name:"Lead",cat:"post-transition",row:6,col:14},{n:83,s:"Bi",name:"Bismuth",cat:"post-transition",row:6,col:15},{n:84,s:"Po",name:"Polonium",cat:"metalloid",row:6,col:16},{n:85,s:"At",name:"Astatine",cat:"halogen",row:6,col:17},{n:86,s:"Rn",name:"Radon",cat:"noble-gas",row:6,col:18},
  {n:87,s:"Fr",name:"Francium",cat:"alkali-metal",row:7,col:1},{n:88,s:"Ra",name:"Radium",cat:"alkaline-earth",row:7,col:2},{n:89,s:"Ac",name:"Actinium",cat:"actinide",row:7,col:3},{n:104,s:"Rf",name:"Rutherfordium",cat:"transition-metal",row:7,col:4},{n:105,s:"Db",name:"Dubnium",cat:"transition-metal",row:7,col:5},{n:106,s:"Sg",name:"Seaborgium",cat:"transition-metal",row:7,col:6},{n:107,s:"Bh",name:"Bohrium",cat:"transition-metal",row:7,col:7},{n:108,s:"Hs",name:"Hassium",cat:"transition-metal",row:7,col:8},{n:109,s:"Mt",name:"Meitnerium",cat:"transition-metal",row:7,col:9},{n:110,s:"Ds",name:"Darmstadtium",cat:"transition-metal",row:7,col:10},{n:111,s:"Rg",name:"Roentgenium",cat:"transition-metal",row:7,col:11},{n:112,s:"Cn",name:"Copernicium",cat:"transition-metal",row:7,col:12},{n:113,s:"Nh",name:"Nihonium",cat:"post-transition",row:7,col:13},{n:114,s:"Fl",name:"Flerovium",cat:"post-transition",row:7,col:14},{n:115,s:"Mc",name:"Moscovium",cat:"post-transition",row:7,col:15},{n:116,s:"Lv",name:"Livermorium",cat:"post-transition",row:7,col:16},{n:117,s:"Ts",name:"Tennessine",cat:"halogen",row:7,col:17},{n:118,s:"Og",name:"Oganesson",cat:"noble-gas",row:7,col:18},
  {n:58,s:"Ce",name:"Cerium",cat:"lanthanide",row:8,col:4},{n:59,s:"Pr",name:"Praseodymium",cat:"lanthanide",row:8,col:5},{n:60,s:"Nd",name:"Neodymium",cat:"lanthanide",row:8,col:6},{n:61,s:"Pm",name:"Promethium",cat:"lanthanide",row:8,col:7},{n:62,s:"Sm",name:"Samarium",cat:"lanthanide",row:8,col:8},{n:63,s:"Eu",name:"Europium",cat:"lanthanide",row:8,col:9},{n:64,s:"Gd",name:"Gadolinium",cat:"lanthanide",row:8,col:10},{n:65,s:"Tb",name:"Terbium",cat:"lanthanide",row:8,col:11},{n:66,s:"Dy",name:"Dysprosium",cat:"lanthanide",row:8,col:12},{n:67,s:"Ho",name:"Holmium",cat:"lanthanide",row:8,col:13},{n:68,s:"Er",name:"Erbium",cat:"lanthanide",row:8,col:14},{n:69,s:"Tm",name:"Thulium",cat:"lanthanide",row:8,col:15},{n:70,s:"Yb",name:"Ytterbium",cat:"lanthanide",row:8,col:16},{n:71,s:"Lu",name:"Lutetium",cat:"lanthanide",row:8,col:17},
  {n:90,s:"Th",name:"Thorium",cat:"actinide",row:9,col:4},{n:91,s:"Pa",name:"Protactinium",cat:"actinide",row:9,col:5},{n:92,s:"U",name:"Uranium",cat:"actinide",row:9,col:6},{n:93,s:"Np",name:"Neptunium",cat:"actinide",row:9,col:7},{n:94,s:"Pu",name:"Plutonium",cat:"actinide",row:9,col:8},{n:95,s:"Am",name:"Americium",cat:"actinide",row:9,col:9},{n:96,s:"Cm",name:"Curium",cat:"actinide",row:9,col:10},{n:97,s:"Bk",name:"Berkelium",cat:"actinide",row:9,col:11},{n:98,s:"Cf",name:"Californium",cat:"actinide",row:9,col:12},{n:99,s:"Es",name:"Einsteinium",cat:"actinide",row:9,col:13},{n:100,s:"Fm",name:"Fermium",cat:"actinide",row:9,col:14},{n:101,s:"Md",name:"Mendelevium",cat:"actinide",row:9,col:15},{n:102,s:"No",name:"Nobelium",cat:"actinide",row:9,col:16},{n:103,s:"Lr",name:"Lawrencium",cat:"actinide",row:9,col:17},
];

const CAT_COLORS = {
  "alkali-metal": { bg: "rgba(239,68,68,0.18)", border: "rgba(239,68,68,0.5)", text: "#FCA5A5" },
  "alkaline-earth": { bg: "rgba(249,115,22,0.18)", border: "rgba(249,115,22,0.5)", text: "#FDBA74" },
  "transition-metal": { bg: "rgba(234,179,8,0.18)", border: "rgba(234,179,8,0.5)", text: "#FDE047" },
  "post-transition": { bg: "rgba(34,197,94,0.18)", border: "rgba(34,197,94,0.5)", text: "#86EFAC" },
  "metalloid": { bg: "rgba(16,185,129,0.18)", border: "rgba(16,185,129,0.5)", text: "#6EE7B7" },
  "nonmetal": { bg: "rgba(59,130,246,0.18)", border: "rgba(59,130,246,0.5)", text: "#93C5FD" },
  "halogen": { bg: "rgba(139,92,246,0.18)", border: "rgba(139,92,246,0.5)", text: "#C4B5FD" },
  "noble-gas": { bg: "rgba(236,72,153,0.18)", border: "rgba(236,72,153,0.5)", text: "#F9A8D4" },
  "lanthanide": { bg: "rgba(14,165,233,0.18)", border: "rgba(14,165,233,0.5)", text: "#7DD3FC" },
  "actinide": { bg: "rgba(244,63,94,0.18)", border: "rgba(244,63,94,0.5)", text: "#FDA4AF" },
};

function PeriodicTableView() {
  const [hovered, setHovered] = useState(null);
  const [filter, setFilter] = useState("all");
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const categories = [
    { key: "alkali-metal", label: "Alkali Metals" },
    { key: "alkaline-earth", label: "Alkaline Earth" },
    { key: "transition-metal", label: "Transition Metals" },
    { key: "post-transition", label: "Post-Transition" },
    { key: "metalloid", label: "Metalloids" },
    { key: "nonmetal", label: "Nonmetals" },
    { key: "halogen", label: "Halogens" },
    { key: "noble-gas", label: "Noble Gases" },
    { key: "lanthanide", label: "Lanthanides" },
    { key: "actinide", label: "Actinides" },
  ];

  const visibleElements = filter === "all" ? PERIODIC_ELEMENTS : PERIODIC_ELEMENTS.filter(e => e.cat === filter);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <h2 style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 24, margin: 0 }}>🧪 Periodic Table</h2>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          <button onClick={() => setFilter("all")} style={{
            padding: "4px 10px", borderRadius: 8, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            background: filter === "all" ? "rgba(255,255,255,0.12)" : "transparent",
            border: `1px solid ${filter === "all" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"}`,
            color: filter === "all" ? "#fff" : "rgba(255,255,255,0.4)",
          }}>All</button>
          {categories.map(c => {
            const col = CAT_COLORS[c.key];
            return (
              <button key={c.key} onClick={() => setFilter(filter === c.key ? "all" : c.key)} style={{
                padding: "4px 10px", borderRadius: 8, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                background: filter === c.key ? col.bg : "transparent",
                border: `1px solid ${filter === c.key ? col.border : "rgba(255,255,255,0.1)"}`,
                color: filter === c.key ? col.text : "rgba(255,255,255,0.4)",
              }}>{c.label}</button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {categories.map(c => (
          <div key={c.key} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: CAT_COLORS[c.key].bg, border: `1px solid ${CAT_COLORS[c.key].border}` }} />
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>{c.label}</span>
          </div>
        ))}
      </div>

      {/* Main Table */}
      <div className="periodic-table-grid" style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "repeat(18, 1fr)" : "repeat(18, 1fr)",
        gridTemplateRows: "repeat(7, 1fr)",
        gap: isMobile ? "1px" : "3px",
        marginBottom: 16,
        overflowX: "auto",
      }}>
        {PERIODIC_ELEMENTS.filter(e => e.row <= 7).map(el => {
          const col = CAT_COLORS[el.cat] || CAT_COLORS["nonmetal"];
          const isVisible = filter === "all" || el.cat === filter;
          const isHovered = hovered === el.n;
          return (
            <div
              key={el.n}
              onMouseEnter={() => setHovered(el.n)}
              onMouseLeave={() => setHovered(null)}
              style={{
                gridColumn: el.col,
                gridRow: el.row,
                background: isVisible ? col.bg : "rgba(255,255,255,0.02)",
                border: `1px solid ${isHovered && isVisible ? col.border : isVisible ? col.border.replace('0.5', '0.2') : 'rgba(255,255,255,0.04)'}`,
                borderRadius: isMobile ? 2 : 6,
                padding: isMobile ? "2px 1px" : "6px 4px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.15s",
                transform: isHovered && isVisible ? "scale(1.08)" : "scale(1)",
                zIndex: isHovered ? 10 : 1,
                opacity: isVisible ? 1 : 0.15,
                minWidth: isMobile ? 0 : 48,
              }}
            >
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: isMobile ? 6 : 9, marginBottom: 1 }}>{el.n}</div>
              <div style={{ color: isVisible ? col.text : "rgba(255,255,255,0.15)", fontSize: isMobile ? 8 : 13, fontWeight: 700, lineHeight: 1.1 }}>{el.s}</div>
              {!isMobile && <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 7, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{el.name}</div>}
            </div>
          );
        })}
      </div>

      {/* Lanthanides & Actinides */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, marginBottom: 6, letterSpacing: "0.1em" }}>LANTHANIDES (Row 8)</div>
        <div className="periodic-table-grid" style={{
          display: "grid", gridTemplateColumns: "repeat(14, 1fr)", gap: isMobile ? "1px" : "3px", overflowX: "auto",
        }}>
          {PERIODIC_ELEMENTS.filter(e => e.row === 8).map(el => {
            const col = CAT_COLORS[el.cat];
            const isVisible = filter === "all" || el.cat === filter;
            return (
              <div key={el.n} style={{
                background: isVisible ? col.bg : "rgba(255,255,255,0.02)",
                border: `1px solid ${isVisible ? col.border.replace('0.5', '0.2') : 'rgba(255,255,255,0.04)'}`,
                borderRadius: isMobile ? 2 : 6, padding: isMobile ? "2px 1px" : "6px 4px",
                textAlign: "center", opacity: isVisible ? 1 : 0.15, minWidth: isMobile ? 0 : 48,
              }}>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: isMobile ? 6 : 9 }}>{el.n}</div>
                <div style={{ color: isVisible ? col.text : "rgba(255,255,255,0.15)", fontSize: isMobile ? 8 : 13, fontWeight: 700 }}>{el.s}</div>
                {!isMobile && <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 7, marginTop: 2 }}>{el.name}</div>}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, marginBottom: 6, letterSpacing: "0.1em" }}>ACTINIDES (Row 9)</div>
        <div className="periodic-table-grid" style={{
          display: "grid", gridTemplateColumns: "repeat(14, 1fr)", gap: isMobile ? "1px" : "3px", overflowX: "auto",
        }}>
          {PERIODIC_ELEMENTS.filter(e => e.row === 9).map(el => {
            const col = CAT_COLORS[el.cat];
            const isVisible = filter === "all" || el.cat === filter;
            return (
              <div key={el.n} style={{
                background: isVisible ? col.bg : "rgba(255,255,255,0.02)",
                border: `1px solid ${isVisible ? col.border.replace('0.5', '0.2') : 'rgba(255,255,255,0.04)'}`,
                borderRadius: isMobile ? 2 : 6, padding: isMobile ? "2px 1px" : "6px 4px",
                textAlign: "center", opacity: isVisible ? 1 : 0.15, minWidth: isMobile ? 0 : 48,
              }}>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: isMobile ? 6 : 9 }}>{el.n}</div>
                <div style={{ color: isVisible ? col.text : "rgba(255,255,255,0.15)", fontSize: isMobile ? 8 : 13, fontWeight: 700 }}>{el.s}</div>
                {!isMobile && <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 7, marginTop: 2 }}>{el.name}</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Element Detail */}
      {hovered && (() => {
        const el = PERIODIC_ELEMENTS.find(e => e.n === hovered);
        if (!el) return null;
        const col = CAT_COLORS[el.cat];
        return (
          <div style={{
            background: "rgba(255,255,255,0.04)", border: `1px solid ${col.border}`, borderRadius: 16,
            padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 12, background: col.bg, border: `2px solid ${col.border}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800,
              color: col.text, flexShrink: 0,
            }}>{el.s}</div>
            <div>
              <div style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>{el.name}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>Atomic Number: {el.n} · {categories.find(c => c.key === el.cat)?.label}</div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ─── DERIVATIONS DATA ────────────────────────────────────────────────────────
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

// ─── FORMULA OF THE DAY ─────────────────────────────────────────────────────
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

// ─── TAG BADGE ─────────────────────────────────────────────────────────────
function TagBadge({ tag }) {
  const styles = {
    JEE: { bg: "rgba(251,191,36,0.15)", border: "rgba(251,191,36,0.4)", color: "#FBBF24" },
    CET: { bg: "rgba(52,211,153,0.15)", border: "rgba(52,211,153,0.4)", color: "#34D399" },
    NCERT: { bg: "rgba(167,139,250,0.15)", border: "rgba(167,139,250,0.4)", color: "#A78BFA" },
  };
  const s = styles[tag] || styles.JEE;
  return (
    <span style={{
      background: s.bg,
      border: `1px solid ${s.border}`,
      color: s.color,
      fontSize: "9px",
      fontWeight: 700,
      padding: "2px 7px",
      borderRadius: 99,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    }}>{tag}</span>
  );
}

// ─── WEIGHTAGE BADGE ───────────────────────────────────────────────────────
function WeightageBadge({ weightage }) {
  if (!weightage) return null;
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
      {weightage.jee && (
        <span style={{
          background: "rgba(251,191,36,0.12)",
          border: "1px solid rgba(251,191,36,0.3)",
          color: "#FBBF24",
          fontSize: "9px",
          fontWeight: 700,
          padding: "2px 6px",
          borderRadius: 99,
        }}>JEE: {weightage.jee}</span>
      )}
      {weightage.cet && (
        <span style={{
          background: "rgba(52,211,153,0.12)",
          border: "1px solid rgba(52,211,153,0.3)",
          color: "#34D399",
          fontSize: "9px",
          fontWeight: 700,
          padding: "2px 6px",
          borderRadius: 99,
        }}>CET: {weightage.cet}</span>
      )}
    </div>
  );
}

// ─── FORMULA CARD ──────────────────────────────────────────────────────────
function FormulaCard({ f, subjectColor, bookmarks, toggleBookmark }) {
  const id = f.label;
  const isBookmarked = bookmarks.has(id);
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${f.important ? subjectColor + "50" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 14,
      padding: "13px 16px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      transition: "all 0.2s",
      boxShadow: f.important ? `0 0 18px ${subjectColor}20` : "none",
      position: "relative",
    }}
      className="formula-card"
    >
      {f.important && (
        <div style={{
          position: "absolute",
          top: 8, right: 8,
          background: "rgba(251,191,36,0.2)",
          border: "1px solid rgba(251,191,36,0.4)",
          color: "#FBBF24",
          fontSize: 8,
          padding: "1px 5px",
          borderRadius: 99,
          fontWeight: 700,
          letterSpacing: "0.1em",
        }}>★ KEY</div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, marginBottom: 6, letterSpacing: "0.05em" }}>{f.label}</div>
        <div style={{ overflowX: "auto", color: "#fff" }}>
          <Math tex={f.tex} display={true} />
        </div>
        <div style={{ display: "flex", gap: 5, marginTop: 6, flexWrap: "wrap" }}>
          {f.jee && <TagBadge tag="JEE" />}
          {f.cet && <TagBadge tag="CET" />}
        </div>
      </div>
      <button
        onClick={() => toggleBookmark(id)}
        style={{
          background: isBookmarked ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.05)",
          border: `1px solid ${isBookmarked ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.1)"}`,
          color: isBookmarked ? "#FBBF24" : "rgba(255,255,255,0.3)",
          borderRadius: 8,
          width: 30,
          height: 30,
          cursor: "pointer",
          fontSize: 14,
          flexShrink: 0,
          transition: "all 0.2s",
        }}
      >{isBookmarked ? "★" : "☆"}</button>
    </div>
  );
}

// ─── SECTION BLOCK ─────────────────────────────────────────────────────────
function SectionBlock({ section, subjectColor, bookmarks, toggleBookmark }) {
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
        <span style={{ color: subjectColor, transition: "transform 0.25s", display: "inline-block", transform: open ? "rotate(0)" : "rotate(-90deg)" }}>▾</span>
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
              <div style={{ color: subjectColor, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>📝 NOTES</div>
              {section.notes.map((n, i) => (
                <div key={i} style={{ color: "rgba(255,255,255,0.65)", fontSize: 12.5, marginBottom: 4, lineHeight: 1.6, paddingLeft: 12, borderLeft: `2px solid ${subjectColor}50` }}>
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
              <div style={{ color: "#F87171", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>⚠️ COMMON MISTAKES</div>
              {section.mistakes.map((m, i) => (
                <div key={i} style={{ color: "rgba(255,255,255,0.6)", fontSize: 12.5, marginBottom: 4, lineHeight: 1.6, paddingLeft: 12, borderLeft: "2px solid rgba(239,68,68,0.4)" }}>
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
              <div style={{ color: "#FB923C", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>⚡ TRICKS & SHORTCUTS</div>
              {section.tricks.map((t, i) => (
                <div key={i} style={{ color: "rgba(255,255,255,0.6)", fontSize: 12.5, marginBottom: 4, lineHeight: 1.6, paddingLeft: 12, borderLeft: "2px solid rgba(251,146,60,0.4)" }}>
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

// ─── TOPIC VIEW ────────────────────────────────────────────────────────────
function TopicView({ topic, subject, bookmarks, toggleBookmark }) {
  const s = SUBJECTS[subject];
  return (
    <div style={{ padding: "0 0 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: s.bg,
          border: `1px solid ${s.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20,
          flexShrink: 0,
        }}>{s.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ color: "#fff", margin: 0, fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{topic.title}</h2>
          <div style={{ display: "flex", gap: 5, marginTop: 4, flexWrap: "wrap", alignItems: "center" }}>
            {topic.tags.map(t => <TagBadge key={t} tag={t} />)}
            <WeightageBadge weightage={topic.weightage} />
          </div>
        </div>
      </div>
      {topic.sections.map((sec, i) => (
        <SectionBlock key={i} section={sec} subjectColor={s.color} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
      ))}
    </div>
  );
}

// ─── SIDEBAR ───────────────────────────────────────────────────────────────
function Sidebar({ subject, setSubject, activeTopic, setActiveTopic, searchQuery, setSearchQuery, onTopicSelect }) {
  const dataMap = { physics: PHYSICS_DATA, chemistry: CHEMISTRY_DATA, mathematics: MATHEMATICS_DATA };
  const topics = dataMap[subject] || [];

  return (
    <div style={{
      width: 260,
      flexShrink: 0,
      background: "rgba(10,10,20,0.85)",
      backdropFilter: "blur(30px)",
      borderRight: "1px solid rgba(255,255,255,0.07)",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      position: "sticky",
      top: 0,
      overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{ padding: "22px 18px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Playfair Display', serif", color: "#fff", letterSpacing: "-0.02em" }}>
          JEE<span style={{ color: "#818CF8" }}>×</span>CET
        </div>
        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, letterSpacing: "0.12em", marginTop: 2 }}>FORMULA HANDBOOK</div>
      </div>

      {/* Search */}
      <div style={{ padding: "12px 14px" }}>
        <div style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
          gap: 8,
        }}>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>⌕</span>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search formulas..."
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: 12.5,
              outline: "none",
              width: "100%",
              fontFamily: "inherit",
            }}
          />
        </div>
      </div>

      {/* Subject Tabs */}
      <div style={{ padding: "0 14px 12px", display: "flex", gap: 6 }}>
        {Object.entries(SUBJECTS).map(([key, s]) => (
          <button
            key={key}
            onClick={() => { setSubject(key); setActiveTopic(null); }}
            style={{
              flex: 1,
              padding: "7px 4px",
              borderRadius: 9,
              border: `1px solid ${subject === key ? s.color + "60" : "rgba(255,255,255,0.07)"}`,
              background: subject === key ? s.bg : "transparent",
              color: subject === key ? s.color : "rgba(255,255,255,0.3)",
              fontSize: 16,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            title={s.label}
          >{s.icon}</button>
        ))}
      </div>

      {/* Topic List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 10px 20px" }}>
        {topics.map(topic => (
          <button
            key={topic.id}
            onClick={() => { setActiveTopic(topic.id); onTopicSelect && onTopicSelect(); }}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "9px 12px",
              borderRadius: 9,
              border: "1px solid transparent",
              background: activeTopic === topic.id ? SUBJECTS[subject].bg : "transparent",
              borderColor: activeTopic === topic.id ? SUBJECTS[subject].border : "transparent",
              color: activeTopic === topic.id ? SUBJECTS[subject].color : "rgba(255,255,255,0.55)",
              fontSize: 12.5,
              fontWeight: activeTopic === topic.id ? 600 : 400,
              cursor: "pointer",
              marginBottom: 2,
              transition: "all 0.18s",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
            className="topic-btn"
          >
            <span style={{ opacity: 0.5, fontSize: 10 }}>◆</span>
            <span style={{ flex: 1 }}>{topic.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── HOME PAGE ─────────────────────────────────────────────────────────────
function HomePage({ setSubject, setActiveTopic, setView }) {
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

        {/* Stats */}
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

// ─── BOOKMARKS VIEW ────────────────────────────────────────────────────────
function BookmarksView({ bookmarks, toggleBookmark, setView }) {
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

// ─── FORMULA OF THE DAY VIEW ────────────────────────────────────────────────
function FormulaOfTheDayView({ bookmarks, toggleBookmark }) {
  const formula = getDayFormula();
  const [refreshIdx, setRefreshIdx] = useState(0);
  const [currentFormula, setCurrentFormula] = useState(formula);

  const getRandomFormula = () => {
    const idx = Math.floor(Math.random() * IMPORTANT_FORMULAS.length);
    setCurrentFormula(IMPORTANT_FORMULAS[idx]);
    setRefreshIdx(r => r + 1);
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

      {/* Related formulas from same topic */}
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

// ─── QUIZ VIEW ──────────────────────────────────────────────────────────────
function QuizView({ progress, setProgress }) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [filter, setFilter] = useState("all");

  const filteredQs = filter === "all" ? QUIZ_QUESTIONS : QUIZ_QUESTIONS.filter(q => q.subject === filter);
  const current = filteredQs[qIndex];

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === current.correct) {
      setScore(s => s + 1);
      setProgress(p => {
        const newQuizHistory = [...(p.quizHistory || []), { date: Date.now(), correct: true, subject: current.subject }];
        return { ...p, quizCorrect: (p.quizCorrect || 0) + 1, quizHistory: newQuizHistory.slice(-50) };
      });
    } else {
      setProgress(p => {
        const newQuizHistory = [...(p.quizHistory || []), { date: Date.now(), correct: false, subject: current.subject }];
        return { ...p, quizHistory: newQuizHistory.slice(-50) };
      });
    }
    setProgress(p => ({ ...p, quizAttempted: (p.quizAttempted || 0) + 1 }));
  };

  const handleNext = () => {
    if (qIndex + 1 >= filteredQs.length) {
      setQuizFinished(true);
    } else {
      setQIndex(i => i + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    setQIndex(0);
    setSelected(null);
    setShowResult(false);
    setQuizFinished(false);
    setScore(0);
  };

  const subjectColor = current ? SUBJECTS[current.subject]?.color : "#818CF8";

  if (quizFinished) {
    const pct = Math.round((score / filteredQs.length) * 100);
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>{pct >= 80 ? "🎉" : pct >= 50 ? "📚" : "💪"}</div>
        <h2 style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 8 }}>Quiz Complete!</h2>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, marginBottom: 32 }}>
          You scored <span style={{ color: pct >= 80 ? "#34D399" : pct >= 50 ? "#FBBF24" : "#F87171", fontWeight: 700 }}>{score}/{filteredQs.length}</span> ({pct}%)
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={handleRestart} style={{
            background: "rgba(129,140,248,0.15)",
            border: "1px solid rgba(129,140,248,0.4)",
            color: "#818CF8",
            borderRadius: 12,
            padding: "12px 24px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 14,
            fontWeight: 600,
          }}>🔁 Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
        <h2 style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 24, margin: 0 }}>🧠 Formula Quiz</h2>
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "physics", "chemistry", "mathematics"].map(f => (
            <button key={f} onClick={() => { setFilter(f); setQIndex(0); setSelected(null); setShowResult(false); setScore(0); }} style={{
              padding: "4px 10px",
              borderRadius: 8,
              border: `1px solid ${filter === f ? "rgba(129,140,248,0.5)" : "rgba(255,255,255,0.1)"}`,
              background: filter === f ? "rgba(129,140,248,0.15)" : "transparent",
              color: filter === f ? "#818CF8" : "rgba(255,255,255,0.4)",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "capitalize",
            }}>{f === "all" ? "All" : SUBJECTS[f]?.icon}</button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.4)", fontSize: 11, marginBottom: 6 }}>
          <span>Question {qIndex + 1} of {filteredQs.length}</span>
          <span>Score: {score}/{qIndex + (showResult ? 1 : 0)}</span>
        </div>
        <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${((qIndex + (showResult ? 1 : 0)) / filteredQs.length) * 100}%`, background: subjectColor, borderRadius: 4, transition: "width 0.3s" }} />
        </div>
      </div>

      {/* Question card */}
      <div style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${subjectColor}40`,
        borderRadius: 20,
        padding: "28px 28px",
        marginBottom: 16,
      }}>
        <div style={{ color: subjectColor, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
          {SUBJECTS[current.subject]?.icon} {SUBJECTS[current.subject]?.label?.toUpperCase()}
        </div>
        <div style={{ color: "#fff", fontSize: 17, fontWeight: 600, lineHeight: 1.6, marginBottom: 24 }}>{current.q}</div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {current.options.map((opt, i) => {
            let bg = "rgba(255,255,255,0.04)";
            let border = "rgba(255,255,255,0.1)";
            let color = "rgba(255,255,255,0.8)";
            if (showResult) {
              if (i === current.correct) { bg = "rgba(52,211,153,0.15)"; border = "rgba(52,211,153,0.5)"; color = "#34D399"; }
              else if (i === selected && i !== current.correct) { bg = "rgba(239,68,68,0.12)"; border = "rgba(239,68,68,0.4)"; color = "#F87171"; }
            } else if (selected === i) { bg = `${subjectColor}20`; border = subjectColor + "60"; color = "#fff"; }
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                style={{
                  background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: "13px 18px",
                  color, textAlign: "left", cursor: selected !== null ? "default" : "pointer",
                  fontSize: 13, fontFamily: "inherit", lineHeight: 1.5, transition: "all 0.2s",
                  display: "flex", alignItems: "center", gap: 10,
                }}
              >
                <span style={{ fontWeight: 700, opacity: 0.5, fontSize: 11 }}>{String.fromCharCode(65 + i)}</span>
                {opt}
                {showResult && i === current.correct && <span style={{ marginLeft: "auto" }}>✓</span>}
                {showResult && i === selected && i !== current.correct && <span style={{ marginLeft: "auto" }}>✗</span>}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && (
          <div style={{
            marginTop: 16,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: "12px 16px",
          }}>
            <div style={{ color: "#FBBF24", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>💡 EXPLANATION</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.6 }}>{current.explanation}</div>
          </div>
        )}
      </div>

      {showResult && (
        <button onClick={handleNext} style={{
          width: "100%",
          background: `${subjectColor}20`,
          border: `1px solid ${subjectColor}50`,
          color: subjectColor,
          borderRadius: 14,
          padding: "14px",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 700,
          fontFamily: "inherit",
          transition: "all 0.2s",
        }}>
          {qIndex + 1 >= filteredQs.length ? "See Results →" : "Next Question →"}
        </button>
      )}
    </div>
  );
}

// ─── PROGRESS TRACKER VIEW ──────────────────────────────────────────────────
function StatCard({ label, value, sub, color = "#818CF8" }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16,
      padding: "20px",
      textAlign: "center",
    }}>
      <div style={{ color, fontSize: 28, fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>{value}</div>
      <div style={{ color: "#fff", fontSize: 12, fontWeight: 600, marginTop: 4 }}>{label}</div>
      {sub && <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function ProgressView({ progress, bookmarks, srData }) {
  const totalFormulas = ALL_FORMULAS_FLAT.length;
  const bookmarkedCount = bookmarks.size;
  const quizAttempted = progress.quizAttempted || 0;
  const quizCorrect = progress.quizCorrect || 0;
  const accuracy = quizAttempted > 0 ? Math.round((quizCorrect / quizAttempted) * 100) : 0;
  const topicsVisited = progress.topicsVisited || [];
  const streak = progress.streak || 0;
  const quizHistory = progress.quizHistory || [];

  // Mastery from SR data
  const srEntries = Object.entries(srData || {});
  const masteredCount = srEntries.filter(([_, v]) => v && (v.repetitions || 0) >= 3).length;
  const learningCount = srEntries.filter(([_, v]) => v && (v.repetitions || 0) > 0 && (v.repetitions || 0) < 3).length;
  const dueCount = srEntries.filter(([_, v]) => v && (v.dueDate || 0) <= Date.now()).length;

  // Subject breakdown
  const subjectCounts = { physics: 0, chemistry: 0, mathematics: 0 };
  bookmarks.forEach(id => {
    const f = ALL_FORMULAS_FLAT.find(x => x.label === id);
    if (f) subjectCounts[f.subject] = (subjectCounts[f.subject] || 0) + 1;
  });

  // Last 7 days accuracy
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
    const dayQs = quizHistory.filter(h => h && new Date(h.date).toISOString().split('T')[0] === d);
    const dayCorrect = dayQs.filter(h => h.correct).length;
    last7.push({ date: d, total: dayQs.length, correct: dayCorrect });
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
      <h2 style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 24 }}>📊 Progress Tracker</h2>

      {/* Streak banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(251,191,36,0.1), rgba(251,146,60,0.05))",
        border: "1px solid rgba(251,191,36,0.2)",
        borderRadius: 16,
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 20,
      }}>
        <div style={{ fontSize: 32 }}>🔥</div>
        <div>
          <div style={{ color: "#FBBF24", fontSize: 16, fontWeight: 700 }}>{streak} Day Streak</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Keep revising daily to maintain your streak!</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 24 }}>
        <StatCard label="Formulas Bookmarked" value={bookmarkedCount} sub={`of ${totalFormulas} total`} color="#FBBF24" />
        <StatCard label="Mastered (SR)" value={masteredCount} sub={`${learningCount} learning`} color="#34D399" />
        <StatCard label="Quiz Accuracy" value={`${accuracy}%`} sub={`${quizCorrect}/${quizAttempted} correct`} color={accuracy >= 80 ? "#34D399" : accuracy >= 50 ? "#FBBF24" : "#F87171"} />
        <StatCard label="Topics Explored" value={topicsVisited.length} sub={`${dueCount} cards due today`} color="#818CF8" />
      </div>

      {/* Weekly quiz trend */}
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 14 }}>📈 Last 7 Days Quiz Activity</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
          {last7.map((d, i) => {
            const pct = d.total > 0 ? (d.correct / d.total) * 100 : 0;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{d.total > 0 ? `${Math.round(pct)}%` : "-"}</div>
                <div style={{ width: "100%", height: 80, background: "rgba(255,255,255,0.06)", borderRadius: 6, position: "relative", overflow: "hidden" }}>
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    height: `${d.total > 0 ? pct : 0}%`,
                    background: pct >= 80 ? "#34D399" : pct >= 50 ? "#FBBF24" : "#F87171",
                    borderRadius: "6px 6px 0 0",
                    transition: "height 0.5s",
                  }} />
                </div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>{d.date.slice(5)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject breakdown */}
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Bookmarks by Subject</div>
        {Object.entries(SUBJECTS).map(([key, s]) => {
          const count = subjectCounts[key] || 0;
          const totalImp = ALL_FORMULAS_FLAT.filter(f => f.subject === key && f.important).length;
          const pct = totalImp > 0 ? Math.round((count / totalImp) * 100) : 0;
          return (
            <div key={key} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ color: s.color, fontSize: 12 }}>{s.icon} {s.label}</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{count} / {totalImp} key</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(100, pct)}%`, background: s.color, borderRadius: 4, transition: "width 0.5s" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Mastery rings */}
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 24px" }}>
        <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 12 }}>🧠 Spaced Repetition Mastery</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { label: "New", value: srEntries.filter(([_, v]) => !v.repetitions).length, color: "rgba(255,255,255,0.3)" },
            { label: "Learning", value: learningCount, color: "#FBBF24" },
            { label: "Mastered", value: masteredCount, color: "#34D399" },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center", padding: "14px", background: "rgba(255,255,255,0.03)", borderRadius: 12 }}>
              <div style={{ color: item.color, fontSize: 24, fontWeight: 800 }}>{item.value}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 4 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SM-2 REVISION VIEW ─────────────────────────────────────────────────────
function sm2Update(card, rating) {
  let { interval = 0, repetitions = 0, efactor = 2.5 } = card || {};
  let newInterval, newReps;

  if (rating >= 3) {
    if (repetitions === 0) newInterval = 1;
    else if (repetitions === 1) newInterval = 6;
    else newInterval = Math.round(interval * efactor);
    newReps = repetitions + 1;
  } else {
    newReps = 0;
    newInterval = 1;
  }

  const q = rating;
  let newEf = efactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (newEf < 1.3) newEf = 1.3;

  const dueDate = Date.now() + newInterval * 24 * 60 * 60 * 1000;

  return { interval: newInterval, repetitions: newReps, efactor: newEf, dueDate, lastReviewed: Date.now() };
}

function RevisionView({ bookmarks, toggleBookmark, srData, setSrData }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showFormula, setShowFormula] = useState(false);
  const [filter, setFilter] = useState("important");
  const [subFilter, setSubFilter] = useState("all");
  const [rated, setRated] = useState(false);

  let pool = filter === "bookmarked"
    ? ALL_FORMULAS_FLAT.filter(f => bookmarks.has(f.label))
    : filter === "important"
    ? IMPORTANT_FORMULAS
    : ALL_FORMULAS_FLAT;

  if (subFilter !== "all") pool = pool.filter(f => f.subject === subFilter);

  // Attach SR data and sort: due first
  const now = Date.now();
  const poolWithSR = pool.map(f => {
    const sr = srData[f.label] || { interval: 0, repetitions: 0, efactor: 2.5, dueDate: 0 };
    return { ...f, sr };
  });
  const duePool = poolWithSR.filter(f => f.sr.dueDate <= now).sort((a, b) => a.sr.dueDate - b.sr.dueDate);
  const queue = duePool.length > 0 ? duePool : poolWithSR;
  const current = queue[currentIdx] || queue[0];

  const next = () => { setCurrentIdx(i => (i + 1) % queue.length); setShowFormula(false); setRated(false); };
  const prev = () => { setCurrentIdx(i => (i - 1 + queue.length) % queue.length); setShowFormula(false); setRated(false); };

  const handleRate = (rating) => {
    if (rated) return;
    const updated = sm2Update(current.sr, rating);
    setSrData(prev => ({ ...prev, [current.label]: updated }));
    setRated(true);
    setTimeout(() => next(), 400);
  };

  if (pool.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px", color: "rgba(255,255,255,0.3)" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>📭</div>
        <div style={{ fontSize: 16 }}>No formulas in this set</div>
        <div style={{ fontSize: 13, marginTop: 8 }}>{filter === "bookmarked" ? "Bookmark some formulas first!" : "Try a different filter"}</div>
      </div>
    );
  }

  const s = SUBJECTS[current.subject];
  const isDue = (current.sr?.dueDate || 0) <= now;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
        <h2 style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 24, margin: 0 }}>🔄 Revision Mode <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>SM-2</span></h2>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[["important", "⭐ Key"], ["bookmarked", "★ Saved"], ["all", "All"]].map(([v, l]) => (
            <button key={v} onClick={() => { setFilter(v); setCurrentIdx(0); setShowFormula(false); setRated(false); }} style={{
              padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              background: filter === v ? "rgba(129,140,248,0.15)" : "transparent",
              border: `1px solid ${filter === v ? "rgba(129,140,248,0.4)" : "rgba(255,255,255,0.1)"}`,
              color: filter === v ? "#818CF8" : "rgba(255,255,255,0.4)",
            }}>{l}</button>
          ))}
          {["all", "physics", "chemistry", "mathematics"].map(f => (
            <button key={f} onClick={() => { setSubFilter(f); setCurrentIdx(0); setShowFormula(false); setRated(false); }} style={{
              padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              background: subFilter === f ? "rgba(255,255,255,0.08)" : "transparent",
              border: `1px solid ${subFilter === f ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)"}`,
              color: subFilter === f ? "#fff" : "rgba(255,255,255,0.35)",
            }}>{f === "all" ? "All" : SUBJECTS[f]?.icon}</button>
          ))}
        </div>
      </div>

      {/* Card counter */}
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, textAlign: "center", marginBottom: 14 }}>
        {currentIdx + 1} / {queue.length} {isDue && <span style={{ color: "#F87171" }}>· Due</span>}
      </div>

      {/* Flashcard */}
      <div
        onClick={() => !rated && setShowFormula(f => !f)}
        style={{
          background: showFormula
            ? `linear-gradient(135deg, ${s.bg}, rgba(255,255,255,0.02))`
            : "rgba(255,255,255,0.04)",
          border: `2px solid ${showFormula ? s.border : "rgba(255,255,255,0.1)"}`,
          borderRadius: 24,
          padding: "48px 36px",
          textAlign: "center",
          cursor: "pointer",
          minHeight: 200,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s",
          marginBottom: 16,
          boxShadow: showFormula ? `0 20px 60px ${s.glow}` : "none",
        }}
      >
        <div style={{ color: showFormula ? s.color : "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", marginBottom: 12 }}>
          {showFormula ? `${s.icon} ${s.label} · ${current.topic}` : "TAP TO REVEAL"}
        </div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginBottom: showFormula ? 20 : 0 }}>{current.label}</div>
        {showFormula && (
          <div style={{ fontSize: "1.6em", color: "#fff", overflowX: "auto", maxWidth: "100%" }}>
            <Math tex={current.tex} display={true} />
          </div>
        )}
        {!showFormula && (
          <div style={{ fontSize: 32, color: "rgba(255,255,255,0.15)", marginTop: 8 }}>?</div>
        )}
      </div>

      {/* SM-2 Rating */}
      {showFormula && !rated && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, textAlign: "center", marginBottom: 10 }}>How well did you know this?</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "Again", color: "#F87171", rating: 1 },
              { label: "Hard", color: "#FB923C", rating: 2 },
              { label: "Good", color: "#FBBF24", rating: 3 },
              { label: "Easy", color: "#34D399", rating: 4 },
              { label: "Perfect", color: "#60A5FA", rating: 5 },
            ].map(btn => (
              <button
                key={btn.rating}
                onClick={() => handleRate(btn.rating)}
                style={{
                  background: `${btn.color}15`,
                  border: `1px solid ${btn.color}50`,
                  color: btn.color,
                  borderRadius: 10,
                  padding: "10px 16px",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "inherit",
                  minWidth: 70,
                }}
              >{btn.label}</button>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={prev} style={{
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
          color: "#fff", borderRadius: 12, padding: "12px 24px", cursor: "pointer",
          fontSize: 14, fontFamily: "inherit",
        }}>← Prev</button>
        <button onClick={() => toggleBookmark(current.label)} style={{
          background: bookmarks.has(current.label) ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.06)",
          border: `1px solid ${bookmarks.has(current.label) ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.12)"}`,
          color: bookmarks.has(current.label) ? "#FBBF24" : "rgba(255,255,255,0.5)",
          borderRadius: 12, padding: "12px 18px", cursor: "pointer", fontSize: 16, fontFamily: "inherit",
        }}>{bookmarks.has(current.label) ? "★" : "☆"}</button>
        <button onClick={next} style={{
          background: `${s.color}20`, border: `1px solid ${s.color}50`,
          color: s.color, borderRadius: 12, padding: "12px 24px", cursor: "pointer",
          fontSize: 14, fontFamily: "inherit", fontWeight: 600,
        }}>Next →</button>
      </div>
    </div>
  );
}

// ─── TRIGONOMETRY TABLE VIEW ────────────────────────────────────────────────
const TRIG_VALUES = [
  { angle: "0°", rad: "0", sin: "0", cos: "1", tan: "0", cot: "∞", sec: "1", cosec: "∞" },
  { angle: "30°", rad: "π/6", sin: "1/2", cos: "√3/2", tan: "1/√3", cot: "√3", sec: "2/√3", cosec: "2" },
  { angle: "45°", rad: "π/4", sin: "1/√2", cos: "1/√2", tan: "1", cot: "1", sec: "√2", cosec: "√2" },
  { angle: "60°", rad: "π/3", sin: "√3/2", cos: "1/2", tan: "√3", cot: "1/√3", sec: "2", cosec: "2/√3" },
  { angle: "90°", rad: "π/2", sin: "1", cos: "0", tan: "∞", cot: "0", sec: "∞", cosec: "1" },
  { angle: "120°", rad: "2π/3", sin: "√3/2", cos: "-1/2", tan: "-√3", cot: "-1/√3", sec: "-2", cosec: "2/√3" },
  { angle: "135°", rad: "3π/4", sin: "1/√2", cos: "-1/√2", tan: "-1", cot: "-1", sec: "-√2", cosec: "√2" },
  { angle: "150°", rad: "5π/6", sin: "1/2", cos: "-√3/2", tan: "-1/√3", cot: "-√3", sec: "-2/√3", cosec: "2" },
  { angle: "180°", rad: "π", sin: "0", cos: "-1", tan: "0", cot: "∞", sec: "-1", cosec: "∞" },
  { angle: "270°", rad: "3π/2", sin: "-1", cos: "0", tan: "∞", cot: "0", sec: "∞", cosec: "-1" },
  { angle: "360°", rad: "2π", sin: "0", cos: "1", tan: "0", cot: "∞", sec: "1", cosec: "∞" },
];

function TrigTableView() {
  const [highlight, setHighlight] = useState(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const cols = [
    { key: "angle", label: "Angle", color: "#818CF8" },
    { key: "rad", label: "Radians", color: "#818CF8" },
    { key: "sin", label: "sin θ", color: "#F472B6" },
    { key: "cos", label: "cos θ", color: "#34D399" },
    { key: "tan", label: "tan θ", color: "#FBBF24" },
    { key: "cot", label: "cot θ", color: "#FB923C" },
    { key: "sec", label: "sec θ", color: "#60A5FA" },
    { key: "cosec", label: "cosec θ", color: "#A78BFA" },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <h2 style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 24, margin: 0 }}>📐 Trigonometric Values Table</h2>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {cols.slice(2).map(c => (
            <button key={c.key} onClick={() => setHighlight(highlight === c.key ? null : c.key)} style={{
              padding: "4px 10px", borderRadius: 8, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              background: highlight === c.key ? `${c.color}20` : "transparent",
              border: `1px solid ${highlight === c.key ? c.color + "60" : "rgba(255,255,255,0.1)"}`,
              color: highlight === c.key ? c.color : "rgba(255,255,255,0.4)",
            }}>{c.label}</button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: "auto", marginBottom: 20 }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 4px", fontSize: isMobile ? 11 : 13 }}>
          <thead>
            <tr>
              {cols.map(c => (
                <th key={c.key} style={{
                  padding: isMobile ? "8px 4px" : "12px 8px",
                  color: c.color,
                  fontSize: isMobile ? 9 : 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  textAlign: "center",
                  borderBottom: `1px solid ${c.color}30`,
                  whiteSpace: "nowrap",
                }}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TRIG_VALUES.map((row, i) => (
              <tr key={i} style={{ transition: "all 0.2s" }}>
                {cols.map(c => {
                  const isHighlighted = highlight === c.key;
                  return (
                    <td key={c.key} style={{
                      padding: isMobile ? "8px 4px" : "12px 8px",
                      textAlign: "center",
                      background: isHighlighted ? `${c.color}12` : "rgba(255,255,255,0.03)",
                      border: `1px solid ${isHighlighted ? c.color + "30" : "rgba(255,255,255,0.06)"}`,
                      borderRadius: c.key === "angle" ? "8px 0 0 8px" : c.key === "cosec" ? "0 8px 8px 0" : 0,
                      color: isHighlighted ? c.color : "rgba(255,255,255,0.8)",
                      fontWeight: isHighlighted ? 700 : 400,
                      fontSize: isMobile ? 10 : 13,
                      whiteSpace: "nowrap",
                    }}>
                      {row[c.key]}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ASTC Quadrant Summary */}
      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16, padding: "20px 24px", marginBottom: 16,
      }}>
        <div style={{ color: "#FBBF24", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 14 }}>📐 ASTC RULE — SIGNS BY QUADRANT</div>
        <div className="astc-grid" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
          {[
            { q: "Q1 (0°–90°)", sign: "All +ve", funcs: "sin, cos, tan, cot, sec, cosec", color: "#34D399" },
            { q: "Q2 (90°–180°)", sign: "sin +ve", funcs: "sin, cosec", color: "#F472B6" },
            { q: "Q3 (180°–270°)", sign: "tan +ve", funcs: "tan, cot", color: "#FBBF24" },
            { q: "Q4 (270°–360°)", sign: "cos +ve", funcs: "cos, sec", color: "#60A5FA" },
          ].map(q => (
            <div key={q.q} style={{
              background: "rgba(255,255,255,0.04)", border: `1px solid ${q.color}25`,
              borderRadius: 10, padding: "12px 14px",
            }}>
              <div style={{ color: q.color, fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{q.q}</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>{q.sign}</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, marginTop: 2 }}>{q.funcs}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Complementary & Supplementary */}
      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16, padding: "20px 24px",
      }}>
        <div style={{ color: "#818CF8", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 14 }}>🔗 COMPLEMENTARY & SUPPLEMENTARY IDENTITIES</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
          {[
            { label: "Complementary (90°–θ)", formulas: ["sin(90°–θ) = cos θ", "cos(90°–θ) = sin θ", "tan(90°–θ) = cot θ", "cot(90°–θ) = tan θ", "sec(90°–θ) = cosec θ", "cosec(90°–θ) = sec θ"] },
            { label: "Supplementary (180°–θ)", formulas: ["sin(180°–θ) = sin θ", "cos(180°–θ) = –cos θ", "tan(180°–θ) = –tan θ", "sin(180°+θ) = –sin θ", "cos(180°+θ) = –cos θ", "tan(180°+θ) = tan θ"] },
            { label: "Negative Angles", formulas: ["sin(–θ) = –sin θ", "cos(–θ) = cos θ", "tan(–θ) = –tan θ", "cosec(–θ) = –cosec θ", "sec(–θ) = sec θ", "cot(–θ) = –cot θ"] },
            { label: "Periodicity", formulas: ["sin(360°–θ) = –sin θ", "cos(360°–θ) = cos θ", "sin(360°+θ) = sin θ", "cos(360°+θ) = cos θ", "tan(360°+θ) = tan θ", "tan(180°+θ) = tan θ"] },
          ].map(g => (
            <div key={g.label} style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 10, padding: "12px 14px",
            }}>
              <div style={{ color: "#fff", fontSize: 11, fontWeight: 700, marginBottom: 8 }}>{g.label}</div>
              {g.formulas.map((f, i) => (
                <div key={i} style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, marginBottom: 3, fontFamily: "monospace" }}>{f}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DERIVATIONS VIEW ────────────────────────────────────────────────────────
function DerivationsView() {
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
                        background: "rgba(251,191,36,0.05)",
                        border: "1px solid rgba(251,191,36,0.2)",
                        borderRadius: 10,
                        padding: "10px 14px",
                        color: "rgba(255,255,255,0.6)",
                        fontSize: 12,
                        lineHeight: 1.6,
                      }}>
                        <span style={{ color: "#FBBF24", fontWeight: 700 }}>📝 Note: </span>{d.note}
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

// ─── UNIT CHECKER VIEW ───────────────────────────────────────────────────────
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
    { id: "periodic", label: "🧪 Periodic Table" },
    { id: "trig", label: "📐 Trig Table" },
    { id: "bookmarks", label: `★ Bookmarks (${bookmarks.size})` },
    { id: "progress", label: "📊 Progress" },
    { id: "derivations", label: "📐 Derivations" },
    { id: "diagrams", label: "🔬 Diagrams" },
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
        .periodic-table-grid { gap: 1px !important; }
        .astc-grid { grid-template-columns: 1fr !important; }
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
    { id: "periodic", label: "🧪 Periodic" },
    { id: "trig", label: "📐 Trig" },
    { id: "derivations", label: "📐 Derivations" },
    { id: "diagrams", label: "🔬 Diagrams" },
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
              {view === "periodic" && <PeriodicTableView />}
              {view === "trig" && <TrigTableView />}
              {view === "diagrams" && <Diagrams3DView />}
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

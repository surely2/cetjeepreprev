import { useState, useEffect, useRef, useCallback } from "react";

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
      window.katex.render(tex, ref.current, { displayMode: display, throwOnError: false, trust: true, strict: false });
    } catch (e) { ref.current.textContent = tex; }
  }, [tex, display, mathReady]);
  return <span ref={ref} className={display ? "block my-2" : "inline"} />;
}

const SUBJECTS = {
  physics: { label: "Physics", icon: "⚛", color: "#60A5FA", glow: "rgba(96,165,250,0.3)", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.25)" },
  chemistry: { label: "Chemistry", icon: "⚗", color: "#34D399", glow: "rgba(52,211,153,0.3)", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.25)" },
  mathematics: { label: "Maths", icon: "∑", color: "#A78BFA", glow: "rgba(167,139,250,0.3)", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.25)" },
};

const PHYSICS_DATA = [
  { id: "mechanics", title: "Mechanics", tags: ["JEE","CET"], sections: [
    { title: "Kinematics", formulas: [
      { label: "1st equation", tex: "v = u + at", jee:true, cet:true },
      { label: "2nd equation", tex: "s = ut + \\frac{1}{2}at^2", jee:true, cet:true },
      { label: "3rd equation", tex: "v^2 = u^2 + 2as", jee:true, cet:true },
      { label: "nth second", tex: "s_n = u + \\frac{a(2n-1)}{2}", jee:true, cet:false },
      { label: "Projectile range", tex: "R = \\frac{u^2 \\sin 2\\theta}{g}", jee:true, cet:true, important:true },
      { label: "Max height", tex: "H = \\frac{u^2 \\sin^2\\theta}{2g}", jee:true, cet:true },
      { label: "Time of flight", tex: "T = \\frac{2u\\sin\\theta}{g}", jee:true, cet:true },
      { label: "Max range (θ=45°)", tex: "R_{max} = \\frac{u^2}{g}", jee:true, cet:true, important:true },
    ], notes:["At max height: v_y=0, v_x=ucosθ","Same R for θ and (90°−θ)","g ≈ 10 m/s² for CET"], mistakes:["Confusing displacement and distance in nth second"], tricks:["R is maximum at 45°"] },
    { title: "Newton's Laws", formulas: [
      { label: "2nd Law", tex: "\\vec{F} = m\\vec{a}", jee:true, cet:true, important:true },
      { label: "Weight", tex: "W = mg", jee:true, cet:true },
      { label: "Kinetic friction", tex: "f_k = \\mu_k N", jee:true, cet:true },
      { label: "Static friction", tex: "f_s \\leq \\mu_s N", jee:true, cet:true },
      { label: "Banking angle", tex: "\\tan\\theta = \\frac{v^2}{rg}", jee:true, cet:true },
      { label: "Pseudo force", tex: "F_{pseudo} = -ma_0", jee:true, cet:false },
    ], notes:["μs > μk always","N ≠ mg on inclined/accelerating surfaces"], mistakes:["Ignoring pseudo force in accelerating frames"], tricks:["Connected blocks: a=F/(m₁+m₂), T=m₂a"] },
    { title: "Work, Energy & Power", formulas: [
      { label: "Work done", tex: "W = Fd\\cos\\theta", jee:true, cet:true, important:true },
      { label: "Kinetic energy", tex: "KE = \\frac{1}{2}mv^2", jee:true, cet:true },
      { label: "Work-energy theorem", tex: "W_{net} = \\Delta KE", jee:true, cet:true, important:true },
      { label: "Gravitational PE", tex: "PE = mgh", jee:true, cet:true },
      { label: "Spring PE", tex: "U = \\frac{1}{2}kx^2", jee:true, cet:true },
      { label: "Power", tex: "P = \\frac{W}{t} = \\vec{F}\\cdot\\vec{v}", jee:true, cet:true },
    ], notes:["1 kWh = 3.6×10⁶ J","Only ΔPE matters, not reference"], mistakes:["Wrong angle in W=Fdcosθ","Friction does negative work"], tricks:["Reference point for PE is arbitrary"] },
    { title: "Momentum & Collisions", formulas: [
      { label: "Momentum", tex: "\\vec{p} = m\\vec{v}", jee:true, cet:true },
      { label: "Impulse", tex: "J = F\\Delta t = \\Delta p", jee:true, cet:true },
      { label: "Restitution", tex: "e = \\frac{v_2-v_1}{u_1-u_2}", jee:true, cet:true, important:true },
      { label: "Perfectly inelastic", tex: "m_1u_1+m_2u_2=(m_1+m_2)v", jee:true, cet:true },
    ], notes:["e=1: elastic, e=0: perfectly inelastic","Momentum conserved if no external force"], mistakes:["Confusing e formula direction"], tricks:["Equal masses elastic collision: velocities swap"] },
    { title: "Rotational Motion", formulas: [
      { label: "Torque", tex: "\\tau = r \\times F = I\\alpha", jee:true, cet:true, important:true },
      { label: "Angular momentum", tex: "L = I\\omega", jee:true, cet:true },
      { label: "Rotational KE", tex: "KE_{rot} = \\frac{1}{2}I\\omega^2", jee:true, cet:true },
      { label: "MI: rod (center)", tex: "I = \\frac{ML^2}{12}", jee:true, cet:true },
      { label: "MI: disk", tex: "I = \\frac{MR^2}{2}", jee:true, cet:true },
      { label: "MI: ring", tex: "I = MR^2", jee:true, cet:true },
      { label: "MI: solid sphere", tex: "I = \\frac{2}{5}MR^2", jee:true, cet:true, important:true },
      { label: "MI: hollow sphere", tex: "I = \\frac{2}{3}MR^2", jee:true, cet:true },
      { label: "Parallel axis", tex: "I = I_{cm} + Md^2", jee:true, cet:true, important:true },
      { label: "Perpendicular axis", tex: "I_z = I_x + I_y", jee:true, cet:true },
      { label: "Rolling condition", tex: "v = R\\omega", jee:true, cet:true },
    ], notes:["Perp. axis: 2D laminas only","Hollow > Solid: more MI for same shape"], mistakes:["Applying perp. axis to 3D bodies"], tricks:["Rolling total KE = ½mv² + ½Iω²"] },
    { title: "Gravitation", formulas: [
      { label: "Newton's gravitation", tex: "F = G\\frac{m_1 m_2}{r^2}", jee:true, cet:true, important:true },
      { label: "Surface gravity", tex: "g = \\frac{GM}{R^2}", jee:true, cet:true },
      { label: "Escape velocity", tex: "v_e = \\sqrt{2gR}", jee:true, cet:true, important:true },
      { label: "Orbital velocity", tex: "v_0 = \\sqrt{\\frac{GM}{r}}", jee:true, cet:true },
      { label: "Orbital period", tex: "T = 2\\pi\\sqrt{\\frac{r^3}{GM}}", jee:true, cet:true },
      { label: "Kepler's 3rd law", tex: "T^2 \\propto r^3", jee:true, cet:true, important:true },
      { label: "Grav. PE", tex: "U = -\\frac{GMm}{r}", jee:true, cet:true },
      { label: "g at height h", tex: "g_h = g\\left(1-\\frac{2h}{R}\\right)", jee:true, cet:true },
      { label: "g at depth d", tex: "g_d = g\\left(1-\\frac{d}{R}\\right)", jee:true, cet:true },
    ], notes:["G=6.67×10⁻¹¹ N m²/kg²","vₑ≈11.2 km/s, v₀≈7.9 km/s","g=0 at Earth's center"], mistakes:["r from center vs surface","U is always negative"], tricks:["vₑ = √2·v₀ near surface"] },
  ]},
  { id: "shm", title: "SHM", tags: ["JEE","CET"], sections: [
    { title: "SHM Fundamentals", formulas: [
      { label: "SHM condition", tex: "a = -\\omega^2 x", jee:true, cet:true, important:true },
      { label: "Displacement", tex: "x = A\\sin(\\omega t + \\phi)", jee:true, cet:true },
      { label: "Velocity", tex: "v = \\omega\\sqrt{A^2-x^2}", jee:true, cet:true, important:true },
      { label: "Angular frequency", tex: "\\omega = \\frac{2\\pi}{T}", jee:true, cet:true },
      { label: "Pendulum period", tex: "T = 2\\pi\\sqrt{\\frac{l}{g}}", jee:true, cet:true, important:true },
      { label: "Spring-mass period", tex: "T = 2\\pi\\sqrt{\\frac{m}{k}}", jee:true, cet:true, important:true },
      { label: "KE in SHM", tex: "KE = \\frac{1}{2}m\\omega^2(A^2-x^2)", jee:true, cet:true },
      { label: "PE in SHM", tex: "PE = \\frac{1}{2}m\\omega^2 x^2", jee:true, cet:true },
      { label: "Total energy", tex: "E = \\frac{1}{2}m\\omega^2 A^2", jee:true, cet:true, important:true },
      { label: "Springs series", tex: "\\frac{1}{k_{eff}}=\\frac{1}{k_1}+\\frac{1}{k_2}", jee:true, cet:true },
      { label: "Springs parallel", tex: "k_{eff}=k_1+k_2", jee:true, cet:true },
    ], notes:["x=0: KE max, PE=0","x=A: KE=0, PE max","Total E is constant","Pendulum T: independent of mass & amplitude"], mistakes:["T=2π√(l/g) only for small angles"], tricks:["v_max=Aω at x=0; a_max=Aω² at x=±A"] },
  ]},
  { id: "waves", title: "Waves & Sound", tags: ["JEE","CET"], sections: [
    { title: "Wave Properties", formulas: [
      { label: "Wave speed", tex: "v = f\\lambda", jee:true, cet:true },
      { label: "Speed in string", tex: "v = \\sqrt{\\frac{T}{\\mu}}", jee:true, cet:true, important:true },
      { label: "Speed of sound", tex: "v = \\sqrt{\\frac{\\gamma P}{\\rho}}", jee:true, cet:true },
      { label: "Sound at 0°C", tex: "v_0 = 332\\text{ m/s}", jee:true, cet:true },
    ], notes:["μ = mass per unit length","γ=1.4 for air","v rises ~0.6 m/s per °C"], mistakes:["Newton's formula misses γ"], tricks:["v∝√T for string; v∝√T for gas (T in Kelvin)"] },
    { title: "Standing Waves", formulas: [
      { label: "String nth harmonic", tex: "f_n = \\frac{n}{2L}\\sqrt{\\frac{T}{\\mu}}", jee:true, cet:true, important:true },
      { label: "Open pipe nth", tex: "f_n = \\frac{nv}{2L}", jee:true, cet:true },
      { label: "Closed pipe nth (odd)", tex: "f_n = \\frac{(2n-1)v}{4L}", jee:true, cet:true, important:true },
      { label: "Beat frequency", tex: "f_{beat} = |f_1 - f_2|", jee:true, cet:true },
      { label: "Doppler effect", tex: "f' = f\\frac{v \\pm v_o}{v \\mp v_s}", jee:true, cet:true, important:true },
    ], notes:["Closed pipe: only odd harmonics","Open pipe: all harmonics","Doppler: + numerator when observer→source"], mistakes:["Wrong Doppler sign","Open vs closed pipe confusion"], tricks:["Numerator sign = observer direction; denominator opposite"] },
  ]},
  { id: "optics", title: "Ray Optics", tags: ["JEE","CET"], sections: [
    { title: "Mirrors & Lenses", formulas: [
      { label: "Mirror formula", tex: "\\frac{1}{f}=\\frac{1}{v}+\\frac{1}{u}", jee:true, cet:true, important:true },
      { label: "Mirror magnification", tex: "m = -\\frac{v}{u}", jee:true, cet:true },
      { label: "Snell's law", tex: "n_1\\sin\\theta_1 = n_2\\sin\\theta_2", jee:true, cet:true, important:true },
      { label: "Critical angle", tex: "\\sin C = \\frac{1}{n}", jee:true, cet:true },
      { label: "Lens formula", tex: "\\frac{1}{f}=\\frac{1}{v}-\\frac{1}{u}", jee:true, cet:true, important:true },
      { label: "Lensmaker's", tex: "\\frac{1}{f}=(n-1)\\left(\\frac{1}{R_1}-\\frac{1}{R_2}\\right)", jee:true, cet:true },
      { label: "Lens power", tex: "P = \\frac{1}{f(\\text{m})}", jee:true, cet:true },
      { label: "Lenses in contact", tex: "P = P_1 + P_2", jee:true, cet:true },
    ], notes:["Distances measured from pole/optical center","n_glass≈1.5, n_water=1.33"], mistakes:["Wrong sign in lens formula","Confusing mirror and lens formulae"], tricks:["Lens: v−u; Mirror: v+u in denominator"] },
    { title: "Prism & Wave Optics", formulas: [
      { label: "Prism min deviation", tex: "n = \\frac{\\sin\\frac{A+\\delta_m}{2}}{\\sin\\frac{A}{2}}", jee:true, cet:true, important:true },
      { label: "Small angle prism", tex: "\\delta = (n-1)A", jee:true, cet:true },
      { label: "YDSE fringe width", tex: "\\beta = \\frac{\\lambda D}{d}", jee:true, cet:true, important:true },
      { label: "Constructive", tex: "\\Delta x = n\\lambda", jee:true, cet:true },
      { label: "Destructive", tex: "\\Delta x = (2n-1)\\frac{\\lambda}{2}", jee:true, cet:true },
      { label: "Malus's law", tex: "I = I_0\\cos^2\\theta", jee:true, cet:true, important:true },
      { label: "Brewster's law", tex: "\\tan i_B = n", jee:true, cet:true },
    ], notes:["VIBGYOR: violet bends most","YDSE: d=slit sep, D=screen dist","Brewster: reflected ray fully polarized"], mistakes:["Confusing d and D in fringe formula"], tricks:["β∝λ: red fringes wider than violet"] },
  ]},
  { id: "thermal", title: "Thermal Physics", tags: ["JEE","CET"], sections: [
    { title: "Thermal Expansion", formulas: [
      { label: "Linear expansion", tex: "\\Delta L = L_0\\alpha\\Delta T", jee:true, cet:true },
      { label: "Volume expansion", tex: "\\Delta V = V_0\\gamma\\Delta T", jee:true, cet:true, important:true },
      { label: "γ = 3α relation", tex: "\\gamma = 3\\alpha = \\frac{3}{2}\\beta", jee:true, cet:true, important:true },
    ], notes:["α:β:γ = 1:2:3","For liquids: only volume expansion"], mistakes:["Using linear formula for volume"], tricks:["Remember 1:2:3 ratio for α:β:γ"] },
    { title: "Calorimetry & Radiation", formulas: [
      { label: "Heat absorbed", tex: "Q = mc\\Delta T", jee:true, cet:true, important:true },
      { label: "Latent heat", tex: "Q = mL", jee:true, cet:true },
      { label: "Newton's cooling", tex: "\\frac{dT}{dt} = -k(T-T_0)", jee:true, cet:true },
      { label: "Wien's law", tex: "\\lambda_m T = 2.898\\times10^{-3}\\text{ m·K}", jee:true, cet:true },
      { label: "Stefan's law", tex: "E = \\sigma T^4", jee:true, cet:true },
    ], notes:["c_water=4200 J/kg·K","L_fusion ice=336 kJ/kg","Use T in Kelvin for Stefan/Wien"], mistakes:["°C instead of K in Stefan/Wien"], tricks:["Hotter object → smaller λ_max → bluer"] },
  ]},
  { id: "fluids", title: "Fluid Mechanics", tags: ["JEE","CET"], sections: [
    { title: "Pressure & Buoyancy", formulas: [
      { label: "Hydrostatic pressure", tex: "P = P_0 + \\rho gh", jee:true, cet:true, important:true },
      { label: "Buoyancy", tex: "F_b = \\rho_{fluid}\\cdot V_{sub}\\cdot g", jee:true, cet:true, important:true },
      { label: "Pascal's law", tex: "\\frac{F_1}{A_1}=\\frac{F_2}{A_2}", jee:true, cet:true },
    ], notes:["P depends only on depth, not container shape","Floating: weight = buoyancy"], mistakes:["Using total volume instead of submerged"], tricks:["Fractional depth submerged = ρ_obj/ρ_fluid"] },
    { title: "Flow", formulas: [
      { label: "Continuity", tex: "A_1v_1 = A_2v_2", jee:true, cet:true, important:true },
      { label: "Bernoulli", tex: "P + \\frac{1}{2}\\rho v^2 + \\rho gh = \\text{const}", jee:true, cet:true, important:true },
      { label: "Torricelli", tex: "v = \\sqrt{2gh}", jee:true, cet:true },
      { label: "Terminal velocity", tex: "v_t = \\frac{2r^2(\\rho-\\sigma)g}{9\\eta}", jee:true, cet:true, important:true },
      { label: "Stokes' law", tex: "F = 6\\pi\\eta rv", jee:true, cet:true },
    ], notes:["Bernoulli: ideal fluid only","Higher velocity → lower pressure"], mistakes:["Applying Bernoulli to viscous flow"], tricks:["vₜ ∝ r²: double radius → 4× terminal vel"] },
  ]},
  { id: "surface", title: "Surface Tension", tags: ["CET","JEE"], sections: [
    { title: "Surface Tension Formulas", formulas: [
      { label: "Surface tension", tex: "T = \\frac{F}{l}", jee:true, cet:true },
      { label: "Excess pressure (bubble)", tex: "\\Delta P = \\frac{4T}{r}", jee:true, cet:true, important:true },
      { label: "Excess pressure (drop)", tex: "\\Delta P = \\frac{2T}{r}", jee:true, cet:true, important:true },
      { label: "Capillary rise", tex: "h = \\frac{2T\\cos\\theta}{r\\rho g}", jee:true, cet:true, important:true },
    ], notes:["Bubble: 2 surfaces → 4T/r","Drop: 1 surface → 2T/r","Mercury: θ>90° → capillary fall"], mistakes:["Using 2T/r for soap bubble (should be 4T/r)"], tricks:["Bubble = 2× pressure of drop"] },
  ]},
];

const CHEMISTRY_DATA = [
  { id: "mole", title: "Mole Concept", tags: ["JEE","CET"], sections: [
    { title: "Fundamental Relations", formulas: [
      { label: "Moles", tex: "n = \\frac{m}{M} = \\frac{N}{N_A}", jee:true, cet:true, important:true },
      { label: "Avogadro's number", tex: "N_A = 6.022\\times10^{23}", jee:true, cet:true },
      { label: "Molar volume (STP)", tex: "V_m = 22.4\\text{ L/mol}", jee:true, cet:true },
      { label: "Molarity", tex: "M = \\frac{n_{solute}}{V_{soln}(L)}", jee:true, cet:true, important:true },
      { label: "Molality", tex: "m = \\frac{n_{solute}}{m_{solvent}(kg)}", jee:true, cet:true },
      { label: "Mole fraction", tex: "\\chi_A = \\frac{n_A}{n_A+n_B}", jee:true, cet:true },
      { label: "% yield", tex: "\\%yield = \\frac{actual}{theoretical}\\times100", jee:true, cet:true },
    ], notes:["n-factor: acids=basicity, bases=acidity, redox=OS change","Moles always first step in stoichiometry"], mistakes:["mL instead of L for molarity"], tricks:["Limiting reagent: divide moles by stoich. coeff → smallest = LR"] },
  ]},
  { id: "atomic", title: "Atomic Structure", tags: ["JEE","CET"], sections: [
    { title: "Bohr Model", formulas: [
      { label: "Energy nth orbit", tex: "E_n = -\\frac{13.6}{n^2}\\text{ eV}", jee:true, cet:true, important:true },
      { label: "Radius nth orbit", tex: "r_n = 0.529n^2\\text{ Å}", jee:true, cet:true },
      { label: "Rydberg formula", tex: "\\bar{\\nu} = R_H\\left(\\frac{1}{n_1^2}-\\frac{1}{n_2^2}\\right)", jee:true, cet:true, important:true },
      { label: "de Broglie", tex: "\\lambda = \\frac{h}{mv}", jee:true, cet:true, important:true },
      { label: "Heisenberg", tex: "\\Delta x\\cdot\\Delta p \\geq \\frac{h}{4\\pi}", jee:true, cet:true },
      { label: "Photoelectric", tex: "E = h\\nu = \\phi + KE_{max}", jee:true, cet:true, important:true },
    ], notes:["Series: Lyman(UV), Balmer(visible), Paschen(IR)","h=6.626×10⁻³⁴ J·s"], mistakes:["E₁ = −13.6 eV (negative!)"], tricks:["Energy gap → photon: λ=hc/E"] },
    { title: "Quantum Numbers", formulas: [
      { label: "Max e⁻ in shell", tex: "= 2n^2", jee:true, cet:true },
      { label: "Max e⁻ in subshell", tex: "= 2(2l+1)", jee:true, cet:true },
      { label: "Orbitals in subshell", tex: "= 2l+1", jee:true, cet:true },
    ], notes:["l=0(s),1(p),2(d),3(f)","Cr=[Ar]3d⁵4s¹; Cu=[Ar]3d¹⁰4s¹ (exceptions)","Aufbau: 1s 2s 2p 3s 3p 4s 3d 4p..."], mistakes:["Cr as [Ar]3d⁴4s² is wrong"], tricks:["(n+l) rule: lower n+l fills first"] },
  ]},
  { id: "thermo_chem", title: "Thermodynamics", tags: ["JEE","CET"], sections: [
    { title: "Laws & Equations", formulas: [
      { label: "First law", tex: "\\Delta U = q - P\\Delta V", jee:true, cet:true, important:true },
      { label: "Enthalpy", tex: "\\Delta H = \\Delta U + \\Delta n_g RT", jee:true, cet:true, important:true },
      { label: "Gibbs free energy", tex: "\\Delta G = \\Delta H - T\\Delta S", jee:true, cet:true, important:true },
      { label: "Spontaneous", tex: "\\Delta G < 0", jee:true, cet:true },
      { label: "Hess's law", tex: "\\Delta H_{rxn} = \\sum\\Delta H_f(prod) - \\sum\\Delta H_f(react)", jee:true, cet:true, important:true },
      { label: "Bond enthalpy", tex: "\\Delta H = \\sum\\text{broken} - \\sum\\text{formed}", jee:true, cet:true },
    ], notes:["ΔH<0: exothermic; ΔH>0: endothermic","Δng: gaseous moles only","ΔG=0 at equilibrium"], mistakes:["w=−PΔV (sign!)","Count only gaseous moles for Δng"], tricks:["ΔG<0, ΔH<0, ΔS>0: always spontaneous"] },
  ]},
  { id: "equilibrium", title: "Equilibrium", tags: ["JEE","CET"], sections: [
    { title: "Equilibrium Constants", formulas: [
      { label: "Kc", tex: "K_c = \\frac{[C]^c[D]^d}{[A]^a[B]^b}", jee:true, cet:true, important:true },
      { label: "Kp from Kc", tex: "K_p = K_c(RT)^{\\Delta n_g}", jee:true, cet:true, important:true },
      { label: "Degree of dissociation", tex: "K_c \\approx c\\alpha^2\\quad(\\alpha\\ll1)", jee:true, cet:true },
    ], notes:["Le Chatelier: system counteracts change","↑P favors fewer moles of gas","K depends only on temperature"], mistakes:["Including solids/liquids in K"], tricks:["Kp>Kc when Δng>0; Kp<Kc when Δng<0"] },
    { title: "Ionic Equilibrium", formulas: [
      { label: "pH", tex: "\\text{pH} = -\\log[H^+]", jee:true, cet:true, important:true },
      { label: "pH + pOH = 14", tex: "\\text{pH}+\\text{pOH}=14", jee:true, cet:true, important:true },
      { label: "Kw", tex: "K_w = [H^+][OH^-] = 10^{-14}", jee:true, cet:true },
      { label: "Henderson-Hasselbalch", tex: "\\text{pH}=\\text{p}K_a+\\log\\frac{[salt]}{[acid]}", jee:true, cet:true, important:true },
      { label: "Ksp", tex: "K_{sp}=[A^+]^m[B^-]^n", jee:true, cet:true, important:true },
    ], notes:["pH=7 neutral only at 25°C","Buffer: weak acid + its salt","Salt of weak acid + strong base: pH>7"], mistakes:["10⁻⁸ M HCl: pH≈7 (water contributes)"], tricks:["pH of 10⁻⁸ M HCl is NOT less than 7"] },
  ]},
  { id: "redox", title: "Redox", tags: ["JEE","CET"], sections: [
    { title: "Oxidation States", formulas: [
      { label: "n-factor (redox)", tex: "n = \\Delta OS \\times \\text{atoms changed}", jee:true, cet:true, important:true },
      { label: "Equivalents", tex: "n_1 N_1 = n_2 N_2", jee:true, cet:true },
      { label: "KMnO₄ (acidic) n=", tex: "5\\quad(Mn: +7\\to+2)", jee:true, cet:true },
      { label: "KMnO₄ (neutral) n=", tex: "3\\quad(Mn: +7\\to+4)", jee:true, cet:true },
      { label: "KMnO₄ (basic) n=", tex: "1\\quad(Mn: +7\\to+6)", jee:true, cet:true },
      { label: "K₂Cr₂O₇ n=", tex: "6\\quad(Cr: +6\\to+3)", jee:true, cet:true },
    ], notes:["O=−2 (peroxide: −1), H=+1 (hydride: −1), F=−1","Sum of OS = 0 in neutral compound"], mistakes:["O in peroxides is −1, not −2"], tricks:["OIL RIG: Oxidation Is Loss, Reduction Is Gain"] },
  ]},
  { id: "goc", title: "GOC & Isomerism", tags: ["JEE","CET"], sections: [
    { title: "Electronic Effects", formulas: [
      { label: "DBE (degree of unsaturation)", tex: "DBE = \\frac{2C+2+N-H-X}{2}", jee:true, cet:true, important:true },
    ], notes: ["+I: alkyl, −OR, −OH, −NH₂ (electron donating)","−I: −NO₂, −CN, −COOH, halogens","Carbocation: 3°>2°>1°; allylic>secondary","Free radical: 3°>2°>1°","Carbanion: opposite to carbocation stability","F: −I but +M (halogen paradox)"], mistakes:["Confusing inductive and mesomeric effects"], tricks:["DBE=1: one π bond or ring; DBE=4: benzene"] },
    { title: "Stereoisomerism", formulas: [], notes:["Geometric: restricted rotation (C=C, rings)","Optical: non-superimposable mirror images","Chiral center: 4 different groups on C","Meso: chiral centers but internally compensated → optically inactive","Stereoisomers ≤ 2ⁿ (n = chiral centers)","R/S: Cahn-Ingold-Prelog priority rules"], mistakes:["Meso compound is NOT optically active"], tricks:["Enantiomers: same physical prop, opposite optical rotation"] },
  ]},
  { id: "bonding", title: "Chemical Bonding", tags: ["JEE","CET"], sections: [
    { title: "VSEPR & Hybridization", formulas: [
      { label: "Formal charge", tex: "FC = V - N - \\frac{B}{2}", jee:true, cet:true },
      { label: "Bond order (MO)", tex: "BO = \\frac{\\text{bonding}-\\text{antibonding}}{2}", jee:true, cet:true },
      { label: "Dipole moment", tex: "\\mu = q\\times d", jee:true, cet:true },
    ], notes:["sp: linear 180°, sp²: trigonal 120°, sp³: tetrahedral 109.5°","sp³d: trig. bipyramidal, sp³d²: octahedral","CO₂: linear, nonpolar despite polar bonds","Bond order↑ → bond length↓, bond energy↑"], mistakes:["CO₂ is linear, NOT bent"], tricks:["Hybridization = ½(V + bonds + lone pairs − charge)"] },
  ]},
  { id: "coord", title: "Coordination Chemistry", tags: ["JEE","CET"], sections: [
    { title: "Nomenclature & Crystal Field", formulas: [], notes:["IUPAC: anionic ligands first (alphabetical), then metal+OS","Spectrochemical series (weak→strong): I⁻<Br⁻<Cl⁻<F⁻<OH⁻<H₂O<NH₃<en<CN⁻<CO","d²sp³: inner orbital (low spin, octahedral)","sp³d²: outer orbital (high spin)","[Co(NH₃)₆]³⁺: d²sp³, diamagnetic","[CoF₆]³⁻: sp³d², paramagnetic"], mistakes:["Naming cation before anion in complex"], tricks:["Strong field ligands: CO, CN⁻, en, NH₃ → low spin"] },
  ]},
];

const MATHEMATICS_DATA = [
  { id: "trigonometry", title: "Trigonometry", tags: ["JEE","CET"], sections: [
    { title: "Fundamental Identities", formulas: [
      { label: "Pythagorean", tex: "\\sin^2\\theta+\\cos^2\\theta=1", jee:true, cet:true, important:true },
      { label: "tan identity", tex: "1+\\tan^2\\theta=\\sec^2\\theta", jee:true, cet:true },
      { label: "cot identity", tex: "1+\\cot^2\\theta=\\csc^2\\theta", jee:true, cet:true },
      { label: "sin(A±B)", tex: "\\sin(A\\pm B)=\\sin A\\cos B\\pm\\cos A\\sin B", jee:true, cet:true, important:true },
      { label: "cos(A±B)", tex: "\\cos(A\\pm B)=\\cos A\\cos B\\mp\\sin A\\sin B", jee:true, cet:true, important:true },
      { label: "tan(A+B)", tex: "\\tan(A+B)=\\frac{\\tan A+\\tan B}{1-\\tan A\\tan B}", jee:true, cet:true },
      { label: "sin 2A", tex: "\\sin 2A=2\\sin A\\cos A", jee:true, cet:true, important:true },
      { label: "cos 2A", tex: "\\cos 2A=\\cos^2A-\\sin^2A=2\\cos^2A-1", jee:true, cet:true, important:true },
      { label: "tan 2A", tex: "\\tan 2A=\\frac{2\\tan A}{1-\\tan^2 A}", jee:true, cet:true },
      { label: "sin²A (half angle)", tex: "\\sin^2A=\\frac{1-\\cos 2A}{2}", jee:true, cet:true, important:true },
      { label: "cos²A (half angle)", tex: "\\cos^2A=\\frac{1+\\cos 2A}{2}", jee:true, cet:true, important:true },
      { label: "sinC+sinD", tex: "\\sin C+\\sin D=2\\sin\\frac{C+D}{2}\\cos\\frac{C-D}{2}", jee:true, cet:true, important:true },
      { label: "sin 3A", tex: "\\sin 3A=3\\sin A-4\\sin^3A", jee:true, cet:true },
      { label: "cos 3A", tex: "\\cos 3A=4\\cos^3A-3\\cos A", jee:true, cet:true },
    ], notes:["ASTC: All(Q1), Sin(Q2), Tan(Q3), Cos(Q4)","sin(−θ)=−sinθ (odd); cos(−θ)=cosθ (even)","sin30°=½, sin45°=1/√2, sin60°=√3/2"], mistakes:["Wrong sign in cos(A−B) vs cos(A+B)"], tricks:["ASTC — All Students Take Calculus"] },
    { title: "Inverse Trig & Triangle", formulas: [
      { label: "sin⁻¹ range", tex: "\\sin^{-1}:\\left[-\\frac{\\pi}{2},\\frac{\\pi}{2}\\right]", jee:true, cet:true },
      { label: "cos⁻¹ range", tex: "\\cos^{-1}:[0,\\pi]", jee:true, cet:true },
      { label: "sin⁻¹+cos⁻¹", tex: "\\sin^{-1}x+\\cos^{-1}x=\\frac{\\pi}{2}", jee:true, cet:true, important:true },
      { label: "tan⁻¹+tan⁻¹", tex: "\\tan^{-1}x+\\tan^{-1}y=\\tan^{-1}\\frac{x+y}{1-xy}\\;(xy<1)", jee:true, cet:true, important:true },
      { label: "Sine rule", tex: "\\frac{a}{\\sin A}=\\frac{b}{\\sin B}=\\frac{c}{\\sin C}=2R", jee:true, cet:true, important:true },
      { label: "Cosine rule", tex: "\\cos A=\\frac{b^2+c^2-a^2}{2bc}", jee:true, cet:true, important:true },
    ], notes:["Principal value: unique value in restricted range","For tan⁻¹ sum: if xy>1, x,y>0 → add π"], mistakes:["sin⁻¹(sinx)=x only when x∈[−π/2,π/2]"], tricks:["tan⁻¹+tan⁻¹ needs xy<1 check!"] },
  ]},
  { id: "pnc_prob", title: "P&C + Probability", tags: ["JEE","CET"], sections: [
    { title: "Permutations & Combinations", formulas: [
      { label: "Permutation", tex: "^nP_r=\\frac{n!}{(n-r)!}", jee:true, cet:true, important:true },
      { label: "Combination", tex: "^nC_r=\\frac{n!}{r!(n-r)!}", jee:true, cet:true, important:true },
      { label: "Symmetry", tex: "^nC_r={}^nC_{n-r}", jee:true, cet:true },
      { label: "Pascal identity", tex: "^nC_r+{}^nC_{r-1}={}^{n+1}C_r", jee:true, cet:true },
      { label: "Sum of combinations", tex: "\\sum_{r=0}^n {}^nC_r = 2^n", jee:true, cet:true, important:true },
      { label: "Circular permutation", tex: "(n-1)!", jee:true, cet:true },
    ], notes:["0!=1","Circular: fix one, arrange rest","Identical objects: n!/(p!q!r!)"], mistakes:["Circular: forgetting to divide by n","Permutation when order doesn't matter"], tricks:["Gap method: n objects, place r in n+1 gaps → ⁽ⁿ⁺¹⁾Cᵣ"] },
    { title: "Probability", formulas: [
      { label: "Classical probability", tex: "P(A)=\\frac{\\text{favorable}}{\\text{total}}", jee:true, cet:true, important:true },
      { label: "Complement", tex: "P(A')=1-P(A)", jee:true, cet:true },
      { label: "Addition rule", tex: "P(A\\cup B)=P(A)+P(B)-P(A\\cap B)", jee:true, cet:true, important:true },
      { label: "Conditional", tex: "P(A|B)=\\frac{P(A\\cap B)}{P(B)}", jee:true, cet:true, important:true },
      { label: "Independent events", tex: "P(A\\cap B)=P(A)\\cdot P(B)", jee:true, cet:true, important:true },
      { label: "Bayes' theorem", tex: "P(A_i|B)=\\frac{P(A_i)P(B|A_i)}{\\sum_j P(A_j)P(B|A_j)}", jee:true, cet:false },
      { label: "Binomial P(X=r)", tex: "^nC_r p^r q^{n-r}", jee:true, cet:true, important:true },
      { label: "Binomial mean", tex: "\\mu=np", jee:true, cet:true, important:true },
      { label: "Binomial variance", tex: "\\sigma^2=npq", jee:true, cet:true, important:true },
    ], notes:["Mutually exclusive ≠ independent","0≤P(A)≤1 always","Binomial: fixed n, independent, constant p"], mistakes:["Adding probabilities of non-mutually exclusive events","np is mean, npq is variance"], tricks:["P(at least one) = 1 − P(none)"] },
  ]},
  { id: "algebra", title: "Matrices & Determinants", tags: ["JEE","CET"], sections: [
    { title: "Matrix Algebra", formulas: [
      { label: "(AB)ᵀ", tex: "(AB)^T=B^TA^T", jee:true, cet:true, important:true },
      { label: "Symmetric", tex: "A^T=A", jee:true, cet:true },
      { label: "Skew-symmetric", tex: "A^T=-A,\\;a_{ii}=0", jee:true, cet:true },
      { label: "Inverse (2×2)", tex: "A^{-1}=\\frac{1}{|A|}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix}", jee:true, cet:true, important:true },
    ], notes:["AB≠BA (non-commutative)","Invertible iff |A|≠0"], mistakes:["Assuming AB=BA","Wrong order in (AB)ᵀ"], tricks:["(AB)ᵀ=BᵀAᵀ — order reverses! Same as (AB)⁻¹=B⁻¹A⁻¹"] },
    { title: "Determinants", formulas: [
      { label: "2×2 det", tex: "\\begin{vmatrix}a&b\\\\c&d\\end{vmatrix}=ad-bc", jee:true, cet:true, important:true },
      { label: "|kA| for n×n", tex: "|kA|=k^n|A|", jee:true, cet:true, important:true },
      { label: "|AB|", tex: "|AB|=|A||B|", jee:true, cet:true, important:true },
      { label: "Area of triangle", tex: "\\Delta=\\frac{1}{2}\\begin{vmatrix}x_1&y_1&1\\\\x_2&y_2&1\\\\x_3&y_3&1\\end{vmatrix}", jee:true, cet:true, important:true },
      { label: "Cramer's rule", tex: "x=\\frac{D_x}{D},\\;y=\\frac{D_y}{D}", jee:true, cet:true },
    ], notes:["Identical rows/cols: |A|=0","D=0, all Di=0: infinite solutions","D=0, any Di≠0: no solution"], mistakes:["Forgetting sign in cofactor expansion"], tricks:["Sarrus rule for 3×3 expansion"] },
  ]},
  { id: "coordinate", title: "Coordinate Geometry", tags: ["JEE","CET"], sections: [
    { title: "Straight Lines", formulas: [
      { label: "Slope", tex: "m=\\tan\\theta=\\frac{y_2-y_1}{x_2-x_1}", jee:true, cet:true },
      { label: "Slope-intercept", tex: "y=mx+c", jee:true, cet:true, important:true },
      { label: "Point-slope", tex: "y-y_1=m(x-x_1)", jee:true, cet:true },
      { label: "Intercept form", tex: "\\frac{x}{a}+\\frac{y}{b}=1", jee:true, cet:true },
      { label: "Dist: point to line", tex: "d=\\frac{|ax_1+by_1+c|}{\\sqrt{a^2+b^2}}", jee:true, cet:true, important:true },
      { label: "Angle between lines", tex: "\\tan\\theta=\\left|\\frac{m_1-m_2}{1+m_1m_2}\\right|", jee:true, cet:true, important:true },
      { label: "Perpendicular condition", tex: "m_1m_2=-1", jee:true, cet:true, important:true },
    ], notes:["Parallel: m₁=m₂","Concurrent lines: all pass through one point"], mistakes:["Distance formula needs |absolute value|"], tricks:["Three lines concurrent ⟺ determinant of coefficients = 0"] },
    { title: "Circles", formulas: [
      { label: "Standard form", tex: "(x-h)^2+(y-k)^2=r^2", jee:true, cet:true, important:true },
      { label: "General form", tex: "x^2+y^2+2gx+2fy+c=0", jee:true, cet:true, important:true },
      { label: "Centre & radius", tex: "(-g,-f),\\;r=\\sqrt{g^2+f^2-c}", jee:true, cet:true, important:true },
      { label: "Tangent at (x₁,y₁)", tex: "xx_1+yy_1+g(x+x_1)+f(y+y_1)+c=0", jee:true, cet:true },
      { label: "Length of tangent", tex: "L=\\sqrt{x_1^2+y_1^2+2gx_1+2fy_1+c}", jee:true, cet:true },
    ], notes:["Centre is (−g, −f) not (g, f)","Two circles: |r₁−r₂|<d<r₁+r₂ to intersect"], mistakes:["Sign error in centre coordinates"], tricks:["Tangent from external point: L²=S₁"] },
    { title: "Conics", formulas: [
      { label: "Parabola", tex: "y^2=4ax", jee:true, cet:true, important:true },
      { label: "Parabola focus", tex: "\\text{Focus}=(a,0),\\;\\text{directrix}:x=-a", jee:true, cet:true },
      { label: "Ellipse", tex: "\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1,\\;a>b", jee:true, cet:true, important:true },
      { label: "Ellipse eccentricity", tex: "e=\\frac{c}{a}<1,\\;c=\\sqrt{a^2-b^2}", jee:true, cet:true, important:true },
      { label: "Ellipse focal sum", tex: "PF_1+PF_2=2a", jee:true, cet:true, important:true },
      { label: "Hyperbola", tex: "\\frac{x^2}{a^2}-\\frac{y^2}{b^2}=1,\\;e>1", jee:true, cet:true, important:true },
      { label: "Rectangular hyperbola", tex: "xy=c^2", jee:true, cet:true },
    ], notes:["e=0:circle, 0<e<1:ellipse, e=1:parabola, e>1:hyperbola","Latus rectum (y²=4ax)=4a"], mistakes:["Confusing a and b in ellipse"], tricks:["y²=4ax: opens right; y²=−4ax: opens left"] },
  ]},
  { id: "vectors", title: "Vectors & 3D", tags: ["JEE","CET"], sections: [
    { title: "Vector Operations", formulas: [
      { label: "Dot product", tex: "\\vec{a}\\cdot\\vec{b}=|a||b|\\cos\\theta", jee:true, cet:true, important:true },
      { label: "Cross product mag", tex: "|\\vec{a}\\times\\vec{b}|=|a||b|\\sin\\theta", jee:true, cet:true, important:true },
      { label: "Scalar triple product", tex: "[\\vec{a}\\,\\vec{b}\\,\\vec{c}]=\\vec{a}\\cdot(\\vec{b}\\times\\vec{c})", jee:true, cet:false },
      { label: "Area of triangle", tex: "=\\frac{1}{2}|\\vec{AB}\\times\\vec{AC}|", jee:true, cet:true, important:true },
      { label: "Area of parallelogram", tex: "=|\\vec{a}\\times\\vec{b}|", jee:true, cet:true },
      { label: "Projection of a on b", tex: "=\\frac{\\vec{a}\\cdot\\vec{b}}{|\\vec{b}|}", jee:true, cet:true },
      { label: "Perpendicular condition", tex: "\\vec{a}\\cdot\\vec{b}=0", jee:true, cet:true, important:true },
      { label: "Parallel condition", tex: "\\vec{a}\\times\\vec{b}=\\vec{0}", jee:true, cet:true },
    ], notes:["î×ĵ=k̂; ĵ×k̂=î; k̂×î=ĵ (cyclic)","a×b=−(b×a) (anti-commutative)","Coplanar: [a b c]=0"], mistakes:["Dot product=scalar; cross product=vector"], tricks:["î×ĵ=k̂: right-hand cyclic rule"] },
  ]},
  { id: "calculus", title: "Calculus", tags: ["JEE","CET"], sections: [
    { title: "Differentiation", formulas: [
      { label: "d/dx(xⁿ)", tex: "\\frac{d}{dx}(x^n)=nx^{n-1}", jee:true, cet:true, important:true },
      { label: "d/dx(sin x)", tex: "\\frac{d}{dx}(\\sin x)=\\cos x", jee:true, cet:true },
      { label: "d/dx(cos x)", tex: "\\frac{d}{dx}(\\cos x)=-\\sin x", jee:true, cet:true },
      { label: "d/dx(tan x)", tex: "\\frac{d}{dx}(\\tan x)=\\sec^2 x", jee:true, cet:true },
      { label: "d/dx(ln x)", tex: "\\frac{d}{dx}(\\ln x)=\\frac{1}{x}", jee:true, cet:true },
      { label: "d/dx(eˣ)", tex: "\\frac{d}{dx}(e^x)=e^x", jee:true, cet:true },
      { label: "Chain rule", tex: "\\frac{d}{dx}f(g(x))=f'(g(x))\\cdot g'(x)", jee:true, cet:true, important:true },
      { label: "Product rule", tex: "(uv)'=u'v+uv'", jee:true, cet:true, important:true },
      { label: "Quotient rule", tex: "\\left(\\frac{u}{v}\\right)'=\\frac{u'v-uv'}{v^2}", jee:true, cet:true },
    ], notes:["Critical points: f'(x)=0","Maxima: f''(x)<0; Minima: f''(x)>0"], mistakes:["Chain rule missing"], tricks:["d/dx(xⁿ)=nxⁿ⁻¹: power rule always"] },
    { title: "Integration", formulas: [
      { label: "∫xⁿ dx", tex: "\\int x^n\\,dx=\\frac{x^{n+1}}{n+1}+C", jee:true, cet:true, important:true },
      { label: "∫sin x dx", tex: "\\int\\sin x\\,dx=-\\cos x+C", jee:true, cet:true },
      { label: "∫cos x dx", tex: "\\int\\cos x\\,dx=\\sin x+C", jee:true, cet:true },
      { label: "∫eˣ dx", tex: "\\int e^x\\,dx=e^x+C", jee:true, cet:true },
      { label: "∫1/x dx", tex: "\\int\\frac{1}{x}\\,dx=\\ln|x|+C", jee:true, cet:true },
      { label: "Definite integral", tex: "\\int_a^b f(x)\\,dx = F(b)-F(a)", jee:true, cet:true, important:true },
      { label: "By parts", tex: "\\int u\\,dv = uv - \\int v\\,du", jee:true, cet:true, important:true },
    ], notes:["Always add +C for indefinite","Area between curves: ∫|f(x)−g(x)|dx"], mistakes:["Forgetting +C","Sign in ∫sin x dx = −cos x"], tricks:["ILATE for by parts: Inverse, Log, Algebraic, Trig, Exponential"] },
  ]},
];

function TagBadge({ tag }) {
  const styles = {
    JEE: { bg:"rgba(251,191,36,0.15)", border:"rgba(251,191,36,0.4)", color:"#FBBF24" },
    CET: { bg:"rgba(52,211,153,0.15)", border:"rgba(52,211,153,0.4)", color:"#34D399" },
    NCERT: { bg:"rgba(167,139,250,0.15)", border:"rgba(167,139,250,0.4)", color:"#A78BFA" },
  };
  const s = styles[tag] || styles.JEE;
  return (
    <span style={{ background:s.bg, border:`1px solid ${s.border}`, color:s.color, fontSize:"9px", fontWeight:700, padding:"2px 6px", borderRadius:99, letterSpacing:"0.08em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{tag}</span>
  );
}

function FormulaCard({ f, subjectColor, bookmarks, toggleBookmark }) {
  const id = f.label;
  const isBookmarked = bookmarks.has(id);
  return (
    <div style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${f.important ? subjectColor+"50" : "rgba(255,255,255,0.07)"}`, borderRadius:12, padding:"12px 14px", display:"flex", alignItems:"flex-start", gap:10, boxShadow:f.important?`0 0 16px ${subjectColor}18`:"none", position:"relative" }}>
      {f.important && (
        <div style={{ position:"absolute", top:7, right:38, background:"rgba(251,191,36,0.2)", border:"1px solid rgba(251,191,36,0.4)", color:"#FBBF24", fontSize:8, padding:"1px 5px", borderRadius:99, fontWeight:700, letterSpacing:"0.08em" }}>★ KEY</div>
      )}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ color:"rgba(255,255,255,0.4)", fontSize:10, marginBottom:5 }}>{f.label}</div>
        <div style={{ overflowX:"auto", color:"#fff", WebkitOverflowScrolling:"touch" }}>
          <Math tex={f.tex} display={true} />
        </div>
        <div style={{ display:"flex", gap:4, marginTop:6, flexWrap:"wrap" }}>
          {f.jee && <TagBadge tag="JEE" />}
          {f.cet && <TagBadge tag="CET" />}
        </div>
      </div>
      <button
        onClick={() => toggleBookmark(id)}
        style={{ background:isBookmarked?"rgba(251,191,36,0.15)":"rgba(255,255,255,0.05)", border:`1px solid ${isBookmarked?"rgba(251,191,36,0.4)":"rgba(255,255,255,0.1)"}`, color:isBookmarked?"#FBBF24":"rgba(255,255,255,0.3)", borderRadius:8, width:32, height:32, cursor:"pointer", fontSize:15, flexShrink:0, marginTop:2 }}
      >{isBookmarked?"★":"☆"}</button>
    </div>
  );
}

function SectionBlock({ section, subjectColor, bookmarks, toggleBookmark }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom:8 }}>
      <button
        onClick={() => setOpen(o=>!o)}
        style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"11px 14px", color:"#fff", fontSize:13, fontWeight:600, display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", textAlign:"left" }}
      >
        <span style={{ flex:1, marginRight:8 }}>{section.title}</span>
        <span style={{ color:subjectColor, fontSize:12, transform:open?"rotate(0)":"rotate(-90deg)", display:"inline-block", transition:"transform 0.2s", flexShrink:0 }}>▾</span>
      </button>
      {open && (
        <div style={{ marginTop:6, display:"flex", flexDirection:"column", gap:6 }}>
          {section.formulas && section.formulas.map((f,i) => (
            <FormulaCard key={i} f={f} subjectColor={subjectColor} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
          ))}
          {section.notes && section.notes.length > 0 && (
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"11px 14px" }}>
              <div style={{ color:subjectColor, fontSize:10, fontWeight:700, letterSpacing:"0.08em", marginBottom:8 }}>📝 NOTES</div>
              {section.notes.map((n,i) => (
                <div key={i} style={{ color:"rgba(255,255,255,0.65)", fontSize:12, marginBottom:5, lineHeight:1.6, paddingLeft:10, borderLeft:`2px solid ${subjectColor}50` }}>{n}</div>
              ))}
            </div>
          )}
          {section.mistakes && section.mistakes.length > 0 && (
            <div style={{ background:"rgba(239,68,68,0.05)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:10, padding:"11px 14px" }}>
              <div style={{ color:"#F87171", fontSize:10, fontWeight:700, letterSpacing:"0.08em", marginBottom:8 }}>⚠️ COMMON MISTAKES</div>
              {section.mistakes.map((m,i) => (
                <div key={i} style={{ color:"rgba(255,255,255,0.6)", fontSize:12, marginBottom:4, lineHeight:1.6, paddingLeft:10, borderLeft:"2px solid rgba(239,68,68,0.4)" }}>{m}</div>
              ))}
            </div>
          )}
          {section.tricks && section.tricks.length > 0 && (
            <div style={{ background:"rgba(251,146,60,0.05)", border:"1px solid rgba(251,146,60,0.2)", borderRadius:10, padding:"11px 14px" }}>
              <div style={{ color:"#FB923C", fontSize:10, fontWeight:700, letterSpacing:"0.08em", marginBottom:8 }}>⚡ TRICKS</div>
              {section.tricks.map((t,i) => (
                <div key={i} style={{ color:"rgba(255,255,255,0.6)", fontSize:12, marginBottom:4, lineHeight:1.6, paddingLeft:10, borderLeft:"2px solid rgba(251,146,60,0.4)" }}>{t}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TopicView({ topic, subject, bookmarks, toggleBookmark, onBack }) {
  const s = SUBJECTS[subject];
  return (
    <div>
      {/* Back header */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, paddingBottom:14, borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"#fff", borderRadius:8, width:34, height:34, cursor:"pointer", fontSize:16, flexShrink:0 }}>←</button>
        <div style={{ flex:1, minWidth:0 }}>
          <h2 style={{ color:"#fff", margin:0, fontSize:17, fontWeight:700 }}>{topic.title}</h2>
          <div style={{ display:"flex", gap:4, marginTop:3, flexWrap:"wrap" }}>
            {topic.tags.map(t=><TagBadge key={t} tag={t}/>)}
          </div>
        </div>
      </div>
      {topic.sections.map((sec,i) => (
        <SectionBlock key={i} section={sec} subjectColor={s.color} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
      ))}
    </div>
  );
}

function SearchView({ query, bookmarks, toggleBookmark }) {
  const dataMap = { physics:PHYSICS_DATA, chemistry:CHEMISTRY_DATA, mathematics:MATHEMATICS_DATA };
  const q = query.toLowerCase();
  const results = [];
  Object.entries(dataMap).forEach(([sub, topics]) => {
    topics.forEach(topic => {
      topic.sections.forEach(sec => {
        sec.formulas && sec.formulas.forEach(f => {
          if (f.label.toLowerCase().includes(q) || f.tex.toLowerCase().includes(q)) {
            results.push({ ...f, subject:sub, topic:topic.title, topicId:topic.id });
          }
        });
      });
    });
  });
  return (
    <div>
      <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12, marginBottom:12 }}>
        {results.length} result{results.length!==1?"s":""} for "{query}"
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {results.map((f,i) => (
          <div key={i}>
            <div style={{ color:"rgba(255,255,255,0.3)", fontSize:10, marginBottom:4 }}>
              {SUBJECTS[f.subject].icon} {SUBJECTS[f.subject].label} · {f.topic}
            </div>
            <FormulaCard f={f} subjectColor={SUBJECTS[f.subject].color} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
          </div>
        ))}
        {results.length===0 && (
          <div style={{ color:"rgba(255,255,255,0.3)", fontSize:14, textAlign:"center", padding:"40px 0" }}>No formulas found</div>
        )}
      </div>
    </div>
  );
}

function BookmarksView({ bookmarks, toggleBookmark }) {
  const allFormulas = [];
  [
    ...PHYSICS_DATA.map(t=>({...t,subject:"physics"})),
    ...CHEMISTRY_DATA.map(t=>({...t,subject:"chemistry"})),
    ...MATHEMATICS_DATA.map(t=>({...t,subject:"mathematics"})),
  ].forEach(topic => {
    topic.sections.forEach(sec => {
      sec.formulas && sec.formulas.forEach(f => {
        if (bookmarks.has(f.label)) allFormulas.push({...f, subject:topic.subject, topic:topic.title});
      });
    });
  });
  if (allFormulas.length===0) return (
    <div style={{ textAlign:"center", padding:"60px 24px", color:"rgba(255,255,255,0.3)" }}>
      <div style={{ fontSize:44, marginBottom:14 }}>★</div>
      <div style={{ fontSize:15 }}>No bookmarks yet</div>
      <div style={{ fontSize:12, marginTop:6 }}>Tap ☆ on any formula to save it</div>
    </div>
  );
  return (
    <div>
      <h2 style={{ color:"#fff", fontSize:17, fontWeight:700, marginBottom:16 }}>★ Saved ({allFormulas.length})</h2>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {allFormulas.map((f,i) => (
          <div key={i}>
            <div style={{ color:"rgba(255,255,255,0.3)", fontSize:10, marginBottom:4 }}>
              {SUBJECTS[f.subject].icon} {SUBJECTS[f.subject].label} · {f.topic}
            </div>
            <FormulaCard f={f} subjectColor={SUBJECTS[f.subject].color} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
          </div>
        ))}
      </div>
    </div>
  );
}

function TopicListView({ subject, onSelect }) {
  const dataMap = { physics:PHYSICS_DATA, chemistry:CHEMISTRY_DATA, mathematics:MATHEMATICS_DATA };
  const s = SUBJECTS[subject];
  const topics = dataMap[subject] || [];
  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
        <span style={{ fontSize:28 }}>{s.icon}</span>
        <h2 style={{ color:"#fff", margin:0, fontSize:20, fontWeight:700 }}>{s.label}</h2>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {topics.map(topic => {
          const formulaCount = topic.sections.reduce((acc,s)=>acc+(s.formulas?.length||0),0);
          return (
            <button
              key={topic.id}
              onClick={() => onSelect(topic.id)}
              style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:12, padding:"14px 16px", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}
            >
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ color:"#fff", fontSize:14, fontWeight:600, marginBottom:4 }}>{topic.title}</div>
                <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                  {topic.tags.map(t=><TagBadge key={t} tag={t}/>)}
                </div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ color:s.color, fontSize:12, fontWeight:600 }}>{formulaCount}</div>
                <div style={{ color:"rgba(255,255,255,0.3)", fontSize:9 }}>formulas</div>
              </div>
              <span style={{ color:s.color, fontSize:14, flexShrink:0 }}>›</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HomeView({ onSubjectSelect }) {
  const stats = [
    { v:"500+", l:"Formulas", i:"∑" },
    { v:"34", l:"Topics", i:"📚" },
    { v:"3", l:"Subjects", i:"⚗" },
    { v:"100+", l:"Tricks", i:"⚡" },
  ];
  const dataMap = { physics:PHYSICS_DATA, chemistry:CHEMISTRY_DATA, mathematics:MATHEMATICS_DATA };
  return (
    <div>
      {/* Hero */}
      <div style={{ textAlign:"center", padding:"28px 16px 24px", background:"radial-gradient(ellipse at 50% 0%, rgba(129,140,248,0.12), transparent 70%), rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, marginBottom:16 }}>
        <div style={{ fontSize:40, marginBottom:10 }}>⚡</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:800, color:"#fff", margin:"0 0 6px", lineHeight:1.2 }}>JEE Main × MHT CET</h1>
        <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, margin:"0 0 4px" }}>Complete Formula Handbook</p>
        <p style={{ color:"rgba(129,140,248,0.8)", fontSize:11, letterSpacing:"0.08em", textTransform:"uppercase", margin:0 }}>Physics · Chemistry · Maths</p>
        <div style={{ display:"flex", gap:8, marginTop:18, justifyContent:"center", flexWrap:"wrap" }}>
          {stats.map(s=>(
            <div key={s.l} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"10px 16px", textAlign:"center" }}>
              <div style={{ fontSize:18, fontWeight:800, color:"#fff" }}>{s.v}</div>
              <div style={{ color:"rgba(255,255,255,0.4)", fontSize:9, letterSpacing:"0.1em", marginTop:1 }}>{s.l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:16 }}>
        {Object.entries(SUBJECTS).map(([key,s])=>(
          <button
            key={key}
            onClick={() => onSubjectSelect(key)}
            style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:14, padding:"16px 10px", cursor:"pointer", textAlign:"center", boxShadow:`0 6px 20px ${s.glow}` }}
          >
            <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
            <div style={{ color:"#fff", fontSize:12, fontWeight:700, marginBottom:4 }}>{s.label}</div>
            <div style={{ color:s.color, fontSize:10 }}>{dataMap[key].length} topics</div>
          </button>
        ))}
      </div>

      {/* Tips */}
      <div style={{ background:"rgba(251,191,36,0.05)", border:"1px solid rgba(251,191,36,0.15)", borderRadius:14, padding:"14px 16px" }}>
        <div style={{ color:"#FBBF24", fontSize:10, fontWeight:700, letterSpacing:"0.1em", marginBottom:10 }}>💡 HOW TO USE</div>
        {["Tap a subject card to browse topics","★ KEY formulas are highest priority","Bookmark ☆ formulas you want to revisit","JEE / CET tags show exam relevance","⚠️ Avoid the listed common mistakes","⚡ Tricks & shortcuts save exam time"].map((tip,i)=>(
          <div key={i} style={{ color:"rgba(255,255,255,0.5)", fontSize:11, lineHeight:1.7 }}>→ {tip}</div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("home"); // home | study | bookmarks | search
  const [subject, setSubject] = useState("physics");
  const [activeTopic, setActiveTopic] = useState(null);
  const [bookmarks, setBookmarks] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const toggleBookmark = useCallback((id) => {
    setBookmarks(b => { const nb=new Set(b); nb.has(id)?nb.delete(id):nb.add(id); return nb; });
  }, []);

  const dataMap = { physics:PHYSICS_DATA, chemistry:CHEMISTRY_DATA, mathematics:MATHEMATICS_DATA };
  const currentTopic = activeTopic && dataMap[subject]?.find(t=>t.id===activeTopic);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `
      *{box-sizing:border-box;margin:0;padding:0;}
      html,body{background:#060610;font-family:'DM Sans',sans-serif;color:#fff;height:100%;overflow:hidden;}
      #root{height:100%;}
      ::-webkit-scrollbar{width:3px;height:3px;}
      ::-webkit-scrollbar-track{background:transparent;}
      ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12);border-radius:3px;}
      button{font-family:'DM Sans',sans-serif;}
      input{font-family:'DM Sans',sans-serif;}
      .katex{font-size:1em!important;}
      .katex-display{text-align:left!important;margin:4px 0!important;}
    `;
    document.head.appendChild(style);
  }, []);

  const showSearch = searchQuery.length > 1;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"#060610", position:"relative" }}>
      {/* Top search bar */}
      <div style={{ flexShrink:0, padding:"10px 12px 8px", background:"rgba(6,6,16,0.95)", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", gap:8, alignItems:"center", zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.07)", border:`1px solid ${searchFocused?"rgba(129,140,248,0.4)":"rgba(255,255,255,0.1)"}`, borderRadius:10, padding:"8px 12px", flex:1 }}>
          <span style={{ color:"rgba(255,255,255,0.35)", fontSize:14 }}>⌕</span>
          <input
            value={searchQuery}
            onChange={e=>setSearchQuery(e.target.value)}
            onFocus={()=>setSearchFocused(true)}
            onBlur={()=>setSearchFocused(false)}
            placeholder="Search formulas..."
            style={{ background:"transparent", border:"none", color:"#fff", fontSize:13, outline:"none", width:"100%" }}
          />
          {searchQuery && <button onClick={()=>setSearchQuery("")} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:14, padding:"0 2px" }}>✕</button>}
        </div>
        {/* Subject quick switcher — only in study tab */}
        {tab==="study" && !showSearch && (
          <div style={{ display:"flex", gap:4 }}>
            {Object.entries(SUBJECTS).map(([key,s])=>(
              <button
                key={key}
                onClick={()=>{ setSubject(key); setActiveTopic(null); }}
                style={{ width:34, height:34, borderRadius:8, border:`1px solid ${subject===key?s.color+"60":"rgba(255,255,255,0.1)"}`, background:subject===key?s.bg:"transparent", color:subject===key?s.color:"rgba(255,255,255,0.4)", fontSize:15, cursor:"pointer" }}
                title={s.label}
              >{s.icon}</button>
            ))}
          </div>
        )}
      </div>

      {/* Main scroll area */}
      <div style={{ flex:1, overflowY:"auto", padding:"14px 12px", WebkitOverflowScrolling:"touch" }}>
        {showSearch ? (
          <SearchView query={searchQuery} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
        ) : (
          <>
            {tab==="home" && (
              <HomeView onSubjectSelect={(key) => { setSubject(key); setActiveTopic(null); setTab("study"); }} />
            )}
            {tab==="study" && (
              activeTopic && currentTopic
                ? <TopicView topic={currentTopic} subject={subject} bookmarks={bookmarks} toggleBookmark={toggleBookmark} onBack={()=>setActiveTopic(null)} />
                : <TopicListView subject={subject} onSelect={(id)=>setActiveTopic(id)} />
            )}
            {tab==="bookmarks" && (
              <BookmarksView bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
            )}
          </>
        )}
      </div>

      {/* Bottom tab bar */}
      <div style={{ flexShrink:0, background:"rgba(6,6,16,0.97)", borderTop:"1px solid rgba(255,255,255,0.08)", display:"flex", zIndex:10, paddingBottom:"env(safe-area-inset-bottom, 0px)" }}>
        {[
          { id:"home", icon:"🏠", label:"Home" },
          { id:"study", icon:SUBJECTS[subject].icon, label:SUBJECTS[subject].label, color:SUBJECTS[subject].color },
          { id:"bookmarks", icon:"★", label:`Saved${bookmarks.size>0?` (${bookmarks.size})`:""}` },
        ].map(t=>{
          const active = tab===t.id && !showSearch;
          const color = active ? (t.color||"#818CF8") : "rgba(255,255,255,0.35)";
          return (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); if(showSearch) setSearchQuery(""); }}
              style={{ flex:1, padding:"10px 4px 8px", background:"transparent", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}
            >
              <span style={{ fontSize:20, lineHeight:1, filter:active?"none":"grayscale(0.5) opacity(0.5)" }}>{t.icon}</span>
              <span style={{ color, fontSize:10, fontWeight:active?700:400, transition:"color 0.15s" }}>{t.label}</span>
              {active && <div style={{ width:20, height:2, borderRadius:1, background:t.color||"#818CF8", marginTop:1 }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

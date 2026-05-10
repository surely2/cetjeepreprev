
import { useState, useEffect, useRef, useMemo } from "react";
import katex from "katex";

// ───────── DATA ─────────
const PHYSICS_DATA = [
  {
    id: "mechanics",
    title: "Mechanics",
    icon: "⚙️",
    color: "blue",
    sections: [
      {
        title: "Kinematics",
        formulas: [
          { latex: "v = u + at", label: "Velocity-time", tags: ["CET", "JEE"] },
          { latex: "s = ut + \\frac{1}{2}at^2", label: "Displacement", tags: ["CET", "JEE"] },
          { latex: "v^2 = u^2 + 2as", label: "Velocity-displacement", tags: ["CET", "JEE"] },
          { latex: "s_n = u + \\frac{a(2n-1)}{2}", label: "nth second displacement", tags: ["CET"] },
          { latex: "R = \\frac{u^2\\sin 2\\theta}{g}", label: "Projectile Range", tags: ["CET", "JEE"] },
          { latex: "H = \\frac{u^2\\sin^2\\theta}{2g}", label: "Max Height", tags: ["CET", "JEE"] },
          { latex: "T = \\frac{2u\\sin\\theta}{g}", label: "Time of flight", tags: ["CET", "JEE"] },
          { latex: "\\vec{v}_{rel} = \\vec{v}_A - \\vec{v}_B", label: "Relative Velocity", tags: ["JEE"] },
        ],
        points: [
          "For maximum range, θ = 45°, R_max = u²/g",
          "Complementary angles (θ and 90°−θ) give same range",
          "At max height, vertical velocity = 0",
          "Horizontal velocity remains constant throughout projectile motion",
          "Range on inclined plane: R = \\frac{2u^2\\sin(\\alpha-\\beta)\\cos\\alpha}{g\\cos^2\\beta}",
        ],
        mistakes: [
          "Confusing displacement with distance",
          "Forgetting u in s = ut + ½at² when u ≠ 0",
          "Using g = 10 m/s² vs 9.8 m/s² — check question",
        ],
        tricks: [
          "For same range: θ and (90°−θ) are complementary angles",
          "At max height of projectile: KE = ½m(u cosθ)²",
          "Time to reach max height = T/2",
        ],
      },
      {
        title: "Newton's Laws & Forces",
        formulas: [
          { latex: "\\vec{F} = m\\vec{a}", label: "Newton's 2nd Law", tags: ["CET", "JEE"] },
          { latex: "\\vec{F}_{12} = -\\vec{F}_{21}", label: "Newton's 3rd Law", tags: ["CET"] },
          { latex: "f_s \\leq \\mu_s N", label: "Static Friction", tags: ["CET", "JEE"] },
          { latex: "f_k = \\mu_k N", label: "Kinetic Friction", tags: ["CET", "JEE"] },
          { latex: "T = m(g + a)", label: "Tension (upward acc.)", tags: ["CET"] },
          { latex: "T = m(g - a)", label: "Tension (downward acc.)", tags: ["CET"] },
          { latex: "a = \\frac{(m_1 - m_2)g}{m_1 + m_2}", label: "Atwood Machine", tags: ["CET", "JEE"] },
          { latex: "N = mg\\cos\\theta", label: "Normal on incline", tags: ["CET", "JEE"] },
        ],
        points: [
          "μ_s > μ_k always (static > kinetic friction)",
          "On incline: a = g(sin θ − μ cos θ) with friction",
          "Pseudo force = ma (in non-inertial frame, opposite to acceleration)",
          "Apparent weight in lift: W' = m(g + a) going up, m(g − a) going down",
        ],
        mistakes: [
          "Applying Newton's law without free body diagram",
          "Forgetting pseudo force in rotating/accelerating frames",
          "Using wrong sign for acceleration direction",
        ],
        tricks: [
          "FBD first — always draw free body diagram",
          "If μ_s is not given, assume μ_s = μ_k",
          "Tension same throughout massless string",
        ],
      },
      {
        title: "Work, Energy & Power",
        formulas: [
          { latex: "W = \\vec{F} \\cdot \\vec{d} = Fd\\cos\\theta", label: "Work done", tags: ["CET", "JEE"] },
          { latex: "KE = \\frac{1}{2}mv^2", label: "Kinetic Energy", tags: ["CET", "JEE"] },
          { latex: "PE = mgh", label: "Gravitational PE", tags: ["CET", "JEE"] },
          { latex: "PE_{spring} = \\frac{1}{2}kx^2", label: "Spring PE", tags: ["CET", "JEE"] },
          { latex: "W_{net} = \\Delta KE", label: "Work-Energy Theorem", tags: ["CET", "JEE"] },
          { latex: "P = \\frac{W}{t} = Fv", label: "Power", tags: ["CET", "JEE"] },
          { latex: "e = \\frac{v_2 - v_1}{u_1 - u_2}", label: "Coefficient of Restitution", tags: ["CET", "JEE"] },
        ],
        points: [
          "e = 1: perfectly elastic; e = 0: perfectly inelastic",
          "In elastic collision: KE conserved; in inelastic: not conserved",
          "Conservative forces: work done path-independent",
          "Power = rate of doing work = Fv cosθ",
        ],
        mistakes: [
          "Work by normal force is zero (perpendicular to motion)",
          "Confusing elastic and inelastic collisions",
          "Forgetting negative work by friction",
        ],
        tricks: [
          "Work done by gravity = mgh (only depends on height)",
          "For spring: F = −kx (restoring force)",
          "Head-on elastic collision of equal masses: velocities exchange",
        ],
      },
      {
        title: "Rotational Motion",
        formulas: [
          { latex: "\\tau = I\\alpha = r \\times F", label: "Torque", tags: ["CET", "JEE"] },
          { latex: "L = I\\omega = mvr", label: "Angular Momentum", tags: ["CET", "JEE"] },
          { latex: "I_{disc} = \\frac{1}{2}MR^2", label: "MOI: Disc", tags: ["CET", "JEE"] },
          { latex: "I_{ring} = MR^2", label: "MOI: Ring/Hoop", tags: ["CET", "JEE"] },
          { latex: "I_{sphere} = \\frac{2}{5}MR^2", label: "MOI: Solid Sphere", tags: ["CET", "JEE"] },
          { latex: "I_{rod} = \\frac{ML^2}{12}", label: "MOI: Rod (center)", tags: ["CET"] },
          { latex: "I_{parallel} = I_{cm} + Md^2", label: "Parallel Axis Theorem", tags: ["CET", "JEE"] },
          { latex: "KE_{rolling} = \\frac{1}{2}mv^2\\left(1 + \\frac{k^2}{R^2}\\right)", label: "Rolling KE", tags: ["JEE"] },
        ],
        points: [
          "Angular momentum conserved when net torque = 0",
          "For rolling without slipping: v = Rω",
          "k² = I/m (radius of gyration squared)",
          "Ring rolls slowest on incline (highest k²/R²)",
        ],
        mistakes: [
          "Forgetting to include both translational and rotational KE",
          "Applying parallel axis theorem from wrong reference",
          "Confusing τ = Iα with F = ma",
        ],
      },
      {
        title: "Gravitation",
        formulas: [
          { latex: "F = G\\frac{m_1 m_2}{r^2}", label: "Newton's Law of Gravitation", tags: ["CET", "JEE"] },
          { latex: "g = \\frac{GM}{R^2}", label: "Surface gravity", tags: ["CET", "JEE"] },
          { latex: "g_h = g\\left(1 - \\frac{2h}{R}\\right)", label: "g at height h (h<<R)", tags: ["CET"] },
          { latex: "g_d = g\\left(1 - \\frac{d}{R}\\right)", label: "g at depth d", tags: ["CET", "JEE"] },
          { latex: "v_e = \\sqrt{\\frac{2GM}{R}} = \\sqrt{2gR}", label: "Escape Velocity", tags: ["CET", "JEE"] },
          { latex: "v_o = \\sqrt{\\frac{GM}{r}} = \\sqrt{gR}", label: "Orbital Velocity", tags: ["CET", "JEE"] },
          { latex: "T^2 = \\frac{4\\pi^2 r^3}{GM}", label: "Kepler's 3rd Law", tags: ["CET", "JEE"] },
          { latex: "E_{total} = -\\frac{GMm}{2r}", label: "Total orbital energy", tags: ["JEE"] },
        ],
        points: [
          "v_e = √2 × v_o at surface",
          "g is max at surface, decreases above and below",
          "g = 0 at center of earth",
          "Geostationary orbit: T = 24h, height ≈ 36000 km",
          "G = 6.67 × 10⁻¹¹ N m² kg⁻²",
        ],
        tricks: [
          "v_e on earth ≈ 11.2 km/s",
          "v_o = v_e/√2",
          "Kepler's 1st: ellipse; 2nd: equal areas; 3rd: T²∝r³",
        ],
      },
    ],
  },
  {
    id: "elasticity",
    title: "Elasticity",
    icon: "🔩",
    color: "blue",
    sections: [
      {
        title: "Stress, Strain & Moduli",
        formulas: [
          { latex: "\\text{Stress} = \\frac{F}{A}", label: "Stress", tags: ["CET", "JEE"] },
          { latex: "\\text{Strain} = \\frac{\\Delta L}{L}", label: "Longitudinal Strain", tags: ["CET"] },
          { latex: "Y = \\frac{\\text{Stress}}{\\text{Strain}} = \\frac{FL}{A\\Delta L}", label: "Young's Modulus", tags: ["CET", "JEE"] },
          { latex: "B = -\\frac{\\Delta P}{\\Delta V/V}", label: "Bulk Modulus", tags: ["CET", "JEE"] },
          { latex: "\\eta = \\frac{\\text{Shear Stress}}{\\text{Shear Strain}}", label: "Rigidity Modulus", tags: ["CET"] },
          { latex: "\\sigma = \\frac{\\text{Lateral Strain}}{\\text{Longitudinal Strain}}", label: "Poisson's Ratio", tags: ["CET"] },
          { latex: "U = \\frac{1}{2}\\times\\text{Stress}\\times\\text{Strain}\\times V", label: "Elastic PE", tags: ["CET", "JEE"] },
        ],
        points: [
          "Elastic limit: max stress beyond which deformation is permanent",
          "Hooke's Law: Stress ∝ Strain (within elastic limit)",
          "Steel is more elastic than rubber (higher Y)",
          "Unit of Stress = N/m² = Pascal",
          "Strain is dimensionless",
          "0 < σ < 0.5 (Poisson's ratio range)",
        ],
        mistakes: [
          "Rubber is more elastic is WRONG — steel has higher Y",
          "Forgetting area is cross-sectional area",
          "Strain has no units",
        ],
        tricks: [
          "Y(steel) > Y(copper) > Y(aluminium) > Y(rubber)",
          "Incompressible material: σ = 0.5",
          "Energy per unit volume = ½ × stress × strain",
        ],
      },
    ],
  },
  {
    id: "fluids",
    title: "Fluid Mechanics",
    icon: "💧",
    color: "blue",
    sections: [
      {
        title: "Pressure & Buoyancy",
        formulas: [
          { latex: "P = \\frac{F}{A}", label: "Pressure", tags: ["CET", "JEE"] },
          { latex: "P = P_0 + \\rho g h", label: "Pressure at depth h", tags: ["CET", "JEE"] },
          { latex: "F_b = \\rho_{liquid} \\cdot V_{submerged} \\cdot g", label: "Buoyant Force", tags: ["CET", "JEE"] },
          { latex: "\\text{Relative Density} = \\frac{\\rho_{substance}}{\\rho_{water}}", label: "Relative Density", tags: ["CET"] },
        ],
        points: [
          "Pascal's Law: pressure applied to enclosed fluid transmitted equally",
          "Archimedes' Principle: buoyant force = weight of fluid displaced",
          "Object floats when ρ_object < ρ_fluid",
          "Pressure is scalar; force is vector",
        ],
        tricks: [
          "Weight in fluid = True weight − Buoyant force",
          "Fraction submerged = ρ_object/ρ_fluid",
        ],
      },
      {
        title: "Fluid Flow & Bernoulli",
        formulas: [
          { latex: "A_1 v_1 = A_2 v_2", label: "Equation of Continuity", tags: ["CET", "JEE"] },
          { latex: "P + \\frac{1}{2}\\rho v^2 + \\rho g h = \\text{const}", label: "Bernoulli's Equation", tags: ["CET", "JEE"] },
          { latex: "v = \\sqrt{2gh}", label: "Torricelli's Theorem", tags: ["CET", "JEE"] },
          { latex: "F = \\frac{6\\pi\\eta r v}{1}", label: "Stokes' Law", tags: ["CET"] },
          { latex: "v_t = \\frac{2r^2(\\rho - \\sigma)g}{9\\eta}", label: "Terminal Velocity", tags: ["CET", "JEE"] },
        ],
        points: [
          "Bernoulli: based on energy conservation",
          "Higher velocity → lower pressure (Bernoulli effect)",
          "Terminal velocity: drag = gravity − buoyancy",
          "Reynolds number determines laminar vs turbulent flow",
        ],
        mistakes: [
          "Bernoulli applies only to streamline (laminar) flow",
          "Torricelli: exit velocity independent of container shape",
        ],
        tricks: [
          "v_t ∝ r² — terminal velocity increases rapidly with radius",
          "Venturimeter uses Bernoulli's principle",
        ],
      },
    ],
  },
  {
    id: "surface_tension",
    title: "Surface Tension",
    icon: "🫧",
    color: "blue",
    sections: [
      {
        title: "Surface Tension & Capillarity",
        formulas: [
          { latex: "T = \\frac{F}{l}", label: "Surface Tension", tags: ["CET", "JEE"] },
          { latex: "W = T \\times \\Delta A", label: "Work done", tags: ["CET"] },
          { latex: "P_{excess} = \\frac{2T}{r}", label: "Excess pressure (drop)", tags: ["CET", "JEE"] },
          { latex: "P_{bubble} = \\frac{4T}{r}", label: "Excess pressure (soap bubble)", tags: ["CET", "JEE"] },
          { latex: "h = \\frac{2T\\cos\\theta}{\\rho g r}", label: "Capillary Rise", tags: ["CET", "JEE"] },
          { latex: "E = 4\\pi r^2 T", label: "Surface energy of drop", tags: ["CET"] },
        ],
        points: [
          "Soap bubble has TWO surfaces → 4T/r",
          "Water drop has ONE surface → 2T/r",
          "Capillary rise for water (wetting liquid); fall for mercury (non-wetting)",
          "Contact angle θ < 90° → wetting; θ > 90° → non-wetting",
          "Surface tension decreases with temperature",
          "Merging n drops of radius r into one: energy released = 4πr²T·n(1 − n^(-1/3))",
        ],
        mistakes: [
          "Confusing soap bubble (2 surfaces) vs liquid drop (1 surface)",
          "Mercury rises in capillary is WRONG — mercury falls",
          "Surface tension units: N/m or J/m²",
        ],
        tricks: [
          "For soap bubble: P_inside > P_outside by 4T/r",
          "Smaller bubble → greater excess pressure",
          "When two bubbles coalesce: 3r²= r₁² + r₂² (radius conservation by surface area)",
        ],
      },
    ],
  },
  {
    id: "viscosity",
    title: "Viscosity",
    icon: "🌊",
    color: "blue",
    sections: [
      {
        title: "Viscosity & Flow",
        formulas: [
          { latex: "F = \\eta A \\frac{dv}{dx}", label: "Newton's Law of Viscosity", tags: ["CET", "JEE"] },
          { latex: "v_t = \\frac{2r^2(\\rho-\\sigma)g}{9\\eta}", label: "Terminal Velocity", tags: ["CET", "JEE"] },
          { latex: "Q = \\frac{\\pi Pr^4}{8\\eta l}", label: "Poiseuille's Formula", tags: ["CET", "JEE"] },
          { latex: "R_e = \\frac{\\rho v D}{\\eta}", label: "Reynolds Number", tags: ["CET"] },
        ],
        points: [
          "η (eta) = coefficient of viscosity; SI unit: Pa·s = N·s/m²",
          "R_e < 2000: laminar flow; R_e > 3000: turbulent flow",
          "Viscosity of liquids decreases with temperature",
          "Viscosity of gases increases with temperature",
          "Terminal velocity when net force = 0",
        ],
        mistakes: [
          "Liquids get less viscous when heated (not more)",
          "Gases get more viscous when heated",
          "Stokes law only valid for small spherical objects at low velocities",
        ],
        tricks: [
          "v_t ∝ r² and v_t ∝ (ρ−σ) — lighter objects have lower terminal velocity",
          "Q ∝ r⁴ — doubling radius increases flow 16×",
        ],
      },
    ],
  },
  {
    id: "shm",
    title: "Simple Harmonic Motion",
    icon: "〰️",
    color: "blue",
    sections: [
      {
        title: "SHM Fundamentals",
        formulas: [
          { latex: "x = A\\sin(\\omega t + \\phi)", label: "Displacement", tags: ["CET", "JEE"] },
          { latex: "v = A\\omega\\cos(\\omega t + \\phi) = \\omega\\sqrt{A^2 - x^2}", label: "Velocity", tags: ["CET", "JEE"] },
          { latex: "a = -\\omega^2 x", label: "Acceleration", tags: ["CET", "JEE"] },
          { latex: "T_{pendulum} = 2\\pi\\sqrt{\\frac{L}{g}}", label: "Simple Pendulum", tags: ["CET", "JEE"] },
          { latex: "T_{spring} = 2\\pi\\sqrt{\\frac{m}{k}}", label: "Spring-Mass", tags: ["CET", "JEE"] },
          { latex: "E_{total} = \\frac{1}{2}kA^2 = \\frac{1}{2}m\\omega^2 A^2", label: "Total Energy", tags: ["CET", "JEE"] },
          { latex: "KE = \\frac{1}{2}m\\omega^2(A^2 - x^2)", label: "Kinetic Energy", tags: ["CET"] },
          { latex: "PE = \\frac{1}{2}m\\omega^2 x^2", label: "Potential Energy", tags: ["CET"] },
          { latex: "T_{series} = 2\\pi\\sqrt{\\frac{m(k_1+k_2)}{k_1 k_2}}", label: "Springs in Series", tags: ["CET"] },
          { latex: "T_{parallel} = 2\\pi\\sqrt{\\frac{m}{k_1+k_2}}", label: "Springs in Parallel", tags: ["CET", "JEE"] },
        ],
        points: [
          "SHM condition: a = −ω²x (restoring force proportional to displacement)",
          "KE + PE = constant = Total Energy",
          "At mean position: KE = max, PE = 0",
          "At extreme: KE = 0, PE = max",
          "f = ω/2π; T = 2π/ω",
          "Pendulum independent of mass and amplitude (small angles)",
          "Angular frequency ω = √(k/m) for spring",
        ],
        mistakes: [
          "Pendulum period depends on g, NOT on mass",
          "Using wrong formula for series vs parallel springs",
          "Forgetting phase constant φ",
          "SHM valid only for small amplitudes in pendulum",
        ],
        tricks: [
          "If spring cut to n pieces: k' = nk",
          "Effective k for series: 1/k = 1/k₁ + 1/k₂",
          "Effective k for parallel: k = k₁ + k₂",
          "v_max = Aω (at mean position)",
        ],
      },
    ],
  },
  {
    id: "waves",
    title: "Waves & Sound",
    icon: "🔊",
    color: "blue",
    sections: [
      {
        title: "Wave Fundamentals",
        formulas: [
          { latex: "v = f\\lambda = \\frac{\\lambda}{T}", label: "Wave speed", tags: ["CET", "JEE"] },
          { latex: "v_{string} = \\sqrt{\\frac{T}{\\mu}}", label: "Speed in string", tags: ["CET", "JEE"] },
          { latex: "v_{sound} = \\sqrt{\\frac{\\gamma P}{\\rho}} = \\sqrt{\\frac{B}{\\rho}}", label: "Speed of sound", tags: ["CET", "JEE"] },
          { latex: "v = 332 + 0.6t \\text{ m/s}", label: "Sound speed at t°C", tags: ["CET"] },
          { latex: "\\beta = 10\\log\\left(\\frac{I}{I_0}\\right)", label: "Sound Level (dB)", tags: ["CET"] },
          { latex: "f' = f\\left(\\frac{v \\pm v_0}{v \\mp v_s}\\right)", label: "Doppler Effect", tags: ["CET", "JEE"] },
        ],
        points: [
          "Sound: longitudinal wave; Light: transverse wave",
          "Speed of sound increases with temperature",
          "Speed of sound: steel > water > air",
          "I₀ = 10⁻¹² W/m² (threshold of hearing)",
          "Beats frequency = |f₁ − f₂|",
        ],
        mistakes: [
          "Doppler: observer moving towards source → + in numerator",
          "Speed of sound independent of frequency",
          "Intensity ∝ 1/r² (inverse square law)",
        ],
        tricks: [
          "v_sound at 0°C ≈ 332 m/s; at room temp ≈ 343 m/s",
          "Doppler: towards each other → higher frequency",
          "Beat frequency = |f₁ − f₂| ≤ 10 Hz for audible beats",
        ],
      },
      {
        title: "Standing Waves",
        formulas: [
          { latex: "f_n = \\frac{n}{2L}\\sqrt{\\frac{T}{\\mu}}", label: "String (both ends fixed)", tags: ["CET", "JEE"] },
          { latex: "f_n = \\frac{(2n-1)v}{4L}", label: "Pipe (one end open)", tags: ["CET", "JEE"] },
          { latex: "f_n = \\frac{nv}{2L}", label: "Pipe (both ends open)", tags: ["CET", "JEE"] },
          { latex: "\\Delta f = \\frac{v}{2L}", label: "Frequency gap (harmonics)", tags: ["CET"] },
        ],
        points: [
          "Open pipe: all harmonics present",
          "Closed pipe: only odd harmonics present",
          "Node: zero displacement; Antinode: max displacement",
          "λ/2 between two nodes (or two antinodes)",
          "End correction: e = 0.6r for open end",
        ],
        tricks: [
          "Fundamental of open pipe = Fundamental of string (both ends fixed) formula-wise",
          "Resonance occurs when L = nλ/2 (open) or nλ/4 (closed)",
        ],
      },
    ],
  },
  {
    id: "wave_optics",
    title: "Wave Optics",
    icon: "🌈",
    color: "blue",
    sections: [
      {
        title: "Interference & Diffraction",
        formulas: [
          { latex: "\\Delta x = \\frac{\\lambda D}{d}", label: "Fringe Width (YDSE)", tags: ["CET", "JEE"] },
          { latex: "y_n = \\frac{n\\lambda D}{d}", label: "Bright fringe position", tags: ["CET", "JEE"] },
          { latex: "y_n = \\frac{(2n-1)\\lambda D}{2d}", label: "Dark fringe position", tags: ["CET", "JEE"] },
          { latex: "I = I_1 + I_2 + 2\\sqrt{I_1 I_2}\\cos\\delta", label: "Resultant Intensity", tags: ["CET", "JEE"] },
          { latex: "\\sin\\theta = \\frac{n\\lambda}{d}", label: "Diffraction grating", tags: ["CET", "JEE"] },
          { latex: "\\theta_{min} = \\frac{1.22\\lambda}{D}", label: "Rayleigh's criterion", tags: ["JEE"] },
        ],
        points: [
          "YDSE: constructive interference → path difference = nλ",
          "YDSE: destructive interference → path difference = (2n−1)λ/2",
          "Fringe width β = λD/d (increases with λ and D, decreases with d)",
          "Coherent sources required for sustained interference",
          "Single slit diffraction: central maxima is twice as wide",
        ],
        mistakes: [
          "Confusing bright and dark fringe positions",
          "YDSE: d = slit separation; D = screen distance",
          "Fringe width same for all fringes in YDSE",
        ],
        tricks: [
          "If medium changed: β' = β × (λ'/λ) = β/μ",
          "Violet fringes narrowest; red widest (λ_red > λ_violet)",
          "For minimum fringe width: use smallest λ (violet ~400nm)",
        ],
      },
      {
        title: "Polarization",
        formulas: [
          { latex: "I = I_0 \\cos^2\\theta", label: "Malus's Law", tags: ["CET", "JEE"] },
          { latex: "\\tan\\theta_B = \\mu", label: "Brewster's Angle", tags: ["CET", "JEE"] },
        ],
        points: [
          "Polarization proves transverse nature of light",
          "At Brewster's angle: reflected ray is completely polarized",
          "θ_B + θ_r = 90° (angle of refraction)",
          "Unpolarized → polarizer → intensity halved",
        ],
      },
    ],
  },
  {
    id: "ray_optics",
    title: "Ray Optics",
    icon: "🔭",
    color: "blue",
    sections: [
      {
        title: "Reflection & Mirrors",
        formulas: [
          { latex: "\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f} = \\frac{2}{R}", label: "Mirror Formula", tags: ["CET", "JEE"] },
          { latex: "m = -\\frac{v}{u} = \\frac{h_i}{h_o}", label: "Magnification", tags: ["CET", "JEE"] },
          { latex: "f = \\frac{R}{2}", label: "Focal Length & Radius", tags: ["CET", "JEE"] },
        ],
        points: [
          "Sign convention: object always on left; distances measured from pole",
          "Real image: negative v; Virtual image: positive v",
          "Concave: f < 0; Convex: f > 0",
          "m > 0: erect; m < 0: inverted image",
          "m > 1: magnified; m < 1: diminished",
        ],
        tricks: [
          "Concave mirror: real, inverted when u > f",
          "Convex mirror: always virtual, erect, diminished",
          "Plane mirror: m = +1 always",
        ],
      },
      {
        title: "Refraction & Lenses",
        formulas: [
          { latex: "\\mu = \\frac{c}{v} = \\frac{\\sin i}{\\sin r}", label: "Refractive Index / Snell's Law", tags: ["CET", "JEE"] },
          { latex: "\\frac{\\mu_2}{v} - \\frac{\\mu_1}{u} = \\frac{\\mu_2 - \\mu_1}{R}", label: "Refraction at spherical surface", tags: ["JEE"] },
          { latex: "\\frac{1}{f} = (\\mu - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)", label: "Lensmaker's Equation", tags: ["CET", "JEE"] },
          { latex: "\\frac{1}{v} - \\frac{1}{u} = \\frac{1}{f}", label: "Lens Formula", tags: ["CET", "JEE"] },
          { latex: "P = \\frac{1}{f(m)}", label: "Power of Lens (diopters)", tags: ["CET", "JEE"] },
          { latex: "\\frac{1}{f} = \\frac{1}{f_1} + \\frac{1}{f_2}", label: "Combined focal length", tags: ["CET", "JEE"] },
          { latex: "\\mu_{critical} = \\frac{1}{\\sin C}", label: "TIR Critical Angle", tags: ["CET", "JEE"] },
          { latex: "\\delta = (\\mu - 1)A", label: "Prism deviation (thin prism)", tags: ["CET", "JEE"] },
          { latex: "\\delta_m = 2i - A \\text{ where } r = A/2", label: "Min. deviation in prism", tags: ["JEE"] },
        ],
        points: [
          "TIR: light goes from denser to rarer medium, i > critical angle",
          "Converging lens: f > 0; Diverging lens: f < 0",
          "P = P₁ + P₂ for combination of lenses",
          "Optical fiber works on TIR principle",
          "Myopia: concave lens; Hypermetropia: convex lens",
          "Dispersion: violet deviates most, red least (VIBGYOR)",
        ],
        mistakes: [
          "Snell's law: μ₁ sin i = μ₂ sin r (not μ₁/μ₂)",
          "TIR only when going denser → rarer",
          "Real is positive convention differs from real is negative (check which convention used)",
        ],
        tricks: [
          "sin C = 1/μ for glass-air interface",
          "μ_violet > μ_red → violet bends more in prism",
          "Angular dispersion = δ_V − δ_R = (μ_V − μ_R)A",
        ],
      },
    ],
  },
  {
    id: "thermal",
    title: "Thermal Expansion",
    icon: "🌡️",
    color: "blue",
    sections: [
      {
        title: "Thermal Expansion",
        formulas: [
          { latex: "\\Delta L = L_0 \\alpha \\Delta T", label: "Linear Expansion", tags: ["CET", "JEE"] },
          { latex: "\\Delta A = A_0 \\beta \\Delta T = A_0 (2\\alpha) \\Delta T", label: "Area Expansion", tags: ["CET"] },
          { latex: "\\Delta V = V_0 \\gamma \\Delta T = V_0 (3\\alpha) \\Delta T", label: "Volume Expansion", tags: ["CET", "JEE"] },
          { latex: "\\gamma = 3\\alpha = \\frac{3}{2}\\beta", label: "Relation: α, β, γ", tags: ["CET", "JEE"] },
          { latex: "\\rho' = \\frac{\\rho}{1 + \\gamma \\Delta T}", label: "Density after expansion", tags: ["CET"] },
        ],
        points: [
          "Liquids: real expansion > apparent expansion",
          "γ_real = γ_apparent + γ_vessel",
          "Water anomaly: max density at 4°C",
          "Thermal stress: σ = Yα ΔT",
          "Bimetallic strip: bends towards metal with smaller α",
        ],
        mistakes: [
          "Area expansion coefficient = 2α (not α)",
          "Volume expansion = 3α (not α)",
          "Water expands on cooling from 4°C to 0°C",
        ],
        tricks: [
          "α : β : γ = 1 : 2 : 3",
          "Mercury (γ ≈ 18 × 10⁻⁵) expands more than glass (γ ≈ 2.5 × 10⁻⁵)",
        ],
      },
    ],
  },
  {
    id: "calorimetry",
    title: "Calorimetry",
    icon: "🔥",
    color: "blue",
    sections: [
      {
        title: "Heat & Calorimetry",
        formulas: [
          { latex: "Q = mc\\Delta T", label: "Heat absorbed/released", tags: ["CET", "JEE"] },
          { latex: "Q = mL", label: "Latent Heat", tags: ["CET", "JEE"] },
          { latex: "\\frac{dQ}{dt} = kA\\frac{dT}{dx}", label: "Fourier's Law (Conduction)", tags: ["CET", "JEE"] },
          { latex: "\\frac{dQ}{dt} = \\sigma A T^4", label: "Stefan-Boltzmann Law", tags: ["CET", "JEE"] },
          { latex: "\\frac{dQ}{dt} = e\\sigma A(T^4 - T_0^4)", label: "Net radiation rate", tags: ["JEE"] },
          { latex: "\\frac{dT}{dt} = -b(T - T_0)", label: "Newton's Law of Cooling", tags: ["CET", "JEE"] },
          { latex: "\\lambda_{max} T = b = 2.898 \\times 10^{-3} \\text{ m K}", label: "Wien's Law", tags: ["CET", "JEE"] },
        ],
        points: [
          "Specific heat water: c = 4200 J/kg·K (highest common substance)",
          "L_fusion (ice) = 336 kJ/kg; L_vaporization (water) = 2260 kJ/kg",
          "Emissivity e: 0 < e ≤ 1 (e = 1 for perfect blackbody)",
          "Good absorber = good emitter (Kirchhoff's Law)",
          "Stefan's constant σ = 5.67 × 10⁻⁸ W/m²K⁴",
          "Newton's cooling: valid only for small temperature difference",
        ],
        mistakes: [
          "L_v >> L_f for water (vaporization needs more energy)",
          "Conduction: heat flows from hot to cold",
          "Calorimetry: heat gained = heat lost (isolated system)",
        ],
        tricks: [
          "Wien's law: hotter objects emit at shorter wavelength",
          "Black body absorbs all, reflects none",
          "Thermal resistance R = L/kA; like electrical resistance",
          "Thermal resistance in series: R_total = R₁ + R₂",
        ],
      },
    ],
  },
];

const CHEM_DATA = [
  {
    id: "mole_concept",
    title: "Mole Concept",
    icon: "⚗️",
    color: "green",
    sections: [
      {
        title: "Mole, Molarity & Calculations",
        formulas: [
          { latex: "n = \\frac{m}{M}", label: "Moles from mass", tags: ["CET", "JEE"] },
          { latex: "n = \\frac{N}{N_A}", label: "Moles from particles", tags: ["CET", "JEE"] },
          { latex: "n = \\frac{V}{22.4} \\text{ (STP, L)}", label: "Moles of gas at STP", tags: ["CET", "JEE"] },
          { latex: "M = \\frac{n}{V(L)}", label: "Molarity (M)", tags: ["CET", "JEE"] },
          { latex: "m = \\frac{n}{W_{solvent}(kg)}", label: "Molality (m)", tags: ["CET"] },
          { latex: "\\%w/w = \\frac{w_{solute}}{w_{solution}} \\times 100", label: "% by weight", tags: ["CET"] },
          { latex: "N = n \\times N_A = \\frac{m \\times N_A}{M}", label: "No. of particles", tags: ["CET", "JEE"] },
          { latex: "M_1V_1 = M_2V_2", label: "Dilution formula", tags: ["CET", "JEE"] },
        ],
        points: [
          "N_A = 6.022 × 10²³ mol⁻¹ (Avogadro's number)",
          "1 mole of any ideal gas at STP = 22.4 L",
          "Equivalent weight = M / n-factor",
          "Normality = Molarity × n-factor",
          "Empirical formula: simplest ratio; Molecular formula: actual ratio",
          "Mole fraction: x_A = n_A/(n_A + n_B)",
        ],
        mistakes: [
          "STP: 0°C (273K) and 1 atm — not 25°C",
          "22.4L only for ideal gas at STP",
          "Molecular mass ≠ equivalent mass",
        ],
        tricks: [
          "1 mole of electrons = 96500 C = 1 Faraday",
          "ppm = mg/L for dilute solutions",
          "Mole fraction sum = 1 always",
        ],
      },
    ],
  },
  {
    id: "atomic_structure",
    title: "Atomic Structure",
    icon: "⚛️",
    color: "green",
    sections: [
      {
        title: "Quantum Numbers & Spectra",
        formulas: [
          { latex: "E_n = -\\frac{13.6}{n^2} \\text{ eV (hydrogen)}", label: "Energy of orbit", tags: ["CET", "JEE"] },
          { latex: "r_n = 0.529 \\times n^2 \\text{ Å (hydrogen)}", label: "Radius of orbit", tags: ["CET", "JEE"] },
          { latex: "v_n = \\frac{2.18 \\times 10^6}{n} \\text{ m/s}", label: "Velocity in orbit", tags: ["CET"] },
          { latex: "\\bar{\\nu} = R_H\\left(\\frac{1}{n_1^2} - \\frac{1}{n_2^2}\\right)", label: "Rydberg Formula", tags: ["CET", "JEE"] },
          { latex: "\\lambda = \\frac{h}{mv}", label: "de Broglie wavelength", tags: ["CET", "JEE"] },
          { latex: "\\Delta x \\cdot \\Delta p \\geq \\frac{h}{4\\pi}", label: "Heisenberg's Uncertainty", tags: ["CET", "JEE"] },
          { latex: "E = h\\nu = \\frac{hc}{\\lambda}", label: "Photon energy", tags: ["CET", "JEE"] },
        ],
        points: [
          "Spectral series: Lyman (UV), Balmer (Visible), Paschen (IR)",
          "n=2→1: Lyman; n=3→2: Balmer (first line)",
          "Quantum numbers: n (principal), l (azimuthal), m_l (magnetic), m_s (spin)",
          "l = 0,1,...,n−1; m_l = −l to +l",
          "Pauli exclusion: no two electrons same set of 4 QNs",
          "Hund's rule: max multiplicity in degenerate orbitals",
          "Aufbau: fill lowest energy first (n+l rule)",
        ],
        mistakes: [
          "Bohr's model only valid for H and H-like species",
          "Balmer series in visible region (NOT UV)",
          "Subshells: s(2), p(6), d(10), f(14) max electrons",
        ],
        tricks: [
          "Number of spectral lines from n: n(n−1)/2",
          "r_n for H-like ion: r = 0.529(n²/Z) Å",
          "E_n for H-like ion: E = −13.6(Z²/n²) eV",
          "n+l rule: 4s fills before 3d",
        ],
      },
    ],
  },
  {
    id: "periodic_table",
    title: "Periodic Table",
    icon: "📊",
    color: "green",
    sections: [
      {
        title: "Periodic Trends",
        formulas: [
          { latex: "IE_1 < IE_2 < IE_3 \\ldots", label: "Successive IE order", tags: ["CET", "JEE"] },
          { latex: "\\text{Atomic radius: } r \\propto \\frac{n}{Z_{eff}}", label: "Atomic radius trend", tags: ["CET"] },
        ],
        points: [
          "Atomic radius: increases down group, decreases across period",
          "IE: decreases down group, increases across period (exceptions: Be>B, N>O)",
          "Electronegativity: F is highest (4.0); Cs lowest",
          "Electron Affinity: highest for Cl (not F due to small size)",
          "Metallic character: increases down group, decreases across period",
          "Exception: IE₁(Be) > IE₁(B) because 2s is more stable than 2p",
          "Exception: IE₁(N) > IE₁(O) because half-filled 2p is extra stable",
        ],
        mistakes: [
          "F has highest electronegativity but NOT highest EA",
          "Noble gases have positive EA (zero in some texts)",
          "Lanthanide contraction causes 4d ≈ 5d atomic radii",
        ],
        tricks: [
          "F: most electronegative; Cs: most electropositive",
          "Most reactive metal: Cs (or Fr); Most reactive nonmetal: F",
          "Period 3 elements: Na, Mg, Al, Si, P, S, Cl, Ar",
        ],
      },
    ],
  },
  {
    id: "chemical_bonding",
    title: "Chemical Bonding",
    icon: "🔗",
    color: "green",
    sections: [
      {
        title: "Bonding Concepts",
        formulas: [
          { latex: "\\text{Bond order} = \\frac{\\text{Bonding} - \\text{Antibonding}}{2}", label: "Bond Order (MO Theory)", tags: ["CET", "JEE"] },
          { latex: "\\text{Lone Pairs on central atom} = \\frac{V - B}{2}", label: "Lone pair calculation", tags: ["CET", "JEE"] },
          { latex: "\\vec{\\mu} = q \\times d", label: "Dipole Moment", tags: ["CET", "JEE"] },
        ],
        points: [
          "VSEPR: lone pair−lone pair > lone pair−bond pair > bond pair−bond pair repulsion",
          "Hybridization: sp(linear), sp²(trigonal planar), sp³(tetrahedral)",
          "sp³d(trigonal bipyramidal), sp³d²(octahedral)",
          "Formal charge = Valence − (lone pair e⁻) − ½(bond e⁻)",
          "Resonance structures: average of contributing structures",
          "σ bond: head-on overlap; π bond: lateral overlap",
          "H-bonding: strongest with F, then O, then N",
          "BF₃: sp², trigonal planar, non-polar; NF₃: sp³, pyramidal, polar",
        ],
        mistakes: [
          "Bond order 0 → molecule doesn't exist (He₂)",
          "High bond order → short bond, strong bond",
          "CO is polar despite simple structure (C→O)",
          "H₂O has 2 lone pairs on O — bent shape",
          "PCl₅ is sp³d — 5 bonds possible for P (expanded octet)",
        ],
        tricks: [
          "Number of σ bonds = total bonds; π bonds = additional bonds beyond single",
          "Dipole moment zero: BF₃, CCl₄, CO₂, BeF₂ (symmetric)",
          "μ ≠ 0: H₂O, NH₃, SO₂, CHCl₃",
          "Bond angle: sp³ 109.5° → reduces with lone pairs (NH₃: 107°, H₂O: 104.5°)",
        ],
      },
    ],
  },
  {
    id: "redox",
    title: "Redox Reactions",
    icon: "⚡",
    color: "green",
    sections: [
      {
        title: "Oxidation States & Balancing",
        formulas: [
          { latex: "\\Delta G^\\circ = -nFE^\\circ_{cell}", label: "ΔG and Cell EMF", tags: ["CET", "JEE"] },
          { latex: "E^\\circ_{cell} = E^\\circ_{cathode} - E^\\circ_{anode}", label: "Cell EMF", tags: ["CET", "JEE"] },
          { latex: "E = E^\\circ - \\frac{RT}{nF}\\ln Q", label: "Nernst Equation", tags: ["CET", "JEE"] },
          { latex: "E = E^\\circ - \\frac{0.0591}{n}\\log Q \\text{ (at 25°C)}", label: "Nernst (simplified)", tags: ["CET", "JEE"] },
        ],
        points: [
          "Oxidation: loss of electrons (OIL); Reduction: gain (RIG)",
          "Oxidizing agent: gets reduced; Reducing agent: gets oxidized",
          "Common oxidation states: Mn(+2,+4,+7), Cr(+3,+6), Fe(+2,+3)",
          "Disproportionation: same element oxidized and reduced",
          "Balancing redox: half-reaction method (acidic/basic medium)",
          "SHE: E° = 0 V (Standard Hydrogen Electrode)",
        ],
        mistakes: [
          "O is −2 except in OF₂ (+2), Na₂O₂ (−1), O₂/O₃ (0)",
          "H is +1 except in metal hydrides (−1)",
          "F always −1 (most electronegative)",
          "E°cell positive → spontaneous reaction (ΔG < 0)",
        ],
        tricks: [
          "KMnO₄: purple (acidic → Mn²⁺; basic → MnO₂; neutral → MnO₄²⁻)",
          "K₂Cr₂O₇: orange; Cr₂O₃: green",
          "Reducing power: Li > K > Ca > Na > Mg > Al > Zn > Fe",
        ],
      },
    ],
  },
  {
    id: "thermodynamics",
    title: "Thermodynamics",
    icon: "🌡️",
    color: "green",
    sections: [
      {
        title: "Laws & Functions",
        formulas: [
          { latex: "\\Delta U = q + w", label: "First Law", tags: ["CET", "JEE"] },
          { latex: "w = -P_{ext}\\Delta V", label: "Work at const. P", tags: ["CET", "JEE"] },
          { latex: "\\Delta H = \\Delta U + \\Delta n_g RT", label: "Enthalpy relation", tags: ["CET", "JEE"] },
          { latex: "\\Delta G = \\Delta H - T\\Delta S", label: "Gibbs Free Energy", tags: ["CET", "JEE"] },
          { latex: "\\Delta G^\\circ = -RT\\ln K", label: "ΔG° and K", tags: ["CET", "JEE"] },
          { latex: "C_p - C_v = R", label: "Meyer's Relation", tags: ["CET", "JEE"] },
          { latex: "\\gamma = \\frac{C_p}{C_v}", label: "Ratio of specific heats", tags: ["CET"] },
          { latex: "\\Delta S = \\frac{q_{rev}}{T}", label: "Entropy change", tags: ["CET", "JEE"] },
          { latex: "\\Delta H_f^\\circ(product) - \\Delta H_f^\\circ(reactant)", label: "Hess's Law application", tags: ["CET"] },
        ],
        points: [
          "Isothermal: ΔT=0, ΔU=0; Adiabatic: q=0; Isobaric: ΔP=0; Isochoric: ΔV=0",
          "Spontaneous: ΔG < 0; Non-spontaneous: ΔG > 0; Equilibrium: ΔG = 0",
          "ΔG < 0 when: (a) ΔH<0, ΔS>0 (always); (b) ΔH<0, ΔS<0 at low T; (c) ΔH>0, ΔS>0 at high T",
          "Bond enthalpy: energy to break 1 mole of bonds",
          "Lattice energy: energy to form 1 mole of ionic solid from gas phase ions",
          "Standard state: 298 K, 1 atm",
        ],
        mistakes: [
          "w = −PΔV (work done ON system is positive)",
          "ΔH = ΔU only when Δn_g = 0",
          "Entropy of universe always increases (2nd Law)",
          "Exothermic: ΔH < 0; Endothermic: ΔH > 0",
        ],
        tricks: [
          "Monoatomic gas: Cv = 3R/2, Cp = 5R/2, γ = 5/3",
          "Diatomic gas: Cv = 5R/2, Cp = 7R/2, γ = 7/5",
          "Combustion: always exothermic (ΔH < 0)",
          "Born-Haber cycle for lattice energy calculation",
        ],
      },
    ],
  },
  {
    id: "chemical_equilibrium",
    title: "Chemical Equilibrium",
    icon: "⚖️",
    color: "green",
    sections: [
      {
        title: "Equilibrium Constants",
        formulas: [
          { latex: "K_c = \\frac{[C]^c[D]^d}{[A]^a[B]^b}", label: "Equilibrium Constant Kc", tags: ["CET", "JEE"] },
          { latex: "K_p = K_c(RT)^{\\Delta n_g}", label: "Kp from Kc", tags: ["CET", "JEE"] },
          { latex: "Q_c < K_c \\Rightarrow \\text{forward reaction}", label: "Reaction Quotient", tags: ["CET", "JEE"] },
          { latex: "\\Delta G^\\circ = -RT\\ln K", label: "Free energy & K", tags: ["CET", "JEE"] },
          { latex: "\\alpha = \\sqrt{\\frac{K_c}{K_c + C}}", label: "Degree of dissociation (approx)", tags: ["CET"] },
        ],
        points: [
          "Le Chatelier's Principle: system shifts to counteract stress",
          "K > 1: products favored; K < 1: reactants favored",
          "Temperature: affects K (van't Hoff equation)",
          "Catalyst: doesn't change K, only speeds up reaching equilibrium",
          "Pressure increase: shifts towards fewer moles of gas",
          "Pure solids/liquids NOT included in K expression",
          "For reverse reaction: K' = 1/K",
          "For n × reaction: K' = Kⁿ",
        ],
        mistakes: [
          "Catalyst changes rate but NOT K",
          "Adding inert gas at constant volume: no effect on equilibrium",
          "Adding inert gas at constant pressure: shifts to more moles side",
          "Pure solids excluded from K expression",
        ],
        tricks: [
          "K_p = K_c when Δn_g = 0",
          "Higher K at higher T → endothermic forward reaction",
          "Degree of dissociation α = √(K/C) for A ⇌ 2B type",
        ],
      },
    ],
  },
  {
    id: "ionic_equilibrium",
    title: "Ionic Equilibrium",
    icon: "🧪",
    color: "green",
    sections: [
      {
        title: "pH, Ka, Kb & Buffers",
        formulas: [
          { latex: "K_w = [H^+][OH^-] = 10^{-14} \\text{ at 25°C}", label: "Ionic product of water", tags: ["CET", "JEE"] },
          { latex: "pH = -\\log[H^+]", label: "pH definition", tags: ["CET", "JEE"] },
          { latex: "pH + pOH = 14 \\text{ at 25°C}", label: "pH + pOH", tags: ["CET", "JEE"] },
          { latex: "pH = \\frac{1}{2}(pK_a - \\log C)", label: "Weak acid pH", tags: ["CET", "JEE"] },
          { latex: "[H^+] = \\sqrt{K_a \\cdot C}", label: "H⁺ from weak acid", tags: ["CET", "JEE"] },
          { latex: "pH = pK_a + \\log\\frac{[A^-]}{[HA]}", label: "Henderson-Hasselbalch", tags: ["CET", "JEE"] },
          { latex: "K_a \\times K_b = K_w", label: "Ka × Kb relation", tags: ["CET", "JEE"] },
          { latex: "K_{sp} = [M^+]^m[X^-]^x", label: "Solubility Product", tags: ["CET", "JEE"] },
          { latex: "s = \\left(\\frac{K_{sp}}{4}\\right)^{1/3} \\text{ for M}^{2+}\\text{X}^{2-}", label: "Solubility from Ksp", tags: ["CET"] },
        ],
        points: [
          "Strong acids: HCl, HBr, HI, HNO₃, H₂SO₄, HClO₄",
          "Strong bases: Group 1 hydroxides + Ba(OH)₂, Ca(OH)₂",
          "Buffer capacity: maximum at pH = pKa",
          "Common ion effect: reduces solubility",
          "Salt hydrolysis: weak acid + strong base → basic; strong acid + weak base → acidic",
          "pH at equivalence point: 7 (strong-strong), >7 (strong acid+weak base), <7 (weak acid+strong base)",
        ],
        mistakes: [
          "Water is amphoteric (can act as acid or base)",
          "pH of 10⁻⁸ M HCl is NOT 8 (effect of water's H⁺)",
          "Ksp depends on temperature, not concentration",
          "Solubility decreases with common ion",
        ],
        tricks: [
          "pKa + pKb = pKw = 14 at 25°C",
          "Buffer range: pH = pKa ± 1",
          "pH of 0.1M HCl = 1; 0.01M = 2",
          "Indicators: change color within pKa ± 1 range",
        ],
      },
    ],
  },
  {
    id: "coordination",
    title: "Coordination Compounds",
    icon: "🔮",
    color: "green",
    sections: [
      {
        title: "VBT & Nomenclature",
        formulas: [
          { latex: "\\text{Coordination number} = \\text{no. of donor atoms}", label: "CN Definition", tags: ["CET", "JEE"] },
          { latex: "\\mu = \\sqrt{n(n+2)} \\text{ BM}", label: "Magnetic moment", tags: ["CET", "JEE"] },
        ],
        points: [
          "IUPAC: [Cr(NH₃)₄Cl₂]Cl = Tetraamminedichloridochromium(III) chloride",
          "Ligands: monodentate (Cl⁻, CN⁻, NH₃), bidentate (en, ox²⁻), polydentate (EDTA)",
          "VBT: sp³ → tetrahedral; sp³d²/d²sp³ → octahedral; dsp² → square planar",
          "Inner orbital complex: d²sp³ (uses 3d); Outer: sp³d² (uses 4d)",
          "EAN = Z − oxidation state + (CN × 2)",
          "Effective Atomic Number rule for stability",
          "Isomers: linkage, ionisation, hydrate, coordination isomerism",
          "Optical isomers: [Co(en)₃]³⁺ (3 bidentate), [Co(en)₂Cl₂]⁺",
        ],
        mistakes: [
          "Central metal ion named BEFORE ligands in formula but AFTER in name",
          "Negative ligands end in -o; neutral ligands use common names",
          "Anionic complex uses -ate suffix for metal",
          "Inner orbital: greater stability, low spin; outer orbital: high spin",
        ],
        tricks: [
          "Ambidentate: SCN⁻ (can bond through S or N), NO₂⁻",
          "EDTA is hexadentate (6 donor atoms)",
          "Strong field ligands: CO > CN⁻ > en > NH₃ > H₂O > OH⁻ > F⁻ > Cl⁻ > Br⁻ > I⁻",
          "Chelate effect: polydentate > monodentate stability",
        ],
      },
    ],
  },
  {
    id: "iupac",
    title: "IUPAC Nomenclature",
    icon: "🏷️",
    color: "green",
    sections: [
      {
        title: "Organic Naming Rules",
        formulas: [],
        points: [
          "Priority: carboxylic acid > ester > acid halide > amide > aldehyde > ketone > alcohol > amine > alkene > alkyne > alkane",
          "Parent chain: longest chain containing principal group",
          "Locants: lowest possible numbers to substituents",
          "Prefixes: di, tri, tetra for same substituents",
          "Suffixes: -oic acid, -al, -one, -ol, -amine, -ene, -yne",
          "Alicyclic: cyclo prefix (cyclopentane, cyclohexane)",
          "Branched: use iso-, neo-, sec-, tert- (common names) or IUPAC",
        ],
        mistakes: [
          "Ketone: principal group NOT at C-1 (always C-2 or higher)",
          "Aldehyde always at C-1 (don't give it a locant)",
          "Count O in ether separately from chain",
          "Cyclic compounds: start numbering from principal group",
        ],
        tricks: [
          "CH₃—: methyl; C₂H₅—: ethyl; C₃H₇—: propyl; C₄H₉—: butyl",
          "Common: isopropyl = 1-methylethyl; isobutyl = 2-methylpropyl",
          "Vinyl = ethenyl; Allyl = prop-2-en-1-yl; Benzyl = phenylmethyl",
          "Ph = phenyl (C₆H₅—); Bn = benzyl (C₆H₅CH₂—)",
        ],
      },
    ],
  },
  {
    id: "goc",
    title: "General Organic Chemistry",
    icon: "🧬",
    color: "green",
    sections: [
      {
        title: "Effects, Intermediates & Mechanisms",
        formulas: [
          { latex: "pK_a = -\\log K_a", label: "pKa and acidity", tags: ["CET", "JEE"] },
        ],
        points: [
          "Inductive effect: through σ bonds; decreases with distance",
          "+I groups: alkyl (CH₃ > C₂H₅...), –I groups: halogens, NO₂, CN, COOH",
          "Mesomeric effect: through π bonds / lone pairs (conjugation)",
          "+M groups: −OH, −OR, −NH₂, −NR₂, halogens; −M: NO₂, CN, CHO, COR, COOH",
          "Carbocation stability: 3° > 2° > 1° > CH₃⁺ (hyperconjugation + induction)",
          "Carbanion stability: CH₃⁻ > 1° > 2° > 3° (opposite to carbocation)",
          "Radical stability: 3° > 2° > 1° > CH₃ (like carbocation)",
          "Acidity of carboxylic acids: HCOOH > CH₃COOH > C₂H₅COOH",
          "EWG increase acidity; EDG decrease acidity of benzoic acid",
          "Electrophile: electron-deficient (+); Nucleophile: electron-rich (−)",
          "SN1: tertiary, protic solvent, racemization; SN2: primary, aprotic, inversion",
        ],
        mistakes: [
          "Halogens are −I but +M (net electron-withdrawing overall)",
          "Hyperconjugation: more α-H → more stability",
          "SN1 racemizes; SN2 inverts configuration (Walden inversion)",
        ],
        tricks: [
          "Acidity: more stable conjugate base → more acidic",
          "Phenol is acidic; aniline is basic (but much weaker than aliphatic)",
          "EWG ortho/para → increase acidity of phenol; EDG decrease",
          "Hofmann vs Saytzeff: SN2 → Hofmann (less substituted); E2 → Saytzeff (more substituted)",
        ],
      },
    ],
  },
  {
    id: "isomerism",
    title: "Isomerism",
    icon: "🔄",
    color: "green",
    sections: [
      {
        title: "Types of Isomerism",
        formulas: [],
        points: [
          "Structural isomerism: chain, position, functional group, metamerism, tautomerism",
          "Stereoisomerism: geometrical (cis-trans) and optical",
          "Geometrical isomerism: requires restricted rotation and two different groups on each C",
          "Optical isomerism: requires chiral centre (asymmetric C, 4 different groups)",
          "R/S configuration: priority by atomic number (CIP rules)",
          "Enantiomers: non-superimposable mirror images, rotate plane-polarized light equally and opposite",
          "Diastereomers: stereoisomers that are NOT mirror images",
          "Meso compound: has chiral centers but is achiral (internal plane of symmetry)",
          "Racemic mixture: equal d and l forms, optically inactive",
        ],
        mistakes: [
          "Identical groups on same C → no geometrical isomerism",
          "Ring compounds CAN show geometrical isomerism",
          "Meso compound: chiral centers present but molecule achiral",
          "Number of stereoisomers = 2ⁿ (n = no. of chiral centers); may be less due to meso forms",
        ],
        tricks: [
          "E/Z for alkenes: E (German: entgegen = opposite); Z (zusammen = together)",
          "Priority: I > Br > Cl > F > O > N > C > H",
          "Tartaric acid: 2 chiral centers → 3 stereoisomers (2 optically active + 1 meso)",
          "SN2 → inversion of configuration (Walden inversion)",
          "Plane of symmetry, center of symmetry → achiral",
        ],
      },
    ],
  },
];

// Constants
const IMPORTANT_CONSTANTS = [
  { name: "Avogadro's Number", symbol: "N_A", value: "6.022 \\times 10^{23} \\text{ mol}^{-1}" },
  { name: "Speed of Light", symbol: "c", value: "3 \\times 10^8 \\text{ m/s}" },
  { name: "Planck's Constant", symbol: "h", value: "6.626 \\times 10^{-34} \\text{ J·s}" },
  { name: "Gravitational Constant", symbol: "G", value: "6.67 \\times 10^{-11} \\text{ N m}^2 \\text{kg}^{-2}" },
  { name: "Electron charge", symbol: "e", value: "1.6 \\times 10^{-19} \\text{ C}" },
  { name: "Boltzmann Constant", symbol: "k_B", value: "1.38 \\times 10^{-23} \\text{ J/K}" },
  { name: "Gas Constant", symbol: "R", value: "8.314 \\text{ J mol}^{-1} \\text{K}^{-1}" },
  { name: "Faraday Constant", symbol: "F", value: "96500 \\text{ C mol}^{-1}" },
  { name: "Stefan-Boltzmann", symbol: "\\sigma", value: "5.67 \\times 10^{-8} \\text{ W m}^{-2} \\text{K}^{-4}" },
  { name: "Bohr Radius", symbol: "a_0", value: "0.529 \\text{ Å}" },
  { name: "Rydberg Constant", symbol: "R_H", value: "1.097 \\times 10^7 \\text{ m}^{-1}" },
  { name: "Mass of electron", symbol: "m_e", value: "9.11 \\times 10^{-31} \\text{ kg}" },
];

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSubject, setActiveSubject] = useState("physics");
  const [activeTopicId, setActiveTopicId] = useState("mechanics");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState({});
  const [bookmarks, setBookmarks] = useState(new Set());
  const [formulaOnlyMode, setFormulaOnlyMode] = useState(false);
  const [quickRevisionMode, setQuickRevisionMode] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("topics"); // topics, constants, bookmarks
  const contentRef = useRef(null);

  const allData = activeSubject === "physics" ? PHYSICS_DATA : CHEM_DATA;

  const activeTopic = useMemo(
    () => allData.find((t) => t.id === activeTopicId) || allData[0],
    [allData, activeTopicId]
  );

  // KaTeX is loaded via npm import

  // When topic changes, scroll to top
  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [activeTopicId]);

  // Reset topic when subject changes
  useEffect(() => {
    const data = activeSubject === "physics" ? PHYSICS_DATA : CHEM_DATA;
    setActiveTopicId(data[0].id);
  }, [activeSubject]);

  const renderLatex = (latex) => {
    try {
      const html = katex.renderToString(latex, { displayMode: false, throwOnError: false });
      return <span dangerouslySetInnerHTML={{ __html: html }} />;
    } catch {
      return <span style={{ fontFamily: "monospace", fontSize: "0.875rem" }}>{latex}</span>;
    }
  };

  const renderLatexDisplay = (latex) => {
    try {
      const html = katex.renderToString(latex, { displayMode: true, throwOnError: false });
      return <span dangerouslySetInnerHTML={{ __html: html }} />;
    } catch {
      return <span style={{ fontFamily: "monospace", fontSize: "0.875rem" }}>{latex}</span>;
    }
  };

  const toggleSection = (id) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleBookmark = (id) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Search filtering
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results = [];
    [...PHYSICS_DATA, ...CHEM_DATA].forEach((topic) => {
      topic.sections.forEach((section) => {
        section.formulas?.forEach((f) => {
          if (f.label.toLowerCase().includes(q) || f.latex.toLowerCase().includes(q)) {
            results.push({ ...f, topic: topic.title, subject: topic.color === "blue" ? "physics" : "chemistry" });
          }
        });
      });
    });
    return results.slice(0, 20);
  }, [searchQuery]);

  const colors = {
    physics: {
      accent: darkMode ? "#60a5fa" : "#2563eb",
      bg: darkMode ? "rgba(59,130,246,0.08)" : "rgba(37,99,235,0.06)",
      border: darkMode ? "rgba(59,130,246,0.3)" : "rgba(37,99,235,0.2)",
      tag: darkMode ? "bg-blue-900/60 text-blue-300" : "bg-blue-100 text-blue-700",
    },
    chemistry: {
      accent: darkMode ? "#34d399" : "#059669",
      bg: darkMode ? "rgba(52,211,153,0.08)" : "rgba(5,150,105,0.06)",
      border: darkMode ? "rgba(52,211,153,0.3)" : "rgba(5,150,105,0.2)",
      tag: darkMode ? "bg-emerald-900/60 text-emerald-300" : "bg-emerald-100 text-emerald-700",
    },
  };

  const subj = activeSubject === "physics" ? colors.physics : colors.chemistry;

  const base = darkMode
    ? { bg: "#0f1117", card: "#1a1d27", sidebar: "#13161f", text: "#e2e8f0", muted: "#64748b", border: "#2d3245" }
    : { bg: "#f8faff", card: "#ffffff", sidebar: "#f1f4ff", text: "#1e293b", muted: "#64748b", border: "#e2e8f0" };

  const tagCls = {
    CET: darkMode ? "bg-amber-900/50 text-amber-300 border border-amber-700/40" : "bg-amber-50 text-amber-700 border border-amber-200",
    JEE: darkMode ? "bg-purple-900/50 text-purple-300 border border-purple-700/40" : "bg-purple-50 text-purple-700 border border-purple-200",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: base.bg,
        color: base.text,
        fontFamily: "'SF Pro Display', 'Segoe UI', system-ui, sans-serif",
        transition: "background 0.3s, color 0.3s",
      }}
    >
      {/* Top Nav */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: darkMode ? "rgba(15,17,23,0.95)" : "rgba(248,250,255,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${base.border}`,
          padding: "0 1.5rem",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "none",
              border: "none",
              color: base.muted,
              cursor: "pointer",
              fontSize: "1.25rem",
              padding: "4px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
            }}
          >
            ☰
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.3rem" }}>📚</span>
            <span style={{ fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>
              <span style={{ color: subj.accent }}>JEE</span>
              <span style={{ color: base.text }}> & CET</span>
            </span>
            <span
              style={{
                fontSize: "0.65rem",
                background: subj.bg,
                color: subj.accent,
                border: `1px solid ${subj.border}`,
                padding: "2px 8px",
                borderRadius: "99px",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              REVISION PRO
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search formulas, topics..."
            style={{
              width: "100%",
              padding: "8px 16px 8px 36px",
              background: base.card,
              border: `1px solid ${base.border}`,
              borderRadius: "10px",
              color: base.text,
              fontSize: "0.875rem",
              outline: "none",
            }}
          />
          <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: base.muted, fontSize: "0.9rem" }}>🔍</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: base.muted, cursor: "pointer", fontSize: "1rem" }}
            >
              ✕
            </button>
          )}
          {/* Search Dropdown */}
          {searchResults.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                right: 0,
                background: base.card,
                border: `1px solid ${base.border}`,
                borderRadius: "12px",
                maxHeight: "320px",
                overflowY: "auto",
                zIndex: 100,
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              }}
            >
              {searchResults.map((r, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setActiveSubject(r.subject);
                    setSearchQuery("");
                  }}
                  style={{
                    padding: "10px 16px",
                    borderBottom: i < searchResults.length - 1 ? `1px solid ${base.border}` : "none",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = base.sidebar)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ fontSize: "0.75rem", color: r.subject === "physics" ? colors.physics.accent : colors.chemistry.accent, marginBottom: "2px", fontWeight: 600 }}>
                    {r.topic}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: base.text }}>{r.label}</div>
                  <div style={{ fontSize: "0.75rem", color: base.muted, fontFamily: "monospace" }}>{r.latex.slice(0, 50)}...</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={() => setFormulaOnlyMode(!formulaOnlyMode)}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: `1px solid ${formulaOnlyMode ? subj.border : base.border}`,
              background: formulaOnlyMode ? subj.bg : "transparent",
              color: formulaOnlyMode ? subj.accent : base.muted,
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            ∑ Formula Only
          </button>
          <button
            onClick={() => setQuickRevisionMode(!quickRevisionMode)}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: `1px solid ${quickRevisionMode ? "#a855f7" : base.border}`,
              background: quickRevisionMode ? "rgba(168,85,247,0.1)" : "transparent",
              color: quickRevisionMode ? "#a855f7" : base.muted,
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            ⚡ Quick Rev
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              background: base.card,
              border: `1px solid ${base.border}`,
              borderRadius: "8px",
              padding: "6px 10px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>

      <div style={{ display: "flex", height: "calc(100vh - 60px)", overflow: "hidden" }}>
        {/* Sidebar */}
        {sidebarOpen && (
          <aside
            style={{
              width: "260px",
              minWidth: "260px",
              background: base.sidebar,
              borderRight: `1px solid ${base.border}`,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Subject Tabs */}
            <div style={{ padding: "1rem", borderBottom: `1px solid ${base.border}`, display: "flex", gap: "0.5rem" }}>
              {["physics", "chemistry"].map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSubject(s)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "8px",
                    border: `1px solid ${activeSubject === s ? (s === "physics" ? colors.physics.border : colors.chemistry.border) : base.border}`,
                    background: activeSubject === s ? (s === "physics" ? colors.physics.bg : colors.chemistry.bg) : "transparent",
                    color: activeSubject === s ? (s === "physics" ? colors.physics.accent : colors.chemistry.accent) : base.muted,
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {s === "physics" ? "⚡ Physics" : "🧪 Chem"}
                </button>
              ))}
            </div>

            {/* View tabs */}
            <div style={{ padding: "0.5rem 1rem", borderBottom: `1px solid ${base.border}`, display: "flex", gap: "0.25rem" }}>
              {[["topics", "📖"], ["constants", "🔢"], ["bookmarks", "🔖"]].map(([v, icon]) => (
                <button
                  key={v}
                  onClick={() => setActiveView(v)}
                  style={{
                    flex: 1,
                    padding: "5px 4px",
                    borderRadius: "6px",
                    border: "none",
                    background: activeView === v ? subj.bg : "transparent",
                    color: activeView === v ? subj.accent : base.muted,
                    cursor: "pointer",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                  }}
                >
                  {icon} {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>

            {/* Topic List */}
            {activeView === "topics" && (
              <div style={{ padding: "0.5rem", flex: 1 }}>
                {allData.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setActiveTopicId(topic.id)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: `1px solid ${activeTopicId === topic.id ? subj.border : "transparent"}`,
                      background: activeTopicId === topic.id ? subj.bg : "transparent",
                      color: activeTopicId === topic.id ? subj.accent : base.text,
                      cursor: "pointer",
                      marginBottom: "2px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "0.875rem",
                      fontWeight: activeTopicId === topic.id ? 600 : 400,
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => { if (activeTopicId !== topic.id) e.currentTarget.style.background = base.card; }}
                    onMouseLeave={(e) => { if (activeTopicId !== topic.id) e.currentTarget.style.background = "transparent"; }}
                  >
                    <span style={{ fontSize: "1rem" }}>{topic.icon}</span>
                    <span>{topic.title}</span>
                    {activeTopicId === topic.id && <span style={{ marginLeft: "auto", fontSize: "0.7rem" }}>→</span>}
                  </button>
                ))}
              </div>
            )}

            {/* Constants View */}
            {activeView === "constants" && (
              <div style={{ padding: "0.75rem", overflowY: "auto", flex: 1 }}>
                <div style={{ fontSize: "0.75rem", color: base.muted, marginBottom: "0.5rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Important Constants</div>
                {IMPORTANT_CONSTANTS.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "8px 10px",
                      marginBottom: "4px",
                      background: base.card,
                      border: `1px solid ${base.border}`,
                      borderRadius: "8px",
                    }}
                  >
                    <div style={{ fontSize: "0.7rem", color: base.muted, marginBottom: "2px" }}>{c.name}</div>
                    <div style={{ fontSize: "0.8rem", color: base.text }}>{renderLatex(c.symbol + " = " + c.value)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Bookmarks View */}
            {activeView === "bookmarks" && (
              <div style={{ padding: "0.75rem", flex: 1 }}>
                {bookmarks.size === 0 ? (
                  <div style={{ textAlign: "center", color: base.muted, padding: "2rem 1rem", fontSize: "0.875rem" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔖</div>
                    No bookmarks yet. Click the bookmark icon on any formula.
                  </div>
                ) : (
                  <div>
                    {[...bookmarks].map((id) => (
                      <div key={id} style={{ padding: "8px", background: base.card, border: `1px solid ${base.border}`, borderRadius: "8px", marginBottom: "4px", fontSize: "0.8rem", color: base.text }}>
                        {id}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </aside>
        )}

        {/* Main Content */}
        <main
          ref={contentRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "2rem",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {activeTopic && (
            <>
              {/* Topic Header */}
              <div
                style={{
                  marginBottom: "2rem",
                  padding: "1.5rem 2rem",
                  background: subj.bg,
                  border: `1px solid ${subj.border}`,
                  borderRadius: "16px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", right: "1.5rem", top: "50%", transform: "translateY(-50%)", fontSize: "4rem", opacity: 0.15 }}>
                  {activeTopic.icon}
                </div>
                <div style={{ fontSize: "0.75rem", color: subj.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>
                  {activeSubject === "physics" ? "⚡ Physics" : "🧪 Chemistry"} — JEE Main + MHT CET
                </div>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: base.text, margin: 0, letterSpacing: "-0.02em" }}>
                  {activeTopic.icon} {activeTopic.title}
                </h1>
                <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.75rem", padding: "3px 10px", borderRadius: "99px", ...tagCls.CET.split(" ").reduce((a, c) => { a[c] = true; return a; }, {}), background: darkMode ? "#78350f33" : "#fef9c3", color: darkMode ? "#fcd34d" : "#92400e", border: `1px solid ${darkMode ? "#78350f" : "#fde68a"}` }}>
                    🏆 CET Exam
                  </span>
                  <span style={{ fontSize: "0.75rem", padding: "3px 10px", borderRadius: "99px", background: darkMode ? "#581c8733" : "#f3e8ff", color: darkMode ? "#d8b4fe" : "#6b21a8", border: `1px solid ${darkMode ? "#6b21a8" : "#e9d5ff"}` }}>
                    🎯 JEE Main
                  </span>
                  <span style={{ fontSize: "0.75rem", padding: "3px 10px", borderRadius: "99px", background: darkMode ? "#052e1633" : "#f0fdf4", color: darkMode ? "#86efac" : "#166534", border: `1px solid ${darkMode ? "#166534" : "#bbf7d0"}` }}>
                    📚 NCERT Based
                  </span>
                </div>
              </div>

              {/* Sections */}
              {activeTopic.sections.map((section, sIdx) => {
                const sectionId = `${activeTopic.id}-${sIdx}`;
                const isExpanded = expandedSections[sectionId] !== false; // Default expanded

                return (
                  <div
                    key={sIdx}
                    style={{
                      marginBottom: "1.5rem",
                      background: base.card,
                      border: `1px solid ${base.border}`,
                      borderRadius: "14px",
                      overflow: "hidden",
                    }}
                  >
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(sectionId)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "1rem 1.25rem",
                        background: "none",
                        border: "none",
                        color: base.text,
                        cursor: "pointer",
                        borderBottom: isExpanded ? `1px solid ${base.border}` : "none",
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.01em" }}>{section.title}</span>
                      <span style={{ color: subj.accent, fontSize: "1.1rem", transition: "transform 0.2s", display: "inline-block", transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)" }}>▾</span>
                    </button>

                    {isExpanded && (
                      <div style={{ padding: "1.25rem" }}>
                        {/* Formulas */}
                        {section.formulas && section.formulas.length > 0 && (
                          <div style={{ marginBottom: formulaOnlyMode ? 0 : "1.25rem" }}>
                            <div style={{ fontSize: "0.7rem", color: base.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
                              📐 Formulas
                            </div>
                            <div style={{ display: "grid", gap: "0.625rem" }}>
                              {section.formulas.map((formula, fIdx) => {
                                const fId = `${sectionId}-${fIdx}`;
                                const isBookmarked = bookmarks.has(fId);
                                return (
                                  <div
                                    key={fIdx}
                                    style={{
                                      padding: "0.875rem 1rem",
                                      background: subj.bg,
                                      border: `1px solid ${subj.border}`,
                                      borderRadius: "10px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      gap: "1rem",
                                      flexWrap: "wrap",
                                      transition: "border-color 0.15s",
                                    }}
                                  >
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontSize: "0.7rem", color: subj.accent, fontWeight: 600, marginBottom: "4px" }}>{formula.label}</div>
                                      <div style={{ fontSize: "1.05rem", color: base.text, overflowX: "auto" }}>
                                        {renderLatexDisplay(formula.latex)}
                                      </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                      {formula.tags?.map((tag) => (
                                        <span
                                          key={tag}
                                          style={{
                                            fontSize: "0.65rem",
                                            padding: "2px 8px",
                                            borderRadius: "99px",
                                            fontWeight: 700,
                                            ...(tag === "CET"
                                              ? { background: darkMode ? "#78350f33" : "#fef9c3", color: darkMode ? "#fcd34d" : "#92400e", border: `1px solid ${darkMode ? "#78350f60" : "#fde68a"}` }
                                              : { background: darkMode ? "#4c1d9533" : "#f3e8ff", color: darkMode ? "#d8b4fe" : "#6b21a8", border: `1px solid ${darkMode ? "#6b21a860" : "#e9d5ff"}` })
                                          }}
                                        >
                                          {tag === "CET" ? "🏆 CET" : "🎯 JEE"}
                                        </span>
                                      ))}
                                      <button
                                        onClick={() => toggleBookmark(fId)}
                                        style={{
                                          background: "none",
                                          border: "none",
                                          cursor: "pointer",
                                          fontSize: "1rem",
                                          color: isBookmarked ? "#f59e0b" : base.muted,
                                          padding: "2px 4px",
                                        }}
                                        title={isBookmarked ? "Remove bookmark" : "Bookmark"}
                                      >
                                        {isBookmarked ? "🔖" : "🏷"}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {!formulaOnlyMode && (
                          <>
                            {/* Key Points */}
                            {section.points && section.points.length > 0 && (
                              <div style={{ marginBottom: "1rem" }}>
                                <div style={{ fontSize: "0.7rem", color: base.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.625rem" }}>
                                  💡 Key Points
                                </div>
                                <div
                                  style={{
                                    background: darkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                                    border: `1px solid ${base.border}`,
                                    borderRadius: "10px",
                                    padding: "0.875rem",
                                  }}
                                >
                                  {section.points.map((pt, i) => (
                                    <div
                                      key={i}
                                      style={{
                                        display: "flex",
                                        gap: "8px",
                                        marginBottom: i < section.points.length - 1 ? "6px" : 0,
                                        fontSize: "0.875rem",
                                        color: base.text,
                                        lineHeight: 1.5,
                                      }}
                                    >
                                      <span style={{ color: subj.accent, flexShrink: 0, marginTop: "2px" }}>•</span>
                                      <span>{pt}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Mistakes */}
                            {section.mistakes && section.mistakes.length > 0 && !quickRevisionMode && (
                              <div style={{ marginBottom: "1rem" }}>
                                <div style={{ fontSize: "0.7rem", color: "#ef4444", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.625rem" }}>
                                  ⚠️ Common Mistakes
                                </div>
                                <div
                                  style={{
                                    background: darkMode ? "rgba(239,68,68,0.05)" : "rgba(239,68,68,0.04)",
                                    border: "1px solid rgba(239,68,68,0.2)",
                                    borderRadius: "10px",
                                    padding: "0.875rem",
                                  }}
                                >
                                  {section.mistakes.map((m, i) => (
                                    <div key={i} style={{ display: "flex", gap: "8px", marginBottom: i < section.mistakes.length - 1 ? "6px" : 0, fontSize: "0.875rem", color: base.text, lineHeight: 1.5 }}>
                                      <span style={{ color: "#ef4444", flexShrink: 0 }}>✗</span>
                                      <span>{m}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Tricks */}
                            {section.tricks && section.tricks.length > 0 && (
                              <div>
                                <div style={{ fontSize: "0.7rem", color: "#a855f7", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.625rem" }}>
                                  ⚡ Shortcuts & Tricks
                                </div>
                                <div
                                  style={{
                                    background: darkMode ? "rgba(168,85,247,0.05)" : "rgba(168,85,247,0.04)",
                                    border: "1px solid rgba(168,85,247,0.2)",
                                    borderRadius: "10px",
                                    padding: "0.875rem",
                                  }}
                                >
                                  {section.tricks.map((t, i) => (
                                    <div key={i} style={{ display: "flex", gap: "8px", marginBottom: i < section.tricks.length - 1 ? "6px" : 0, fontSize: "0.875rem", color: base.text, lineHeight: 1.5 }}>
                                      <span style={{ color: "#a855f7", flexShrink: 0 }}>★</span>
                                      <span>{t}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* One-line revision */}
              {quickRevisionMode && (
                <div
                  style={{
                    padding: "1.25rem",
                    background: darkMode ? "rgba(168,85,247,0.08)" : "rgba(168,85,247,0.05)",
                    border: "1px solid rgba(168,85,247,0.2)",
                    borderRadius: "14px",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div style={{ fontSize: "0.75rem", color: "#a855f7", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
                    ⚡ Quick Revision — Formula Recap
                  </div>
                  {activeTopic.sections.map((s, si) =>
                    s.formulas?.map((f, fi) => (
                      <div key={`${si}-${fi}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${base.border}`, gap: "1rem" }}>
                        <span style={{ fontSize: "0.8rem", color: base.muted }}>{f.label}</span>
                        <span style={{ fontSize: "0.875rem" }}>{renderLatex(f.latex)}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}

          {/* Bottom spacer */}
          <div style={{ height: "4rem" }} />
        </main>
      </div>
    </div>
  );
}


# The code is too long for direct string manipulation. Let me create the files properly.
# First, let me write the 3ddiagrams.jsx file

import os
os.makedirs('/mnt/agents/output', exist_ok=True)

# Write the 3ddiagrams.jsx file
diagrams_code = '''import { useState, useEffect, useRef, useCallback } from "react";

// ─── 3D DIAGRAMS VISUALIZER ───────────────────────────────────────────────
// Interactive Canvas-based diagrams for Physics and Mathematics

function Canvas3D({ width = 400, height = 300, draw, onMouseMove, onClick, style = {} }) {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const c = canvas.getContext('2d');
    c.scale(dpr, dpr);
    setCtx(c);
  }, [width, height]);

  useEffect(() => {
    if (ctx && draw) {
      ctx.clearRect(0, 0, width, height);
      draw(ctx, width, height);
    }
  }, [ctx, draw, width, height]);

  const handleMouseMove = (e) => {
    if (!onMouseMove) return;
    const rect = canvasRef.current.getBoundingClientRect();
    onMouseMove(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleClick = (e) => {
    if (!onClick) return;
    const rect = canvasRef.current.getBoundingClientRect();
    onClick(e.clientX - rect.left, e.clientY - rect.top);
  };

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height, cursor: onMouseMove ? 'crosshair' : 'default', ...style }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    />
  );
}

// ─── PROJECTILE MOTION SIMULATOR ──────────────────────────────────────────
function ProjectileMotion() {
  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(20);
  const [g, setG] = useState(9.8);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trail, setTrail] = useState([]);
  const animRef = useRef(null);

  const rad = (angle * Math.PI) / 180;
  const vx = velocity * Math.cos(rad);
  const vy = velocity * Math.sin(rad);
  const totalTime = (2 * vy) / g;
  const maxRange = (velocity * velocity * Math.sin(2 * rad)) / g;
  const maxHeight = (vy * vy) / (2 * g);

  const scale = Math.min(380 / (maxRange || 1), 250 / ((maxHeight || 1) + 10));
  const originX = 30;
  const originY = 270;

  const draw = useCallback((ctx, w, h) => {
    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath(); ctx.moveTo(originX + i * 35, 0); ctx.lineTo(originX + i * 35, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, originY - i * 25); ctx.lineTo(w, originY - i * 25); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(w, originY); ctx.stroke();

    // Labels
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px sans-serif';
    ctx.fillText('x (m)', w - 40, originY + 15);
    ctx.fillText('y (m)', originX - 25, 15);

    // Trajectory path
    ctx.strokeStyle = 'rgba(59,130,246,0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let t = 0; t <= totalTime; t += 0.05) {
      const x = vx * t;
      const y = vy * t - 0.5 * g * t * t;
      const px = originX + x * scale;
      const py = originY - y * scale;
      if (t === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Trail
    trail.forEach((p, i) => {
      ctx.fillStyle = `rgba(59,130,246,${0.1 + (i / trail.length) * 0.4})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Current position
    const x = vx * time;
    const y = vy * time - 0.5 * g * time * time;
    const px = originX + x * scale;
    const py = originY - y * scale;

    if (y >= 0) {
      // Ball
      ctx.fillStyle = '#3B82F6';
      ctx.shadowColor = '#3B82F6';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Velocity vector
      const vxt = vx;
      const vyt = vy - g * time;
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + vxt * 2, py - vyt * 2);
      ctx.stroke();
      ctx.fillStyle = '#FBBF24';
      ctx.font = '10px sans-serif';
      ctx.fillText('v', px + vxt * 2 + 5, py - vyt * 2);

      // Angle arc
      ctx.strokeStyle = 'rgba(251,191,36,0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(originX, originY, 20, -rad, 0);
      ctx.stroke();
      ctx.fillStyle = '#FBBF24';
      ctx.font = '10px sans-serif';
      ctx.fillText(`${angle}°`, originX + 25, originY - 5);
    }

    // Ground
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(w, originY); ctx.stroke();

    // Info box
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(w - 140, 10, 130, 70);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.strokeRect(w - 140, 10, 130, 70);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '11px sans-serif';
    ctx.fillText(`R = ${maxRange.toFixed(1)} m`, w - 130, 30);
    ctx.fillText(`H = ${maxHeight.toFixed(1)} m`, w - 130, 48);
    ctx.fillText(`T = ${totalTime.toFixed(2)} s`, w - 130, 66);
  }, [angle, velocity, g, time, trail, scale, rad, vx, vy, totalTime, maxRange, maxHeight]);

  useEffect(() => {
    if (isPlaying) {
      const start = Date.now();
      const animate = () => {
        const elapsed = (Date.now() - start) / 1000;
        if (elapsed >= totalTime) {
          setTime(totalTime);
          setIsPlaying(false);
          return;
        }
        setTime(elapsed);
        setTrail(prev => {
          const x = originX + vx * elapsed * scale;
          const y = originY - (vy * elapsed - 0.5 * g * elapsed * elapsed) * scale;
          const newTrail = [...prev, { x, y }];
          return newTrail.slice(-50);
        });
        animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, totalTime, vx, vy, g, scale, originX, originY]);

  const reset = () => {
    setTime(0);
    setTrail([]);
    setIsPlaying(false);
  };

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 20 }}>🎯</span>
        <div>
          <div style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>Projectile Motion</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Interactive simulation with velocity vectors</div>
        </div>
      </div>

      <Canvas3D width={400} height={300} draw={draw} style={{ width: '100%', maxWidth: 400, height: 'auto', aspectRatio: '4/3', borderRadius: 10, background: 'rgba(0,0,0,0.2)' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginTop: 16 }}>
        <div>
          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, display: 'block', marginBottom: 4 }}>Angle: {angle}°</label>
          <input type="range" min="0" max="90" value={angle} onChange={e => { setAngle(Number(e.target.value)); reset(); }}
            style={{ width: '100%', accentColor: '#3B82F6' }} />
        </div>
        <div>
          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, display: 'block', marginBottom: 4 }}>Velocity: {velocity} m/s</label>
          <input type="range" min="5" max="50" value={velocity} onChange={e => { setVelocity(Number(e.target.value)); reset(); }}
            style={{ width: '100%', accentColor: '#3B82F6' }} />
        </div>
        <div>
          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, display: 'block', marginBottom: 4 }}>g: {g} m/s²</label>
          <input type="range" min="1" max="20" step="0.1" value={g} onChange={e => { setG(Number(e.target.value)); reset(); }}
            style={{ width: '100%', accentColor: '#3B82F6' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button onClick={() => { reset(); setIsPlaying(true); }} style={{
          background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)', color: '#3B82F6',
          borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', flex: 1
        }}>{isPlaying ? '⏸ Pause' : '▶ Launch'}</button>
        <button onClick={reset} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)',
          borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit'
        }}>↺ Reset</button>
      </div>

      <div style={{ marginTop: 12, padding: 10, background: 'rgba(59,130,246,0.05)', borderRadius: 8, border: '1px solid rgba(59,130,246,0.15)' }}>
        <div style={{ color: '#3B82F6', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 4 }}>KEY FORMULAS</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'monospace' }}>
          R = u²sin(2θ)/g &nbsp;&nbsp; H = u²sin²θ/(2g) &nbsp;&nbsp; T = 2usinθ/g
        </div>
      </div>
    </div>
  );
}

// ─── SHM (SIMPLE HARMONIC MOTION) ─────────────────────────────────────────
function SHMDiagram() {
  const [A, setA] = useState(100);
  const [omega, setOmega] = useState(2);
  const [phase, setPhase] = useState(0);
  const [showComponents, setShowComponents] = useState(true);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animRef = useRef(null);

  const width = 400, height = 280;
  const cx = 200, cy = 140;

  const draw = useCallback((ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let i = -4; i <= 4; i++) {
      ctx.beginPath(); ctx.moveTo(cx + i * 40, 0); ctx.lineTo(cx + i * 40, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, cy + i * 30); ctx.lineTo(w, cy + i * 30); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();

    // Circle reference
    ctx.strokeStyle = 'rgba(139,92,246,0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.arc(cx, cy, A, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);

    // Current position on circle
    const theta = omega * time + phase;
    const px = cx + A * Math.cos(theta);
    const py = cy - A * Math.sin(theta);

    // Radius line
    ctx.strokeStyle = 'rgba(139,92,246,0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();

    // Point on circle
    ctx.fillStyle = '#8B5CF6';
    ctx.shadowColor = '#8B5CF6';
    ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    if (showComponents) {
      // X component (projection)
      ctx.strokeStyle = 'rgba(59,130,246,0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, cy); ctx.stroke();
      ctx.fillStyle = '#3B82F6';
      ctx.beginPath(); ctx.arc(px, cy, 4, 0, Math.PI * 2); ctx.fill();

      // Y component
      ctx.strokeStyle = 'rgba(16,185,129,0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(cx, py); ctx.stroke();
      ctx.fillStyle = '#10B981';
      ctx.beginPath(); ctx.arc(cx, py, 4, 0, Math.PI * 2); ctx.fill();
    }

    // Wave trace
    ctx.strokeStyle = 'rgba(139,92,246,0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let t = 0; t <= time; t += 0.02) {
      const x = cx + A * Math.cos(omega * t + phase);
      const y = cy - A * Math.sin(omega * t + phase);
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Labels
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '11px sans-serif';
    ctx.fillText('x = Acos(ωt)', 10, 20);
    ctx.fillText('y = Asin(ωt)', 10, 35);
    ctx.fillText(`θ = ${(theta % (2 * Math.PI)).toFixed(2)} rad`, 10, 50);

    // Info
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(w - 130, 10, 120, 55);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.strokeRect(w - 130, 10, 120, 55);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '11px sans-serif';
    ctx.fillText(`A = ${A}px`, w - 120, 28);
    ctx.fillText(`ω = ${omega} rad/s`, w - 120, 44);
    ctx.fillText(`T = ${(2 * Math.PI / omega).toFixed(2)}s`, w - 120, 60);
  }, [A, omega, phase, time, showComponents]);

  useEffect(() => {
    if (isPlaying) {
      const start = Date.now();
      const animate = () => {
        const elapsed = (Date.now() - start) / 1000;
        setTime(elapsed);
        animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying]);

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 20 }}>〰️</span>
        <div>
          <div style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>Simple Harmonic Motion</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Circular reference with component projections</div>
        </div>
      </div>

      <Canvas3D width={width} height={height} draw={draw} style={{ width: '100%', maxWidth: 400, height: 'auto', aspectRatio: '10/7', borderRadius: 10, background: 'rgba(0,0,0,0.2)' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginTop: 16 }}>
        <div>
          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, display: 'block', marginBottom: 4 }}>Amplitude: {A}</label>
          <input type="range" min="30" max="120" value={A} onChange={e => { setA(Number(e.target.value)); setTime(0); }}
            style={{ width: '100%', accentColor: '#8B5CF6' }} />
        </div>
        <div>
          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, display: 'block', marginBottom: 4 }}>ω: {omega}</label>
          <input type="range" min="0.5" max="5" step="0.1" value={omega} onChange={e => { setOmega(Number(e.target.value)); setTime(0); }}
            style={{ width: '100%', accentColor: '#8B5CF6' }} />
        </div>
        <div>
          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, display: 'block', marginBottom: 4 }}>Phase: {phase.toFixed(1)}</label>
          <input type="range" min="0" max={Math.PI * 2} step="0.1" value={phase} onChange={e => { setPhase(Number(e.target.value)); setTime(0); }}
            style={{ width: '100%', accentColor: '#8B5CF6' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => setIsPlaying(!isPlaying)} style={{
          background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', color: '#8B5CF6',
          borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', flex: 1
        }}>{isPlaying ? '⏸ Pause' : '▶ Animate'}</button>
        <button onClick={() => { setTime(0); setIsPlaying(false); }} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)',
          borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit'
        }}>↺ Reset</button>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}>
          <input type="checkbox" checked={showComponents} onChange={e => setShowComponents(e.target.checked)} style={{ accentColor: '#8B5CF6' }} />
          Show Components
        </label>
      </div>

      <div style={{ marginTop: 12, padding: 10, background: 'rgba(139,92,246,0.05)', borderRadius: 8, border: '1px solid rgba(139,92,246,0.15)' }}>
        <div style={{ color: '#8B5CF6', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 4 }}>KEY FORMULAS</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'monospace' }}>
          x = Acos(ωt + φ) &nbsp;&nbsp; v = -Aωsin(ωt + φ) &nbsp;&nbsp; a = -Aω²cos(ωt + φ)
        </div>
      </div>
    </div>
  );
}

// ─── OPTICS - REFRACTION SIMULATOR ────────────────────────────────────────
function RefractionDiagram() {
  const [n1, setN1] = useState(1.0);
  const [n2, setN2] = useState(1.5);
  const [incidentAngle, setIncidentAngle] = useState(30);
  const [showNormal, setShowNormal] = useState(true);

  const rad = (incidentAngle * Math.PI) / 180;
  const sinR = (n1 * Math.sin(rad)) / n2;
  const refractedAngle = sinR <= 1 ? (Math.asin(sinR) * 180) / Math.PI : null;
  const isTIR = sinR > 1;

  const width = 400, height = 300;
  const cx = 200, cy = 150;
  const rayLen = 120;

  const draw = useCallback((ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);

    // Media backgrounds
    ctx.fillStyle = 'rgba(59,130,246,0.08)';
    ctx.fillRect(0, 0, w, cy);
    ctx.fillStyle = 'rgba(16,185,129,0.08)';
    ctx.fillRect(0, cy, w, h - cy);

    // Interface line
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();

    // Normal
    if (showNormal) {
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx, 20); ctx.lineTo(cx, h - 20); ctx.stroke();
      ctx.setLineDash([]);
    }

    // Incident ray
    const ix = cx - rayLen * Math.sin(rad);
    const iy = cy - rayLen * Math.cos(rad);
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(ix, iy); ctx.lineTo(cx, cy); ctx.stroke();

    // Arrow on incident
    const midIx = (cx + ix) / 2;
    const midIy = (cy + iy) / 2;
    ctx.fillStyle = '#3B82F6';
    ctx.beginPath();
    ctx.moveTo(midIx, midIy);
    ctx.lineTo(midIx - 8, midIy - 5);
    ctx.lineTo(midIx - 8, midIy + 5);
    ctx.fill();

    // Refracted ray or TIR
    if (!isTIR && refractedAngle !== null) {
      const rRad = (refractedAngle * Math.PI) / 180;
      const rx = cx + rayLen * Math.sin(rRad);
      const ry = cy + rayLen * Math.cos(rRad);
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(rx, ry); ctx.stroke();

      // Arrow
      const midRx = (cx + rx) / 2;
      const midRy = (cy + ry) / 2;
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.moveTo(midRx, midRy);
      ctx.lineTo(midRx + 8, midRy - 5);
      ctx.lineTo(midRx + 8, midRy + 5);
      ctx.fill();
    } else {
      // Total Internal Reflection
      const reflectRad = rad;
      const rx = cx + rayLen * Math.sin(reflectRad);
      const ry = cy - rayLen * Math.cos(reflectRad);
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(rx, ry); ctx.stroke();
      ctx.setLineDash([]);
    }

    // Angle arcs
    ctx.strokeStyle = 'rgba(251,191,36,0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, 25, -Math.PI / 2 - rad, -Math.PI / 2); ctx.stroke();
    if (!isTIR && refractedAngle !== null) {
      const rRad = (refractedAngle * Math.PI) / 180;
      ctx.beginPath(); ctx.arc(cx, cy, 35, Math.PI / 2, Math.PI / 2 + rRad); ctx.stroke();
    }

    // Labels
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '12px sans-serif';
    ctx.fillText(`n₁ = ${n1}`, 20, 30);
    ctx.fillText(`n₂ = ${n2}`, 20, h - 20);
    ctx.fillText(`i = ${incidentAngle}°`, cx - 60, cy - 60);
    if (!isTIR && refractedAngle !== null) {
      ctx.fillText(`r = ${refractedAngle.toFixed(1)}°`, cx + 20, cy + 60);
    } else {
      ctx.fillStyle = '#EF4444';
      ctx.fillText('TIR!', cx + 20, cy + 60);
    }

    // Snell's law box
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(w - 160, 10, 150, 50);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.strokeRect(w - 160, 10, 150, 50);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '11px sans-serif';
    ctx.fillText(`n₁sin(i) = n₂sin(r)`, w - 150, 28);
    ctx.fillText(`${n1}×sin(${incidentAngle}°) = ${n2}×sin(${isTIR ? '—' : refractedAngle.toFixed(1) + '°'})`, w - 150, 46);
  }, [n1, n2, incidentAngle, rad, isTIR, refractedAngle, showNormal]);

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 20 }}>💎</span>
        <div>
          <div style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>Refraction & TIR</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Snell's law with total internal reflection</div>
        </div>
      </div>

      <Canvas3D width={width} height={height} draw={draw} style={{ width: '100%', maxWidth: 400, height: 'auto', aspectRatio: '4/3', borderRadius: 10, background: 'rgba(0,0,0,0.2)' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginTop: 16 }}>
        <div>
          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, display: 'block', marginBottom: 4 }}>n₁ (incident): {n1}</label>
          <input type="range" min="1" max="2.5" step="0.1" value={n1} onChange={e => setN1(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#3B82F6' }} />
        </div>
        <div>
          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, display: 'block', marginBottom: 4 }}>n₂ (refracted): {n2}</label>
          <input type="range" min="1" max="2.5" step="0.1" value={n2} onChange={e => setN2(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#10B981' }} />
        </div>
        <div>
          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, display: 'block', marginBottom: 4 }}>Angle of incidence: {incidentAngle}°</label>
          <input type="range" min="0" max="90" value={incidentAngle} onChange={e => setIncidentAngle(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#FBBF24' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}>
          <input type="checkbox" checked={showNormal} onChange={e => setShowNormal(e.target.checked)} style={{ accentColor: '#818CF8' }} />
          Show Normal
        </label>
        {isTIR && (
          <span style={{ color: '#EF4444', fontSize: 12, fontWeight: 600, background: 'rgba(239,68,68,0.1)', padding: '4px 10px', borderRadius: 6 }}>
            ⚠️ Total Internal Reflection!
          </span>
        )}
      </div>

      <div style={{ marginTop: 12, padding: 10, background: 'rgba(16,185,129,0.05)', borderRadius: 8, border: '1px solid rgba(16,185,129,0.15)' }}>
        <div style={{ color: '#10B981', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 4 }}>SNELL'S LAW</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'monospace' }}>
          n₁ sin θ₁ = n₂ sin θ₂ &nbsp;&nbsp; Critical angle: sin⁻¹(n₂/n₁) when n₁ {'>'} n₂
        </div>
      </div>
    </div>
  );
}

// ─── CONIC SECTIONS VISUALIZER ────────────────────────────────────────────
function ConicSections() {
  const [type, setType] = useState('parabola');
  const [a, setA] = useState(50);

  const width = 400, height = 300;
  const cx = 200, cy = 150;

  const draw = useCallback((ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let i = -5; i <= 5; i++) {
      ctx.beginPath(); ctx.moveTo(cx + i * 40, 0); ctx.lineTo(cx + i * 40, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, cy + i * 30); ctx.lineTo(w, cy + i * 30); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();

    ctx.strokeStyle = '#8B5CF6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    if (type === 'parabola') {
      // y² = 4ax → x = y²/(4a)
      for (let y = -100; y <= 100; y += 2) {
        const x = (y * y) / (4 * a);
        const px = cx + x;
        const py = cy - y;
        if (y === -100) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      // Focus
      ctx.fillStyle = '#FBBF24';
      ctx.beginPath(); ctx.arc(cx + a, cy, 4, 0, Math.PI * 2); ctx.fill();
      // Directrix
      ctx.strokeStyle = 'rgba(251,191,36,0.4)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(cx - a, 0); ctx.lineTo(cx - a, h); ctx.stroke();
      ctx.setLineDash([]);
      // Latus rectum
      ctx.strokeStyle = 'rgba(239,68,68,0.4)';
      ctx.beginPath(); ctx.moveTo(cx + a, cy - 2 * a); ctx.lineTo(cx + a, cy + 2 * a); ctx.stroke();
    } else if (type === 'ellipse') {
      const b = a * 0.6;
      ctx.beginPath(); ctx.ellipse(cx, cy, a, b, 0, 0, Math.PI * 2); ctx.stroke();
      const c = Math.sqrt(a * a - b * b);
      ctx.fillStyle = '#FBBF24';
      ctx.beginPath(); ctx.arc(cx - c, cy, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + c, cy, 4, 0, Math.PI * 2); ctx.fill();
      // Major axis
      ctx.strokeStyle = 'rgba(251,191,36,0.3)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(cx - a, cy); ctx.lineTo(cx + a, cy); ctx.stroke();
      ctx.setLineDash([]);
    } else if (type === 'hyperbola') {
      const b = a * 0.6;
      // Right branch
      for (let x = a; x <= 180; x += 2) {
        const y = b * Math.sqrt((x * x) / (a * a) - 1);
        const px = cx + x;
        const py1 = cy - y;
        const py2 = cy + y;
        if (x === a) { ctx.moveTo(px, py1); }
        else { ctx.lineTo(px, py1); }
      }
      ctx.stroke();
      // Left branch
      ctx.beginPath();
      for (let x = a; x <= 180; x += 2) {
        const y = b * Math.sqrt((x * x) / (a * a) - 1);
        const px = cx - x;
        const py1 = cy - y;
        if (x === a) { ctx.moveTo(px, py1); }
        else { ctx.lineTo(px, py1); }
      }
      ctx.stroke();
      // Asymptotes
      ctx.strokeStyle = 'rgba(239,68,68,0.3)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + 150, cy - 150 * b / a); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + 150, cy + 150 * b / a); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - 150, cy - 150 * b / a); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - 150, cy + 150 * b / a); ctx.stroke();
      ctx.setLineDash([]);
    }

    // Labels
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '11px sans-serif';
    if (type === 'parabola') {
      ctx.fillText('Focus', cx + a + 8, cy - 8);
      ctx.fillText('Directrix', cx - a - 50, cy - 10);
      ctx.fillText('Latus Rectum = 4a', cx + a + 8, cy + 20);
    } else if (type === 'ellipse') {
      ctx.fillText('Foci', cx - c - 30, cy - 8);
      ctx.fillText('2a (major axis)', cx - 20, cy + 20);
    } else if (type === 'hyperbola') {
      ctx.fillText('Asymptotes', cx + 100, cy - 80);
    }
  }, [type, a, cx, cy]);

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 20 }}>📐</span>
        <div>
          <div style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>Conic Sections</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Parabola, Ellipse, Hyperbola with key elements</div>
        </div>
      </div>

      <Canvas3D width={width} height={height} draw={draw} style={{ width: '100%', maxWidth: 400, height: 'auto', aspectRatio: '4/3', borderRadius: 10, background: 'rgba(0,0,0,0.2)' }} />

      <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
        {['parabola', 'ellipse', 'hyperbola'].map(t => (
          <button key={t} onClick={() => setType(t)} style={{
            background: type === t ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${type === t ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.1)'}`,
            color: type === t ? '#8B5CF6' : 'rgba(255,255,255,0.5)',
            borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
            textTransform: 'capitalize', flex: 1
          }}>{t}</button>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, display: 'block', marginBottom: 4 }}>
          {type === 'parabola' ? 'Parameter a' : 'Semi-major axis a'}: {a}
        </label>
        <input type="range" min="20" max="100" value={a} onChange={e => setA(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#8B5CF6' }} />
      </div>

      <div style={{ marginTop: 12, padding: 10, background: 'rgba(139,92,246,0.05)', borderRadius: 8, border: '1px solid rgba(139,92,246,0.15)' }}>
        <div style={{ color: '#8B5CF6', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 4 }}>STANDARD FORMS</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'monospace' }}>
          {type === 'parabola' && 'y² = 4ax | Focus: (a,0) | Directrix: x = -a'}
          {type === 'ellipse' && 'x²/a² + y²/b² = 1 | e = √(1-b²/a²) | Foci: (±ae, 0)'}
          {type === 'hyperbola' && 'x²/a² - y²/b² = 1 | e = √(1+b²/a²) | Asymptotes: y = ±(b/a)x'}
        </div>
      </div>
    </div>
  );
}

// ─── WAVE INTERFERENCE (YDSE) ─────────────────────────────────────────────
function WaveInterference() {
  const [wavelength, setWavelength] = useState(40);
  const [d, setD] = useState(80);
  const [screenDist, setScreenDist] = useState(200);
  const [showPathDiff, setShowPathDiff] = useState(false);

  const width = 400, height = 300;
  const slitY = 50;
  const screenY = height - 40;
  const cx = width / 2;

  const draw = useCallback((ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);

    // Screen
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fillRect(0, screenY, w, 40);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, screenY); ctx.lineTo(w, screenY); ctx.stroke();

    // Slits
    const s1x = cx - d / 2;
    const s2x = cx + d / 2;
    ctx.fillStyle = '#FBBF24';
    ctx.beginPath(); ctx.arc(s1x, slitY, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s2x, slitY, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '10px sans-serif';
    ctx.fillText('S₁', s1x - 12, slitY - 8);
    ctx.fillText('S₂', s2x + 6, slitY - 8);

    // Wavefronts from S1
    for (let r = 10; r < screenDist; r += wavelength) {
      ctx.strokeStyle = `rgba(59,130,246,${0.3 - r / 600})`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(s1x, slitY, r, 0, Math.PI * 2); ctx.stroke();
    }
    // Wavefronts from S2
    for (let r = 10; r < screenDist; r += wavelength) {
      ctx.strokeStyle = `rgba(16,185,129,${0.3 - r / 600})`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(s2x, slitY, r, 0, Math.PI * 2); ctx.stroke();
    }

    // Interference pattern on screen
    const patternWidth = 300;
    const steps = 200;
    for (let i = 0; i < steps; i++) {
      const x = cx - patternWidth / 2 + (patternWidth * i) / steps;
      const dist1 = Math.sqrt((x - s1x) ** 2 + (screenY - slitY) ** 2);
      const dist2 = Math.sqrt((x - s2x) ** 2 + (screenY - slitY) ** 2);
      const phaseDiff = ((dist2 - dist1) / wavelength) * 2 * Math.PI;
      const intensity = Math.cos(phaseDiff / 2) ** 2;

      const hue = 220 + intensity * 60;
      ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${intensity * 0.8})`;
      ctx.fillRect(x, screenY, patternWidth / steps + 1, 35);
    }

    // Central bright fringe marker
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '10px sans-serif';
    ctx.fillText('Central Max', cx - 25, screenY + 30);

    // Path difference visualization
    if (showPathDiff) {
      const targetX = cx + 60;
      ctx.strokeStyle = 'rgba(251,191,36,0.5)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(s1x, slitY); ctx.lineTo(targetX, screenY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(s2x, slitY); ctx.lineTo(targetX, screenY); ctx.stroke();
      ctx.setLineDash([]);

      const dist1 = Math.sqrt((targetX - s1x) ** 2 + (screenY - slitY) ** 2);
      const dist2 = Math.sqrt((targetX - s2x) ** 2 + (screenY - slitY) ** 2);
      ctx.fillStyle = '#FBBF24';
      ctx.fillText(`Δx = ${Math.abs(dist2 - dist1).toFixed(1)}`, targetX + 10, (slitY + screenY) / 2);
    }

    // Labels
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '11px sans-serif';
    ctx.fillText(`λ = ${wavelength}px`, 10, 20);
    ctx.fillText(`d = ${d}px`, 10, 35);
    ctx.fillText(`D = ${screenDist}px`, 10, 50);
    ctx.fillText(`β = λD/d`, w - 80, 20);
  }, [wavelength, d, screenDist, showPathDiff, cx, slitY, screenY]);

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 20 }}>〰️</span>
        <div>
          <div style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>Wave Interference (YDSE)</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Double slit experiment with fringe pattern</div>
        </div>
      </div>

      <Canvas3D width={width} height={height} draw={draw} style={{ width: '100%', maxWidth: 400, height: 'auto', aspectRatio: '4/3', borderRadius: 10, background: 'rgba(0,0,0,0.2)' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginTop: 16 }}>
        <div>
          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, display: 'block', marginBottom: 4 }}>Wavelength λ: {wavelength}</label>
          <input type="range" min="20" max="80" value={wavelength} onChange={e => setWavelength(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#3B82F6' }} />
        </div>
        <div>
          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, display: 'block', marginBottom: 4 }}>Slit separation d: {d}</label>
          <input type="range" min="30" max="150" value={d} onChange={e => setD(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#3B82F6' }} />
        </div>
        <div>
          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, display: 'block', marginBottom: 4 }}>Screen distance D: {screenDist}</label>
          <input type="range" min="100" max="250" value={screenDist} onChange={e => setScreenDist(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#3B82F6' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}>
          <input type="checkbox" checked={showPathDiff} onChange={e => setShowPathDiff(e.target.checked)} style={{ accentColor: '#FBBF24' }} />
          Show Path Difference
        </label>
      </div>

      <div style={{ marginTop: 12, padding: 10, background: 'rgba(59,130,246,0.05)', borderRadius: 8, border: '1px solid rgba(59,130,246,0.15)' }}>
        <div style={{ color: '#3B82F6', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 4 }}>YDSE FORMULAS</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'monospace' }}>
          β = λD/d (fringe width) &nbsp;&nbsp; Δx = nλ (bright) &nbsp;&nbsp; Δx = (2n-1)λ/2 (dark)
        </div>
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────
export function Diagrams3DView() {
  const [activeTab, setActiveTab] = useState('projectile');

  const tabs = [
    { id: 'projectile', label: '🎯 Projectile', component: ProjectileMotion },
    { id: 'shm', label: '〰️ SHM', component: SHMDiagram },
    { id: 'optics', label: '💎 Refraction', component: RefractionDiagram },
    { id: 'conics', label: '📐 Conics', component: ConicSections },
    { id: 'waves', label: '〰️ Interference', component: WaveInterference },
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || ProjectileMotion;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: '#fff', fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 8 }}>
          🔬 Interactive Diagrams
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
          Visualize physics and math concepts with interactive simulations
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 20,
        overflowX: 'auto',
        paddingBottom: 4,
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px',
              borderRadius: 12,
              border: `1px solid ${activeTab === tab.id ? 'rgba(129,140,248,0.4)' : 'rgba(255,255,255,0.1)'}`,
              background: activeTab === tab.id ? 'rgba(129,140,248,0.15)' : 'rgba(255,255,255,0.03)',
              color: activeTab === tab.id ? '#818CF8' : 'rgba(255,255,255,0.5)',
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 600 : 400,
              cursor: 'pointer',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ActiveComponent />

      {/* Tips */}
      <div style={{
        background: 'rgba(251,191,36,0.05)',
        border: '1px solid rgba(251,191,36,0.15)',
        borderRadius: 16,
        padding: '16px 20px',
        marginTop: 8,
      }}>
        <div style={{ color: '#FBBF24', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>
          💡 HOW TO USE
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {[
            'Adjust sliders to change parameters',
            'Click Launch/Animate to see motion',
            'Use Reset to start over',
            'Hover over canvas for coordinates',
            'Toggle options to show/hide elements',
            'Formulas update automatically',
          ].map((tip, i) => (
            <div key={i} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, lineHeight: 1.6 }}>
              → {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
'''

with open('/mnt/agents/output/3ddiagrams.jsx', 'w') as f:
    f.write(diagrams_code)

print("3ddiagrams.jsx created successfully!")
print(f"File size: {len(diagrams_code)} characters")

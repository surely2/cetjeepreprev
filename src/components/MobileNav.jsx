import { SUBJECTS } from "../data/index.js";

export function MobileBottomNav({ view, setView, subject, bookmarks, setMobileDrawerOpen, setMobileNavOpen }) {
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

export function MobileDrawer({ open, onClose, children }) {
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

export function MainNavDrawer({ open, onClose, view, setView, subject, bookmarks }) {
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

import { SUBJECTS, PHYSICS_DATA, CHEMISTRY_DATA, MATHEMATICS_DATA } from "../data/index.js";
import { TagBadge } from "./FormulaCard.jsx";
import { WeightageBadge } from "./FormulaCard.jsx";

export function Sidebar({ subject, setSubject, activeTopic, setActiveTopic, searchQuery, setSearchQuery, onTopicSelect }) {
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
        <div style={{ 
          fontSize: 18, 
          fontWeight: 800, 
          fontFamily: "'Playfair Display', serif", 
          color: "#fff", 
          letterSpacing: "-0.02em" 
        }}>
          JEE<span style={{ color: "#818CF8" }}>×</span>CET
        </div>
        <div style={{ 
          color: "rgba(255,255,255,0.35)", 
          fontSize: 10, 
          letterSpacing: "0.12em", 
          marginTop: 2 
        }}>FORMULA HANDBOOK</div>
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

import { useMemo } from "react";
import { SUBJECTS, PHYSICS_DATA, CHEMISTRY_DATA, MATHEMATICS_DATA } from "../data/index.js";
import { FormulaCard, TagBadge, WeightageBadge } from "../components/FormulaCard.jsx";
import { SectionBlock } from "../components/SectionBlock.jsx";

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

export function StudyView({ subject, activeTopic, setActiveTopic, bookmarks, toggleBookmark }) {
  const dataMap = { physics: PHYSICS_DATA, chemistry: CHEMISTRY_DATA, mathematics: MATHEMATICS_DATA };
  const currentTopic = activeTopic && dataMap[subject]?.find(t => t.id === activeTopic);

  if (!activeTopic || !currentTopic) {
    return (
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "28px 20px" }}>
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
              onClick={() => setActiveTopic(topic.id)}
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
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "28px 20px" }}>
      <TopicView topic={currentTopic} subject={subject} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
    </div>
  );
}

import { useState } from "react";
import { SUBJECTS, QUIZ_QUESTIONS } from "../data/index.js";

export function QuizView({ progress, setProgress }) {
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
        <button onClick={handleRestart} style={{
          background: "rgba(129,140,248,0.15)", border: "1px solid rgba(129,140,248,0.4)",
          color: "#818CF8", borderRadius: 12, padding: "12px 24px", cursor: "pointer",
          fontFamily: "inherit", fontSize: 14, fontWeight: 600,
        }}>🔁 Try Again</button>
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
              padding: "4px 10px", borderRadius: 8,
              border: `1px solid ${filter === f ? "rgba(129,140,248,0.5)" : "rgba(255,255,255,0.1)"}`,
              background: filter === f ? "rgba(129,140,248,0.15)" : "transparent",
              color: filter === f ? "#818CF8" : "rgba(255,255,255,0.4)",
              cursor: "pointer", fontSize: 11, fontWeight: 600, textTransform: "capitalize",
            }}>{f === "all" ? "All" : SUBJECTS[f]?.icon}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.4)", fontSize: 11, marginBottom: 6 }}>
          <span>Question {qIndex + 1} of {filteredQs.length}</span>
          <span>Score: {score}/{qIndex + (showResult ? 1 : 0)}</span>
        </div>
        <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${((qIndex + (showResult ? 1 : 0)) / filteredQs.length) * 100}%`, background: subjectColor, borderRadius: 4, transition: "width 0.3s" }} />
        </div>
      </div>

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
              <button key={i} onClick={() => handleSelect(i)} style={{
                background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: "13px 18px",
                color, textAlign: "left", cursor: selected !== null ? "default" : "pointer",
                fontSize: 13, fontFamily: "inherit", lineHeight: 1.5, transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontWeight: 700, opacity: 0.5, fontSize: 11 }}>{String.fromCharCode(65 + i)}</span>
                {opt}
                {showResult && i === current.correct && <span style={{ marginLeft: "auto" }}>✓</span>}
                {showResult && i === selected && i !== current.correct && <span style={{ marginLeft: "auto" }}>✗</span>}
              </button>
            );
          })}
        </div>

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

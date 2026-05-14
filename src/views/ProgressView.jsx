import { useMemo } from "react";
import { SUBJECTS, ALL_FORMULAS_FLAT } from "../data/index.js";

export function ProgressView({ progress, bookmarks, srData }) {
  const totalFormulas = ALL_FORMULAS_FLAT.length;
  const bookmarkedCount = bookmarks.size;
  const quizAttempted = progress.quizAttempted || 0;
  const quizCorrect = progress.quizCorrect || 0;
  const accuracy = quizAttempted > 0 ? Math.round((quizCorrect / quizAttempted) * 100) : 0;
  const topicsVisited = progress.topicsVisited || [];
  const streak = progress.streak || 0;
  const quizHistory = progress.quizHistory || [];

  const srEntries = Object.entries(srData || {});
  const masteredCount = srEntries.filter(([_, v]) => (v.repetitions || 0) >= 3).length;
  const learningCount = srEntries.filter(([_, v]) => (v.repetitions || 0) > 0 && (v.repetitions || 0) < 3).length;
  const dueCount = srEntries.filter(([_, v]) => (v.dueDate || 0) <= Date.now()).length;

  const subjectCounts = { physics: 0, chemistry: 0, mathematics: 0 };
  bookmarks.forEach(id => {
    const f = ALL_FORMULAS_FLAT.find(x => x.label === id);
    if (f) subjectCounts[f.subject] = (subjectCounts[f.subject] || 0) + 1;
  });

  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
    const dayQs = quizHistory.filter(h => new Date(h.date).toISOString().split('T')[0] === d);
    const dayCorrect = dayQs.filter(h => h.correct).length;
    last7.push({ date: d, total: dayQs.length, correct: dayCorrect });
  }

  const StatCard = ({ label, value, sub, color = "#818CF8" }) => (
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

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
      <h2 style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 24 }}>📊 Progress Tracker</h2>

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

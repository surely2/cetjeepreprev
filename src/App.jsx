import { useState, useEffect, useCallback, useMemo } from "react";

// ─── DATA & HOOKS ──────────────────────────────────────────────────────────
import { SUBJECTS, PHYSICS_DATA, CHEMISTRY_DATA, MATHEMATICS_DATA, ALL_FORMULAS_FLAT } from "./data/index.js";
import { usePersistentState } from "./hooks/usePersistentState.js";

// ─── COMPONENTS ────────────────────────────────────────────────────────────
import { Sidebar, FormulaCard, MobileBottomNav, MobileDrawer, MainNavDrawer } from "./components/index.js";

// ─── VIEWS ─────────────────────────────────────────────────────────────────
import {
  HomePage, StudyView, BookmarksView, FormulaOfTheDay,
  QuizView, ProgressView, RevisionView, DerivationsView,
  UnitCheckerView, ConstantsView, CheatSheetView, Diagrams3DView,
} from "./views/index.js";

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
    quizAttempted: 0, quizCorrect: 0, topicsVisited: [],
    quizHistory: [], studySessions: [], lastActiveDate: null,
    streak: 0, formulaViews: 0,
    subjectStats: { physics: 0, chemistry: 0, mathematics: 0 },
    dailyActivity: {},
  });

  const [srData, setSrData] = usePersistentState("jee-cet-sr", {});

  // Mobile detection
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
      return exists ? prev.filter(x => x !== id) : [...prev, id];
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
  const currentTopic = activeTopic && dataMap[subject]?.find(t => t.id === activeTopic);

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

  // Global styles
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

      {/* Mobile Drawers */}
      {isMobile && (
        <MobileDrawer open={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)}>
          {sidebarEl}
        </MobileDrawer>
      )}
      <MainNavDrawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        view={view}
        setView={setView}
        subject={subject}
        bookmarks={bookmarks}
      />

      {/* Main Content */}
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
            style={{ 
              background: "rgba(255,255,255,0.06)", 
              border: "1px solid rgba(255,255,255,0.1)", 
              color: "#fff", 
              borderRadius: 8, 
              width: 32, 
              height: 32, 
              cursor: "pointer", 
              fontSize: 14, 
              flexShrink: 0 
            }}
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

        {/* Content Area */}
        <div className="main-scroll-area" style={{ flex: 1, overflowY: "auto", padding: "0 4px" }}>

          {/* Search Results */}
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
              {view === "fotd" && <FormulaOfTheDay bookmarks={bookmarks} toggleBookmark={toggleBookmark} />}
              {view === "derivations" && <DerivationsView />}
              {view === "units" && <UnitCheckerView />}
              {view === "constants" && <ConstantsView />}
              {view === "cheatsheet" && <CheatSheetView bookmarks={bookmarks} setView={setView} />}
              {view === "diagrams" && <Diagrams3DView />}
              {view === "study" && (
                <div className="main-content-inner" style={{ maxWidth: 800, margin: "0 auto", padding: "28px 20px" }}>
                  <StudyView 
                    subject={subject} 
                    activeTopic={activeTopic} 
                    setActiveTopic={setActiveTopic}
                    bookmarks={bookmarks} 
                    toggleBookmark={toggleBookmark} 
                  />
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

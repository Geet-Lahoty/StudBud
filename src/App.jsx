import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import SyllabusUpload from "./pages/SyllabusUpload";
import StudyKanban from "./pages/StudyKanban";
import QuizGate from "./pages/QuizGate";
import Hero from "./components/Hero";
import ArchitectureFlow from "./components/ArchitectureFlow";
import IntellectualRigor from "./components/IntellectualRigor";
import MethodologyComparison from "./components/MethodologyComparison";

export default function App() {
  // Navigation state: "syllabus-upload" | "study-kanban" | "quiz-gate" | "landing"
  const getInitialRoute = () => {
    const hash = window.location.hash.replace("#", "");
    if (["syllabus-upload", "study-kanban", "quiz-gate", "landing"].includes(hash)) {
      return hash;
    }
    return "study-kanban";
  };

  const [currentPath, setCurrentPath] = useState(getInitialRoute);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState("login");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (["syllabus-upload", "study-kanban", "quiz-gate", "landing"].includes(hash)) {
        setCurrentPath(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = (path) => {
    setCurrentPath(path);
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenAuth = (tab = "login") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const handleCloseAuth = () => {
    setAuthModalOpen(false);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Top Header Navigation */}
      <Header
        currentPath={currentPath}
        onNavigate={navigateTo}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Content Area */}
      <main className="w-full pt-16 flex-1 bg-surface">
        {currentPath === "syllabus-upload" && (
          <SyllabusUpload onNavigate={navigateTo} />
        )}

        {currentPath === "study-kanban" && (
          <StudyKanban onOpenQuizGate={() => navigateTo("quiz-gate")} />
        )}

        {currentPath === "quiz-gate" && (
          <QuizGate onNavigate={navigateTo} />
        )}

        {currentPath === "landing" && (
          <div className="pt-4">
            <Hero />
            <ArchitectureFlow />
            <IntellectualRigor />
            <MethodologyComparison />
          </div>
        )}
      </main>

      {/* Scholarly Footer */}
      <Footer onOpenAuth={handleOpenAuth} onNavigate={navigateTo} />

      {/* Scholar Auth Modal */}
      {authModalOpen && (
        <AuthModal
          key={`${authModalTab}-${authModalOpen}`}
          initialTab={authModalTab}
          onClose={handleCloseAuth}
        />
      )}
    </div>
  );
}

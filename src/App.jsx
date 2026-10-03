import { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ArchitectureFlow from "./components/ArchitectureFlow";
import IntellectualRigor from "./components/IntellectualRigor";
import MethodologyComparison from "./components/MethodologyComparison";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import { supabase } from "./lib/supabase";

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState("login");

  const handleOpenAuth = (tab = "login") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const handleCloseAuth = () => {
    setAuthModalOpen(false);
  };

  useEffect(() => {
    // Check the current authentication session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Current session:", session);
    });

    // Listen for authentication changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event);
      console.log("Session:", session);
    });

    // Clean up the listener when the app unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Header */}
      <Header onOpenAuth={handleOpenAuth} />

      {/* Main Content Canvas */}
      <main className="w-full pt-20 flex-1">
        {/* Desktop Hero Section */}
        <Hero />

        {/* 3-Step Verification Architecture */}
        <ArchitectureFlow />

        {/* Precision Built for Intellectual Rigor */}
        <IntellectualRigor />

        {/* Comparative Methodology & Benchmarks */}
        <MethodologyComparison />
      </main>

      {/* Spacious Academic Footer */}
      <Footer onOpenAuth={handleOpenAuth} />

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

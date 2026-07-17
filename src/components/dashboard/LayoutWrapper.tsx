"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import AnalyticsTracker from "./AnalyticsTracker";
import HomeTab from "../tabs/HomeTab";
import AboutTab from "../tabs/AboutTab";
import ProjectsTab from "../tabs/ProjectsTab";
import SqlTab from "../tabs/SqlTab";
import PythonTab from "../tabs/PythonTab";
import PowerBiTab from "../tabs/PowerBiTab";
import MlTab from "../tabs/MlTab";
import SkillsTab from "../tabs/SkillsTab";
import ExperienceTab from "../tabs/ExperienceTab";
import CertificationsTab from "../tabs/CertificationsTab";
import ResumeTab from "../tabs/ResumeTab";
import BlogTab from "../tabs/BlogTab";
import ContactTab from "../tabs/ContactTab";

export default function LayoutWrapper() {
  const [showHero, setShowHero] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sync tab state with URL query param for deep linking
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab) {
        setActiveTab(tab);
        setShowHero(false); // If deep linking directly, bypass landing hero
      }
    }
  }, []);

  // Theme Sync effect
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const handleActiveTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tabId);
      window.history.pushState({}, "", url.toString());
    }
  };

  const handleEnterWorkspace = () => {
    setShowHero(false);
  };

  const handleLockWorkspace = () => {
    setShowHero(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeTab setActiveTab={handleActiveTabChange} theme={theme} />;
      case "about":
        return <AboutTab />;
      case "projects":
        return <ProjectsTab />;
      case "sql":
        return <SqlTab />;
      case "python":
        return <PythonTab />;
      case "powerbi":
        return <PowerBiTab />;
      case "ml":
        return <MlTab />;
      case "skills":
        return <SkillsTab />;
      case "experience":
        return <ExperienceTab />;
      case "certifications":
        return <CertificationsTab />;
      case "resume":
        return <ResumeTab />;
      case "blog":
        return <BlogTab />;
      case "contact":
        return <ContactTab />;
      default:
        return <HomeTab setActiveTab={handleActiveTabChange} />;
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground overflow-x-hidden font-sans">
      <AnalyticsTracker activeTab={activeTab} />
      
      {/* 2. Interactive Landing Hero */}
      <AnimatePresence>
        {showHero && (
          <motion.div
            key="hero"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-40"
          >
            <HeroSection onEnter={handleEnterWorkspace} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Centralized Dashboard Workspace Container */}
      {!showHero && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex h-screen w-screen overflow-hidden bg-background"
        >
          {/* Collapsible Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={handleActiveTabChange}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            mobileOpen={mobileSidebarOpen}
            setMobileOpen={setMobileSidebarOpen}
          />

          {/* Right Page View Container */}
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
            {/* Top Navigation */}
            <Navbar activeTab={activeTab} setMobileOpen={setMobileSidebarOpen} theme={theme} toggleTheme={toggleTheme} />

            {/* Scrollable Container for Panel and Footer */}
            <div className="flex-1 overflow-y-auto flex flex-col justify-between">
              {/* Main Interactive Content Panel */}
              <main className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto pb-16">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    {renderTabContent()}
                  </motion.div>
                </AnimatePresence>
              </main>

              {/* Dashboard Footer */}
              <footer className="border-t border-border bg-card px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 print:hidden select-none">
                <div>
                  © {new Date().getFullYear()} MADHAV KARTHICK
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleLockWorkspace} 
                    className="hover:text-cyan-400 font-semibold uppercase transition"
                  >
                    [ Lock Workspace ]
                  </button>
                  <span>LOC: BENGALURU, IN</span>
                </div>
              </footer>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}

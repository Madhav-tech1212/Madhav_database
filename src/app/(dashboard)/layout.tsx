"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";
import AnalyticsTracker from "@/components/dashboard/AnalyticsTracker";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Get active tab ID from pathname (e.g. "/about" -> "about", "/projects/slug" -> "projects")
  const getActiveTab = () => {
    const segment = pathname.replace(/^\//, "").split("/")[0];
    return segment || "home";
  };

  const activeTab = getActiveTab();

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

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans">
      <AnalyticsTracker />
      
      {/* Collapsible Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={() => {}} // Tab switching is now link/path-based
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Right Page View Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
        {/* Top Navigation */}
        <Navbar 
          activeTab={activeTab} 
          setMobileOpen={setMobileSidebarOpen} 
          theme={theme} 
          toggleTheme={toggleTheme} 
        />

        {/* Scrollable Container for Panel and Footer */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between">
          {/* Main Interactive Content Panel */}
          <main className="p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto pb-16">
            {children}
          </main>

          {/* Dashboard Footer */}
          <footer className="border-t border-border bg-card px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 print:hidden select-none">
            <div>
              © {new Date().getFullYear()} MADHAV KARTHICK
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="/" 
                className="hover:text-cyan-400 font-semibold uppercase transition"
              >
                [ Lock Workspace ]
              </a>
              <span>LOC: BENGALURU, IN</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

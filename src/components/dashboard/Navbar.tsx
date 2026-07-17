"use client";

import { useEffect, useState } from "react";
import { Menu, Search, Calendar, Bell, Sun, Moon } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

interface NavbarProps {
  activeTab: string;
  setMobileOpen: (open: boolean) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export default function Navbar({ activeTab, setMobileOpen, theme, toggleTheme }: NavbarProps) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getBreadcrumb = (tab: string) => {
    switch (tab) {
      case "home":
        return "Workspace / Dashboard Overview";
      case "about":
        return "Workspace / About Me";
      case "projects":
        return "Workspace / Project Repository";
      case "sql":
        return "Data Engine / SQL Query Workbench";
      case "python":
        return "Data Engine / Python Terminal";
      case "powerbi":
        return "Data Engine / Power BI Insights";
      case "ml":
        return "Data Engine / Machine Learning Workbench";
      case "skills":
        return "Credentials / Competency Matrix";
      case "experience":
        return "Credentials / Professional Timeline";
      case "certifications":
        return "Credentials / Verified Certifications";
      case "resume":
        return "Credentials / CV Engine";
      case "blog":
        return "Community / Technical Notes";
      case "contact":
        return "Community / Contact Console";
      default:
        return `Workspace / ${tab}`;
    }
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case "home":
        return "Dashboard Overview";
      case "about":
        return "About Me";
      case "projects":
        return "All Projects";
      case "sql":
        return "SQL Portfolio";
      case "python":
        return "Python Scripts";
      case "powerbi":
        return "Power BI Showcase";
      case "ml":
        return "Machine Learning";
      case "skills":
        return "Core Skills";
      case "experience":
        return "Professional Experience";
      case "certifications":
        return "Certifications";
      case "resume":
        return "Resume Hub";
      case "blog":
        return "Technical Blog";
      case "contact":
        return "Contact Terminal";
      default:
        return tab;
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-border bg-background/85 backdrop-blur-md px-6 select-none">
      {/* Breadcrumb / Mobile hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-slate-900/40 text-slate-400 hover:text-white"
        >
          <Menu size={18} />
        </button>
        <div className="flex flex-col">
          {/* <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
            {getBreadcrumb(activeTab)}
          </div> */}
          <div className="text-sm font-semibold text-white">
            {getTabLabel(activeTab)}
          </div>
        </div>
      </div>

      {/* Mock Search (CMD + K style) */}
      <div className="hidden lg:flex items-center gap-2 max-w-sm w-80 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-slate-500 hover:border-slate-400 dark:hover:border-slate-700 cursor-pointer">
        <Search size={14} className="text-slate-400" />
        <span className="flex-1">Search queries, models, files...</span>
        <span className="rounded bg-muted px-1.5 py-0.5 text-xs border border-border font-mono select-none">
          ⌘K
        </span>
      </div>

      {/* Quick stats and clock */}
      <div className="flex items-center gap-4 text-sm font-mono">
        <div className="hidden sm:flex items-center gap-2 text-slate-500 dark:text-slate-400 border-r border-border pr-4">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs tracking-wider text-emerald-500 dark:text-emerald-400">SERVER ONLINE</span>
        </div>

        {/* Live system clock */}
        <div className="text-foreground font-semibold bg-card border border-border rounded-lg px-3 py-1.5 hidden md:block">
          {currentTime || "00:00:00"}
        </div>

        {/* Icons / Theme Toggler */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-secondary transition-all"
            title="Toggle theme mode"
            aria-label="Toggle theme mode"
          >
            {theme === "dark" ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-indigo-600" />}
          </button>

          <a
            href="https://github.com/Madhav-tech1212"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-slate-500 hover:text-foreground hover:bg-secondary transition"
          >
            <FaGithub size={16} />
          </a>
          <a
            href="https://www.linkedin.com/in/madhavkarthickki"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-slate-500 hover:text-foreground hover:bg-secondary transition"
          >
            <FaLinkedin size={16} />
          </a>
        </div>
      </div>
    </header>
  );
}

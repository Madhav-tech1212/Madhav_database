"use client";

import { motion } from "framer-motion";
import {
  Home,
  User,
  FolderCode,
  Database,
  Cpu,
  BarChart3,
  Briefcase,
  Code2,
  Award,
  FileText,
  BookOpen,
  Mail,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Activity
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen
}: SidebarProps) {

  // const menuGroups = [
  //   {
  //     title: "Workspace",
  //     items: [
  //       { id: "home", label: "Dashboard", icon: Home },
  //       { id: "about", label: "About Me", icon: User },
  //       { id: "projects", label: "All Projects", icon: FolderCode },
  //     ]
  //   },
  //   {
  //     title: "Data Workspaces",
  //     items: [
  //       { id: "sql", label: "SQL Portfolio", icon: Database },
  //       { id: "python", label: "Python Scripts", icon: Terminal },
  //       { id: "powerbi", label: "Power BI", icon: BarChart3 },
  //       // { id: "ml", label: "Machine Learning", icon: Cpu },
  //     ]
  //   },
  //   {
  //     title: "Credentials",
  //     items: [
  //       { id: "skills", label: "Core Skills", icon: Code2 },
  //       { id: "experience", label: "Experience", icon: Briefcase },
  //       { id: "certifications", label: "Certifications", icon: Award },
  //       { id: "resume", label: "Resume Hub", icon: FileText },
  //     ]
  //   },
  //   {
  //     title: "Connect",
  //     items: [
  //       { id: "blog", label: "Tech Blog", icon: BookOpen },
  //       { id: "contact", label: "Contact", icon: Mail },
  //     ]
  //   }
  // ];

  const menuGroups = [
    {
      title: "Workspace",
      items: [
        { id: "home", label: "Dashboard", icon: Home },
        { id: "about", label: "About Me", icon: User },
        { id: "projects", label: "All Projects", icon: FolderCode },
	      { id: "skills", label: "Core Skills", icon: Code2 },
        { id: "experience", label: "Experience", icon: Briefcase },
	      { id: "resume", label: "Resume Hub", icon: FileText },
	      { id: "contact", label: "Contact", icon: Mail },
      ]
    },
  ];
  const handleNav = (tabId: string) => {
    setActiveTab(tabId);
    setMobileOpen(false); // Close mobile drawer when clicked
  };

  const sidebarContent = (
    <div className="w-full flex h-full flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border select-none">
      {/* Brand Header */}
      <div className={`flex h-16 items-center border-b border-sidebar-border ${
        collapsed ? "justify-center px-2" : "gap-3 px-6"
      }`}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-500 text-white font-bold shadow-md shadow-cyan-500/20">
          <Activity size={18} className="animate-pulse" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col"
          >
            <span className="font-semibold text-foreground tracking-wider text-sm">MADHAVK.COM</span>
            <span className="text-[10px] text-cyan-500 dark:text-cyan-400 font-mono tracking-widest">DATA WORKSPACE</span>
          </motion.div>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                {group.title}
              </span>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNav(item.id)}
                      className={`flex items-center rounded-lg py-2 text-sm font-medium transition-all duration-200 ${
                        collapsed 
                          ? "justify-center w-10 h-10 mx-auto" 
                          : "w-full justify-start px-3 gap-3"
                      } ${
                        isActive
                          ? "bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 shadow-[inset_4px_0_12px_rgba(6,182,212,0.05)]" + (collapsed ? "" : " border-l-2 border-cyan-500 dark:border-cyan-400")
                          : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" + (collapsed ? "" : " border-l-2 border-transparent")
                      }`}
                    >
                      <Icon size={18} className={`${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="truncate"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Collapse button at bottom */}
      <div className={`hidden md:flex border-t border-sidebar-border p-4 ${collapsed ? "justify-center" : "justify-end"}`}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-sidebar-border bg-card text-slate-500 hover:text-foreground dark:text-slate-400 hover:bg-sidebar-accent transition"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent sidebar with variable width) */}
      <aside
        className={`hidden md:block h-screen sticky top-0 transition-all duration-300 shrink-0 z-20 ${collapsed ? "w-16" : "w-64"
          }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
        />
      )}

      {/* Mobile Sidebar (Slide-over drawer) */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-40 w-64 h-full transform transition-transform duration-300 ease-in-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

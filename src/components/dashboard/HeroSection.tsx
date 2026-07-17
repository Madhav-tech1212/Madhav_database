"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ArrowRight, ShieldCheck, Cpu, Database, BarChart3 } from "lucide-react";

interface HeroSectionProps {
  onEnter: () => void;
}

const titles = [
  "Data Analyst",
  "Business Intelligence Developer",
  "SQL Developer",
  "Python Developer",
  "Dashboard Designer",
  "Analytics Engineer",
  "Power BI Developer",
  "Business Problem Solver",
  "Data Storyteller",
];

const steps = [
  {
    text: "Loading business datasets...",
    targetPercent: 15,
  },
  {
    text: "Cleaning & validating raw data...",
    targetPercent: 30,
  },
  {
    text: "Transforming data with SQL & Python...",
    targetPercent: 50,
  },
  {
    text: "Analyzing KPIs & business metrics...",
    targetPercent: 70,
  },
  {
    text: "Generating Power BI dashboards...",
    targetPercent: 90,
  },
  {
    text: "Insights ready. Welcome to my analytics workspace.",
    targetPercent: 100,
  },
];

export default function HeroSection({ onEnter }: HeroSectionProps) {
  const [titleIdx, setTitleIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [percent, setPercent] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  // Rotating title text effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIdx((prev) => (prev + 1) % titles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // progressive console loader updater
  useEffect(() => {
    if (!loading) return;

    const intervalTime = 30; // approx 3 seconds boot sequence
    const timer = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }

        const nextPercent = prev + 1;
        const matchedStepIndex = steps.findIndex(
          (s, idx) => 
            nextPercent >= s.targetPercent && 
            (idx === steps.length - 1 || nextPercent < steps[idx + 1].targetPercent)
        );

        if (matchedStepIndex !== -1 && matchedStepIndex !== currentStep) {
          setCurrentStep(matchedStepIndex);
          setTerminalLogs((logs) => [
            ...logs,
            `[info] ${steps[matchedStepIndex].text}`,
          ]);
        }
        
        return nextPercent;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentStep, loading]);

  useEffect(() => {
    if (percent === 100) {
      const delay = setTimeout(() => {
        setLoading(false);
      }, 600);
      return () => clearTimeout(delay);
    }
  }, [percent]);

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-[#05070f] overflow-hidden select-none font-sans">
      {/* Dynamic Matrix/Grid Glowing Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Floating neon blobs */}
      <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[150px]" />

      <div className="relative z-10 flex flex-col items-center justify-center max-w-4xl text-center px-6 w-full">
        {/* Top telemetry tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-950/20 px-4 py-1.5 text-xs font-mono text-cyan-400 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
          </span>
          MADHAV KARTHICK // ANALYTICS WORKSPACE
        </motion.div>

        {/* Hello header */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-2 leading-tight"
        >
          Hello, I'm{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-[#00d2ff] bg-clip-text text-transparent inline-block whitespace-nowrap">
            Madhav Karthick
          </span>
        </motion.h1>

        {/* Rotating titles container */}
        <div className="h-10 md:h-12 flex items-center justify-center mb-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={titleIdx}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-lg md:text-2xl font-mono font-medium text-slate-400 tracking-wide"
            >
              {titles[titleIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-full max-w-xl mx-auto space-y-2.5 mb-6">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span className="text-slate-300 font-medium">
              {percent === 100 ? "Initialization Finished" : "Running ETL & Metric Compilations..."}
            </span>
            <span className="font-bold text-cyan-400 tabular-nums">{percent}%</span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-900 border border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-[#00d2ff]"
              style={{ width: `${percent}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
        </div>

        {/* The 6 Steps Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl w-full mx-auto font-mono text-left mb-4">
          {steps.map((s, idx) => {
            const isCompleted = percent >= s.targetPercent;
            const isActive = percent < s.targetPercent && (idx === 0 || percent >= steps[idx - 1].targetPercent);
            return (
              <div 
                key={idx} 
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                  isCompleted 
                    ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" 
                    : isActive 
                      ? "border-cyan-500/30 bg-cyan-500/5 text-cyan-400 shadow-sm shadow-cyan-950/10" 
                      : "border-white/5 bg-transparent text-slate-600"
                }`}
              >
                {isCompleted ? (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-400">✓</span>
                ) : isActive ? (
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
                  </span>
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-750" />
                )}
                <span className="text-[11px] font-medium leading-none">{s.text}</span>
              </div>
            );
          })}
        </div>

        {/* Enter Workspace Button Reveal Container */}
        <div className="h-20 flex items-center justify-center">
          <AnimatePresence>
            {percent === 100 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <button
                  onClick={onEnter}
                  className="group relative flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-500 via-cyan-400 to-[#00d2ff] p-[1.5px] font-semibold text-white shadow-xl shadow-cyan-500/10 hover:shadow-cyan-400/20 active:scale-95 transition-all duration-300"
                >
                  <span className="flex items-center gap-3 w-full h-full bg-[#070b19] px-8 py-4 rounded-[11px] group-hover:bg-transparent group-hover:text-[#070b19] transition-all duration-300">
                    <Terminal size={18} className="group-hover:rotate-6 transition-transform" />
                    <span>Enter Workspace</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Systems grid indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="mt-6 grid grid-cols-3 gap-8 border-t border-white/5 pt-6 text-[11px] font-mono text-slate-500 max-w-lg mx-auto w-full"
        >
          <div className="flex flex-col items-center gap-1">
            <Database size={16} className="text-cyan-500/60" />
            <span>SQL ANALYTICS</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Cpu size={16} className="text-blue-500/60" />
            <span>ML ENGINE</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <BarChart3 size={16} className="text-cyan-400/60" />
            <span>BI SOLUTIONS</span>
          </div>
        </motion.div>
      </div>

      {/* Decorative side telemetry */}
      <div className="absolute bottom-6 left-8 hidden lg:block text-[10px] font-mono text-slate-500 select-none space-y-1">
        <div>ROLE: ANALYTICS ENGINEER & BI DEVELOPER</div>
        <div>LOC: BENGALURU, KARNATAKA, IN</div>
      </div>

      <div className="absolute bottom-6 right-8 hidden lg:block text-[10px] font-mono text-slate-500 select-none space-y-1 text-right">
        <div>STACK: SQL, PYTHON, POWER BI, ML</div>
        <div>STATUS: AVAILABLE FOR OPPORTUNITIES</div>
      </div>
    </div>
  );
}

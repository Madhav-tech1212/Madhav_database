"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

const steps = [
  { text: "Initializing next dev server compiler...", targetPercent: 5 },
  { text: "Loading React, TypeScript, and Tailwind packages...", targetPercent: 12 },
  { text: "Resolving PostgreSQL database connections...", targetPercent: 28 },
  { text: "Executing database migration checks...", targetPercent: 43 },
  { text: "Verifying Pandas scripts & ETL data pipelines...", targetPercent: 57 },
  { text: "Auditing application security policies...", targetPercent: 69 },
  { text: "Running workspace test runner suites...", targetPercent: 82 },
  { text: "Compiling dashboard components...", targetPercent: 91 },
  { text: "Optimizing code bundles for fast delivery...", targetPercent: 97 },
  { text: "Dev server ready.", targetPercent: 100 },
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [percent, setPercent] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  useEffect(() => {
    // Increment percent and transition through steps
    const intervalTime = 40; // Total loading time approx 4 seconds
    const timer = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }

        const nextPercent = prev + 1;
        
        // Check if we need to advance to the next step
        const matchedStepIndex = steps.findIndex(
          (s, idx) => 
            nextPercent >= s.targetPercent && 
            (idx === steps.length - 1 || nextPercent < steps[idx + 1].targetPercent)
        );

        if (matchedStepIndex !== -1 && matchedStepIndex !== currentStep) {
          setCurrentStep(matchedStepIndex);
          // Add terminal logs
          setTerminalLogs((logs) => [
            ...logs,
            `[info] ${steps[matchedStepIndex].text}`,
          ]);
        }
        
        return nextPercent;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentStep]);

  useEffect(() => {
    if (percent === 100) {
      const delay = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(delay);
    }
  }, [percent, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05070f] font-mono text-[#00d2ff]"
    >
      <div className="relative w-full max-w-2xl px-6">
        {/* Glow effect */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-cyan-500/10 via-blue-500/0 to-transparent blur-3xl" />

        {/* Top bar styling */}
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500/60" />
            <span className="h-2 w-2 rounded-full bg-yellow-500/60" />
            <span className="h-2 w-2 rounded-full bg-green-500/60" />
            <span className="ml-2">npm_run_dev.log</span>
          </div>
          <div>Next.js v16</div>
        </div>

        {/* System telemetry logs console */}
        <div className="mb-6 h-40 overflow-y-auto rounded-lg border border-white/5 bg-black/40 p-4 text-[11px] text-slate-400 select-none scrollbar-thin">
          <div className="text-slate-500">[info] server boot initialized...</div>
          <div className="text-slate-500">[info] establishing local telemetry listeners...</div>
          {terminalLogs.map((log, index) => (
            <div
              key={index}
              className={`${
                index === terminalLogs.length - 1 ? "text-[#00d2ff] font-semibold" : ""
              }`}
            >
              {log}
            </div>
          ))}
          {percent < 100 && (
            <div className="mt-1 flex items-center gap-1">
              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[#00d2ff]" />
              <span className="text-slate-500">Processing...</span>
            </div>
          )}
        </div>

        {/* Loading Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-200 font-medium">
              {percent === 100 ? "Initialization Finished" : steps[currentStep]?.text}
            </span>
            <span className="font-bold text-white tabular-nums">{percent}%</span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-900 border border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-[#00d2ff]"
              style={{ width: `${percent}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="mt-12 text-center text-xs text-slate-600 select-none">
          SECURE CONNECTION ESTABLISHED // PORTFOLIO WORKSPACE
        </div>
      </div>
    </motion.div>
  );
}

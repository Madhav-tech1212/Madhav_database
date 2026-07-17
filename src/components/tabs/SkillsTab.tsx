"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Database, Terminal, BarChart, Cpu, Code } from "lucide-react";

interface SkillItem {
  name: string;
  level: number;
}

interface SkillCategory {
  title: string;
  icon: any;
  skills: SkillItem[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "Databases & Warehousing",
    icon: Database,
    skills: [
      { name: "SQL (PostgreSQL / ANSI SQL)", level: 95 },
      { name: "Google BigQuery", level: 88 },
      { name: "MySQL", level: 90 },
      { name: "Data Modeling (Star/Snowflake)", level: 92 },
      { name: "Query Optimization / Indexing", level: 85 }
    ]
  },
  {
    title: "Programming & ETL",
    icon: Terminal,
    skills: [
      { name: "Python (Pandas, NumPy)", level: 92 },
      { name: "R-Language (Basic Stats)", level: 65 },
      { name: "ETL / Pipeline Automation", level: 86 },
      { name: "API Integrations (REST/JSON)", level: 88 }
    ]
  },
  {
    title: "Business Intelligence",
    icon: BarChart,
    skills: [
      { name: "Power BI (Desktop / Service)", level: 90 },
      { name: "DAX (Data Analysis Expressions)", level: 88 },
      { name: "Excel (VBA, Power Query)", level: 95 },
      { name: "Storytelling & Visual Design", level: 92 }
    ]
  },
  // {
  //   title: "Machine Learning & Stats",
  //   icon: Cpu,
  //   skills: [
  //     { name: "Scikit-Learn (Supervised/Unsupervised)", level: 82 },
  //     { name: "Time Series Forecasting (SARIMAX)", level: 80 },
  //     { name: "Statistical Hypothesis Testing", level: 84 },
  //     { name: "Data Cleaning / Preprocessing", level: 94 }
  //   ]
  // },
  {
    title: "Web Tech & Frameworks",
    icon: Code,
    skills: [
      { name: "React.js / Next.js", level: 85 },
      { name: "Tailwind CSS", level: 90 },
      { name: "TypeScript", level: 80 },
      { name: "Git / Version Control", level: 88 }
    ]
  }
];

// Sub-component for individual skill bar with delay
function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(level);
    }, delay * 100);
    return () => clearTimeout(timer);
  }, [level, delay]);

  return (
    <div className="space-y-1.5 select-none">
      <div className="flex justify-between text-xs font-medium font-sans">
        <span className="text-foreground">{name}</span>
        <span className="text-cyan-600 dark:text-cyan-400 font-mono">{level}%</span>
      </div>
      <div className="h-1.5 w-full bg-secondary border border-border rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-[#06b6d4] dark:to-[#00d2ff] transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default function SkillsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none font-sans">
      {skillCategories.map((cat, catIdx) => {
        const Icon = cat.icon;
        return (
          <motion.div
            key={catIdx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: catIdx * 0.08 }}
            className="rounded-xl border border-border bg-card p-5 space-y-4 hover:border-cyan-500/20 transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 border-b border-border pb-3">
              <div className="rounded-lg bg-secondary p-2 border border-border text-cyan-600 dark:text-cyan-400">
                <Icon size={16} />
              </div>
              <h3 className="font-bold text-foreground tracking-wide text-xs uppercase font-mono">
                {cat.title}
              </h3>
            </div>

            {/* List of skills */}
            <div className="space-y-4">
              {cat.skills.map((skill, sIdx) => (
                <SkillBar
                  key={sIdx}
                  name={skill.name}
                  level={skill.level}
                  delay={(catIdx * 2) + sIdx}
                />
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

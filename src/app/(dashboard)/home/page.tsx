"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Database, 
  Terminal, 
  Briefcase, 
  BarChart, 
  ArrowUpRight 
} from "lucide-react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area
} from "recharts";

// CountUp Component for stats
function CountUp({ value, duration = 1000, suffix = "" }: { value: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (value === 0) return;
    let start = 0;
    const end = value;
    const incrementTime = Math.max(Math.floor(duration / end), 8);
    
    const timer = setInterval(() => {
      start += 1;
      setCount(Math.min(start, end));
      if (start >= end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span className="tabular-nums">{count}{suffix}</span>;
}

// Mock Data for charts
const skillRadarData = [
  { subject: "SQL / Warehousing", A: 95, fullMark: 100 },
  { subject: "Python Scripts", A: 90, fullMark: 100 },
  { subject: "Power BI / DAX", A: 88, fullMark: 100 },
  { subject: "Excel / Power Query", A: 80, fullMark: 100 },
  { subject: "Statistics / Analytics", A: 78, fullMark: 100 },
  { subject: "ETL / Automation", A: 85, fullMark: 100 },
];

const projectTimelineData = [
  { name: "Q1", SQL: 2, Python: 1, BI: 2 },
  { name: "Q2", SQL: 6, Python: 4, BI: 6 },
  { name: "Q3", SQL: 7, Python: 8, BI: 10 },
  { name: "Q4", SQL: 10, Python: 12, BI: 15 },
];

const techUsageData = [
  { name: "BigQuery", score: 90 },
  { name: "Postgres", score: 95 },
  { name: "Pandas", score: 90 },
  { name: "Power BI", score: 88 },
  { name: "Python", score: 92 },
  { name: "Scikit-Learn", score: 82 },
];

// Generate Mock GitHub contributions (53 weeks * 7 days = 371 cells)
const generateGitContributions = () => {
  const data = [];
  for (let i = 0; i < 371; i++) {
    const day = i % 7;
    let level = 0;
    const rand = Math.random();
    if (day === 0 || day === 6) {
      level = rand > 0.85 ? 1 : 0;
    } else {
      level = rand > 0.9 ? 4 : rand > 0.75 ? 3 : rand > 0.5 ? 2 : rand > 0.2 ? 1 : 0;
    }
    data.push({ id: i, level });
  }
  return data;
};

const gitContribs = generateGitContributions();

export default function HomePage() {
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const root = window.document.documentElement;
    setTheme(root.classList.contains("dark") ? "dark" : "light");

    const observer = new MutationObserver(() => {
      setTheme(root.classList.contains("dark") ? "dark" : "light");
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const tickColor = theme === "dark" ? "#8a9ebf" : "#475569";
  const gridColor = theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";

  const statCards = [
    { 
      title: "Total Projects", 
      value: 5, 
      suffix: "+", 
      icon: Database, 
      color: "from-cyan-400 to-blue-500", 
      tab: "projects" 
    },
    { 
      title: "Client satisfaction", 
      value: 98, 
      suffix: "%", 
      icon: Terminal, 
      color: "from-blue-500 to-indigo-500", 
      tab: "" 
    },
    { 
      title: "Power BI Report Portfolio", 
      value: 12, 
      suffix: "", 
      icon: BarChart, 
      color: "from-cyan-500 to-emerald-500", 
      tab: "" 
    },
    { 
      title: "Years Active Experience", 
      value: 2, 
      suffix: "+", 
      icon: Briefcase, 
      color: "from-emerald-400 to-teal-500", 
      tab: "experience" 
    },
  ];

  return (
    <div className="space-y-6 select-none">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6">
        <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-gradient-to-l from-cyan-500/10 to-transparent blur-3xl" />

        <div className="relative z-10 space-y-3">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Data Analyst • Business Intelligence • SQL Developer
          </h2>

          <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
            I help startups and businesses turn raw data into actionable insights through
            SQL, Python, Power BI, and BigQuery. From interactive executive dashboards
            and KPI reporting to automated analytics workflows, I build solutions that
            support faster, data-driven business decisions.
          </p>

          <p className="text-sm font-medium text-cyan-400">
            🚀 Available for Remote Full-Time Roles • Freelance Projects • Business Analytics Consulting
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => card.tab && router.push(`/${card.tab}`)}
              className={`group relative overflow-hidden rounded-xl border border-border bg-card p-5 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-950/10 transition-all duration-300 ${
                card.tab ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 from-transparent via-cyan-500 to-transparent" />
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
                    {card.title}
                  </span>
                  <div className="text-2xl font-bold text-foreground flex items-baseline">
                    <CountUp value={card.value} suffix={card.suffix} />
                  </div>
                </div>
                <div className="rounded-lg bg-secondary p-2.5 border border-border group-hover:text-primary transition-colors">
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>{card.tab ? "View workspace files" : "Internal Metric"}</span>
                {card.tab && <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Charts & Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Radar: Skill Distribution */}
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between">
          <div className="border-b border-border pb-3 mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Core Skill Matrix</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Multidimensional capability assessment</span>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillRadarData}>
                <PolarGrid stroke={gridColor} />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: tickColor, fontSize: 11, fontFamily: "monospace" }} 
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#475569" }} stroke="transparent" />
                <Radar
                  name="Madhav"
                  dataKey="A"
                  stroke="#00d2ff"
                  fill="#00d2ff"
                  fillOpacity={0.15}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tech Stack Bar Chart */}
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between">
          <div className="border-b border-border pb-3 mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Technology Usage Index</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Production environment utilization rate (%)</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={techUsageData} layout="vertical" margin={{ left: 25, right: 10, top: 5, bottom: 5 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fill: tickColor, fontSize: 11 }} stroke={gridColor} />
                <YAxis dataKey="name" type="category" tick={{ fill: tickColor, fontSize: 11 }} stroke="transparent" width={75} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#090e1f", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }} 
                  itemStyle={{ color: "#00d2ff" }}
                />
                <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                  {techUsageData.map((entry, index) => (
                    <rect
                      key={`bar-${index}`}
                      fill={index % 2 === 0 ? "#00d2ff" : "#3b82f6"}
                    />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Projects Delivery Timeline Chart */}
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between">
          <div className="border-b border-border pb-3 mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Project Delivery Timeline</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Cumulative developer projects completed</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectTimelineData} margin={{ left: 5, right: 10, top: 10, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fill: tickColor, fontSize: 11 }} stroke={gridColor} />
                <YAxis tick={{ fill: tickColor, fontSize: 11 }} stroke={gridColor} width={25} />
                <Tooltip contentStyle={{ backgroundColor: "#090e1f", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }} />
                <Area type="monotone" dataKey="SQL" stroke="#00d2ff" fill="rgba(0,210,255,0.1)" strokeWidth={2} name="SQL Projects" />
                <Area type="monotone" dataKey="Python" stroke="#10b981" fill="rgba(16,185,129,0.05)" strokeWidth={2} name="Python Automations" />
                <Area type="monotone" dataKey="BI" stroke="#f59e0b" fill="rgba(245,158,11,0.05)" strokeWidth={2} name="Power BI Pages" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* GitHub Contributions Grid */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="border-b border-border pb-3 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Continuous Development Activity</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Query commits, notebook executions, pipeline runs</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>Less</span>
            <div className="h-2.5 w-2.5 rounded bg-slate-200 dark:bg-slate-900/50 border border-black/5 dark:border-white/5" />
            <div className="h-2.5 w-2.5 rounded bg-cyan-100 dark:bg-cyan-950/40" />
            <div className="h-2.5 w-2.5 rounded bg-cyan-300 dark:bg-cyan-900/50" />
            <div className="h-2.5 w-2.5 rounded bg-cyan-500/70 dark:bg-cyan-600/50" />
            <div className="h-2.5 w-2.5 rounded bg-[#06b6d4] dark:bg-[#00d2ff]" />
            <span>More</span>
          </div>
        </div>

        {/* Matrix Grid Container */}
        <div className="overflow-x-auto scrollbar-thin">
          <div className="grid grid-flow-col grid-rows-7 gap-[3px] min-w-[700px] py-1">
            {gitContribs.map((cell) => {
              const bgColors = [
                "bg-slate-200 dark:bg-slate-900/50 hover:bg-slate-300 dark:hover:bg-slate-800 border border-black/5 dark:border-white/5",
                "bg-cyan-100 dark:bg-cyan-950/40 hover:bg-cyan-200 dark:hover:bg-cyan-900/60 border border-cyan-500/5",
                "bg-cyan-300 dark:bg-cyan-900/50 hover:bg-cyan-400 dark:hover:bg-cyan-800/60 border border-cyan-500/10",
                "bg-cyan-500/70 dark:bg-cyan-600/50 hover:bg-cyan-600 dark:hover:bg-cyan-500/60 border border-cyan-400/20",
                "bg-[#06b6d4] dark:bg-[#00d2ff] hover:brightness-110",
              ];
              return (
                <div
                  key={cell.id}
                  className={`h-2.5 w-2.5 rounded-[1px] transition-colors cursor-crosshair duration-200 ${
                    bgColors[cell.level]
                  }`}
                  title={`Run telemetry OK: weight ${cell.level}`}
                />
              );
            })}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span>Active commits: 1,842 in last 12 months</span>
          <span>Workspace Sync: Active</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ExternalLink, 
  BookOpen, 
  Code, 
  TrendingUp, 
  Lightbulb, 
  AlertTriangle,
  Layers
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";

interface Project {
  title: string;
  category: string[];
  desc: string;
  image: string;
  stack: string[];
  problem: string;
  solution: string;
  impact: string;
  learnings: string;
  github?: string;
  demo?: string;
}

const projectsData: Project[] = [
  {
    title: "OmniChannel Retail ETL & RFM Analytics",
    category: ["Python", "SQL", "Machine Learning", "Analytics"],
    desc: "End-to-end Python pipeline extracting Shopify and Stripe sales, syncing to PostgreSQL, and performing K-Means clustering.",
    image: "linear-gradient(135deg, #0e1e38 0%, #0a4d68 100%)",
    stack: ["Python", "PostgreSQL", "Pandas", "Scikit-Learn", "Docker"],
    problem: "Marketing teams faced fragmented customer profiles across Shopify, Stripe, and legacy database systems, leading to high churn rates and poorly target marketing campaigns.",
    solution: "Designed and implemented an automated Python ETL pipeline to fetch sales data via API, scrub duplicates using Pandas, structure a centralized star-schema warehouse in PostgreSQL, and execute K-Means clustering to score RFM segments.",
    impact: "Automated segment pipelines enabled custom email flows, yielding a 14% drop in active customer churn and a 9x speed increase in custom query speeds.",
    learnings: "Optimized indexing strategies in Postgres for massive joins and handled raw JSON payload changes from dynamic Stripe endpoints.",
    github: "https://github.com",
    demo: "https://github.com"
  },
  {
    title: "Financial Consolidation & EBITDA BI Suite",
    category: ["Power BI", "SQL", "Dashboard"],
    desc: "Multi-currency financial analytics workspace using Star Schema data modeling and advanced DAX tables.",
    image: "linear-gradient(135deg, #101c38 0%, #086b5c 100%)",
    stack: ["Power BI", "SQL Server", "DAX", "Power Query", "Excel"],
    problem: "C-Suite executives had to manually consolidate spreadsheet datasets across four regional subsidiaries, taking 4 days post-month-end to inspect EBITDA variations.",
    solution: "Modeled a clean Star Schema in SQL Server containing unified foreign currency lookup rates and compiled 24 customized DAX measures (YoY EBITDA, Working Capital, Dynamic FX conversions).",
    impact: "Reduced monthly leadership reporting generation from 4 days to real-time update capabilities, eliminating manual consolidation errors entirely.",
    learnings: "Gained advanced insights into query folding in Power Query and techniques for structuring efficient star-schema structures.",
    github: "https://github.com",
    demo: "https://github.com"
  },
  {
    title: "Predictive Warehouse Stock Optimizer",
    category: ["Python", "Machine Learning", "Analytics"],
    desc: "Time-series forecasting script leveraging SARIMAX algorithms to prevent warehouse stockouts.",
    image: "linear-gradient(135deg, #1a1638 0%, #68084a 100%)",
    stack: ["Python", "SARIMAX", "Statsmodels", "NumPy", "Matplotlib"],
    problem: "Seasonal distribution trends triggered inventory stockouts on high-margin SKU items, costing over $50,000 in monthly lost orders.",
    solution: "Engineered a time-series forecasting model (SARIMAX) mapping seasonal demand spikes and integrated optimal buffer safety thresholds.",
    impact: "Slashed inventory holding expenses by 18% while concurrently dropping stockout occurrences below 1% for core SKU categories.",
    learnings: "Fine-tuned hyperparameter parameters on non-stationary datasets and configured automated script notifications.",
    github: "https://github.com"
  },
  {
    title: "SQL Performance Optimization Hub",
    category: ["SQL", "Analytics"],
    desc: "Query optimization library solving heavy transaction latency on multi-million row tables.",
    image: "linear-gradient(135deg, #091c33 0%, #173b6c 100%)",
    stack: ["PostgreSQL", "Query Plans", "Indexes", "CTEs", "Window Functions"],
    problem: "Critical application analytics queries took over 18 seconds to compute on an active transactional database, throttling server resource levels.",
    solution: "Re-architected messy nested subqueries into optimized Common Table Expressions (CTEs), created targeted partial indices, and mapped partition schemes.",
    impact: "Reduced median analytics query completion times from 18 seconds down to 320 milliseconds (a 98% latency improvement).",
    learnings: "Learned detailed execution plan analysis (`EXPLAIN ANALYZE`) and the distinct performance profiles between CTEs and temporary tables.",
    github: "https://github.com"
  }
];

const categories = ["All", "SQL", "Python", "Power BI", "Machine Learning", "Analytics", "Dashboard"];

export default function ProjectsTab() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = projectsData.filter((p) => {
    if (activeFilter === "All") return true;
    return p.category.includes(activeFilter);
  });

  return (
    <div className="space-y-6 select-none font-sans">
      
      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-border">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium font-mono transition-all duration-200 ${
              activeFilter === cat
                ? "bg-cyan-500/20 text-cyan-500 dark:text-cyan-400 border border-cyan-500/30"
                : "bg-card text-muted-foreground border border-border hover:text-foreground hover:bg-secondary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((proj, idx) => (
            <motion.div
              key={proj.title}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card hover:border-cyan-500/20 transition-all duration-300"
            >
              {/* Card visual thumb */}
              <div
                className="h-36 w-full relative opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                style={{ background: proj.image }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <div className="absolute top-4 right-4 rounded-full bg-background/80 px-2 py-0.5 border border-border text-[9px] font-mono text-cyan-500 dark:text-cyan-400">
                  {proj.category[0]}
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {proj.desc}
                  </p>
                </div>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {proj.stack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="rounded bg-secondary border border-border px-2 py-0.5 text-xs font-mono text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                  {proj.stack.length > 4 && (
                    <span className="text-xs font-mono text-slate-500 px-1 py-0.5">
                      +{proj.stack.length - 4} more
                    </span>
                  )}
                </div>

                {/* Lower buttons bar */}
                <div className="border-t border-border pt-4 flex items-center gap-3">
                  <Dialog>
                    <DialogTrigger
                      onClick={() => setSelectedProject(proj)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-secondary border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
                    >
                      <BookOpen size={13} />
                      <span>View Case Study</span>
                    </DialogTrigger>
                    
                    {/* Project Dialog details */}
                    <DialogContent className="max-w-2xl bg-card border border-border text-card-foreground rounded-xl overflow-hidden font-sans max-h-[90vh] overflow-y-auto">
                      <DialogHeader className="border-b border-border pb-4">
                        <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                          <Layers className="text-primary" size={18} />
                          {selectedProject?.title}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-xs">
                          Production Case Study and System Overview
                        </DialogDescription>
                      </DialogHeader>

                      {selectedProject && (
                        <div className="space-y-5 pt-4 text-xs">
                           {/* Row: Tech Stack */}
                          <div className="space-y-1.5">
                            <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
                              TECHNOLOGY STACK
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedProject.stack.map((t) => (
                                <span key={t} className="rounded bg-secondary border border-border px-2 py-0.5 text-xs font-mono text-foreground">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Row: Problem */}
                          <div className="space-y-1 bg-red-500/5 border border-red-500/10 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-red-500 dark:text-red-400 font-semibold text-xs tracking-wider uppercase">
                              <AlertTriangle size={12} />
                              <span>Problem Statement</span>
                            </div>
                            <p className="text-foreground leading-relaxed pt-1 text-xs">
                              {selectedProject.problem}
                            </p>
                          </div>

                          {/* Row: Solution */}
                          <div className="space-y-1 bg-cyan-500/5 border border-cyan-500/10 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-cyan-500 dark:text-cyan-400 font-semibold text-xs tracking-wider uppercase">
                              <Code size={12} />
                              <span>Technical Solution</span>
                            </div>
                            <p className="text-foreground leading-relaxed pt-1 text-xs">
                              {selectedProject.solution}
                            </p>
                          </div>

                          {/* Row: Impact */}
                          <div className="space-y-1 bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400 font-semibold text-xs tracking-wider uppercase">
                              <TrendingUp size={12} />
                              <span>Business Impact</span>
                            </div>
                            <p className="text-foreground leading-relaxed pt-1 text-xs">
                              {selectedProject.impact}
                            </p>
                          </div>

                          {/* Row: Key Learnings */}
                          <div className="space-y-1 bg-secondary border border-border rounded-lg p-3">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-semibold text-xs tracking-wider uppercase">
                              <Lightbulb size={12} />
                              <span>Key Learnings</span>
                            </div>
                            <p className="text-foreground leading-relaxed pt-1 text-xs">
                              {selectedProject.learnings}
                            </p>
                          </div>

                           {/* Bottom Action Footer inside Dialog */}
                          <div className="border-t border-border pt-4 flex items-center justify-end gap-3 text-xs">
                            {selectedProject.github && (
                              <a
                                href={selectedProject.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-4 py-2 hover:bg-muted text-foreground transition"
                              >
                                <FaGithub size={13} />
                                <span>Code Repository</span>
                              </a>
                            )}
                            {selectedProject.demo && (
                              <a
                                href={selectedProject.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 hover:brightness-110 text-white font-semibold transition"
                              >
                                <ExternalLink size={13} />
                                <span>Live Dashboard</span>
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary text-slate-500 hover:text-foreground hover:bg-muted transition"
                      title="GitHub Repository"
                    >
                      <FaGithub size={14} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}

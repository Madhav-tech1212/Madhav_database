"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { projectsData, getProjectSlug, categories } from "./projectsData";

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const router = useRouter();

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
          {filteredProjects.map((proj) => (
            <motion.div
              key={proj.title}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={() => router.push(`/projects/${getProjectSlug(proj.title)}`)}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card hover:border-cyan-500/20 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              {/* Card visual thumb */}
              <div className="h-36 w-full relative overflow-hidden bg-secondary">
                {proj.image.startsWith("linear-gradient") || proj.image.startsWith("#") ? (
                  <div
                    className="w-full h-full opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                    style={{ background: proj.image }}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <div className="absolute top-4 right-4 rounded-full bg-background/80 px-2 py-0.5 border border-border text-[9px] font-mono text-cyan-500 dark:text-cyan-400">
                  {proj.category[0]}
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-foreground group-hover:text-cyan-500 transition-colors">
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/projects/${getProjectSlug(proj.title)}`);
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-secondary border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
                  >
                    <BookOpen size={13} />
                    <span>View Project</span>
                  </button>

                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
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

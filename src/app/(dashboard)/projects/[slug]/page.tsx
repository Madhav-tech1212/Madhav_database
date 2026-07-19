"use client";

import { useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ExternalLink, 
  Code, 
  TrendingUp, 
  Lightbulb, 
  AlertTriangle,
  ArrowLeft
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { projectsData, getProjectSlug, Project } from "../projectsData";
import { tracker } from "@/lib/tracker";

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const project = projectsData.find((p) => getProjectSlug(p.title) === slug);

  useEffect(() => {
    if (project) {
      // Track custom event when a user opens this project case study
      tracker.trackCustomEvent("project_view", project.title);
    }
  }, [project]);

  if (!project) {
    notFound();
  }

  return <ProjectDetailView project={project} />;
}

interface ProjectDetailViewProps {
  project: Project;
}

function ProjectDetailView({ project }: ProjectDetailViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header / Nav Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <Link
          href="/projects"
          className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-cyan-500 transition group self-start"
        >
          <ArrowLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
          <span>[ BACK TO ALL PROJECTS ]</span>
        </Link>
        
        <div className="flex items-center gap-3">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
            >
              <FaGithub size={14} />
              <span>Repository</span>
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-3.5 py-2 text-xs font-semibold text-white hover:brightness-110 transition"
            >
              <ExternalLink size={14} />
              <span>Live Dashboard</span>
            </a>
          )}
        </div>
      </div>

      {/* Hero / Banner with Title */}
      <div className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-lg">
        {/* Background gradient banner */}
        <div className="h-44 md:h-56 w-full relative">
          {project.image.startsWith("linear-gradient") || project.image.startsWith("#") ? (
            <div
              className="w-full h-full opacity-75"
              style={{ background: project.image }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover opacity-75"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        </div>
        
        {/* Content positioning */}
        <div className="p-6 md:p-8 space-y-4 -mt-20 relative z-10 bg-gradient-to-t from-card via-card/95 to-transparent">
          <div className="flex flex-wrap gap-1.5">
            {project.category.map((cat) => (
              <span
                key={cat}
                className="rounded bg-cyan-500/10 border border-cyan-500/25 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-cyan-500 dark:text-cyan-400 uppercase"
              >
                {cat}
              </span>
            ))}
          </div>
          
          <h2 className="text-xl md:text-3xl font-extrabold text-foreground tracking-tight">
            {project.title}
          </h2>
          
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-4xl font-normal">
            {project.desc}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Narrative Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* System / Dashboard Screenshot Showcase */}
          {project.screenshot && (
            <div className="rounded-xl border border-border overflow-hidden bg-card shadow-lg">
              {/* Browser-style title bar */}
              <div className="bg-muted px-4 py-2 border-b border-border flex items-center gap-1.5 select-none">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="ml-2 text-[10px] font-mono text-muted-foreground truncate">
                  {project.title} - System Preview
                </span>
              </div>
              <div className="p-2 bg-secondary/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.screenshot}
                  alt={`${project.title} Showcase`}
                  className="w-full h-auto rounded-lg shadow-sm border border-border/40 object-contain max-h-[450px] mx-auto"
                />
              </div>
            </div>
          )}

          {/* Problem Statement Card */}
          <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-5 md:p-6 space-y-3">
            <div className="flex items-center gap-2 text-red-500 dark:text-red-400 font-bold text-xs tracking-wider uppercase">
              <AlertTriangle size={14} />
              <span>Problem Statement</span>
            </div>
            <p className="text-xs md:text-sm text-foreground leading-relaxed font-normal">
              {project.problem}
            </p>
          </div>

          {/* Technical Solution Card */}
          <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-5 md:p-6 space-y-3">
            <div className="flex items-center gap-2 text-cyan-500 dark:text-cyan-400 font-bold text-xs tracking-wider uppercase">
              <Code size={14} />
              <span>Technical Solution</span>
            </div>
            <p className="text-xs md:text-sm text-foreground leading-relaxed font-normal">
              {project.solution}
            </p>
          </div>

          {/* Business Impact Card */}
          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-5 md:p-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400 font-bold text-xs tracking-wider uppercase">
              <TrendingUp size={14} />
              <span>Business Impact</span>
            </div>
            <p className="text-xs md:text-sm text-foreground leading-relaxed font-normal">
              {project.impact}
            </p>
          </div>
        </div>

        {/* Sidebar Info Area */}
        <div className="space-y-6">
          {/* Tech Stack Card */}
          <div className="rounded-xl border border-border bg-card p-5 md:p-6 space-y-3">
            <h3 className="text-[10px] uppercase font-mono font-bold text-muted-foreground tracking-wider">
              Technology Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded bg-secondary border border-border px-2.5 py-1 text-xs font-mono text-foreground hover:bg-muted transition duration-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Key Learnings Card */}
          <div className="bg-secondary/40 border border-border rounded-xl p-5 md:p-6 space-y-3">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-xs tracking-wider uppercase">
              <Lightbulb size={14} />
              <span>Key Learnings</span>
            </div>
            <p className="text-xs md:text-sm text-foreground leading-relaxed font-normal">
              {project.learnings}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

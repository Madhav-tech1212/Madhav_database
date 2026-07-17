"use client";

import { motion } from "framer-motion";
import { Briefcase, Target, Calendar, Award } from "lucide-react";

interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  location: string;
  responsibilities: string[];
  achievements: string[];
  tech: string[];
}

const experiences: ExperienceItem[] = [
  {
    company: "Freelance",
    role: "Freelance Data Analyst",
    duration: "Jan 2026 - Present",
    location: "Remote",
    responsibilities: [
      "Analyze business datasets using SQL, Python, and BigQuery to uncover trends and generate actionable insights.",
      "Build interactive Power BI dashboards to monitor KPIs, sales performance, customer behavior, and operational metrics.",
      "Automate reporting workflows using Python and Pandas, reducing manual reporting efforts.",
      "Develop end-to-end analytics projects including data cleaning, transformation, visualization, and business reporting."
    ],
    achievements: [
      "Built multiple business intelligence dashboards demonstrating executive-level KPI reporting.",
      "Created reusable SQL analytics templates and automated Python workflows for business reporting.",
      "Published real-world analytics case studies showcasing data-driven business recommendations."
    ],
    tech: [
      "SQL",
      "Python",
      "Power BI",
      "BigQuery",
      "Pandas",
      "Excel",
      "Git"
    ]
  },

  {
    company: "Personal Analytics Portfolio",
    role: "Business Intelligence & Data Analytics",
    duration: "Jan 2026 - Present",
    location: "Remote",
    responsibilities: [
      "Design end-to-end analytics projects using real-world datasets across retail, finance, marketing, and operations.",
      "Perform exploratory data analysis (EDA), data cleaning, feature engineering, and business reporting.",
      "Develop executive dashboards with interactive visualizations and KPI tracking.",
      "Document complete project workflows and publish production-ready analytics repositories on GitHub."
    ],
    achievements: [
      "Built a growing portfolio of business intelligence projects demonstrating practical analytics skills.",
      "Created scalable dashboard templates for executive reporting and business performance monitoring.",
      "Established reusable analytics workflows for SQL, Python, and Power BI projects."
    ],
    tech: [
      "SQL",
      "Python",
      "Power BI",
      "BigQuery",
      "Pandas",
      "Data Visualization"
    ]
  },

  {
    company: "SM Timbers & Klariti Learning",
    role: "Freelance Full Stack Developer",
    duration: "Jun 2025 - Jan 2026",
    location: "Coimbatore, India",
    responsibilities: [
      "Developed business management systems, LMS platforms, and manufacturing workflow applications.",
      "Designed scalable database structures and backend APIs for business operations.",
      "Collaborated with business stakeholders to digitize manual workflows through automation.",
      "Implemented secure authentication, role-based access control, and responsive user interfaces."
    ],
    achievements: [
      "Successfully delivered multiple business web applications for manufacturing and education clients.",
      "Improved operational efficiency through workflow automation and centralized management systems.",
      "Designed reusable application architecture supporting future feature expansion."
    ],
    tech: [
      "Next.js",
      "React",
      "Node.js",
      "MongoDB",
      "WordPress",
      "REST APIs",
      "JavaScript"
    ]
  },

  {
    company: "CDIX Innovation Pvt Ltd",
    role: "Full Stack Developer",
    duration: "Jun 2024 - Jun 2025",
    location: "Chennai, India",
    responsibilities: [
      "Developed scalable web applications using React.js, Next.js, Node.js, and MongoDB.",
      "Built responsive frontend interfaces and backend APIs for enterprise applications.",
      "Collaborated with cross-functional teams to translate business requirements into technical solutions.",
      "Maintained application performance, optimized database queries, and integrated third-party services."
    ],
    achievements: [
      "Delivered multiple production-ready web applications with modern full-stack technologies.",
      "Contributed to scalable application architecture and reusable component development.",
      "Improved application performance through frontend optimization and efficient API integration."
    ],
    tech: [
      "React",
      "Next.js",
      "Node.js",
      "MongoDB",
      "JavaScript",
      "REST APIs",
      "Git"
    ]
  }
];

export default function ExperienceTab() {
  return (
    <div className="space-y-6 select-none font-sans max-w-4xl mx-auto">
      
      <div className="border border-border bg-card rounded-xl p-5 mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">Career Timeline</h3>
        <p className="text-xs text-muted-foreground">
          Professional tenure and data contributions mapped chronologically.
        </p>
      </div>

      <div className="relative border-l border-border ml-4 pl-8 space-y-10">
        {experiences.map((exp, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="relative"
          >
            {/* Timeline Dot Icon */}
            <div className="absolute -left-[45px] top-1.5 flex h-7.5 w-7.5 items-center justify-center rounded-full border border-cyan-500/30 bg-card text-cyan-500 dark:text-cyan-400 shadow-md shadow-cyan-500/20">
              <Briefcase size={13} />
            </div>

            <div className="border border-border bg-card rounded-xl p-5 space-y-4 hover:border-cyan-500/20 transition-all duration-300">
              {/* Header block */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-border pb-3">
                <div>
                  <h4 className="text-base font-bold text-foreground">{exp.role}</h4>
                  <span className="text-sm text-cyan-600 dark:text-cyan-400 font-semibold">{exp.company}</span>
                </div>
                <div className="text-xs text-right font-mono text-muted-foreground">
                  <div className="flex items-center gap-1.5 justify-end">
                    <Calendar size={15} />
                    <span>{exp.duration}</span>
                  </div>
                  <div>{exp.location}</div>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="space-y-1.5">
                <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
                  Core Responsibilities
                </span>
                <ul className="space-y-1 text-sm text-muted-foreground dark:text-slate-300 list-disc pl-4 leading-relaxed">
                  {exp.responsibilities.map((resp, rIdx) => (
                    <li key={rIdx}>{resp}</li>
                  ))}
                </ul>
              </div>

              {/* Key Achievements */}
              <div className="space-y-2 border-t border-border pt-3">
                <span className="text-xs uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-wider flex items-center gap-1.5">
                  <Award size={12} />
                  <span>Key Technical Achievements</span>
                </span>
                <ul className="space-y-1 text-sm text-muted-foreground dark:text-slate-300 list-disc pl-4 leading-relaxed">
                  {exp.achievements.map((ach, aIdx) => (
                    <li key={aIdx} className="marker:text-cyan-500 dark:marker:text-cyan-400">
                      {ach}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech stack footer */}
              <div className="flex flex-wrap gap-1.5 border-t border-border pt-3">
                {exp.tech.map((t) => (
                  <span key={t} className="rounded bg-secondary border border-border px-2 py-0.5 text-xs font-mono text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}

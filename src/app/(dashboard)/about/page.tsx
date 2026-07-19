"use client";

import { motion } from "framer-motion";
import { User, Shield, Target, Compass, Briefcase } from "lucide-react";

export default function AboutPage() {
  const timelineEvents = [
    {
      year: "Jan 2026 - Present",
      title: "Freelance Data Analyst",
      subtitle: "Business Intelligence & Analytics",
      desc: "Delivering business intelligence solutions by analyzing complex datasets, building interactive dashboards, automating reporting pipelines, and uncovering actionable insights using SQL, Python, Power BI, and BigQuery to support data-driven decision-making.",
      tags: [
        "SQL",
        "Python",
        "Power BI",
        "BigQuery",
        "Business Intelligence"
      ]
    },
    {
      year: "Jan 2026 - Present",
      title: "Data Analytics & Business Intelligence",
      subtitle: "Building Enterprise Analytics Projects",
      desc: "Transitioning into Data Analytics by building end-to-end business intelligence projects using SQL, Python, Power BI, and BigQuery. Creating executive dashboards, automating data workflows, and solving real-world business problems through data.",
      tags: [
        "SQL",
        "Python",
        "Power BI",
        "BigQuery",
        "Pandas"
      ]
    },
    {
      year: "Jun 2025 - Jan 2026",
      title: "Freelance Developer",
      subtitle: "SM Timbers & Klariti Learning",
      desc: "Designed and developed business management systems, LMS platforms, and manufacturing workflows. Worked closely with stakeholders to streamline operations through automation, database design, and reporting solutions.",
      tags: [
        "WordPress",
        "Next.js",
        "Database Design",
        "Automation",
        "Business Systems"
      ]
    },
    {
      year: "Jun 2024 - Jun 2025",
      title: "Full Stack Developer",
      subtitle: "CDIX Innovation Pvt Ltd",
      desc: "Developed scalable web applications using React.js, Next.js, and MongoDB. Collaborated on business applications and gained experience translating business requirements into technical solutions while strengthening database and API development skills.",
      tags: [
        "React",
        "Next.js",
        "MongoDB",
        "Node.js",
        "REST APIs"
      ]
    },
    {
      year: "May 2020 - Jun 2024",
      title: "B.E. Mechatronics Engineering",
      subtitle: "Kumaraguru College of Technology",
      desc: "Built engineering projects involving computer vision, automation, and embedded systems. Developed strong foundations in programming, databases, problem-solving, and system design.",
      tags: [
        "Python",
        "Computer Vision",
        "Automation",
        "Embedded Systems",
        "Engineering"
      ]
    }
  ];

  return (
    <div className="space-y-8 select-none">
      
      {/* Intro Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bio Card */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <User className="text-cyan-500 dark:text-cyan-400" size={18} />
            <h3 className="font-bold text-foreground tracking-wide text-sm">About Myself</h3>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              I am a results-oriented *Data Analyst*, **Business Intelligence Developer**, and **Machine Learning Engineer** dedicated to transforming unstructured datasets into strategic business assets. I specialize in bridging the gap between raw data storage infrastructure and executive decision-making.
            </p>
            <p>
              My technical expertise spans building complex **SQL queries** (CTEs, Window functions, performance tuning), developing structured **Python ETL pipelines** (Pandas, NumPy, automation), modeling analytical warehouses (Star schema designs), and building high-fidelity **Power BI reports** that stakeholders trust.
            </p>
            <p>
              Furthermore, I leverage **predictive modeling** and machine learning algorithms (Scikit-Learn, clustering, forecasting models) to anticipate market trends, identify operational anomalies, and engineer custom analytical solutions.
            </p>
          </div>
        </div>

        {/* Mission / Vision Card */}
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <Target className="text-cyan-500 dark:text-cyan-400" size={18} />
              <h3 className="font-bold text-foreground tracking-wide text-sm">Core Objectives</h3>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Compass className="text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" size={14} />
                <div className="text-[14px] leading-relaxed">
                  <span className="text-foreground font-medium block">MISSION</span>
                  <span className="text-muted-foreground">Democratizing operational metrics through automated pipelines and elegant dashboards.</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Shield className="text-cyan-500 dark:text-[#00d2ff] shrink-0 mt-0.5" size={14} />
                <div className="text-[14px] leading-relaxed">
                  <span className="text-foreground font-medium block">VISION</span>
                  <span className="text-muted-foreground">Pioneering secure, scalable, and data-driven infrastructures that drive business efficiency.</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            PORTFOLIO REF: MK_ANALYTICS_04
          </div>
        </div>

      </div>

      {/* Interactive Career Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Timeline (Left 2 cols) */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
            <Briefcase className="text-cyan-500 dark:text-cyan-400" size={18} />
            <h3 className="font-bold text-foreground tracking-wide text-sm">Career & Education Journey</h3>
          </div>
          
          <div className="relative border-l border-border ml-3 pl-6 space-y-8">
            {timelineEvents.map((event, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative"
              >
                {/* Connector Dot */}
                <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-cyan-500 dark:border-cyan-400 bg-background shadow-md shadow-cyan-400/20" />
                
                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                    <span className="font-mono text-cyan-500 dark:text-cyan-400 font-medium">{event.year}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono">{event.subtitle}</span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">{event.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed pr-4">{event.desc}</p>
                  
                  {/* Skill tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {event.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="rounded bg-secondary border border-border px-2 py-0.5 text-[9px] font-mono text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

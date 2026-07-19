"use client";

import { motion } from "framer-motion";
import { Award, CheckCircle, ExternalLink, Calendar } from "lucide-react";

interface Certification {
  name: string;
  org: string;
  date: string;
  id: string;
  url: string;
  category: "SQL" | "Python" | "Cloud" | "BI" | "ML";
}

const certificationsList: Certification[] = [
  {
    name: "Microsoft Certified: Power BI Data Analyst Associate",
    org: "Microsoft",
    date: "Dec 2024",
    id: "PL-300-VERIFIED",
    url: "https://learn.microsoft.com",
    category: "BI"
  },
  {
    name: "Google Cloud Certified: Professional Data Engineer",
    org: "Google Cloud",
    date: "Aug 2024",
    id: "GCP-PDE-8291",
    url: "https://cloud.google.com",
    category: "Cloud"
  },
  {
    name: "AWS Certified Cloud Practitioner",
    org: "Amazon Web Services",
    date: "Feb 2024",
    id: "AWS-CCP-9921",
    url: "https://aws.amazon.com",
    category: "Cloud"
  },
  {
    name: "PCAP: Certified Associate in Python Programming",
    org: "Python Institute",
    date: "Nov 2023",
    id: "PCAP-31-03",
    url: "https://python.org",
    category: "Python"
  },
  {
    name: "SQL Advanced Queries & Performance",
    org: "PostgreSQL Academy",
    date: "May 2023",
    id: "PG-SQL-ADV-902",
    url: "https://postgresql.org",
    category: "SQL"
  }
];

export default function CertificationsPage() {
  return (
    <div className="space-y-6 select-none font-sans">
      <div className="border border-border bg-card rounded-xl p-5 mb-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">Industry Credentials</h3>
        <p className="text-xs text-muted-foreground">
          Professional certifications and qualifications verified via public registry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {certificationsList.map((cert, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-5 hover:border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-950/10 transition-all duration-300"
          >
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 from-transparent via-cyan-500 to-transparent" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded bg-secondary border border-border px-2 py-0.5 text-xs font-mono text-cyan-600 dark:text-cyan-400 uppercase">
                  {cert.category}
                </span>
                <div className="text-slate-500 group-hover:text-primary transition-colors">
                  <Award size={16} />
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors pr-2">
                  {cert.name}
                </h4>
                <p className="text-xs text-muted-foreground font-semibold">
                  {cert.org}
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-border pt-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>Issued: {cert.date}</span>
                </div>
                <span>ID: {cert.id}</span>
              </div>

              <a
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg bg-secondary border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition w-full"
              >
                <CheckCircle size={11} className="text-emerald-500 dark:text-emerald-400" />
                <span>Verify Credential</span>
                <ExternalLink size={10} className="text-slate-500" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

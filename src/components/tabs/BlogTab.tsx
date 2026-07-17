"use client";

import { useState } from "react";
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";

interface Article {
  title: string;
  category: string;
  date: string;
  readTime: string;
  summary: string;
  content: string[];
}

const blogArticles: Article[] = [
  {
    title: "Optimizing PostgreSQL Queries on Multi-Million Row Tables",
    category: "SQL Tuning",
    date: "July 12, 2026",
    readTime: "5 min read",
    summary: "A technical dive into execution plans, partial indexing, and restructuring nested joins to slash latency by 98%.",
    content: [
      "In transactional warehouses, query speeds degrade rapidly as rows surpass critical scales. Yesterday, our customer segment report started taking 18 seconds to execute. Here's a step-by-step breakdown of how we fixed it.",
      "First, running EXPLAIN ANALYZE on the nested query revealed heavy sequential scans on our invoice transactions table (Fact_Invoice) because the planner missed key filters. This highlighted the need for an index.",
      "To address this, we implemented a partial index since we frequently filter by active status: \nCREATE INDEX idx_invoice_active ON Fact_Invoice (customer_id, order_total) WHERE status = 'active';",
      "Next, we replaced nested subqueries with structured Common Table Expressions (CTEs), permitting the postgres compiler to materialize clean temporal results. These configurations dropped latency from 18 seconds down to a crisp 320ms."
    ]
  },
  {
    title: "Memory-Efficient CSV Data Cleaning with Pandas Chunks",
    category: "Python Analytics",
    date: "June 24, 2026",
    readTime: "4 min read",
    summary: "How to process massive raw CSV logs without running into out-of-memory (OOM) errors using python chunking features.",
    content: [
      "Pandas is an exceptional library, but load_csv can overwhelm server RAM when scanning logs exceeding 5GB. To prevent OOM loops, we leverage file chunking pipelines.",
      "Instead of running pd.read_csv('massive_file.csv'), we initialize chunks: \nfor chunk in pd.read_csv('massive_file.csv', chunksize=100000):\n    clean_chunk = chunk[chunk['error_code'].isnull()]\n    # sync straight to PostgreSQL warehouse...",
      "This process caps memory consumption under 250MB regardless of total document size, ensuring reliability in containerized execution environments like AWS Lambda or Docker."
    ]
  },
  {
    title: "Understanding Power BI Star Schemas vs Snowflake Layouts",
    category: "Data Modeling",
    date: "April 18, 2026",
    readTime: "6 min read",
    summary: "Comparing dimension schemas to maximize Power Query folding and ensure fast DAX query responsiveness.",
    content: [
      "When building complex corporate dashboards, the database model determines performance. Many BI developers fallback to snowflake schemas because they normalize database columns, but this degrades dashboard performance.",
      "A Star Schema centers a single Fact table surrounded by flat Dimension tables. This architecture reduces the join complexity of DAX calculations.",
      "Snowflaking splits flat dimensions into child dimensions (e.g. Dim_Products -> Dim_Categories). While it saves minor disk space, it creates visual delays because Power BI must scan multiple nested joins for every calculation.",
      "Rule of thumb: Normalize in your transactional database (3NF), but denormalize into a flat Star Schema in your Power BI dataset for maximum performance."
    ]
  }
];

export default function BlogTab() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <div className="space-y-6 select-none font-sans max-w-4xl mx-auto">
      
      <div className="border border-border bg-card rounded-xl p-5 mb-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">Developer Notebook</h3>
        <p className="text-xs text-muted-foreground">
          Articles documenting SQL query tweaks, Python code snippets, and BI modeling architectures.
        </p>
      </div>

      <div className="space-y-4">
        {blogArticles.map((article, idx) => (
          <div
            key={idx}
            className="group rounded-xl border border-border bg-card p-6 hover:border-cyan-500/20 transition-all duration-300 flex flex-col justify-between gap-4"
          >
            <div className="space-y-2">
              {/* Category, Date, readTime */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted-foreground">
                <span className="rounded bg-secondary border border-border px-2 py-0.5 text-cyan-600 dark:text-cyan-400 font-semibold uppercase">
                  {article.category}
                </span>
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{article.readTime}</span>
                </div>
              </div>

              {/* Title & summary */}
              <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                {article.title}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {article.summary}
              </p>
            </div>

            {/* Read button */}
            <div className="flex justify-end border-t border-border pt-4">
              <Dialog>
                <DialogTrigger
                  onClick={() => setSelectedArticle(article)}
                  className="flex items-center gap-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition"
                >
                  <span>Read Notebook Entry</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </DialogTrigger>
                
                {/* Modal View */}
                <DialogContent className="max-w-2xl bg-card border border-border text-card-foreground rounded-xl overflow-hidden font-sans max-h-[85vh] overflow-y-auto">
                  <DialogHeader className="border-b border-border pb-4">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted-foreground mb-1">
                      <span className="rounded bg-secondary border border-border px-2 py-0.5 text-cyan-600 dark:text-cyan-400 font-semibold uppercase">
                        {selectedArticle?.category}
                      </span>
                      <span>{selectedArticle?.date}</span>
                      <span>{selectedArticle?.readTime}</span>
                    </div>
                    <DialogTitle className="text-base font-bold text-foreground leading-tight">
                      {selectedArticle?.title}
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 dark:text-slate-400 text-[10px]">
                      TECHNICAL NOTEBOOK ENTRY // READ ONLY
                    </DialogDescription>
                  </DialogHeader>

                  {selectedArticle && (
                    <div className="space-y-4 pt-4 text-xs leading-relaxed text-foreground font-sans">
                      {selectedArticle.content.map((p, pIdx) => {
                        // Check if paragraph contains SQL or Python code
                        const isCode = p.includes("SELECT") || p.includes("CREATE INDEX") || p.includes("import pandas") || p.includes("for chunk in");
                        if (isCode) {
                          return (
                            <pre key={pIdx} className="font-mono text-[10.5px] text-emerald-600 dark:text-emerald-400 bg-secondary p-3 rounded-lg border border-border overflow-x-auto whitespace-pre">
                              {p}
                            </pre>
                          );
                        }
                        return <p key={pIdx}>{p}</p>;
                      })}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

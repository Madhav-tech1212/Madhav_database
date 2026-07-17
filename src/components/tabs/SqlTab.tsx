"use client";

import { useState } from "react";
import { Play, Database, Terminal, FileText, CheckCircle2, ChevronRight } from "lucide-react";

interface QueryCase {
  title: string;
  topic: string;
  query: string;
  description: string;
  columns: string[];
  rows: (string | number)[][];
}

const sqlCases: QueryCase[] = [
  {
    title: "Ranking & Window Functions",
    topic: "Window Functions",
    query: `SELECT
  employee_name,
  department,
  salary,
  DENSE_RANK() OVER(
    PARTITION BY department 
    ORDER BY salary DESC
  ) as salary_rank,
  LAG(salary, 1) OVER(
    PARTITION BY department 
    ORDER BY salary DESC
  ) as previous_highest_salary
FROM employees;`,
    description: "Evaluates department-level salary tiers and offsets to find descending salary distributions and step differentials.",
    columns: ["employee_name", "department", "salary", "salary_rank", "previous_highest_salary"],
    rows: [
      ["Alice Patel", "Engineering", 125000, 1, "NULL"],
      ["Bob Jenkins", "Engineering", 115000, 2, 125000],
      ["Diana Rose", "Engineering", 98000, 3, 115000],
      ["Charlie Lee", "Sales", 95000, 1, "NULL"],
      ["Emma Watson", "Sales", 88000, 2, 95000],
    ]
  },
  {
    topic: "CTEs",
    title: "Common Table Expressions (CTEs)",
    query: `WITH RegionalSales AS (
  SELECT region, SUM(amount) as total_sales
  FROM sales
  GROUP BY region
), TopRegions AS (
  SELECT region
  FROM RegionalSales
  WHERE total_sales > (
    SELECT AVG(total_sales) FROM RegionalSales
  )
)
SELECT s.region, s.product_id, SUM(s.amount) as product_sales
FROM sales s
JOIN TopRegions tr ON s.region = tr.region
GROUP BY s.region, s.product_id;`,
    description: "Filters products belonging exclusively to regions whose total sales exceed the global regional average.",
    columns: ["region", "product_id", "product_sales"],
    rows: [
      ["North", "PROD_A91", 45000],
      ["North", "PROD_B02", 30000],
      ["West", "PROD_A91", 62000],
      ["West", "PROD_C33", 28000],
    ]
  },
  {
    topic: "JOINS & Aggregations",
    title: "Customer Lifetime Value (LTV) Join",
    query: `SELECT
  c.customer_name,
  COUNT(o.order_id) as total_orders,
  COALESCE(SUM(o.order_total), 0) as lifetime_value,
  AVG(o.order_total) as average_order_value
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_date >= '2025-01-01'
GROUP BY c.customer_id, c.customer_name
HAVING COUNT(o.order_id) >= 3
ORDER BY lifetime_value DESC;`,
    description: "Joins customers and orders to calculate LTV for users who have completed 3 or more transactions since Jan 2025.",
    columns: ["customer_name", "total_orders", "lifetime_value", "average_order_value"],
    rows: [
      ["John Doe", 5, 1250.00, 250.00],
      ["Sarah Connor", 3, 890.50, 296.83],
      ["Bruce Wayne", 4, 3200.00, 800.00],
    ]
  },
  {
    topic: "Business Case Studies",
    title: "Monthly User Cohort Retention",
    query: `-- Cohort Retention Analysis (Month-on-Month)
WITH user_cohorts AS (
  SELECT user_id, DATE_TRUNC('month', MIN(signup_date)) as cohort_month
  FROM users
  GROUP BY user_id
), activity_months AS (
  SELECT DISTINCT user_id, DATE_TRUNC('month', login_date) as activity_month
  FROM user_logins
)
SELECT
  c.cohort_month,
  COUNT(DISTINCT c.user_id) as cohort_size,
  COUNT(DISTINCT a.user_id) as active_next_month,
  ROUND(COUNT(DISTINCT a.user_id) * 100.0 / COUNT(DISTINCT c.user_id), 2) as retention_pct
FROM user_cohorts c
LEFT JOIN activity_months a ON c.user_id = a.user_id
  AND a.activity_month = c.cohort_month + INTERVAL '1 month'
GROUP BY c.cohort_month
ORDER BY cohort_month;`,
    description: "Calculates the cohort size and consecutive month retention rates for newly registered application profiles.",
    columns: ["cohort_month", "cohort_size", "active_next_month", "retention_pct"],
    rows: [
      ["2025-01-01", 1200, 720, "60.00%"],
      ["2025-02-01", 1500, 975, "65.00%"],
      ["2025-03-01", 1800, 1080, "60.00%"],
    ]
  }
];

export default function SqlTab() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [executing, setExecuting] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const [terminalOutput, setTerminalOutput] = useState<string>("");

  const currentCase = sqlCases[selectedIdx];

  const handleRunQuery = () => {
    setExecuting(true);
    setShowResults(false);
    setTerminalOutput("Initializing compiler connection...\nTarget: PostgreSQL v16\nAnalyzing queries...\nScanning tables...\nOptimizing joins...");
    
    setTimeout(() => {
      setTerminalOutput((prev) => prev + "\nExecution successful. 0 errors. Scanning results database...");
      setTimeout(() => {
        setExecuting(false);
        setShowResults(true);
      }, 500);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 select-none font-sans h-full items-stretch">
      
      {/* Left Sidebar Topics list */}
      <div className="xl:col-span-1 border border-border bg-card rounded-xl p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Database size={16} className="text-cyan-600 dark:text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">SQL Topics</span>
        </div>
        
        <nav className="flex flex-col gap-1 overflow-y-auto max-h-[300px] xl:max-h-[500px] scrollbar-none">
          {sqlCases.map((c, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedIdx(idx);
                setShowResults(true);
                setTerminalOutput("");
              }}
              className={`flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                selectedIdx === idx
                  ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground tracking-wider uppercase font-mono">{c.topic}</span>
                <span className="truncate max-w-[150px]">{c.title}</span>
              </div>
              <ChevronRight size={14} className={selectedIdx === idx ? "text-cyan-600 dark:text-cyan-400" : "text-slate-500"} />
            </button>
          ))}
        </nav>
      </div>

      {/* Editor & Results Area (Right 3 cols) */}
      <div className="xl:col-span-3 flex flex-col gap-6">
        
        {/* SQL Code Window */}
        <div className="border border-border bg-card rounded-xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between bg-secondary border-b border-border px-5 py-3">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Terminal size={14} className="text-cyan-600 dark:text-cyan-400" />
              <span>Query_Editor_01.sql</span>
            </div>
            
            <button
              onClick={handleRunQuery}
              disabled={executing}
              className="flex items-center gap-1.5 rounded bg-primary hover:brightness-110 disabled:opacity-50 px-3 py-1 text-[11px] font-semibold text-primary-foreground transition"
            >
              <Play size={12} fill="currentColor" />
              <span>{executing ? "Running..." : "Run Query"}</span>
            </button>
          </div>

          {/* Code Area */}
          <div className="p-5 font-mono text-[11.5px] leading-relaxed bg-secondary text-foreground overflow-x-auto min-h-[180px]">
            <pre className="whitespace-pre">
              {currentCase.query.split("\n").map((line, lIdx) => {
                // Inline pseudo-syntax highlighter
                let highlighted = line
                  .replace(/(SELECT|FROM|WHERE|GROUP BY|HAVING|ORDER BY|JOIN|LEFT JOIN|WITH|OVER|PARTITION BY|DENSE_RANK|LAG|COALESCE|SUM|AVG|COUNT|ROUND|MIN|DATE_TRUNC|AS|ON|AND|OR|DESC|INTERVAL)/g, '<span class="text-cyan-600 dark:text-cyan-400">$1</span>')
                  .replace(/(--.*)/g, '<span class="text-slate-500 dark:text-slate-400">$1</span>')
                  .replace(/('2025-01-01'|'month'|'1 month')/g, '<span class="text-emerald-600 dark:text-emerald-400">$1</span>')
                  .replace(/(1\b|0\b|3\b|2\b|100\.0\b)/g, '<span class="text-purple-600 dark:text-purple-400">$1</span>');

                return (
                  <div key={lIdx} className="flex gap-4">
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 text-right w-5 select-none">{lIdx + 1}</span>
                    <span dangerouslySetInnerHTML={{ __html: highlighted || "&nbsp;" }} />
                  </div>
                );
              })}
            </pre>
          </div>
        </div>

        {/* Console / Output Window */}
        <div className="border border-border bg-card rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">QueryResultConsole</h4>
            {showResults && !executing && (
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 dark:text-emerald-400 font-mono">
                <CheckCircle2 size={12} />
                <span>SUCCESS ({currentCase.rows.length} rows returned)</span>
              </div>
            )}
          </div>

          {/* Telemetry/Log window when executing */}
          {(executing || terminalOutput) && (
            <pre className="font-mono text-[10px] text-muted-foreground bg-background p-3 rounded border border-border max-h-24 overflow-y-auto whitespace-pre-line">
              {terminalOutput}
            </pre>
          )}

          {/* Results Table Grid */}
          {showResults && !executing && (
            <div className="overflow-x-auto rounded border border-border">
              <table className="min-w-full text-left font-mono text-[11px] text-foreground">
                <thead className="bg-secondary text-muted-foreground border-b border-border">
                  <tr>
                    {currentCase.columns.map((col, cIdx) => (
                      <th key={cIdx} className="px-4 py-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-transparent">
                  {currentCase.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-muted transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-4 py-2">
                          {typeof cell === "number" ? cell.toLocaleString() : cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Description */}
          <div className="text-[11px] text-muted-foreground leading-relaxed bg-secondary rounded-lg p-3 border border-border">
            <span className="font-semibold text-foreground block mb-1">Functional Description</span>
            {currentCase.description}
          </div>
        </div>

      </div>

    </div>
  );
}

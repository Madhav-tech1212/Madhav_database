export interface Project {
  title: string;
  category: string[];
  desc: string;
  image: string;
  screenshot?: string;
  stack: string[];
  problem: string;
  solution: string;
  impact: string;
  learnings: string;
  github?: string;
  demo?: string;
}

export const projectsData: Project[] = [
  {
    title: "OmniChannel Retail ETL & RFM Analytics",
    category: ["Python", "SQL", "Machine Learning", "Analytics"],
    desc: "End-to-end Python pipeline extracting Shopify and Stripe sales, syncing to PostgreSQL, and performing K-Means clustering.",
    image: "linear-gradient(135deg, #0e1e38 0%, #0a4d68 100%)",
    screenshot: "/projects/Retail Store Sales Analysis.png",
    stack: ["Python", "PostgreSQL", "Pandas", "Scikit-Learn", "Docker"],
    problem: "Marketing teams faced fragmented customer profiles across Shopify, Stripe, and legacy database systems, leading to high churn rates and poorly target marketing campaigns.",
    solution: "Designed and implemented an automated Python ETL pipeline to fetch sales data via API, scrub duplicates using Pandas, structure a centralized star-schema warehouse in PostgreSQL, and execute K-Means clustering to score RFM segments.",
    impact: "Automated segment pipelines enabled custom email flows, yielding a 14% drop in active customer churn and a 9x speed increase in custom query speeds.",
    learnings: "Optimized indexing strategies in Postgres for massive joins and handled raw JSON payload changes from dynamic Stripe endpoints.",
    github: "https://github.com/Madhav-tech1212",
    demo: "https://github.com/Madhav-tech1212"
  },
  {
    title: "Financial Consolidation & EBITDA BI Suite",
    category: ["Power BI", "SQL", "Dashboard"],
    desc: "Multi-currency financial analytics workspace using Star Schema data modeling and advanced DAX tables.",
    image: "linear-gradient(135deg, #101c38 0%, #086b5c 100%)",
    screenshot: "/projects/retail-dashboard.png",
    stack: ["Power BI", "SQL Server", "DAX", "Power Query", "Excel"],
    problem: "C-Suite executives had to manually consolidate spreadsheet datasets across four regional subsidiaries, taking 4 days post-month-end to inspect EBITDA variations.",
    solution: "Modeled a clean Star Schema in SQL Server containing unified foreign currency lookup rates and compiled 24 customized DAX measures (YoY EBITDA, Working Capital, Dynamic FX conversions).",
    impact: "Reduced monthly leadership reporting generation from 4 days to real-time update capabilities, eliminating manual consolidation errors entirely.",
    learnings: "Gained advanced insights into query folding in Power Query and techniques for structuring efficient star-schema structures.",
    github: "https://github.com/Madhav-tech1212",
    demo: "https://github.com/Madhav-tech1212"
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
    github: "https://github.com/Madhav-tech1212"
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
    github: "https://github.com/Madhav-tech1212"
  }
];

export const getProjectSlug = (title: string) => 
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const categories = ["All", "SQL", "Python", "Power BI", "Machine Learning", "Analytics", "Dashboard"];

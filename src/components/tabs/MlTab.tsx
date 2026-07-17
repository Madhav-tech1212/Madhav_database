"use client";

import { useState } from "react";
import { 
  Database, 
  LineChart, 
  Wrench, 
  Cpu, 
  Activity, 
  CloudLightning, 
  TrendingUp, 
  ChevronRight 
} from "lucide-react";

interface PipelineStage {
  label: string;
  icon: any;
  title: string;
  desc: string;
  details: string;
  metricLabel?: string;
  metricValue?: string;
}

interface MlProject {
  title: string;
  algorithm: string;
  dataset: string;
  stages: PipelineStage[];
}

const mlProjects: MlProject[] = [
  {
    title: "XGBoost Customer Lifetime Value Predictor",
    algorithm: "Regression / Gradient Boosting",
    dataset: "E-Commerce Transaction Logs (2.4M rows)",
    stages: [
      {
        label: "Dataset",
        icon: Database,
        title: "Datalake Aggregation",
        desc: "Consolidated historical order frequencies, refund rates, and session durations from Postgres tables.",
        details: "Loaded raw transactional data mapping customer profiles over a 24-month horizon. Handled outliers where total expenditures exceeded 4 standard deviations.",
        metricLabel: "Records Analyzed",
        metricValue: "2,452,019 rows"
      },
      {
        label: "EDA",
        icon: LineChart,
        title: "Exploratory Data Analysis",
        desc: "Discovered strong positive skewness in order value distribution and seasonal peaks.",
        details: "Analyzed features correlation matrix showing purchase frequency and duration of membership hold the highest collinear correlation with lifetime value.",
        metricLabel: "Skewness Coefficient",
        metricValue: "+3.24"
      },
      {
        label: "Features",
        icon: Wrench,
        title: "Feature Engineering",
        desc: "Built custom metrics like Recency, Frequency, and Monetary (RFM) aggregations.",
        details: "Calculated average transaction intervals and rolling purchase counts. Log-transformed skewed monetary inputs to enforce normal distribution ranges.",
        metricLabel: "Features Engineered",
        metricValue: "18 Features"
      },
      {
        label: "Training",
        icon: Cpu,
        title: "Model Compilation",
        desc: "Trained an XGBoost Regressor with 5-fold cross-validation.",
        details: "Utilized hyperparameter optimization via GridSearchCV. Configured learning rate to 0.05 and max depth to 6 to limit validation overfitting risks.",
        metricLabel: "Training Epochs",
        metricValue: "1,500 estimators"
      },
      {
        label: "Evaluation",
        icon: Activity,
        title: "Model Validation",
        desc: "Achieved high coefficient of determination with minimal absolute errors.",
        details: "Tested final model parameters against a 20% holdout set. Inspected residual plots showing homoscedastic variance structures across predictions.",
        metricLabel: "Validation R² Score",
        metricValue: "0.8842"
      },
      {
        label: "Deployment",
        icon: CloudLightning,
        title: "Production Release",
        desc: "Serialized model utilizing Joblib and packaged within a FastApi microservice.",
        details: "Deployed API endpoint inside a lightweight Docker container, integrating scheduled monthly inference pipelines on active databases.",
        metricLabel: "Latency (P95)",
        metricValue: "42 milliseconds"
      },
      {
        label: "Business Value",
        icon: TrendingUp,
        title: "Operational Impact",
        desc: "Triggered targeted VIP loyalty rewards for top 5% forecast lifetime spenders.",
        details: "Empowered retention managers to target predictive high-value cohorts prior to churn cycles, improving marketing acquisition efficiencies.",
        metricLabel: "ROI Multiplier",
        metricValue: "3.2x Marketing Spend"
      }
    ]
  },
  {
    title: "Random Forest Customer Churn Classifier",
    algorithm: "Classification / Ensemble Learning",
    dataset: "Telecom User Subscriptions (85k rows)",
    stages: [
      {
        label: "Dataset",
        icon: Database,
        title: "Data Loading",
        desc: "Aggregated cellular metrics, support call frequency, and data usage statistics.",
        details: "Consolidated client contract histories. Imbalanced target labels resolved using SMOTE (Synthetic Minority Over-sampling Technique).",
        metricLabel: "Class Ratio (Before)",
        metricValue: "88% Active / 12% Churn"
      },
      {
        label: "EDA",
        icon: LineChart,
        title: "Analysis of Churn Triggers",
        desc: "Identified a sharp churn spike when support call counts exceeded 4 in a quarter.",
        details: "Visualized customer churn distribution plots. Determined month-to-month contracts had a 4x higher risk profile than annual agreements.",
        metricLabel: "Top Churn Correland",
        metricValue: "Contract Type (0.64)"
      },
      {
        label: "Features",
        icon: Wrench,
        title: "Vector Transformations",
        desc: "Encodign category inputs (One-Hot) and scaling billing numerical columns.",
        details: "Applied StandardScaler across tenure and monthly charges. Encoded call ratings metrics using ordinal mappings.",
        metricLabel: "Input Dimensions",
        metricValue: "24 columns"
      },
      {
        label: "Training",
        icon: Cpu,
        title: "Classifier Booting",
        desc: "Trained Random Forest Classifier with bootstrap sampling.",
        details: "Configured ensemble parameters: n_estimators=300, min_samples_split=5. Handled training parameters across localized computing servers.",
        metricLabel: "Bootstrap Trees",
        metricValue: "300 estimators"
      },
      {
        label: "Evaluation",
        icon: Activity,
        title: "Confusion Matrix Metrics",
        desc: "Optimized for Recall to limit missing potential active churn profiles.",
        details: "Checked Area under ROC curve (AUC-ROC) metrics. Evaluated confusion matrix showing minimal false negative outputs.",
        metricLabel: "Recall Score (Churn)",
        metricValue: "89.4%"
      },
      {
        label: "Deployment",
        icon: CloudLightning,
        title: "Automated ETL Schedule",
        desc: "Deployed prediction logic inside AWS Lambda routines for weekly database updates.",
        details: "Configured API Gateway to route predictions to sales representatives' dashboard views when a client flags a high risk score (>75%).",
        metricLabel: "F1 Score",
        metricValue: "0.8624"
      },
      {
        label: "Business Value",
        icon: TrendingUp,
        title: "Churn Prevention",
        desc: "Customer success agents preemptively called high-risk subscribers.",
        details: "Reduced customer attrition by 12% in the first quarter of deployment. Optimized agent routing by only targeting subscribers with higher confidence scores.",
        metricLabel: "Retained Subscribers",
        metricValue: "1,200+ profiles"
      }
    ]
  }
];

export default function MlTab() {
  const [selectedProjectIdx, setSelectedProjectIdx] = useState(0);
  const [activeStageIdx, setActiveStageIdx] = useState(0);

  const currentProject = mlProjects[selectedProjectIdx];
  const currentStage = currentProject.stages[activeStageIdx];

  const handleProjectChange = (idx: number) => {
    setSelectedProjectIdx(idx);
    setActiveStageIdx(0); // Reset stepper on project swap
  };
  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 select-none font-sans h-full items-stretch">
      
      {/* Selector sidebar */}
      <div className="xl:col-span-1 border border-border bg-card rounded-xl p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Cpu size={16} className="text-cyan-600 dark:text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">ML Pipelines</span>
        </div>

        <nav className="flex flex-col gap-1 overflow-y-auto max-h-[300px] xl:max-h-[500px] scrollbar-none">
          {mlProjects.map((proj, idx) => (
            <button
              key={idx}
              onClick={() => handleProjectChange(idx)}
              className={`flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                selectedProjectIdx === idx
                  ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground tracking-wider uppercase font-mono">{proj.algorithm}</span>
                <span>{proj.title.split(" ").slice(0, 3).join(" ") + "..."}</span>
              </div>
              <ChevronRight size={14} className={selectedProjectIdx === idx ? "text-cyan-600 dark:text-cyan-400" : "text-slate-500"} />
            </button>
          ))}
        </nav>
      </div>

      {/* Main dashboard space (Right 3 cols) */}
      <div className="xl:col-span-3 flex flex-col gap-6">
        
        {/* Project Header Summary */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              {currentProject.title}
            </h3>
            <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-0.5 text-xs font-mono text-cyan-600 dark:text-cyan-400">
              {currentProject.algorithm}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Dataset Source:</span> {currentProject.dataset}
          </p>
        </div>

        {/* Stepper Pipeline Indicators */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {currentProject.stages.map((stage, sIdx) => {
            const Icon = stage.icon;
            const isActive = activeStageIdx === sIdx;
            return (
              <button
                key={sIdx}
                onClick={() => setActiveStageIdx(sIdx)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all duration-200 ${
                  isActive
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400 shadow-md shadow-cyan-950/10"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon size={16} />
                <span className="text-[9px] font-semibold mt-1 font-mono tracking-wide">{stage.label}</span>
              </button>
            );
          })}
        </div>

        {/* Stage Methodology Details Board */}
        <div className="border border-border bg-card p-5 flex flex-col gap-5 justify-between">
          <div className="flex items-start justify-between border-b border-border pb-3">
            <div>
              <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
                PIPELINE STAGE {activeStageIdx + 1} OF 7 // {currentStage.label.toUpperCase()}
              </span>
              <h4 className="text-base font-bold text-foreground mt-0.5">
                {currentStage.title}
              </h4>
            </div>

            {currentStage.metricLabel && (
              <div className="text-right">
                <span className="text-[9px] font-mono text-muted-foreground uppercase block">
                  {currentStage.metricLabel}
                </span>
                <span className="text-sm font-bold text-emerald-500 dark:text-emerald-400 font-mono">
                  {currentStage.metricValue}
                </span>
              </div>
            )}
          </div>

          {/* Description & Detail */}
          <div className="space-y-4 text-xs leading-relaxed text-foreground">
            <p className="font-semibold text-foreground">
              {currentStage.desc}
            </p>
            <p className="text-muted-foreground bg-secondary p-4 rounded-lg border border-border">
              {currentStage.details}
            </p>
          </div>

          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono border-t border-border pt-3">
            STABLE ARTIFACT PATH // ML_DEPLOYMENT_PIPELINE.PKL
          </div>
        </div>

      </div>

    </div>
  );
}

"use client";

import { useState } from "react";
import { Play, Terminal, CheckCircle2 } from "lucide-react";

interface PythonScript {
  title: string;
  category: string;
  code: string;
  description: string;
  logs: string[];
}

const pythonScripts: PythonScript[] = [
  {
    title: "Shopify API Customer ETL Pipeline",
    category: "ETL / Data Wrangling",
    description: "Connects to Shopify & Stripe endpoints, cleans raw transaction JSONs, enforces schema constraints, and loads cleaned rows into database.",
    code: `import pandas as pd
import requests
import psycopg2
from datetime import datetime

def extract_shopify_orders(api_url, api_token):
    print(f"[{datetime.now()}] INFO: Fetching orders from Shopify API...")
    headers = {"X-Shopify-Access-Token": api_token}
    res = requests.get(f"{api_url}/orders.json?status=any", headers=headers)
    res.raise_for_status()
    return res.json().get("orders", [])

def transform_orders(raw_orders):
    print(f"[{datetime.now()}] INFO: Scrubbing nested JSON and aligning schemas...")
    df = pd.DataFrame(raw_orders)
    
    # Clean nulls, enforce datatypes
    df['created_at'] = pd.to_datetime(df['created_at'])
    df['total_price'] = pd.to_numeric(df['total_price'], errors='coerce').fillna(0.0)
    df['email'] = df['email'].str.lower().str.strip()
    
    # Filter valid profiles
    clean_df = df[df['email'].notnull() & (df['total_price'] > 0)]
    print(f"[{datetime.now()}] SUCCESS: Cleaned {len(clean_df)} valid order profiles.")
    return clean_df

# Run ETL sequence
raw = extract_shopify_orders("https://api.shopify.com", "shp_token_abc")
cleaned = transform_orders(raw)
print("ETL complete. Synced to target datalake.")`,
    logs: [
      "[17:54:31] INFO: Initializing Shopify API ETL...",
      "[17:54:32] INFO: Connecting to HTTPS gateway: api.shopify.com...",
      "[17:54:33] INFO: Fetching orders payload. Received 200 OK. Content length: 1.2MB",
      "[17:54:33] INFO: Parsing raw JSON data...",
      "[17:54:34] INFO: Enforcing Pandas schema models on 450 order arrays...",
      "[17:54:34] INFO: Casting 'total_price' to numeric float64...",
      "[17:54:34] INFO: Standardizing emails with lower case trim filters...",
      "[17:54:35] SUCCESS: Cleaned and output 412 active orders.",
      "[17:54:35] INFO: Writing records to table: analytics.orders...",
      "[17:54:35] SUCCESS: Process finished with exit code 0."
    ]
  },
  {
    title: "Random Forest Hyperparameter Tuner",
    category: "Machine Learning Utility",
    description: "Implements Scikit-Learn GridSearchCV to locate optimal hyperparameters for customer classifier profiles, outputting accuracy analytics.",
    code: `import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import classification_report

# Load preprocessed arrays
X_train, y_train = np.load("X_train.npy"), np.load("y_train.npy")

print("Initializing Grid Search over parameter boundaries...")
param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [10, 15, None],
    'min_samples_split': [2, 5, 10]
}

rf = RandomForestClassifier(random_state=42)
grid_search = GridSearchCV(
    estimator=rf, 
    param_grid=param_grid, 
    cv=3, 
    scoring='accuracy', 
    verbose=1
)

print("Starting training process across 27 configurations...")
grid_search.fit(X_train, y_train)

print(f"Optimal parameters: {grid_search.best_params_}")
print(f"Validation Score: {grid_search.best_score_:.4f}")`,
    logs: [
      "[17:54:31] INFO: Loading training array vectors: X_train.npy (4500, 24)...",
      "[17:54:32] INFO: Initializing RandomForestClassifier tuning pipeline...",
      "[17:54:32] INFO: Running grid search cv=3, configurations=27 (total runs: 81)...",
      "[17:54:33] Fitting 3 folds for each of 27 candidates, totalling 81 fits",
      "[17:54:34] [CV] n_estimators=100, max_depth=10, min_samples_split=2 - Acc: 0.824",
      "[17:54:35] [CV] n_estimators=200, max_depth=15, min_samples_split=5 - Acc: 0.856",
      "[17:54:36] [CV] n_estimators=300, max_depth=None, min_samples_split=10 - Acc: 0.871",
      "[17:54:37] SUCCESS: Completed grid search loops.",
      "[17:54:37] Optimal parameters: {'max_depth': 15, 'min_samples_split': 5, 'n_estimators': 300}",
      "[17:54:37] Validation Score: 0.8724",
      "[17:54:37] PROCESS COMPLETE."
    ]
  },
  {
    title: "AWS S3 Database Backup Automator",
    category: "Automation Scripts",
    description: "Backs up local raw transactional data tables, compresses files into .tar.gz archives, and uploads records securely to AWS S3 storage using Boto3.",
    code: `import os
import tarfile
import boto3
from botocore.exceptions import ClientError

def create_archive(source_dir, output_filename):
    print(f"Compressing files from {source_dir}...")
    with tarfile.open(output_filename, "w:gz") as tar:
        tar.add(source_dir, arcname=os.path.basename(source_dir))
    print(f"Archive generated: {output_filename} ({os.path.getsize(output_filename) / 1024:.1f} KB)")

def upload_to_s3(file_name, bucket, object_name=None):
    s3_client = boto3.client('s3')
    try:
        print(f"Uploading {file_name} to bucket '{bucket}'...")
        s3_client.upload_file(file_name, bucket, object_name or file_name)
        print("Upload verification successful.")
    except ClientError as e:
        print(f"ERROR: {e}")
        return False
    return True

# Trigger script
create_archive("/tmp/transaction_logs", "tx_log_backup.tar.gz")
upload_to_s3("tx_log_backup.tar.gz", "corporate-db-vault-prod")`,
    logs: [
      "[17:54:31] INFO: Initializing local compression routines...",
      "[17:54:32] Compressing files from /tmp/transaction_logs...",
      "[17:54:33] Archive generated: tx_log_backup.tar.gz (482.4 KB)",
      "[17:54:33] INFO: Creating secure client connection to AWS S3...",
      "[17:54:34] Uploading tx_log_backup.tar.gz to bucket 'corporate-db-vault-prod'...",
      "[17:54:35] INFO: Multipart transfer stream completed successfully.",
      "[17:54:35] SUCCESS: File verified in remote bucket. CRC32 checksum match.",
      "[17:54:35] Cleanup: Removing local backup file...",
      "[17:54:35] Run finished."
    ]
  }
];

export default function PythonPage() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [executing, setExecuting] = useState(false);
  const [activeLogs, setActiveLogs] = useState<string[]>([]);

  const currentScript = pythonScripts[selectedIdx];

  const handleRunScript = () => {
    setExecuting(true);
    setActiveLogs([]);
    
    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < currentScript.logs.length) {
        setActiveLogs((prev) => [...prev, currentScript.logs[logIndex]]);
        logIndex++;
      } else {
        clearInterval(interval);
        setExecuting(false);
      }
    }, 350);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 select-none font-sans h-full items-stretch">
      {/* Side selection menu */}
      <div className="xl:col-span-1 border border-border bg-card rounded-xl p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Terminal size={16} className="text-cyan-600 dark:text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">Scripts Console</span>
        </div>
        
        <nav className="flex flex-col gap-1 overflow-y-auto max-h-[300px] xl:max-h-[500px] scrollbar-none">
          {pythonScripts.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedIdx(idx);
                setActiveLogs([]);
              }}
              className={`flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                selectedIdx === idx
                  ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground tracking-wider uppercase font-mono">{s.category}</span>
                <span className="truncate max-w-[150px]">{s.title}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Code window & Stdout window */}
      <div className="xl:col-span-3 flex flex-col gap-6">
        {/* Python File Editor */}
        <div className="border border-border bg-card rounded-xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between bg-secondary border-b border-border px-5 py-3">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Terminal size={14} className="text-yellow-600 dark:text-yellow-500" />
              <span>{currentScript.title.toLowerCase().replace(/ /g, "_")}.py</span>
            </div>
            
            <button
              onClick={handleRunScript}
              disabled={executing}
              className="flex items-center gap-1.5 rounded bg-yellow-500 hover:brightness-110 disabled:opacity-50 px-3 py-1 text-[11px] font-semibold text-black transition"
            >
              <Play size={12} fill="currentColor" />
              <span>{executing ? "Executing..." : "Run Script"}</span>
            </button>
          </div>

          <div className="p-5 font-mono text-[11.5px] leading-relaxed bg-secondary text-foreground overflow-x-auto min-h-[220px]">
            <pre className="whitespace-pre">
              {currentScript.code.split("\n").map((line, lIdx) => {
                let highlighted = line
                  .replace(/(import|from|def|return|if|else|elif|for|in|try|except|while|as)\b/g, '<span class="text-yellow-600 dark:text-yellow-500">$1</span>')
                  .replace(/print/g, '<span class="text-cyan-600 dark:text-cyan-400">print</span>')
                  .replace(/(#.*)/g, '<span class="text-slate-500 dark:text-slate-400">$1</span>')
                  .replace(/(".*?"|'.*?')/g, '<span class="text-emerald-600 dark:text-emerald-400">$1</span>');

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

        {/* Console logs */}
        <div className="border border-border bg-card rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Stdout Interpreter Stream</h4>
            {activeLogs.length > 0 && !executing && (
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 dark:text-emerald-400 font-mono">
                <CheckCircle2 size={12} />
                <span>SUCCESS (Exit 0)</span>
              </div>
            )}
          </div>

          <div className="font-mono text-[10.5px] text-foreground bg-background p-4 rounded-lg border border-border min-h-[140px] max-h-[240px] overflow-y-auto space-y-1.5 scrollbar-thin">
            {activeLogs.length === 0 ? (
              <div className="text-muted-foreground italic select-none">Press 'Run Script' to execute the interpreter console...</div>
            ) : (
              activeLogs.map((log, idx) => {
                let logClass = "text-foreground";
                if (log.includes("SUCCESS")) logClass = "text-emerald-500 dark:text-emerald-400 font-semibold";
                if (log.includes("ERROR")) logClass = "text-rose-500 dark:text-rose-400 font-semibold";
                if (log.includes("INFO")) logClass = "text-cyan-600 dark:text-cyan-400";
                return (
                  <div key={idx} className={logClass}>
                    {log}
                  </div>
                );
              })
            )}
            {executing && (
              <div className="flex items-center gap-1.5 mt-2">
                <span className="h-1.5 w-1.5 animate-ping rounded-full bg-yellow-500" />
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Running process thread...</span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-muted-foreground leading-relaxed bg-secondary rounded-lg p-3 border border-border">
            <span className="font-semibold text-foreground block mb-1">Execution Objectives</span>
            {currentScript.description}
          </div>
        </div>
      </div>
    </div>
  );
}

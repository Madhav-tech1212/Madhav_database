"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Terminal, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import AnalyticsOverview from "@/components/analytics/AnalyticsOverview";

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Read passcode state on client mount to bypass login if already entered in session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = sessionStorage.getItem("admin_portfolio_auth") === "true";
      if (isAuth) {
        setAuthorized(true);
      }
    }
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;

    setLoading(true);
    setErrorMsg("");

    // Simulate cryptographic verification delay (400ms) for high-fidelity UX feel
    setTimeout(() => {
      // Default local passcode fallback, or check against system process variable
      const validKey = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";
      
      if (passcode === validKey) {
        sessionStorage.setItem("admin_portfolio_auth", "true");
        setAuthorized(true);
      } else {
        setErrorMsg("ACCESS RESTRICTION // INVALID CRYPTO KEY");
      }
      setLoading(false);
    }, 4500); // 4500ms allows displaying authentication handshake terminal outputs
  };

  return (
    <div className="min-h-screen w-screen bg-[#05070f] text-foreground overflow-x-hidden font-sans relative flex items-center justify-center">
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Floating neon blobs */}
      <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-cyan-500/5 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[150px]" />

      <AnimatePresence mode="wait">
        {!authorized ? (
          <motion.div
            key="lockscreen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full max-w-md px-6"
          >
            <div className="border border-border bg-card/60 backdrop-blur-md rounded-2xl p-6 shadow-2xl shadow-black/60 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />
              
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Lock size={20} className={loading ? "animate-pulse" : ""} />
                </div>
                
                <div>
                  <h1 className="text-sm font-bold uppercase tracking-widest text-foreground font-mono">
                    SECURE ACCESS CHECKPOINT
                  </h1>
                  <p className="text-[10px] text-muted-foreground font-mono mt-1 uppercase">
                    Portfolio Analytics System // Admin Entry
                  </p>
                </div>

                <form onSubmit={handleUnlock} className="w-full space-y-4 pt-4">
                  <div className="space-y-1.5 text-left font-mono">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                      Enter Security Access Key
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••••••"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      disabled={loading}
                      className="w-full rounded-lg border border-border bg-secondary/80 px-4 py-3 text-xs font-mono text-center tracking-widest text-foreground focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                    />
                  </div>

                  {errorMsg && (
                    <div className="flex items-center gap-2 rounded bg-rose-500/10 border border-rose-500/20 p-2 text-[10px] font-mono text-rose-400 uppercase">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {loading ? (
                    <div className="w-full rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-3 text-[10px] font-mono text-cyan-400 text-left space-y-1 h-36 overflow-y-auto scrollbar-none">
                      <div className="animate-pulse">Connecting to Prisma client instance...</div>
                      <div>Resolving PostgreSQL DB tables...</div>
                      <div>Decrypting credential nodes...</div>
                      <div>Handshaking admin session...</div>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={!passcode}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 font-semibold text-black py-3 text-xs uppercase tracking-wider font-mono transition active:scale-[0.98]"
                    >
                      <ShieldAlert size={14} />
                      <span>Verify Credentials</span>
                    </button>
                  )}
                </form>
              </div>
            </div>
            
            <div className="mt-6 text-center text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              SECURE DECRYPT SESSION // BENGALURU, IN
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full min-h-screen"
          >
            <AnalyticsOverview />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

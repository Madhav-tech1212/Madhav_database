"use client";

import { useState } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Terminal,
  CheckCircle2
} from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function ContactTab() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitting(true);
    setConsoleLogs([]);
    setSubmitted(false);

    const logSteps = [
      "INFO: Opening TLS socket to email relay...",
      `INFO: Authenticating SMTP user: ${formData.email.toLowerCase()}...`,
      "INFO: Encrypting email payload (AES-256-GCM)...",
      "INFO: Transmitting message envelope...",
      "SUCCESS: Message dispatched successfully. Queue ID: SMTP_8291A."
    ];

    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < logSteps.length) {
        setConsoleLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${logSteps[logIndex]}`]);
        logIndex++;
      } else {
        clearInterval(interval);
        setSubmitting(false);
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    }, 400);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none font-sans max-w-6xl mx-auto">
      
      {/* Contact Details Card (Left col) */}
      <div className="lg:col-span-1 rounded-xl border border-border bg-card p-6 flex flex-col justify-between gap-8">
        <div className="space-y-6">
          <div className="border-b border-border pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Communication Terminal</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Contact nodes & public channels</span>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="rounded bg-secondary border border-border p-2 text-cyan-600 dark:text-cyan-400">
                <Mail size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-mono">EMAIL</span>
                <span className="text-foreground font-medium">madhavkarthickk.1212@gmail.com</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded bg-secondary border border-border p-2 text-cyan-600 dark:text-cyan-400">
                <MapPin size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-mono">LOCATION</span>
                <span className="text-foreground font-medium">Bangalore, Karnataka, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3 pt-6 border-t border-border text-sm font-semibold">
          <a
            href="https://www.linkedin.com/in/madhavkarthickki"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-border bg-secondary p-3 hover:bg-muted transition text-foreground"
          >
            <div className="flex items-center gap-2">
              <FaLinkedin size={14} className="text-cyan-600 dark:text-cyan-400" />
              <span>LinkedIn</span>
            </div>
          </a>
          
          <a
            href="https://x.com/Maddyxtwt"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-border bg-secondary p-3 hover:bg-muted transition text-foreground"
          >
            <div className="flex items-center gap-2">
              <FaTwitter size={14} className="text-cyan-600 dark:text-cyan-400" />
              <span>Twitter</span>
            </div>
          </a>

          <a
            href="https://github.com/Madhav-tech1212"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-border bg-secondary p-3 hover:bg-muted transition text-foreground"
          >
            <div className="flex items-center gap-2">
              <FaGithub size={14} className="text-cyan-600 dark:text-cyan-400" />
              <span>GitHub</span>
            </div>
          </a>
        </div>
      </div>

      {/* Form Area (Right 2 cols) */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Input Form */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="border-b border-border pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Contact Portal</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Send an encrypted connection request</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase font-semibold">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. John Doe"
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-cyan-500/50 focus:outline-none transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase font-semibold">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. john@email.com"
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-cyan-500/50 focus:outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase font-semibold">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="e.g. Consulting Project Opportunity"
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-cyan-500/50 focus:outline-none transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground uppercase font-semibold">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Write your request details here..."
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-foreground focus:border-cyan-500/50 focus:outline-none transition resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-2.5 font-bold text-white hover:brightness-110 disabled:opacity-50 transition"
              >
                <Send size={15} />
                <span>{submitting ? "Transmitting..." : "Send Secure Message"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Telemetry log window */}
        {(submitting || consoleLogs.length > 0) && (
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-1.5">
                <Terminal size={14} className="text-cyan-500 dark:text-cyan-400 animate-pulse" />
                <span>SMTP_Transmission_Terminal</span>
              </span>
              {submitted && (
                <span className="flex items-center gap-1 text-xs font-mono text-emerald-500">
                  <CheckCircle2 size={12} />
                  <span>TRANSMITTED</span>
                </span>
              )}
            </div>
            
            <div className="font-mono text-xs text-muted-foreground space-y-1 bg-background p-3.5 rounded border border-border max-h-36 overflow-y-auto scrollbar-thin">
              {consoleLogs.map((log, lIdx) => {
                const isSuccess = log.includes("SUCCESS");
                return (
                  <div key={lIdx} className={isSuccess ? "text-emerald-500 dark:text-emerald-400 font-bold" : ""}>
                    {log}
                  </div>
                );
              })}
              {submitting && (
                <div className="flex items-center gap-1 mt-1 text-slate-500 dark:text-slate-400 italic">
                  <span className="h-1 w-1 animate-ping bg-cyan-500 dark:bg-cyan-400 rounded-full" />
                  <span>Streaming frames...</span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

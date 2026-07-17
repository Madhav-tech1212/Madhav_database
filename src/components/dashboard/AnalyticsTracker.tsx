"use client";

import { useEffect, useRef } from "react";
import { tracker } from "@/lib/tracker";

interface AnalyticsTrackerProps {
  activeTab: string;
}

export default function AnalyticsTracker({ activeTab }: AnalyticsTrackerProps) {
  const trackedDepths = useRef<Set<number>>(new Set());
  const lastTab = useRef<string>("");

  // 1. Tracks tab changes as page views
  useEffect(() => {
    if (activeTab && activeTab !== lastTab.current) {
      lastTab.current = activeTab;
      tracker.trackPageView(activeTab);
    }
  }, [activeTab]);

  // 2. Initializes session, hooks scroll depth and click listeners
  useEffect(() => {
    // Fire session init on mount
    tracker.initSession();

    // Scroll depth listener
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const scrollPct = Math.round((window.scrollY / scrollHeight) * 100);
      const thresholds = [25, 50, 75, 100];

      thresholds.forEach((depth) => {
        if (scrollPct >= depth && !trackedDepths.current.has(depth)) {
          trackedDepths.current.add(depth);
          tracker.trackCustomEvent("scroll_depth", `${depth}%`);
        }
      });
    };

    // Global click listener
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Find closest interactive parent anchor/button
      const element = target.closest("a, button") as HTMLElement;
      if (!element) return;

      const text = (element.textContent || "").trim().substring(0, 40);
      const href = (element as HTMLAnchorElement).href || "";

      // Check for social connections
      if (href.includes("github.com")) {
        tracker.trackCustomEvent("social_click", "GitHub Click", { href });
      } else if (href.includes("linkedin.com")) {
        tracker.trackCustomEvent("social_click", "LinkedIn Click", { href });
      } else if (href.includes("x.com") || href.includes("twitter.com")) {
        tracker.trackCustomEvent("social_click", "Twitter Click", { href });
      } else if (href.includes("mailto:") || text.toLowerCase().includes("mail") || text.toLowerCase().includes("email")) {
        tracker.trackCustomEvent("social_click", "Contact Click", { text });
      }

      // Check for resume downloads
      if (
        (text.toLowerCase().includes("resume") && text.toLowerCase().includes("download")) ||
        href.toLowerCase().endsWith(".pdf")
      ) {
        tracker.trackCustomEvent("resume_download", text || "Resume PDF Download");
      }

      // General CTA buttons matches
      const ctas = [
        "hire me", "view project", "download resume", "contact me",
        "book meeting", "enter workspace", "run query", "run script"
      ];
      const isCta = ctas.some((cta) => text.toLowerCase().includes(cta));
      if (isCta) {
        tracker.trackCustomEvent("cta_click", text);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("click", handleGlobalClick);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  return null; // Silent background logger
}

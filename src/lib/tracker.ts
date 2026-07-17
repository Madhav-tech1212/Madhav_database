/**
 * Portfolio Analytics Client Tracker Utility
 */

export interface TrackPayload {
  visitorId: string;
  sessionId: string;
  type: "page_view" | "event" | "session";
  data: {
    pagePath?: string;
    eventType?: string;
    eventName?: string;
    metadata?: any;
    referrer?: string;
    utmSource?: string;
    device?: string;
    browser?: string;
    os?: string;
    screenResolution?: string;
    country?: string;
  };
}

class AnalyticsTracker {
  private visitorIdKey = "portfolio_visitor_id";
  private sessionIdKey = "portfolio_session_id";
  private initialized = false;

  private getOrId(key: string, isSession = false): string {
    if (typeof window === "undefined") return "";
    
    const storage = isSession ? sessionStorage : localStorage;
    let id = storage.getItem(key);
    if (!id) {
      id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
      storage.setItem(key, id);
    }
    return id;
  }

  public getVisitorId(): string {
    return this.getOrId(this.visitorIdKey, false);
  }

  public getSessionId(): string {
    return this.getOrId(this.sessionIdKey, true);
  }

  // Detect Country using Intl system timezone mappings
  private getCountryByTimezone(): string {
    if (typeof window === "undefined") return "India";
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (tz.includes("Kolkata") || tz.includes("Calcutta")) return "India";
      if (tz.includes("London")) return "United Kingdom";
      if (tz.includes("New_York") || tz.includes("Chicago") || tz.includes("Los_Angeles") || tz.includes("Denver")) return "United States";
      if (tz.includes("Singapore")) return "Singapore";
      if (tz.includes("Sydney") || tz.includes("Melbourne")) return "Australia";
      if (tz.includes("Berlin") || tz.includes("Paris") || tz.includes("Rome") || tz.includes("Madrid")) return "Europe";
      if (tz.includes("Tokyo")) return "Japan";
      if (tz.includes("Toronto") || tz.includes("Vancouver")) return "Canada";
    } catch {
      // Fallback
    }
    return "India";
  }

  private getDeviceType(): string {
    if (typeof window === "undefined") return "Desktop";
    const width = window.innerWidth;
    if (width < 768) return "Mobile";
    if (width < 1024) return "Tablet";
    return "Desktop";
  }

  private getBrowser(): string {
    if (typeof window === "undefined") return "Unknown";
    const ua = navigator.userAgent;
    if (ua.includes("Brave")) return "Brave";
    if (ua.includes("OPR") || ua.includes("Opera")) return "Opera";
    if (ua.includes("Edg")) return "Edge";
    if (ua.includes("Chrome") && !ua.includes("Chromium")) return "Chrome";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
    if (ua.includes("Firefox")) return "Firefox";
    return "Chrome"; // fallback to dominant default
  }

  private getOS(): string {
    if (typeof window === "undefined") return "Unknown";
    const ua = navigator.userAgent;
    if (ua.includes("Windows")) return "Windows";
    if (ua.includes("Macintosh") || ua.includes("Mac OS")) return "macOS";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
    if (ua.includes("Linux")) return "Linux";
    return "Unknown";
  }

  private getUTMSource(): string {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    return params.get("utm_source") || "";
  }

  public async initSession() {
    if (this.initialized || typeof window === "undefined") return;
    this.initialized = true;

    const payload: TrackPayload = {
      visitorId: this.getVisitorId(),
      sessionId: this.getSessionId(),
      type: "session",
      data: {
        device: this.getDeviceType(),
        browser: this.getBrowser(),
        os: this.getOS(),
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        referrer: document.referrer || "Direct",
        utmSource: this.getUTMSource(),
        country: this.getCountryByTimezone(),
      },
    };

    await this.sendBeacon(payload);
  }

  public async trackPageView(pagePath: string) {
    if (typeof window === "undefined") return;
    
    const payload: TrackPayload = {
      visitorId: this.getVisitorId(),
      sessionId: this.getSessionId(),
      type: "page_view",
      data: {
        pagePath,
        device: this.getDeviceType(),
        browser: this.getBrowser(),
        os: this.getOS(),
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        country: this.getCountryByTimezone(),
      },
    };

    await this.sendBeacon(payload);
  }

  public async trackCustomEvent(eventType: string, eventName: string, metadata: any = {}) {
    if (typeof window === "undefined") return;

    const payload: TrackPayload = {
      visitorId: this.getVisitorId(),
      sessionId: this.getSessionId(),
      type: "event",
      data: {
        eventType,
        eventName,
        metadata,
        device: this.getDeviceType(),
        browser: this.getBrowser(),
        os: this.getOS(),
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        country: this.getCountryByTimezone(),
      },
    };

    await this.sendBeacon(payload);
  }

  private async sendBeacon(payload: TrackPayload) {
    try {
      // Use standard fetch
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true, // ensures payload completes even if tab closes
      });
    } catch (e) {
      console.warn("Analytics sending failed:", e);
    }
  }
}

export const tracker = new AnalyticsTracker();

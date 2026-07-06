import React from "react";

// Visible only when the app is served under a sub-path (e.g. /new) — i.e. the
// AWS/CloudFront preview build. Hidden for the base44 root deployment, where
// import.meta.env.BASE_URL is "/". The back link is a plain anchor so it escapes
// the SPA basename and lands on the real site root.
export default function NewLookBanner() {
  if (import.meta.env.BASE_URL === "/") return null;
  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] bg-primary text-primary-foreground">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-9 flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.16em]">
        <span>Preview build · /new</span>
        <a href="/" className="hover:text-accent transition-colors">
          ← Back to closetheoffer.com
        </a>
      </div>
    </div>
  );
}

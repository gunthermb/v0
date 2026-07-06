import React from "react";

const POINTS = [
  "Recruiter emails filtered from inbox noise",
  "Interview events pulled from Google Calendar",
  "Zoom, Teams, and phone numbers extracted automatically",
  "Past 90 days of interviews — always visible",
];

const EMAILS = [
  { date: "Wed Jun 25 · 10:30 AM ET", subject: "Amazon AWS — Phone Interview", tag: "Upcoming" },
  { from: "Patrick Wallace <pwallace@recruiter.com>", subject: "RE: Cloud Architect opportunity — submitted at $190K" },
  { from: "Shaun Navarro <shaunnav@amazon.com>", subject: "Amazon AWS — next steps in your interview process" },
];

export default function InboxSync() {
  return (
    <section className="py-28 md:py-40">
      <div className="hairline mb-28" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        <div>
          <p className="mono-label mb-8">Gmail + Calendar Sync</p>
          <h2 className="display-heading text-4xl md:text-6xl leading-[0.95] mb-8">
            Your inbox and calendar, surfaced automatically.
          </h2>
          <p className="text-foreground/70 text-lg mb-8">
            Connect once with Google OAuth. CloseTheOffer scans your Gmail for recruiter
            emails and your Calendar for interview events — and shows them right in the
            dashboard.
          </p>
          <ul className="space-y-4">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3 text-foreground/80">
                <span className="mt-2 w-1.5 h-1.5 bg-accent shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card border border-hairline divide-y divide-hairline">
          {EMAILS.map((e, i) => (
            <div key={i} className="p-6">
              {e.tag ? (
                <p className="mono-label text-accent mb-2">📅 {e.tag} · {e.date}</p>
              ) : (
                <p className="mono-label mb-2">📬 {e.from}</p>
              )}
              <p className="font-display font-medium tracking-[-0.01em]">{e.subject}</p>
              {i === 0 && (
                <div className="flex gap-3 mt-4">
                  <button className="mono-label border border-hairline px-3 py-1.5 hover:border-foreground transition-colors">
                    🎥 Join Zoom
                  </button>
                  <button className="mono-label border border-hairline px-3 py-1.5 hover:border-foreground transition-colors">
                    📋 Interview Prep
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
import React from "react";

const COLUMNS = [
  {
    title: "Applied",
    cards: [
      { company: "Amazon AWS", role: "Sr. Solutions Architect", tag: "🏠 Remote" },
    ],
  },
  {
    title: "Screening",
    cards: [
      { company: "Booz Allen", role: "Cloud Lead", tag: "TS/SCI" },
      { company: "Four Points", role: "SA — Federal", tag: "🏠 Remote" },
    ],
  },
  {
    title: "Interview",
    cards: [
      { company: "Microsoft", role: "Cloud Architect", tag: "🏠 Remote" },
    ],
  },
  {
    title: "Offer 🎉",
    cards: [
      { company: "Accenture Fed", role: "$210K · Start Aug 1", tag: "Offer" },
    ],
  },
];

const INTEGRATIONS = ["Gmail", "Google Calendar", "LinkedIn Jobs", "Indeed", "Glassdoor", "ZipRecruiter"];
const AVATARS = ["M", "J", "K", "A", "+"];

export default function HeroDashboard() {
  return (
    <div className="bg-card border border-hairline p-5 md:p-7">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-hairline">
        <p className="font-display font-semibold text-sm tracking-[-0.01em]">📋 CloseTheOffer</p>
        <div className="flex gap-3 text-xs">
          <span className="mono-label">📊 Pipeline</span>
          <span className="mono-label">📅 Interviews</span>
          <span className="mono-label">🔍 Search</span>
          <span className="mono-label hidden md:inline">📋 Prep</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-5">
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="mono-label mb-3">{col.title}</p>
            <div className="space-y-2 md:space-y-3">
              {col.cards.map((c, i) => (
                <div key={i} className="bg-background border border-hairline p-3">
                  <p className="font-display font-semibold text-xs leading-tight">{c.company}</p>
                  <p className="text-foreground/60 text-xs mt-0.5">{c.role}</p>
                  <p className="mono-label mt-2 text-[10px]">{c.tag}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-hairline">
        <div className="flex -space-x-2 mr-3">
          {AVATARS.map((a, i) => (
            <span
              key={i}
              className="w-7 h-7 grid place-items-center bg-primary text-primary-foreground font-mono text-[10px] border-2 border-card rounded-full"
            >
              {a}
            </span>
          ))}
        </div>
        {INTEGRATIONS.map((name) => (
          <span
            key={name}
            className="font-mono text-[10px] px-2.5 py-1 border border-hairline text-foreground/60"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
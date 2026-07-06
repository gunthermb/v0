import React from "react";

const FEATURES = [
  { icon: "📊", title: "Visual pipeline board", body: "Drag-and-drop kanban across New → Applied → Screening → Interview → Offer. See where every opportunity stands at a glance." },
  { icon: "📋", title: "Interview prep cards", body: "Company brief, talking points, salary stance, questions to ask, and a STAR story library — organized per interview. No other tracker has this." },
  { icon: "📬", title: "Gmail & Calendar sync", body: "Surfaces recruiter emails and pulls interview events automatically. Zoom links, Teams links, and call numbers extracted from calendar invites." },
  { icon: "🔍", title: "Job board search", body: "Search LinkedIn, Indeed, Glassdoor, and ZipRecruiter directly — without leaving the dashboard. One click to add to your pipeline." },
  { icon: "⭐", title: "STAR story library", body: "Write your behavioral interview stories once (Situation, Task, Action, Result) and reuse them across every interview. Categorized by Leadership Principle." },
  { icon: "✅", title: "Action item tracker", body: "Follow-up tasks, pending callbacks, and email replies — organized by priority alongside your inbox scan so nothing slips through." },
];

export default function Features() {
  return (
    <section id="features" className="py-28 md:py-40 bg-card">
      <div className="hairline mb-28" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <p className="mono-label mb-8">Everything in one place</p>
        <h2 className="display-heading text-4xl md:text-6xl lg:text-7xl max-w-4xl mb-20">
          The job search command center you actually need.
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-hairline">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="bg-card p-10 md:p-12 group hover:bg-background transition-colors"
            >
              <span className="text-3xl block mb-8">{f.icon}</span>
              <h3 className="font-display font-semibold text-xl tracking-[-0.02em] mb-4">
                {f.title}
              </h3>
              <p className="text-foreground/70 text-base leading-relaxed">{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
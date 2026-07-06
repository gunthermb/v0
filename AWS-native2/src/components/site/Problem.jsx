import React from "react";

const PROBLEMS = [
  {
    icon: "🗂️",
    title: "Scattered across spreadsheets",
    body: "You're tracking jobs in a Google Sheet, prep notes in a doc, and interviews in a calendar. Nothing talks to each other.",
  },
  {
    icon: "💸",
    title: "Competitors charge way too much",
    body: "Huntr is $40/month with no interview prep. Teal is $29/month. You're paying for features you don't need while missing ones you do.",
  },
  {
    icon: "😰",
    title: "No real interview prep",
    body: "Walking into an interview without a company brief, salary stance, and STAR stories ready? You're leaving offers on the table.",
  },
];

export default function Problem() {
  return (
    <section className="py-28 md:py-40">
      <div className="hairline mb-28" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <p className="mono-label mb-8">The Problem</p>
        <h2 className="display-heading text-4xl md:text-6xl lg:text-7xl max-w-4xl">
          Job searching is a full-time job.
          <br />
          <span className="text-muted-foreground">Most tools make it harder.</span>
        </h2>
        <div className="mt-20 grid md:grid-cols-3 gap-px bg-hairline">
          {PROBLEMS.map((p) => (
            <div key={p.title} className="bg-background p-10">
              <span className="text-3xl block mb-8">{p.icon}</span>
              <h3 className="font-display font-semibold text-xl tracking-[-0.02em] mb-4">
                {p.title}
              </h3>
              <p className="text-foreground/70 text-base leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
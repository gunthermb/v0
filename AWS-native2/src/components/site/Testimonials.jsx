import React from "react";

const REVIEWS = [
  {
    quote:
      "I was juggling a spreadsheet, Notion, and my email at once. CloseTheOffer replaced all three. The interview prep cards alone are worth the price.",
    name: "James R.",
    initials: "JR",
    role: "AWS Solutions Architect · Landed $195K offer",
  },
  {
    quote:
      "I used Huntr before and paid $40/month. CloseTheOffer has the Gmail sync and prep cards Huntr never added — for $9. It's not even close.",
    name: "Keisha M.",
    initials: "KM",
    role: "Cloud Engineer · Interviewing at 4 companies",
  },
  {
    quote:
      "The STAR story library is brilliant. I wrote my 6 stories once and now I just open prep before every interview. I went from 1 offer to 3 in the same search.",
    name: "Alex P.",
    initials: "AP",
    role: "Technical Program Manager · 3 offers in hand",
  },
];

export default function Testimonials() {
  return (
    <section className="py-28 md:py-40 bg-card">
      <div className="hairline mb-28" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <p className="mono-label mb-8">From job seekers</p>
        <h2 className="display-heading text-4xl md:text-6xl lg:text-7xl max-w-3xl mb-20">
          Real results, real fast.
        </h2>
        <div className="grid md:grid-cols-3 gap-px bg-hairline">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="bg-card p-10 flex flex-col">
              <div className="text-accent text-sm tracking-widest mb-6">★★★★★</div>
              <blockquote className="text-foreground/85 text-lg leading-relaxed mb-8 flex-1">
                "{r.quote}"
              </blockquote>
              <figcaption className="flex items-center gap-4 pt-6 border-t border-hairline">
                <span className="w-11 h-11 grid place-items-center bg-primary text-primary-foreground font-mono text-xs">
                  {r.initials}
                </span>
                <div>
                  <p className="font-display font-semibold">{r.name}</p>
                  <p className="text-muted-foreground text-sm">{r.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
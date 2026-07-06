import React from "react";
import { Link } from "react-router-dom";

const TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    desc: "Perfect for getting started and trying out the core features.",
    features: [
      { t: "Pipeline board (up to 10 cards)", on: true },
      { t: "3 interview prep cards", on: true },
      { t: "3 STAR stories", on: true },
      { t: "Action item tracker", on: true },
      { t: "Pipeline export / import", on: true },
      { t: "Gmail sync", on: false },
      { t: "Google Calendar sync", on: false },
      { t: "Job board search", on: false },
      { t: "Unlimited prep cards", on: false },
    ],
    cta: "Get started free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/mo",
    sub: "or $79/yr — save 27% · 2 months free",
    note: "78% cheaper than Huntr · 69% cheaper than Teal",
    desc: "Everything you need to run a focused, organized job search — start to offer.",
    features: [
      { t: "Unlimited pipeline cards", on: true },
      { t: "Unlimited prep cards & STAR stories", on: true },
      { t: "Gmail sync — recruiter email surface", on: true },
      { t: "Google Calendar sync — interview events", on: true },
      { t: "Job board search (LinkedIn, Indeed, Glassdoor)", on: true },
      { t: "Action items + follow-up tracker", on: true },
      { t: "Pipeline export / import (JSON)", on: true },
      { t: "Priority support", on: true },
    ],
    cta: "Start Pro — $9/mo →",
    popular: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-28 md:py-40">
      <div className="hairline mb-28" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <p className="mono-label mb-8">Simple Pricing</p>
        <h2 className="display-heading text-4xl md:text-6xl lg:text-7xl max-w-4xl mb-6">
          Free to start. Upgrade when you're ready.
        </h2>
        <p className="text-foreground/70 text-lg max-w-xl mb-20">
          No credit card required to start. Cancel anytime. Your data is always exportable.
        </p>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`p-10 md:p-12 flex flex-col ${
                tier.popular
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-hairline"
              }`}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-display font-semibold text-2xl tracking-[-0.02em]">
                  {tier.name}
                </h3>
                {tier.popular && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] border border-primary-foreground/30 px-3 py-1">
                    Most popular
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="display-heading text-6xl">{tier.price}</span>
                <span className={tier.popular ? "text-primary-foreground/60" : "text-muted-foreground"}>
                  {tier.period}
                </span>
              </div>
              {tier.sub && (
                <p className={`text-sm mb-2 ${tier.popular ? "text-primary-foreground/70" : "text-foreground/70"}`}>
                  {tier.sub}
                </p>
              )}
              {tier.note && (
                <p className="mono-label mb-4 text-accent">{tier.note}</p>
              )}
              <p className={`text-base mb-8 ${tier.popular ? "text-primary-foreground/75" : "text-foreground/70"}`}>
                {tier.desc}
              </p>
              <ul className="space-y-3 mb-10 flex-1">
                {tier.features.map((f) => (
                  <li key={f.t} className="flex items-start gap-3 text-sm">
                    <span className={f.on ? "" : "opacity-30"}>
                      {f.on ? "✓" : "✗"}
                    </span>
                    <span className={f.on ? "" : "line-through opacity-60"}>{f.t}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className={`text-center font-mono text-xs uppercase tracking-[0.16em] px-6 py-4 transition-colors ${
                  tier.popular
                    ? "bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                    : "bg-primary text-primary-foreground hover:bg-accent"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="mono-label text-center mt-10">
          Cancel anytime. 7-day money-back guarantee on Pro.
        </p>
      </div>
    </section>
  );
}
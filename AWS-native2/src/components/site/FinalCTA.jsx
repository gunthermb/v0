import React from "react";
import { Link } from "react-router-dom";

export default function FinalCTA() {
  return (
    <section className="relative py-32 md:py-48 bg-primary text-primary-foreground overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
        <p className="mono-label mb-8 text-primary-foreground/60">
          Ready to land your next job?
        </p>
        <h2 className="display-heading text-[12vw] md:text-[10vw] lg:text-[9vw] leading-[0.9]">
          Join 500+ job seekers
          <br />
          running a{" "}
          <span className="font-body italic font-normal text-accent">smarter</span> search.
        </h2>
        <p className="text-primary-foreground/70 text-lg mt-10 max-w-xl mx-auto">
          Free to start — no credit card needed.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="bg-background text-foreground px-8 py-4 font-mono text-xs uppercase tracking-[0.16em] hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Start free — it takes 30 seconds
          </Link>
          <a
            href="#pricing"
            className="border border-primary-foreground/30 px-8 py-4 font-mono text-xs uppercase tracking-[0.16em] hover:border-primary-foreground transition-colors"
          >
            See pricing →
          </a>
        </div>
        <p className="mono-label mt-12 text-primary-foreground/50">
          No credit card · 7-day money-back on Pro · Cancel anytime
        </p>
      </div>
    </section>
  );
}
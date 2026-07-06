import React from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";

const RESULTS = [
  { source: "LinkedIn", company: "Amazon AWS", title: "Senior Solutions Architect — WWPS", meta: "🏠 Remote · $180K–$220K · 2 days ago" },
  { source: "Indeed", company: "Booz Allen Hamilton", title: "Cloud Security Architect Lead", meta: "Remote · $99K–$225K · Today" },
  { source: "Glassdoor", company: "Microsoft", title: "Sr. Cloud Solution Architect — Federal", meta: "🏠 Remote · $143K–$196K · 1 day ago" },
];

const POINTS = [
  "Live search across 4 major job boards at once",
  "Filter: remote only, city, date posted",
  "One-click Add to Pipeline — no copy-paste needed",
  "Salary ranges surfaced where available",
];

export default function JobSearch() {
  return (
    <section className="py-28 md:py-40 bg-card">
      <div className="hairline mb-28" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        <div className="order-2 lg:order-1 bg-background border border-hairline p-8 md:p-10">
          <Link
            to="/jobs"
            className="flex items-center gap-3 border border-hairline px-4 py-3 mb-8 hover:border-foreground transition-colors group"
          >
            <Search className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground/60">Cloud Architect remote</span>
            <span className="ml-auto mono-label flex items-center gap-1">
              Search
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
          <div className="space-y-px bg-hairline">
            {RESULTS.map((r) => (
              <div key={r.source} className="bg-background p-5 flex items-start justify-between gap-4">
                <div>
                  <p className="mono-label mb-1">{r.source}</p>
                  <p className="font-display font-semibold">{r.company}</p>
                  <p className="text-foreground/80 text-sm mt-0.5">{r.title}</p>
                  <p className="text-muted-foreground text-sm mt-1">{r.meta}</p>
                </div>
                <button className="mono-label whitespace-nowrap border border-hairline px-3 py-1.5 hover:border-foreground transition-colors">
                  + Add to Pipeline
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="mono-label mb-8">Job Board Search</p>
          <h2 className="display-heading text-4xl md:text-6xl leading-[0.95] mb-8">
            Find and track jobs without switching tabs.
          </h2>
          <p className="text-foreground/70 text-lg mb-8">
            Search LinkedIn, Indeed, Glassdoor, and ZipRecruiter directly from the
            dashboard. Filter by location, remote-only, or date posted. One click adds
            any listing to your pipeline.
          </p>
          <ul className="space-y-4">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3 text-foreground/80">
                <span className="mt-2 w-1.5 h-1.5 bg-accent shrink-0" />
                {p}
              </li>
            ))}
          </ul>
          <Link
            to="/jobs"
            className="group inline-flex items-center gap-2 mt-10 bg-primary text-primary-foreground px-7 py-4 font-mono text-xs uppercase tracking-[0.16em] hover:bg-accent transition-colors"
          >
            Search live jobs
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
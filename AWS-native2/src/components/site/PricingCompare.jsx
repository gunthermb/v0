import React from "react";

const ROWS = [
  { feature: "Application pipeline (kanban", cto: true, huntr: true, teal: true },
  { feature: "Interview prep cards", cto: true, huntr: false, teal: false },
  { feature: "STAR story library", cto: true, huntr: false, teal: false },
  { feature: "Gmail sync (recruiter emails)", cto: true, huntr: false, teal: false },
  { feature: "Google Calendar sync", cto: true, huntr: false, teal: false },
  { feature: "Job board search (LinkedIn/Indeed)", cto: true, huntr: false, teal: "limited" },
  { feature: "Action item tracker", cto: true, huntr: "basic", teal: false },
  { feature: "AI resume builder", cto: "soon", huntr: true, teal: true },
  { feature: "Works offline / export data", cto: true, huntr: false, teal: false },
  { feature: "Monthly price", cto: "$9", huntr: "$40", teal: "$29" },
];

function Cell({ v }) {
  if (v === true) return <span className="text-accent">✓</span>;
  if (v === false) return <span className="text-muted-foreground/40">✗</span>;
  if (v === "soon") return <span className="mono-label text-muted-foreground">Soon</span>;
  if (v === "limited") return <span className="mono-label text-muted-foreground">Limited</span>;
  if (v === "basic") return <span className="mono-label text-muted-foreground">Basic</span>;
  return <span className="font-display font-semibold">{v}</span>;
}

export default function PricingCompare() {
  return (
    <section className="py-28 md:py-40 bg-card">
      <div className="hairline mb-28" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <p className="mono-label mb-8">Why CloseTheOffer</p>
        <h2 className="display-heading text-4xl md:text-6xl lg:text-7xl max-w-4xl mb-20">
          More features. A fraction of the price.
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-hairline">
                <th className="text-left py-6 pr-4 mono-label">Feature</th>
                <th className="py-6 px-4 text-center">
                  <p className="font-display font-semibold tracking-[-0.02em]">CloseTheOffer Pro</p>
                  <p className="mono-label text-accent mt-1">$9/mo</p>
                </th>
                <th className="py-6 px-4 text-center">
                  <p className="font-display font-semibold tracking-[-0.02em]">Huntr Pro</p>
                  <p className="mono-label mt-1">$40/mo</p>
                </th>
                <th className="py-6 px-4 text-center">
                  <p className="font-display font-semibold tracking-[-0.02em]">Teal+</p>
                  <p className="mono-label mt-1">$29/mo</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.feature} className="border-b border-hairline">
                  <td className="py-5 pr-4 text-foreground/80 text-sm md:text-base">{r.feature}</td>
                  <td className="py-5 px-4 text-center"><Cell v={r.cto} /></td>
                  <td className="py-5 px-4 text-center"><Cell v={r.huntr} /></td>
                  <td className="py-5 px-4 text-center"><Cell v={r.teal} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
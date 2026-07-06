import React from "react";

const POINTS = [
  "Company overview and key talking points",
  "Salary stance — what to say and what not to say",
  "Questions to ask the interviewer",
  "Watch-outs: red flags and compensation traps",
  "STAR stories mapped to the specific role",
];

const TAGS = ["AWS GovCloud", "FedRAMP", "Terraform", "Zero Trust", "NIST 800-53"];

export default function InterviewPrep() {
  return (
    <section id="prep" className="py-28 md:py-40">
      <div className="hairline mb-28" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        <div>
          <p className="mono-label mb-8">Interview Prep</p>
          <h2 className="display-heading text-4xl md:text-6xl leading-[0.95] mb-8">
            Walk into every interview completely ready.
          </h2>
          <p className="text-foreground/70 text-lg mb-8">
            Other job trackers stop at the application. CloseTheOffer takes you to the
            offer. For each company in your pipeline, build a prep card with everything
            you need.
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

        <div className="bg-card border border-hairline p-8 md:p-10 lg:sticky lg:top-24">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-hairline">
            <div>
              <p className="font-display font-semibold text-lg">Accenture Federal</p>
              <p className="text-muted-foreground text-sm">Cloud Architect / Technical Lead</p>
            </div>
            <span className="mono-label">Prep</span>
          </div>
          <p className="mono-label mb-3">Key Talking Points</p>
          <ul className="space-y-3 mb-8 text-foreground/80">
            <li>· Lead with Fannie Mae scale — 1,000+ server migration</li>
            <li>· Federal agency pedigree: DoS, DoJ, DISA, OPM</li>
            <li>· TS clearance eligible for immediate reinstatement</li>
          </ul>
          <p className="mono-label mb-3">Keywords</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {TAGS.map((t) => (
              <span
                key={t}
                className="font-mono text-xs px-3 py-1.5 border border-hairline text-foreground/70"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="bg-accent/10 border-l-2 border-accent px-5 py-4">
            <p className="font-mono text-sm text-foreground">
              💰 Target $195K–$210K — do NOT anchor low
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
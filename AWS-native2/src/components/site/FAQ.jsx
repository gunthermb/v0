import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Do I need to set up anything to use it?",
    a: "The pipeline, prep cards, STAR stories, and action items work immediately with no setup. To connect Gmail and Google Calendar, you'll follow a one-time 5-minute setup that walks you through creating a free Google Cloud OAuth credential. Step-by-step instructions are built into the app — no technical knowledge required.",
  },
  {
    q: "Is my data private? Do you store it on your servers?",
    a: "Your job search data (pipeline, prep cards, notes) is stored in your browser's local storage and never sent to our servers. Google API calls go directly from your browser to Google — we never see your emails or calendar events. Your data belongs to you, and you can export it anytime as JSON.",
  },
  {
    q: "How does the job board search work?",
    a: "Job search uses the JSearch API (via RapidAPI), which aggregates listings from LinkedIn, Indeed, Glassdoor, and ZipRecruiter in real-time. Pro users get this connected automatically. You can filter by keyword, location, remote-only, and date posted — and add any listing to your pipeline with one click.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes — cancel anytime from your account settings. If you cancel, you keep Pro access until the end of your billing period, then revert to the free plan. We also offer a 7-day money-back guarantee, no questions asked.",
  },
  {
    q: "What's the difference between CloseTheOffer and Huntr or Teal?",
    a: "Huntr and Teal focus on resume building and application tracking. CloseTheOffer focuses on what happens after you apply — interview prep, Gmail sync to surface recruiter responses, calendar integration to see your upcoming interviews, and a STAR story library for behavioral questions. At $9/mo, it's also 78% cheaper than Huntr's $40/mo plan.",
  },
  {
    q: "What if I'm not technical? Is this hard to set up?",
    a: "Not at all. You can start using the pipeline, prep cards, and action items immediately with zero setup — just sign up and go. The Google OAuth connection (for Gmail and Calendar) requires one 5-minute setup the first time, and the app guides you through every step with screenshots.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-28 md:py-40">
      <div className="hairline mb-28" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid lg:grid-cols-[0.8fr_1.2fr] gap-16">
        <div>
          <p className="mono-label mb-8">Questions</p>
          <h2 className="display-heading text-4xl md:text-6xl leading-[0.95]">
            Everything you need to know.
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-hairline">
              <AccordionTrigger className="font-display font-medium text-lg tracking-[-0.01em] text-left hover:no-underline py-6">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/70 text-base leading-relaxed pb-6">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
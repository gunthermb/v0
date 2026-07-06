import React from "react";
import SiteNav from "@/components/site/SiteNav";
import Hero from "@/components/site/Hero";
import Problem from "@/components/site/Problem";
import Features from "@/components/site/Features";
import InterviewPrep from "@/components/site/InterviewPrep";
import JobSearch from "@/components/site/JobSearch";
import InboxSync from "@/components/site/InboxSync";
import PricingCompare from "@/components/site/PricingCompare";
import Pricing from "@/components/site/Pricing";
import Testimonials from "@/components/site/Testimonials";
import FAQ from "@/components/site/FAQ";
import FinalCTA from "@/components/site/FinalCTA";
import SiteFooter from "@/components/site/SiteFooter";

const HERO_IMAGE =
  "https://media.base44.com/images/public/6a4a85a95c75d6b7387d8df3/855f5f9a2_generated_image.png";

export default function Home() {
  return (
    <div className="bg-background">
      <SiteNav />
      <main>
        <Hero heroImage={HERO_IMAGE} />
        <Problem />
        <Features />
        <InterviewPrep />
        <JobSearch />
        <InboxSync />
        <PricingCompare />
        <Pricing />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <SiteFooter />
    </div>
  );
}
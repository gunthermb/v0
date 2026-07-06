import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import HeroDashboard from "@/components/site/HeroDashboard";

export default function Hero({ heroImage }) {
  return (
    <section id="top" className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24">
      <div className="absolute inset-0 opacity-[0.12]">
        <img
          src={heroImage}
          alt="Monolithic architectural interior bathed in raking light"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative max-w-[1400px] mx-auto w-full px-6 lg:px-10 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="mono-label mb-8 animate-slab-rise">
              Built for engineers, architects & tech professionals
            </p>
            <h1
              className="display-heading text-[13vw] md:text-[8vw] lg:text-[6vw] animate-slab-rise"
              style={{ animationDelay: "0.08s" }}
            >
              Land your next
              <br />
              job{" "}
              <span className="font-body italic font-normal text-accent">faster.</span>
            </h1>
            <p
              className="mt-10 max-w-xl text-lg md:text-xl text-foreground/75 animate-slab-rise"
              style={{ animationDelay: "0.16s" }}
            >
              Pipeline tracking, interview prep, Gmail sync, and LinkedIn/Indeed search —
              all in one dashboard. 78% cheaper than Huntr.
            </p>
            <div
              className="mt-10 flex flex-col sm:flex-row gap-4 animate-slab-rise"
              style={{ animationDelay: "0.24s" }}
            >
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-7 py-4 font-mono text-xs uppercase tracking-[0.16em] hover:bg-accent transition-colors"
              >
                Start free — no credit card
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 border border-hairline px-7 py-4 font-mono text-xs uppercase tracking-[0.16em] hover:border-foreground transition-colors"
              >
                See features →
              </a>
            </div>
            <p
              className="mono-label mt-12 animate-slab-rise"
              style={{ animationDelay: "0.32s" }}
            >
              Join 500+ job seekers already using CloseTheOffer
            </p>
          </div>

          <div className="animate-slab-rise" style={{ animationDelay: "0.2s" }}>
            <p className="mono-label mb-4">closetheoffer.com/dashboard</p>
            <HeroDashboard />
          </div>
        </div>
      </div>
    </section>
  );
}
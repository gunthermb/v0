import React from "react";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function SubpageLayout({ label, title, italicWord, children }) {
  return (
    <div className="bg-background min-h-screen">
      <SiteNav />
      <main className="pt-16">
        <section className="py-20 md:py-28">
          <div className="hairline mb-20" />
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 mono-label hover:text-foreground transition-colors mb-10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to home
            </Link>
            <p className="mono-label mb-6">{label}</p>
            <h1 className="display-heading text-5xl md:text-7xl lg:text-8xl mb-12">
              {title}{" "}
              {italicWord && (
                <span className="font-body italic font-normal text-accent">
                  {italicWord}
                </span>
              )}
            </h1>
            <div className="max-w-3xl text-foreground/80 text-lg leading-relaxed space-y-6">
              {children}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
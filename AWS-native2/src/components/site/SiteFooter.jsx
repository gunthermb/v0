import React from "react";
import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer className="bg-background border-t border-hairline">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16">
        <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-16">
          <div>
            <p className="font-display font-bold text-2xl tracking-[-0.04em] mb-4">
              Close<span className="text-accent">The</span>Offer
            </p>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              The job search command center for engineers, architects, and tech professionals.
            </p>
          </div>
          <div>
            <p className="mono-label mb-5">Product</p>
            <ul className="space-y-3 text-sm text-foreground/70">
              <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#prep" className="hover:text-foreground transition-colors">Interview Prep</a></li>
              <li><Link to="/new" className="hover:text-foreground transition-colors">Post a Job</Link></li>
            </ul>
          </div>
          <div>
            <p className="mono-label mb-5">Company</p>
            <ul className="space-y-3 text-sm text-foreground/70">
              <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
              <li><a href="#top" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="#top" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <p className="mono-label mb-5">Account</p>
            <ul className="space-y-3 text-sm text-foreground/70">
              <li><Link to="/login" className="hover:text-foreground transition-colors">Log in</Link></li>
              <li><Link to="/register" className="hover:text-foreground transition-colors">Sign up</Link></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Start free</a></li>
            </ul>
          </div>
        </div>
        <div className="hairline mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="mono-label">© 2026 CloseTheOffer. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#top" className="mono-label hover:text-foreground transition-colors">Privacy</a>
            <a href="#top" className="mono-label hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
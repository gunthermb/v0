import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export default function SiteNav() {
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/85 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="hairline absolute bottom-0" />
      <nav className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <a href="#top" className="font-display font-bold tracking-[-0.04em] text-lg">
          Close<span className="text-accent">The</span>Offer
        </a>
        <div className="hidden md:flex items-center gap-10">
          {[
            { label: "Features", href: "#features" },
            { label: "Prep", href: "#prep" },
            { label: "Pricing", href: "#pricing" },
            { label: "FAQ", href: "#faq" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="mono-label hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Link to="/new" className="mono-label hover:text-foreground transition-colors">
            Post a Job
          </Link>
        </div>
        {isAuthenticated ? (
          <div className="flex items-center gap-5">
            <span className="mono-label hidden sm:inline max-w-[180px] truncate" title={user?.email}>
              {user?.email}
            </span>
            <button
              onClick={logout}
              className="font-mono text-xs uppercase tracking-[0.16em] border border-hairline px-5 py-2.5 hover:border-foreground transition-colors"
            >
              Log out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="font-mono text-xs uppercase tracking-[0.16em] bg-primary text-primary-foreground px-5 py-2.5 hover:bg-accent transition-colors"
          >
            Start free
          </Link>
        )}
      </nav>
    </header>
  );
}
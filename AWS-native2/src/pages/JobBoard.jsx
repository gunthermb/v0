import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Loader2, ArrowLeft } from "lucide-react";
import { searchJobs } from "@/lib/aws-native";
import JobCard from "@/components/site/JobCard";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";

export default function JobBoard() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("Cloud Architect");
  const [location, setLocation] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);
    try {
      // Real listings from the CloseTheOffer job-search Lambda
      // (Remotive + Adzuna + JSearch, Bedrock-ranked). Cognito-authed.
      const jobs = await searchJobs({ query: keyword, location, remoteOnly });
      setResults(jobs);
      setSearched(true);
    } catch (err) {
      if (err.status === 401) {
        setError("Please log in to search live listings.");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setError(err.message || "Failed to fetch job listings. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

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
            <p className="mono-label mb-6">Live Job Board</p>
            <h1 className="display-heading text-5xl md:text-7xl lg:text-8xl mb-8">
              Search live
              <br />
              <span className="font-body italic font-normal text-accent">job listings.</span>
            </h1>
            <p className="text-foreground/70 text-lg max-w-xl mb-12">
              Real-time results from LinkedIn, Indeed, Glassdoor, and ZipRecruiter.
              One click to add any listing to your pipeline.
            </p>

            <form onSubmit={handleSearch} className="bg-card border border-hairline p-6 md:p-8 mb-12">
              <div className="grid md:grid-cols-[1.5fr_1fr_auto] gap-4">
                <div>
                  <label className="mono-label block mb-2">Keyword</label>
                  <div className="flex items-center gap-3 border border-hairline px-4 py-3 bg-background">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="e.g. Cloud Architect"
                      className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
                <div>
                  <label className="mono-label block mb-2">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Washington DC"
                    className="w-full border border-hairline px-4 py-3 bg-background outline-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-primary-foreground px-8 py-3 font-mono text-xs uppercase tracking-[0.16em] hover:bg-accent transition-colors disabled:opacity-50 flex items-center gap-2 h-[50px]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Searching
                      </>
                    ) : (
                      "Search"
                    )}
                  </button>
                </div>
              </div>
              <label className="flex items-center gap-3 mt-5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remoteOnly}
                  onChange={(e) => setRemoteOnly(e.target.checked)}
                  className="w-4 h-4 accent-accent"
                />
                <span className="mono-label">Remote only</span>
              </label>
            </form>

            {error && (
              <div className="border border-destructive/30 bg-destructive/5 px-6 py-4 text-destructive text-sm mb-8">
                {error}
              </div>
            )}

            {loading && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card border border-hairline p-6 animate-pulse">
                    <div className="h-3 w-20 bg-hairline mb-4" />
                    <div className="h-5 w-3/4 bg-hairline mb-2" />
                    <div className="h-4 w-1/2 bg-hairline mb-6" />
                    <div className="h-3 w-full bg-hairline mb-2" />
                    <div className="h-3 w-2/3 bg-hairline" />
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && searched && results.length === 0 && (
              <div className="text-center py-20 border border-hairline">
                <p className="mono-label mb-2">No results</p>
                <p className="text-foreground/70">Try a different keyword or location.</p>
              </div>
            )}

            {!loading && results.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-8">
                  <p className="mono-label">
                    {results.length} {results.length === 1 ? "listing" : "listings"} found
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((job, i) => (
                    <JobCard key={i} job={job} />
                  ))}
                </div>
              </>
            )}

            {!loading && !searched && !error && (
              <div className="text-center py-20 border border-hairline">
                <p className="mono-label mb-2">Ready when you are</p>
                <p className="text-foreground/70">
                  Enter a keyword and hit search to see live listings.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";

const HERO_IMAGE =
  "https://media.base44.com/images/public/6a4a85a95c75d6b7387d8df3/855f5f9a2_generated_image.png";

const EMPTY_FORM = {
  title: "",
  company: "",
  location: "",
  remote: true,
  salary: "",
  employmentType: "Full-time",
  applyUrl: "",
  description: "",
};

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

const inputClass =
  "w-full border border-hairline px-4 py-3 bg-background outline-none text-foreground placeholder:text-muted-foreground focus:border-foreground transition-colors";

export default function PostJob() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const update = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.company.trim()) {
      setError("Job title and company are required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await base44.entities.Job.create({
        title: form.title.trim(),
        company: form.company.trim(),
        location: form.location.trim(),
        remote: form.remote,
        salary: form.salary.trim(),
        employmentType: form.employmentType,
        applyUrl: form.applyUrl.trim(),
        description: form.description.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to post the job. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const postAnother = () => {
    setForm(EMPTY_FORM);
    setSubmitted(false);
    setError("");
  };

  return (
    <div className="bg-background">
      <SiteNav />
      <main>
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24">
          <div className="absolute inset-0 opacity-[0.12]">
            <img
              src={HERO_IMAGE}
              alt="Monolithic architectural interior bathed in raking light"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative max-w-[1400px] mx-auto w-full px-6 lg:px-10 py-16 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left column — hero copy */}
              <div>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 mono-label hover:text-foreground transition-colors mb-8 animate-slab-rise"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to job board
                </Link>
                <p className="mono-label mb-8 animate-slab-rise">Post a role</p>
                <h1
                  className="display-heading text-[13vw] md:text-[8vw] lg:text-[6vw] animate-slab-rise"
                  style={{ animationDelay: "0.08s" }}
                >
                  Post a
                  <br />
                  new{" "}
                  <span className="font-body italic font-normal text-accent">role.</span>
                </h1>
                <p
                  className="mt-10 max-w-xl text-lg md:text-xl text-foreground/75 animate-slab-rise"
                  style={{ animationDelay: "0.16s" }}
                >
                  Add a role to the board. Candidates using CloseTheOffer can track it
                  straight into their pipeline — no job-board fees.
                </p>
                <p
                  className="mono-label mt-12 animate-slab-rise"
                  style={{ animationDelay: "0.32s" }}
                >
                  Seen by 500+ active job seekers
                </p>
              </div>

              {/* Right column — form / confirmation */}
              <div className="animate-slab-rise" style={{ animationDelay: "0.2s" }}>
                <p className="mono-label mb-4">closetheoffer.com/new</p>

                {submitted ? (
                  <div className="bg-card border border-hairline p-8 md:p-12 text-center">
                    <CheckCircle2 className="w-10 h-10 text-accent mx-auto mb-6" />
                    <p className="mono-label mb-2">Job posted</p>
                    <h2 className="font-display font-semibold text-2xl tracking-[-0.02em] mb-3">
                      {form.title} at {form.company}
                    </h2>
                    <p className="text-foreground/70 mb-8">
                      Your listing has been submitted.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                      <button
                        onClick={postAnother}
                        className="bg-primary text-primary-foreground px-8 py-3 font-mono text-xs uppercase tracking-[0.16em] hover:bg-accent transition-colors"
                      >
                        Post another
                      </button>
                      <Link
                        to="/jobs"
                        className="mono-label border border-hairline px-8 py-3 hover:border-foreground transition-colors"
                      >
                        View job board
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-card border border-hairline p-6 md:p-8">
                    {error && (
                      <div className="border border-destructive/30 bg-destructive/5 px-6 py-4 text-destructive text-sm mb-8">
                        {error}
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="sm:col-span-2">
                        <label className="mono-label block mb-2">Job title *</label>
                        <input
                          type="text"
                          value={form.title}
                          onChange={update("title")}
                          placeholder="e.g. Senior Cloud Architect"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="mono-label block mb-2">Company *</label>
                        <input
                          type="text"
                          value={form.company}
                          onChange={update("company")}
                          placeholder="e.g. Acme Corp"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="mono-label block mb-2">Location</label>
                        <input
                          type="text"
                          value={form.location}
                          onChange={update("location")}
                          placeholder="e.g. Washington DC"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="mono-label block mb-2">Salary range</label>
                        <input
                          type="text"
                          value={form.salary}
                          onChange={update("salary")}
                          placeholder="e.g. $150k – $190k"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="mono-label block mb-2">Employment type</label>
                        <select
                          value={form.employmentType}
                          onChange={update("employmentType")}
                          className={inputClass}
                        >
                          {EMPLOYMENT_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mono-label block mb-2">Application URL</label>
                        <input
                          type="url"
                          value={form.applyUrl}
                          onChange={update("applyUrl")}
                          placeholder="https://…"
                          className={inputClass}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mono-label block mb-2">Description</label>
                        <textarea
                          value={form.description}
                          onChange={update("description")}
                          rows={5}
                          placeholder="Describe the role, responsibilities, and requirements…"
                          className={`${inputClass} resize-y`}
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-3 mt-5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.remote}
                        onChange={update("remote")}
                        className="w-4 h-4 accent-accent"
                      />
                      <span className="mono-label">Remote friendly</span>
                    </label>

                    <div className="mt-8">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 font-mono text-xs uppercase tracking-[0.16em] hover:bg-accent transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Posting
                          </>
                        ) : (
                          "Post job"
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

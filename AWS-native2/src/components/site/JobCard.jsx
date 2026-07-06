import React from "react";

export default function JobCard({ job }) {
  return (
    <article className="bg-background border border-hairline p-6 md:p-7 flex flex-col gap-3 hover:border-foreground transition-colors group">
      <div className="flex items-center justify-between gap-4">
        <span className="mono-label">{job.source}</span>
        <span className="mono-label text-muted-foreground">{job.posted}</span>
      </div>
      <div>
        <h3 className="font-display font-semibold text-lg tracking-[-0.02em] leading-snug">
          {job.title}
        </h3>
        <p className="text-foreground/80 text-sm mt-1">{job.company}</p>
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        {job.location && (
          <span className="font-mono px-2.5 py-1 border border-hairline">📍 {job.location}</span>
        )}
        {job.remote && (
          <span className="font-mono px-2.5 py-1 border border-hairline">🏠 Remote</span>
        )}
        {job.salary && (
          <span className="font-mono px-2.5 py-1 border border-hairline text-accent">💰 {job.salary}</span>
        )}
      </div>
      {job.description && (
        <p className="text-foreground/70 text-sm leading-relaxed line-clamp-2">{job.description}</p>
      )}
      <div className="flex items-center gap-3 mt-auto pt-3">
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mono-label hover:text-foreground transition-colors"
          >
            View listing →
          </a>
        )}
        <button className="mono-label ml-auto border border-hairline px-3 py-1.5 hover:border-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          + Add to Pipeline
        </button>
      </div>
    </article>
  );
}
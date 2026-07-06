import React from "react";
import SubpageLayout from "@/components/site/SubpageLayout";

const SECTIONS = [
  {
    h: "Information We Collect",
    p: "We collect your email address, password (encrypted), and any job application data you enter into the pipeline. When you connect Gmail or Google Calendar, we receive OAuth tokens to sync your inbox and calendar events — we never store your email content.",
  },
  {
    h: "How We Use Your Data",
    p: "Your data is used solely to provide the CloseTheOffer service: tracking applications, syncing recruiter communications, generating interview prep cards, and surfacing relevant job listings. We never sell your data to third parties.",
  },
  {
    h: "Data Storage & Security",
    p: "All data is encrypted in transit and at rest. OAuth tokens are stored securely and scoped to the minimum permissions required. Access is limited to authorized personnel and infrastructure.",
  },
  {
    h: "Third-Party Services",
    p: "We integrate with Google (Gmail, Calendar), LinkedIn, Indeed, Glassdoor, and ZipRecruiter. Each service has its own privacy policy governing data you share with them directly.",
  },
  {
    h: "Your Rights",
    p: "You can export or delete all your data at any time from your account settings. Deleting your account permanently removes all associated data within 30 days.",
  },
  {
    h: "Contact",
    p: "Questions about this policy? Email us at support@closetheoffer.com.",
  },
];

export default function Privacy() {
  return (
    <SubpageLayout label="Legal" title="Privacy" italicWord="policy.">
      <p className="text-muted-foreground">Last updated: July 5, 2026</p>
      {SECTIONS.map((s) => (
        <div key={s.h}>
          <h2 className="font-display font-semibold text-xl text-foreground mb-2">{s.h}</h2>
          <p>{s.p}</p>
        </div>
      ))}
    </SubpageLayout>
  );
}
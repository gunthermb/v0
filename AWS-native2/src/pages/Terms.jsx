import React from "react";
import SubpageLayout from "@/components/site/SubpageLayout";

const SECTIONS = [
  {
    h: "Acceptance of Terms",
    p: "By creating an account or using CloseTheOffer, you agree to these Terms of Service. If you do not agree, do not use the service.",
  },
  {
    h: "Your Account",
    p: "You are responsible for maintaining the security of your account credentials and for all activity under your account. You must be 18 or older to use this service.",
  },
  {
    h: "Acceptable Use",
    p: "You agree not to abuse the service, including scraping job listings for redistribution, attempting to access other users' data, or using the platform for any illegal activity.",
  },
  {
    h: "Subscriptions & Billing",
    p: "The Pro plan is $9/month, billed monthly. You can cancel at any time — access continues until the end of your billing period. Refunds are issued at our discretion for unused billing periods.",
  },
  {
    h: "Intellectual Property",
    p: "CloseTheOffer and all its content, features, and functionality are owned by us and protected by copyright, trademark, and other laws. Your job application data remains yours.",
  },
  {
    h: "Service Availability",
    p: "We strive for 99.9% uptime but do not guarantee uninterrupted access. We are not liable for any losses resulting from service interruptions.",
  },
  {
    h: "Limitation of Liability",
    p: "CloseTheOffer is provided 'as is' without warranties of any kind. We are not liable for indirect, incidental, or consequential damages arising from use of the service.",
  },
  {
    h: "Contact",
    p: "Questions about these terms? Email us at support@closetheoffer.com.",
  },
];

export default function Terms() {
  return (
    <SubpageLayout label="Legal" title="Terms of" italicWord="service.">
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
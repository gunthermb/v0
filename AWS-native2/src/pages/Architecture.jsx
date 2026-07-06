import React from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import SubpageLayout from "@/components/site/SubpageLayout";

const SERVICE_MAP = [
  { from: "Vercel hosting + vercel.json", to: "S3 (private) + CloudFront (OAC) + CloudFront Function", status: "replaced" },
  { from: "Supabase email/password + Google", to: "Amazon Cognito User Pool + Hosted UI + Google IdP", status: "replaced" },
  { from: "Anthropic API (resume scan)", to: "Amazon Bedrock (Claude) via API Gateway + Lambda", status: "replaced" },
  { from: "localStorage (resume / pipeline)", to: "DynamoDB (per-user, keyed by Cognito sub)", status: "added" },
  { from: "pdf.js / mammoth from cdnjs", to: "Self-hosted in S3 under /vendor/", status: "replaced" },
  { from: "RapidAPI JSearch (job listings)", to: "No AWS equivalent — stays external", status: "external" },
  { from: "Google Gmail / Calendar sync", to: "Google's data — stays external", status: "external" },
];

const RESOURCES = [
  { service: "Cognito", resource: "User Pool", id: "us-east-1_GQUI7haAM" },
  { service: "Cognito", resource: "App client ID", id: "77ptts1up991813u4g1d5rek0i" },
  { service: "API Gateway", resource: "HTTP API base URL", id: "1sgjnc58fa.execute-api.us-east-1.amazonaws.com" },
  { service: "Lambda", resource: "ResumeScanFunction", id: "POST /scan → Bedrock" },
  { service: "Lambda", resource: "JobSearchFunction", id: "POST /jobs → Remotive + Adzuna + JSearch" },
  { service: "Lambda", resource: "DataFunction", id: "GET/POST /data → DynamoDB" },
  { service: "Bedrock", resource: "Model", id: "us.anthropic.claude-haiku-4-5-20251001-v1:0" },
  { service: "DynamoDB", resource: "Table", id: "closetheoffer-data (PK: userId, SK: item)" },
  { service: "S3", resource: "Site bucket", id: "closetheoffer-site-233855675950 (private)" },
  { service: "CloudFront", resource: "Distribution", id: "d3holrr9fpnwaw.cloudfront.net" },
  { service: "WAF", resource: "Web ACL", id: "closetheoffer-waf (CLOUDFRONT scope)" },
  { service: "SSM", resource: "SecureString params", id: "/closetheoffer/adzuna-app-key, /closetheoffer/jsearch-rapidapi-key" },
];

const COSTS = [
  { service: "Cognito", cost: "Free up to 50,000 monthly active users" },
  { service: "CloudFront + S3", cost: "Pennies for a small static site (free-tier eligible)" },
  { service: "Lambda + API Gateway", cost: "Free tier covers light use" },
  { service: "DynamoDB", cost: "On-demand; free tier covers light use" },
  { service: "Bedrock", cost: "Pay per token — only when a resume is scanned" },
];

export default function Architecture() {
  return (
    <SubpageLayout label="Infrastructure" title="AWS-native" italicWord="architecture.">
      <p>
        CloseTheOffer runs entirely on AWS-native services — replacing Vercel, Supabase,
        and the direct Anthropic API with AWS equivalents. Everything is defined as code
        (AWS SAM / CloudFormation) and deployed with a single command.
      </p>

      <div>
        <p className="mono-label mb-4">Architecture diagram</p>
        <pre className="font-mono text-xs leading-relaxed text-foreground/80 bg-card border border-hairline p-6 overflow-x-auto whitespace-pre">{`                       ┌──────────────────────────────────────────┐
   Browser  ──HTTPS──▶ │ CloudFront (TLS, caching, routing fn)     │
                       │   origin: S3 (private, OAC)               │  static site
                       └──────────────────────────────────────────┘
        │
        │  sign in / sign up
        ▼
   ┌──────────────────────┐     federated      ┌───────────────┐
   │ Amazon Cognito        │◀──── Google IdP ──▶│ Google OAuth  │
   │ User Pool + Hosted UI │   (optional)        └───────────────┘
   └──────────────────────┘
        │ JWT (id/access token)
        ▼
   ┌──────────────────────────────┐   InvokeModel   ┌──────────────┐
   │ API Gateway (HTTP API)        │───────────────▶│ Amazon       │
   │  JWT authorizer (Cognito)     │   Lambda        │ Bedrock      │  resume AI
   │   /scan   → resume-scan λ ─────┘                │ (Claude)     │
   │   /jobs   → job-search λ ─────┐                 └──────────────┘
   │   /data   → data λ ───────────┐
   └───────────────────────────────┘
                                   ▼
                            ┌──────────────┐
                            │ DynamoDB      │  per-user resume / pipeline
                            └──────────────┘`}</pre>
      </div>

      <div>
        <p className="mono-label mb-4">Service mapping</p>
        <div className="border border-hairline">
          {SERVICE_MAP.map((s, i) => (
            <div
              key={s.from}
              className={`grid grid-cols-[auto_1fr_1fr_auto] gap-4 items-start p-4 ${
                i !== SERVICE_MAP.length - 1 ? "border-b border-hairline" : ""
              }`}
            >
              {s.status === "external" ? (
                <AlertTriangle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              )}
              <span className="text-sm text-muted-foreground">{s.from}</span>
              <span className="text-sm text-foreground font-medium">{s.to}</span>
              <span className="mono-label whitespace-nowrap">{s.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mono-label mb-4">Live AWS resources</p>
        <div className="border border-hairline">
          <div className="grid grid-cols-[1fr_1fr_2fr] gap-4 p-4 border-b border-hairline bg-card">
            <span className="mono-label">Service</span>
            <span className="mono-label">Resource</span>
            <span className="mono-label">Identifier</span>
          </div>
          {RESOURCES.map((r, i) => (
            <div
              key={r.resource}
              className={`grid grid-cols-[1fr_1fr_2fr] gap-4 p-4 ${
                i !== RESOURCES.length - 1 ? "border-b border-hairline" : ""
              }`}
            >
              <span className="text-sm text-foreground font-medium">{r.service}</span>
              <span className="text-sm text-muted-foreground">{r.resource}</span>
              <code className="text-xs text-foreground/80 break-all">{r.id}</code>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mono-label mb-4">Cost at low traffic</p>
        <div className="space-y-3">
          {COSTS.map((c) => (
            <div key={c.service} className="flex justify-between border-b border-hairline pb-3">
              <span className="font-display font-semibold text-foreground">{c.service}</span>
              <span className="text-sm text-muted-foreground text-right">{c.cost}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-muted-foreground text-sm">
        Full infrastructure &amp; security reference: see{" "}
        <code className="text-foreground/80">aws-native/INFRASTRUCTURE_AND_SECURITY.md</code>.
        Deploy with{" "}
        <code className="text-foreground/80">aws-native/deploy.sh</code>.
      </p>
    </SubpageLayout>
  );
}
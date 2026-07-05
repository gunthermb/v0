# CloseTheOffer — Infrastructure & Security Reference

_Last updated: 2026-06-30 · Maintainer: GuntherCloudSolutions_

> ⚠️ **This file is safe to commit.** Secret *values* are intentionally masked — only
> identifiers, locations, and status are recorded here. Real secrets live in AWS
> (SSM Parameter Store, Cognito, IAM) and the gitignored `aws-native/.env`.

---

## 1. Overview

CloseTheOffer is a static front end (HTML/JS) on S3 + CloudFront, with a serverless
AWS back end: Amazon Cognito (auth), one API Gateway HTTP API (Cognito-JWT authorized)
fronting three Lambdas, Amazon Bedrock (AI), and DynamoDB (per-user data). Everything
is defined as code (AWS SAM / CloudFormation) and shipped by `deploy.sh`.

| Item | Value |
|------|-------|
| AWS account | `233855675950` |
| Region | `us-east-1` |
| Live URL | https://d3holrr9fpnwaw.cloudfront.net |
| CloudFormation stacks | `closetheoffer-backend`, `closetheoffer-hosting` |
| IaC | AWS SAM (`infrastructure/backend.yaml`, `infrastructure/hosting.yaml`) |
| Deploy | `aws-native/deploy.sh` |

---

## 2. AWS resources

| Service | Resource | Identifier / Notes |
|---------|----------|--------------------|
| Cognito | User Pool | `us-east-1_GQUI7haAM` |
| Cognito | App client ID | `77ptts1up991813u4g1d5rek0i` (public — shipped in `aws-config.js`) |
| Cognito | Hosted UI domain | `https://closetheoffer-auth-233855675950.auth.us-east-1.amazoncognito.com` |
| API Gateway | HTTP API base URL | `https://1sgjnc58fa.execute-api.us-east-1.amazonaws.com` |
| Lambda | `ResumeScanFunction` | `POST /scan` → Bedrock (resume ATS/CAR scan, AI rewrite, STAR gen) |
| Lambda | `JobSearchFunction` | `POST /jobs` → Remotive + Adzuna + JSearch, Bedrock ranking |
| Lambda | `DataFunction` | `GET/POST /data` → DynamoDB (per-user) |
| Bedrock | Model / inference profile | `us.anthropic.claude-haiku-4-5-20251001-v1:0` |
| DynamoDB | Table | `closetheoffer-data` (PK `userId`, SK `item`) |
| S3 | Site bucket | `closetheoffer-site-233855675950` (private; CloudFront OAC only) |
| CloudFront | Distribution | serves the static site; URL above |
| WAF | Web ACL | `closetheoffer-waf` (CLOUDFRONT scope) |
| SSM | Parameters | `/closetheoffer/adzuna-app-key`, `/closetheoffer/jsearch-rapidapi-key` (SecureString) |

---

## 3. Credentials & secrets inventory

**Secret values are masked.** Public identifiers are shown in full because they are
already exposed in the client app or are non-sensitive.

| Credential | Type | Value | Where it lives |
|------------|------|-------|----------------|
| AWS account ID | Public | `233855675950` | — |
| IAM admin user | — | `mike-admin` (AdministratorAccess) | IAM |
| AWS root access keys | — | **deleted** (none present) | — |
| AWS root MFA | — | **enabled** | Root security credentials |
| Cognito app client ID | Public | `77ptts1up991813u4g1d5rek0i` | `aws-config.js` |
| API base URL | Public | `1sgjnc58fa.execute-api.us-east-1.amazonaws.com` | `aws-config.js` |
| CloudFront URL | Public | `d3holrr9fpnwaw.cloudfront.net` | CloudFront |
| Google OAuth Web client ID | Public | `802452158790-kn2up59p0c7…apps.googleusercontent.com` | app default + Cognito IdP |
| Google client secret | **SECRET** | `GOCSPX-•••••••• (masked)` | Cognito IdP config (+ user's local notes) |
| Adzuna app_id | Public | `eb751fdc` | `aws-native/.env` |
| Adzuna app_key | **SECRET** | `•••••••• (masked)` | **SSM SecureString** `/closetheoffer/adzuna-app-key` |
| JSearch RapidAPI key | **SECRET** | _not set yet_ | **SSM SecureString** `/closetheoffer/jsearch-rapidapi-key` (when added) |
| End-user passwords | Managed | hashed by Cognito — never stored by the app | Amazon Cognito |
| `mike-admin` access key | **SECRET** | see §6 incident note | IAM (CLI credential) |

> To read a stored SSM secret value (locally, decrypted):
> `aws ssm get-parameter --name "/closetheoffer/adzuna-app-key" --with-decryption --query "Parameter.Value" --output text`

---

## 4. Security hardening log

| # | Item | Status |
|---|------|--------|
| 1 | Root account: IAM admin user, root MFA on, root access keys deleted | ✅ Done (live) |
| 2 | CORS scoped to the CloudFront origin (allow-list via `ALLOWED_ORIGIN`, no `*`) | ✅ Done (live) |
| 3 | Adzuna/JSearch secrets moved to SSM SecureString; out of Lambda env & `.env` | ✅ Done (live) |
| 4 | API Gateway throttling — 10 req/s steady, 20 burst | ✅ Coded (deploy pending) |
| 5 | AWS WAF on CloudFront — rate limit + AWS managed rule sets | ✅ Coded (deploy pending) |
| 6 | Cognito: 12-char password policy (upper+lower+number), 1h tokens / 7d refresh, token revocation, anti-enumeration | ✅ Coded (deploy pending) |
| 6b | Cognito MFA / SRP / threat protection | ⏸️ Deferred (Google is primary login) |
| 7 | CloudFront HSTS (2yr, includeSubDomains, preload) + existing headers | ✅ Coded (deploy pending) |
| 8 | DynamoDB PITR + deletion protection + KMS-at-rest + Retain policy | ✅ Coded (deploy pending) |
| 9 | Lambda reserved concurrency | ❌ Not used — account Lambda concurrency cap is too low (needs ≥10 unreserved). API throttling (#4) covers cost. Re-add after a Service Quotas limit increase. |
| 10 | Bedrock IAM scoped to Anthropic models/profiles (was `*`) | ✅ Coded (deploy pending) |
| 11 | Observability: budget alert, GuardDuty, CloudTrail | ⏳ To do (console) |

**Existing baseline (pre-hardening):** private S3 + CloudFront OAC, Cognito JWT
authorizer on every API route, deploy secrets in a gitignored `.env`, least-privilege
Lambda roles, HTTPS enforced + security headers.

---

## 5. Deployment runbook

```bash
cd aws-native
./deploy.sh        # backend (SAM) → hosting (CFN) → S3 sync → CloudFront invalidation
```

- Secrets load from `aws-native/.env` (gitignored). Only `ADZUNA_APP_ID` (public) is
  passed as a stack parameter now; the app_key + JSearch key are read from SSM at runtime.
- `ReservedConcurrentExecutions` needs ≥100 unreserved account concurrency; lower the
  values if a deploy reports "must leave 100 unreserved."

**Verification after deploy:**

```bash
# CORS locked to the domain (not '*')
curl -i -X OPTIONS https://1sgjnc58fa.execute-api.us-east-1.amazonaws.com/scan \
  -H "Origin: https://d3holrr9fpnwaw.cloudfront.net" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: authorization,content-type" | grep -i access-control-allow-origin

# Root has no access keys, MFA on
aws iam get-account-summary   # AccountAccessKeysPresent: 0, AccountMFAEnabled: 1
```
Then sign in on the site and run a Job Search — Adzuna results confirm the SSM secret path works.

---

## 6. Pending / deferred items

- **🔴 Rotate `mike-admin` access key `AKIATM4XCNYXCPFULMG5`.** This key's *secret* was
  pasted into a chat on 2026-06-30 and is therefore considered exposed. It is still
  **active**. Remediation (do, then record the date here):
  ```bash
  # create a new key in the console first, run `aws configure` with it, then:
  aws iam delete-access-key --user-name mike-admin --access-key-id AKIATM4XCNYXCPFULMG5
  ```
  _Rotated on: __________ (fill in when done)._
- **Deploy Steps 4–10** (run `./deploy.sh`).
- **Step 11** — budget alert, GuardDuty, CloudTrail.
- **Cognito extras (optional)** — MFA, SRP, threat protection.
- **Adzuna app_key** was also shown in chat; low risk (free, read-only job search) but
  may be regenerated in the Adzuna dashboard and re-stored in SSM if desired.

---

## 7. Notes

- End-user job-search data also persists in browser `localStorage`; the `DataFunction`
  + DynamoDB provide an optional per-user server store keyed by the Cognito `sub`.
- Google client *secret* is held by Cognito (Google IdP federation), not by any Lambda.
- This document contains **no secret values** and is safe to commit / push to GitHub.

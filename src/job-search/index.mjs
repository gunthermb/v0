/*
  Created by GuntherCloudSolutions
  Last updated: 2026-06-29

  Lambda: AWS-native job search. The browser calls API Gateway POST /jobs (Cognito-authed)
  instead of hitting third-party job APIs directly — so keys live in AWS, not the client,
  and there are no CORS issues.

  Flow:
    1. Fan out to the real job sources server-side:
         • Remotive  — free, no key (remote tech roles)
         • Adzuna    — free app_id/app_key (US incl. onsite), used only if creds are set
         • JSearch   — RapidAPI (LinkedIn/Indeed/Glassdoor/ZipRecruiter), used only if a key is set
    2. Normalize + dedupe.
    3. (Optional) Bedrock/Claude ranks each REAL listing against the candidate profile,
       adding a fit score (0-100) and a one-line reason. Bedrock never invents listings.

  Env vars:
    BEDROCK_MODEL_ID   (default us.anthropic.claude-haiku-4-5-20251001-v1:0)
    ADZUNA_APP_ID, ADZUNA_APP_KEY   (optional)
    JSEARCH_RAPIDAPI_KEY            (optional; client may also pass rapidApiKey in the body)
*/
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { SSMClient, GetParametersCommand } from '@aws-sdk/client-ssm';

const bedrock = new BedrockRuntimeClient({});
const ssm = new SSMClient({});
const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'us.anthropic.claude-haiku-4-5-20251001-v1:0';

// Secrets: prefer env vars (local/dev), else fetch from SSM SecureString params at runtime
// so the keys never live in the Lambda's configuration. Cached for the container's life.
let _secretCache = null;
async function getSecrets() {
  if (_secretCache) return _secretCache;
  const s = { adzunaKey: process.env.ADZUNA_APP_KEY || '', jsearchKey: process.env.JSEARCH_RAPIDAPI_KEY || '' };
  const want = [];
  if (!s.adzunaKey && process.env.ADZUNA_APP_KEY_PARAM) want.push(process.env.ADZUNA_APP_KEY_PARAM);
  if (!s.jsearchKey && process.env.JSEARCH_RAPIDAPI_KEY_PARAM) want.push(process.env.JSEARCH_RAPIDAPI_KEY_PARAM);
  if (want.length) {
    try {
      const r = await ssm.send(new GetParametersCommand({ Names: want, WithDecryption: true }));
      for (const pp of (r.Parameters || [])) {
        if (pp.Name === process.env.ADZUNA_APP_KEY_PARAM) s.adzunaKey = pp.Value;
        if (pp.Name === process.env.JSEARCH_RAPIDAPI_KEY_PARAM) s.jsearchKey = pp.Value;
      }
    } catch (e) { console.error('SSM secret fetch failed:', e.message); }
  }
  _secretCache = s;
  return s;
}

// The Lambda owns CORS. ALLOWED_ORIGIN is a comma-separated allow-list (env var); the
// response echoes the caller's origin only if it's on the list (else the first entry).
const ALLOWED = (process.env.ALLOWED_ORIGIN || '*').split(',').map((s) => s.trim()).filter(Boolean);
function corsFor(event) {
  const origin = (event?.headers?.origin) || (event?.headers?.Origin) || '';
  const allow = ALLOWED.includes('*') ? '*' : (origin && ALLOWED.includes(origin) ? origin : (ALLOWED[0] || '*'));
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Headers': 'authorization, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Vary': 'Origin',
    'Content-Type': 'application/json',
  };
}

const stripHtml = (s) => String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

// Relevance: keep only listings whose title/company contains a meaningful query word.
const STOPWORDS = new Set(['the', 'and', 'for', 'with', 'our', 'your', 'job', 'jobs', 'role', 'remote', 'senior', 'sr', 'lead', 'principal', 'staff', 'of', 'in', 'to', 'a', 'an']);
const queryTokens = (q) => (String(q || '').toLowerCase().match(/[a-z0-9+#.]{2,}/g) || []).filter((t) => t.length >= 3 && !STOPWORDS.has(t));
const isRelevant = (job, tokens) => {
  if (!tokens.length) return true;
  const hay = ((job.title || '') + ' ' + (job.company || '')).toLowerCase();
  return tokens.some((t) => hay.includes(t));
};
const timeAgo = (iso) => {
  if (!iso) return '';
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (isNaN(d)) return '';
  return d <= 0 ? 'Today' : d === 1 ? 'Yesterday' : `${d}d ago`;
};

// ── Source: Remotive (no key) ─────────────────────────────────
async function fromRemotive(query) {
  try {
    const r = await fetch('https://remotive.com/api/remote-jobs?search=' + encodeURIComponent(query) + '&limit=40');
    if (!r.ok) return [];
    const d = await r.json();
    return (d.jobs || []).map((j) => ({
      id: 'remotive-' + j.id,
      title: j.title,
      company: j.company_name,
      isRemote: true,
      location: j.candidate_required_location || 'Remote',
      salary: j.salary || '',
      minSalary: null, maxSalary: null, period: '',
      description: stripHtml(j.description).slice(0, 600),
      url: j.url,
      source: 'Remotive',
      posted: timeAgo(j.publication_date),
      date: j.publication_date || '',
    }));
  } catch { return []; }
}

// ── Source: Adzuna (free app_id/app_key) ──────────────────────
async function fromAdzuna(query, location, appKey) {
  const id = process.env.ADZUNA_APP_ID, key = appKey;
  if (!id || !key) return [];
  try {
    const params = new URLSearchParams({
      app_id: id, app_key: key, results_per_page: '30',
      what: query, 'content-type': 'application/json',
      ...(location && location !== 'remote' ? { where: location } : {}),
    });
    const r = await fetch('https://api.adzuna.com/v1/api/jobs/us/search/1?' + params);
    if (!r.ok) return [];
    const d = await r.json();
    return (d.results || []).map((j) => ({
      id: 'adzuna-' + j.id,
      title: j.title,
      company: j.company?.display_name || '',
      isRemote: /remote/i.test(j.title + ' ' + (j.description || '')),
      location: j.location?.display_name || '',
      salary: j.salary_min ? `$${Math.round(j.salary_min / 1000)}K–$${Math.round((j.salary_max || j.salary_min) / 1000)}K` : '',
      minSalary: j.salary_min || null,
      maxSalary: j.salary_max || null,
      period: 'YEAR',
      description: stripHtml(j.description).slice(0, 600),
      url: j.redirect_url,
      source: 'Adzuna',
      posted: timeAgo(j.created),
      date: j.created || '',
    }));
  } catch { return []; }
}

// ── Source: JSearch (RapidAPI) ────────────────────────────────
async function fromJSearch(query, location, date, rapidKey) {
  const k = rapidKey;
  if (!k) return [];
  try {
    const fullQuery = location && location !== 'remote' ? `${query} in ${location}` : query;
    const params = new URLSearchParams({
      query: fullQuery, num_pages: '1', page: '1',
      ...(location === 'remote' ? { remote_jobs_only: 'true' } : {}),
      ...(date && date !== 'any' ? { date_posted: date } : {}),
    });
    const r = await fetch('https://jsearch.p.rapidapi.com/search?' + params, {
      headers: { 'X-RapidAPI-Key': k, 'X-RapidAPI-Host': 'jsearch.p.rapidapi.com' },
    });
    if (!r.ok) return [];
    const d = await r.json();
    return (d.data || []).map((j) => ({
      id: j.job_id,
      title: j.job_title,
      company: j.employer_name,
      isRemote: j.job_is_remote,
      location: j.job_city ? `${j.job_city}, ${j.job_state || j.job_country}` : (j.job_is_remote ? 'Remote' : j.job_country),
      salary: (j.job_min_salary || j.job_max_salary) ? `$${Math.round((j.job_min_salary || j.job_max_salary) / 1000)}K+` : '',
      minSalary: j.job_min_salary || null,
      maxSalary: j.job_max_salary || null,
      period: j.job_salary_period || '',
      description: (j.job_description || '').slice(0, 600),
      url: j.job_apply_link || j.job_google_link,
      source: j.job_publisher || 'JSearch',
      posted: timeAgo(j.job_posted_at_datetime_utc),
      date: j.job_posted_at_datetime_utc || '',
    }));
  } catch { return []; }
}

// ── Bedrock ranking over the REAL listings ────────────────────
async function rankWithBedrock(jobs, profile) {
  if (!jobs.length) return jobs;
  const slim = jobs.slice(0, 25).map((j, i) => ({ i, title: j.title, company: j.company, location: j.location, salary: j.salary }));
  const prompt = `You are screening REAL job listings for a candidate. Do NOT invent jobs. Only score the listings provided.

Candidate profile:
${profile || 'Cloud / AWS Solutions Architect, 25+ years, TS-clearance eligible, targets remote or DC-metro, $180K+/yr or $90/hr+.'}

Listings (JSON):
${JSON.stringify(slim)}

Return ONLY JSON: {"ranked":[{"i":<index>,"score":<0-100 fit>,"why":"<≤12 word reason>"}]}. Include every index exactly once, sorted by score descending.`;

  try {
    const out = await bedrock.send(new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    }));
    const decoded = JSON.parse(new TextDecoder().decode(out.body));
    const raw = decoded.content?.[0]?.text || '';
    const parsed = JSON.parse(raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim());
    const order = [];
    (parsed.ranked || []).forEach((r) => {
      const j = jobs[r.i];
      if (j) { j.fitScore = r.score; j.fitWhy = r.why; order.push(j); }
    });
    // Append any not returned by the model (keep all real listings).
    jobs.forEach((j) => { if (!order.includes(j)) order.push(j); });
    return order;
  } catch {
    return jobs; // ranking is best-effort; never drop real results
  }
}

export const handler = async (event) => {
  const CORS = corsFor(event);
  if (event?.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  try {
    const body = JSON.parse(event.body || '{}');
    const query = (body.query || '').trim();
    if (!query) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'query is required.' }) };
    const location = body.location || '';
    const date = body.date || '';
    const wantRank = body.rank !== false;        // default on
    const useJSearch = body.includeJSearch !== false; // default on; daily pull sets false to save quota

    const secrets = await getSecrets(); // env-first, else SSM SecureString
    const jsearchKey = body.rapidApiKey || secrets.jsearchKey;
    const [remotive, adzuna, jsearch] = await Promise.all([
      fromRemotive(query),
      fromAdzuna(query, location, secrets.adzunaKey),
      useJSearch ? fromJSearch(query, location, date, jsearchKey) : Promise.resolve([]),
    ]);
    // Remotive's keyword search is loose — relevance-filter it. Adzuna/JSearch already
    // scope by keyword server-side, so keep those as-is.
    const tokens = queryTokens(query);
    let jobs = [...remotive.filter((j) => isRelevant(j, tokens)), ...adzuna, ...jsearch];

    // Dedupe by company+title.
    const seen = new Set();
    jobs = jobs.filter((j) => {
      if (!j.company || !j.title) return false;
      const k = norm(j.company) + '|' + norm(j.title);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

    if (wantRank && jobs.length) jobs = await rankWithBedrock(jobs, body.profile);

    return { statusCode: 200, headers: CORS, body: JSON.stringify({ jobs, sources: { remotive: true, adzuna: !!(process.env.ADZUNA_APP_ID && secrets.adzunaKey), jsearch: useJSearch && !!jsearchKey } }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message || String(err) }) };
  }
};

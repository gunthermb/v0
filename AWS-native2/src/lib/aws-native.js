/*
  Created by GuntherCloudSolutions
  Last updated: 2026-07-06

  AWS-native client for the AWS-native2 app (the "base44 look" served at /new).
  Replaces the Base44 SDK: auth runs on Amazon Cognito (native HTTPS API + Hosted UI
  for Google) and data/AI run on the existing CloseTheOffer API Gateway + Lambdas
  (POST /jobs → job-search, POST /scan → Bedrock, GET|POST /data → DynamoDB).

  These are the same backend services the static site already uses — see
  ../../frontend/aws-config.js. All values here are safe to expose in the browser.
*/

const AWS_REGION        = 'us-east-1';
const COGNITO_CLIENT_ID = '77ptts1up991813u4g1d5rek0i';
const HOSTED_UI_DOMAIN  = 'https://closetheoffer-auth-233855675950.auth.us-east-1.amazoncognito.com';
const API_BASE_URL      = 'https://1sgjnc58fa.execute-api.us-east-1.amazonaws.com';

// Google (Hosted UI) returns here. Must be one of the Cognito App Client CallbackURLs.
// We register the app's own base path (…/new/) so the flow stays inside this app.
const APP_BASE   = (import.meta.env.BASE_URL || '/').replace(/\/*$/, '/'); // e.g. "/new/"
export const OAUTH_REDIRECT = window.location.origin + APP_BASE;

const IDP_ENDPOINT = 'https://cognito-idp.' + AWS_REGION + '.amazonaws.com/';

/* ───────────────────────── token storage ───────────────────────── */
function setTokens(t) {
  if (t.IdToken) localStorage.setItem('cto_id_token', t.IdToken);
  if (t.AccessToken) localStorage.setItem('cto_access_token', t.AccessToken);
  if (t.RefreshToken) localStorage.setItem('cto_refresh_token', t.RefreshToken);
}
export function ctoIdToken() { return localStorage.getItem('cto_id_token'); }
function clearTokens() {
  ['cto_id_token', 'cto_access_token', 'cto_refresh_token'].forEach((k) => localStorage.removeItem(k));
}

function decodeJwt(token) {
  try { return JSON.parse(atob(token.split('.')[1])); } catch { return null; }
}

export function ctoTokenValid() {
  const t = ctoIdToken();
  const p = t && decodeJwt(t);
  return !!(p && p.exp * 1000 > Date.now());
}

// The signed-in user, derived from the verified ID token (no /me endpoint needed).
export function ctoCurrentUser() {
  if (!ctoTokenValid()) return null;
  const p = decodeJwt(ctoIdToken());
  if (!p) return null;
  return {
    id: p.sub,
    sub: p.sub,
    email: p.email,
    full_name: p.name || p.email,
    role: p['cognito:groups']?.includes('admin') ? 'admin' : 'user',
  };
}

/* ───────────────────────── Cognito IDP (native) ─────────────────── */
async function cognitoIdp(target, body) {
  const res = await fetch(IDP_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': 'AWSCognitoIdentityProviderService.' + target,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const e = new Error(data.message || data.__type || 'Request failed');
    e.code = data.__type;
    throw e;
  }
  return data;
}

// Create an account. Cognito emails a 6-digit code (call ctoConfirmSignUp next).
export function ctoSignUp(email, password) {
  return cognitoIdp('SignUp', {
    ClientId: COGNITO_CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: [{ Name: 'email', Value: email }],
  });
}

// Confirm a new account with the code from the email.
export function ctoConfirmSignUp(email, code) {
  return cognitoIdp('ConfirmSignUp', {
    ClientId: COGNITO_CLIENT_ID,
    Username: email,
    ConfirmationCode: code,
  });
}

// Re-send the sign-up confirmation code.
export function ctoResendCode(email) {
  return cognitoIdp('ResendConfirmationCode', {
    ClientId: COGNITO_CLIENT_ID,
    Username: email,
  });
}

// Email + password sign-in. Stores tokens on success.
export async function ctoSignIn(email, password) {
  const r = await cognitoIdp('InitiateAuth', {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: COGNITO_CLIENT_ID,
    AuthParameters: { USERNAME: email, PASSWORD: password },
  });
  if (r.AuthenticationResult) setTokens(r.AuthenticationResult);
  return r;
}

// Start a password reset — Cognito emails a code (call ctoConfirmForgotPassword next).
export function ctoForgotPassword(email) {
  return cognitoIdp('ForgotPassword', {
    ClientId: COGNITO_CLIENT_ID,
    Username: email,
  });
}

// Finish a password reset with the emailed code + new password.
export function ctoConfirmForgotPassword(email, code, newPassword) {
  return cognitoIdp('ConfirmForgotPassword', {
    ClientId: COGNITO_CLIENT_ID,
    Username: email,
    ConfirmationCode: code,
    Password: newPassword,
  });
}

/* ───────────────────────── Google (Hosted UI) ───────────────────── */
export function ctoGoogleSignIn() {
  const url = HOSTED_UI_DOMAIN + '/oauth2/authorize'
    + '?identity_provider=Google'
    + '&client_id=' + encodeURIComponent(COGNITO_CLIENT_ID)
    + '&response_type=code'
    + '&scope=' + encodeURIComponent('openid email profile')
    + '&redirect_uri=' + encodeURIComponent(OAUTH_REDIRECT);
  window.location.href = url;
}

// Call once on app load to finish a Hosted-UI / Google redirect (?code=...).
// Returns true if a code was present and exchanged for tokens.
export async function ctoHandleOAuthRedirect() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  if (!code) return false;
  const body = new URLSearchParams();
  body.set('grant_type', 'authorization_code');
  body.set('client_id', COGNITO_CLIENT_ID);
  body.set('code', code);
  body.set('redirect_uri', OAUTH_REDIRECT);
  const res = await fetch(HOSTED_UI_DOMAIN + '/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  const data = await res.json().catch(() => ({}));
  if (data.id_token) {
    setTokens({ IdToken: data.id_token, AccessToken: data.access_token, RefreshToken: data.refresh_token });
    // Strip ?code=…&state=… from the URL so a reload doesn't re-exchange.
    window.history.replaceState({}, document.title, window.location.pathname);
    return true;
  }
  return false;
}

export function ctoSignOut() {
  clearTokens();
  window.location.replace(APP_BASE); // back to this app's home
}

export function friendlyAuthError(err) {
  const c = (err && (err.code || '')) + '';
  const m = (err && err.message) || 'Something went wrong. Please try again.';
  if (c.indexOf('NotAuthorized') !== -1) return 'Incorrect email or password.';
  if (c.indexOf('UsernameExists') !== -1) return 'An account with this email already exists. Try signing in.';
  if (c.indexOf('UserNotConfirmed') !== -1) return 'Please confirm your email first — check your inbox for the code.';
  if (c.indexOf('UserNotFound') !== -1) return 'No account found with that email.';
  if (c.indexOf('InvalidPassword') !== -1) return 'Password must be at least 8 characters with a number and a lowercase letter.';
  if (c.indexOf('CodeMismatch') !== -1) return 'That confirmation code is incorrect.';
  if (c.indexOf('ExpiredCode') !== -1) return 'That code has expired — request a new one.';
  if (c.indexOf('LimitExceeded') !== -1 || c.indexOf('TooManyRequests') !== -1) return 'Too many attempts. Please wait a moment and try again.';
  return m;
}

/* ───────────────────────── API Gateway (Cognito-authed) ─────────── */
// All data/AI routes require the Cognito ID token in the Authorization header.
async function apiFetch(path, { method = 'GET', body } = {}) {
  const token = ctoIdToken();
  const res = await fetch(API_BASE_URL + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: token } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const e = new Error(data.error || data.message || ('Request failed (' + res.status + ')'));
    e.status = res.status;
    throw e;
  }
  return data;
}

// Live job search → job-search Lambda (Remotive + Adzuna + JSearch, Bedrock-ranked).
export async function searchJobs({ query, location, remoteOnly } = {}) {
  const data = await apiFetch('/jobs', { method: 'POST', body: { query, location, remoteOnly } });
  // Normalize to the shape JobCard expects (API returns isRemote).
  return (data.jobs || []).map((j) => ({ ...j, remote: j.isRemote ?? j.remote ?? false }));
}

// Per-user data store (DynamoDB). item = logical key, value = any JSON.
export async function dataGet(item) {
  const q = item ? ('?item=' + encodeURIComponent(item)) : '';
  return apiFetch('/data' + q, { method: 'GET' });
}
export async function dataPost(item, value) {
  return apiFetch('/data', { method: 'POST', body: { item, value } });
}

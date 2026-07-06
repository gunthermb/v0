#!/usr/bin/env bash
# Created by GuntherCloudSolutions
#
# Build the /new payload: the SAME working static site (index/login/dashboard/app/
# app-free + legal pages) reskinned with the base44 look and re-scoped so every
# link/redirect stays under /new. No markup/JS behaviour changes — just the skin
# stylesheet + path rewrites. Output dir is synced to s3://<bucket>/new by deploy.sh.
set -euo pipefail

SKIN_DIR="$(cd "$(dirname "$0")" && pwd)"
# The static site to reskin (index/app/login/...). Passed by deploy.sh as SITE_SRC.
# Falls back to the sibling closetheoffer.com repo so it also works standalone.
SRC="${SITE_SRC:-$(cd "$SKIN_DIR/../../closetheoffer.com" 2>/dev/null && pwd || true)}"
if [ -z "${SRC:-}" ] || [ ! -f "$SRC/index.html" ]; then
  echo "ERROR: static site not found. Set SITE_SRC=/path/to/closetheoffer.com" >&2
  exit 1
fi
OUT="${1:-$SKIN_DIR/.new-dist}"

rm -rf "$OUT"; mkdir -p "$OUT"

# --- copy the site payload (pages + the AWS auth/config + seed data + skin) ---
cp "$SRC"/*.html "$OUT"/
cp "$SRC"/aws-config.js "$OUT"/ 2>/dev/null || true
cp "$SRC"/seed-data.js "$OUT"/ 2>/dev/null || true
cp "$SKIN_DIR/skin.css" "$OUT"/skin.css

# --- 1) inject the skin stylesheet LAST in <head> so it wins the cascade ---
for f in "$OUT"/*.html; do
  perl -0pi -e 's#</head>#  <link rel="stylesheet" href="/new/skin.css">\n</head>#i' "$f"
done

# --- 2) re-scope clean-URL links + JS redirects to /new ---
for f in "$OUT"/*.html; do
  perl -0pi -e 's#href="/(about|blog|changelog|login|privacy|terms|dashboard|freemode)"#href="/new/$1"#g' "$f"
  perl -0pi -e "s#(['\"])/dashboard\\1#\$1/new/dashboard\$1#g" "$f"
  perl -0pi -e "s#(['\"])/login\\1#\$1/new/login\$1#g" "$f"
done

# --- 3) aws-config.js: OAuth callback must return under /new ---
perl -0pi -e "s#window.location.origin \\+ '/dashboard'#window.location.origin + '/new/dashboard'#g" "$OUT/aws-config.js"

# --- 4) recolor the hardcoded brand palette to base44 (purple -> black/olive,
#        dark navy -> warm near-black, purple-tinted whites -> cream). Semantic
#        app colors (green/blue/yellow/red for pipeline stages) are left intact. ---
for f in "$OUT"/*.html "$OUT"/*.css; do
  perl -0pi -e '
    # strong/primary purples -> near-black (base44 primary buttons & text)
    s/#6c5ce7/#1c1c1a/gi; s/#5a4bd1/#000000/gi; s/#5b4bd4/#000000/gi; s/#4c3ce0/#1c1c1a/gi; s/#6d5ce8/#1c1c1a/gi;
    # mid purples -> olive accent (base44 highlight/accent)
    s/#8b5cf6/#6e746a/gi; s/#8b7bf0/#6e746a/gi; s/#a29bfe/#8a8f82/gi; s/#a78bfa/#8a8f82/gi;
    # light purple tints -> warm cream tints
    s/#c4b5fd/#cfd0c4/gi; s/#d9d4ff/#e7e2d6/gi; s/#ede9ff/#eceadf/gi; s/#e9e5ff/#eceadf/gi;
    # dark navy hero/section backgrounds -> warm near-black
    s/#1a1a2e/#1c1c1a/gi; s/#2d2b55/#2b2b26/gi; s/#0f0e1a/#141412/gi; s/#16213e/#1c1c1a/gi;
    # purple-tinted off-whites -> cream
    s/#faf9ff/#f3efe6/gi; s/#f6f7fb/#efeae0/gi; s/#f8f7ff/#efeae0/gi; s/#f5f6f8/#f3efe6/gi;
    # purple glows (rgba of #6c5ce7 = 108,92,231) -> olive glow (110,116,106)
    s/108\s*,\s*92\s*,\s*231/110,116,106/g; s/124\s*,\s*92\s*,\s*246/110,116,106/g;
  ' "$f"
done

echo "Built /new (reskinned static site) -> $OUT"
ls -1 "$OUT" | sed 's/^/  /'

#!/usr/bin/env bash
# Build the base44 "new look" app (AWS-native2 repo) and stage it at <site>/new
# so the normal deploy.sh S3 sync uploads it to s3://<bucket>/new/.
#
# The existing site at the root is untouched; this only (re)creates the /new/ folder.
#
# Usage:
#   tools/build-new-look.sh /path/to/AWS-native2
#   BASE44_APP_DIR=/path/to/AWS-native2 tools/build-new-look.sh
set -euo pipefail

APP_DIR="${1:-${BASE44_APP_DIR:-}}"
if [ -z "$APP_DIR" ]; then
  echo "Usage: $0 <path-to-AWS-native2-repo>" >&2
  exit 1
fi
APP_DIR="$(cd "$APP_DIR" && pwd)"

# closetheoffer.com/ — same directory deploy.sh treats as SITE_DIR (repo root's parent).
SITE_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
DEST="$SITE_DIR/new"

echo "==> Building base44 app at $APP_DIR with base path /new/"
( cd "$APP_DIR" && npm install && VITE_BASE_PATH=/new/ npm run build )

if [ ! -f "$APP_DIR/dist/index.html" ]; then
  echo "Build did not produce $APP_DIR/dist/index.html" >&2
  exit 1
fi

echo "==> Staging build into $DEST"
rm -rf "$DEST"
mkdir -p "$DEST"
cp -R "$APP_DIR/dist/." "$DEST/"

echo "Done. /new is staged. Run aws-native/deploy.sh to upload + invalidate."

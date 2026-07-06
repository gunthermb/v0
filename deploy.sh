#!/usr/bin/env bash
# Created by GuntherCloudSolutions
# Last updated: 2026-07-06
#
# One-shot deploy for the AWS-native CloseTheOffer stack.
# Prereqs: AWS CLI + AWS SAM CLI installed and `aws configure` done.
#          Node.js + npm (to build the AWS-native2 app served at /new).
#          Bedrock model access enabled in the Console (one time).
set -euo pipefail

REGION="${AWS_REGION:-us-east-1}"
APP="closetheoffer"
HERE="$(cd "$(dirname "$0")" && pwd)"
# The static site (index.html, app.html, login.html, aws-config.js, …). Override with
# SITE_DIR=... if it lives elsewhere. Defaults to the sibling closetheoffer.com/ folder.
SITE_DIR="${SITE_DIR:-$(cd "$HERE/../closetheoffer.com" && pwd)}"

# Load deploy-time secrets (Adzuna / JSearch / Google) if present. Gitignored.
if [ -f "$HERE/.env" ]; then
  echo "==> Loading secrets from aws-native/.env"
  set -a; . "$HERE/.env"; set +a
fi

echo "==> 1/4  Deploy backend (Cognito + API + Bedrock + DynamoDB)"
# Optional Google login: export GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET first.
PARAMS="AppName=$APP"
if [ -n "${GOOGLE_CLIENT_ID:-}" ]; then
  PARAMS="$PARAMS GoogleClientId=$GOOGLE_CLIENT_ID GoogleClientSecret=${GOOGLE_CLIENT_SECRET:-}"
fi
# Adzuna app_id is a public identifier (the app_key + JSearch key live in SSM SecureString,
# fetched by the Lambda at runtime — they are NOT passed as stack parameters anymore).
if [ -n "${ADZUNA_APP_ID:-}" ]; then
  PARAMS="$PARAMS AdzunaAppId=$ADZUNA_APP_ID"
fi
sam deploy \
  --region "$REGION" \
  --stack-name "${APP}-backend" \
  --template-file "$HERE/infrastructure/backend.yaml" \
  --capabilities CAPABILITY_IAM \
  --resolve-s3 \
  --no-confirm-changeset \
  --no-fail-on-empty-changeset \
  --parameter-overrides $PARAMS

echo "==> backend outputs (paste these into frontend/aws-config.js):"
aws cloudformation describe-stacks --region "$REGION" --stack-name "${APP}-backend" \
  --query "Stacks[0].Outputs" --output table

echo "==> 2/4  Deploy hosting (S3 + CloudFront + routing function)"
aws cloudformation deploy \
  --region "$REGION" \
  --stack-name "${APP}-hosting" \
  --template-file "$HERE/infrastructure/hosting.yaml" \
  --parameter-overrides AppName="$APP"

BUCKET=$(aws cloudformation describe-stacks --region "$REGION" --stack-name "${APP}-hosting" \
  --query "Stacks[0].Outputs[?OutputKey=='BucketName'].OutputValue" --output text)
DIST=$(aws cloudformation describe-stacks --region "$REGION" --stack-name "${APP}-hosting" \
  --query "Stacks[0].Outputs[?OutputKey=='DistributionId'].OutputValue" --output text)

NEW_BUILD="$HERE/new-skin/build.sh"

echo "==> 3/4  Upload site to s3://$BUCKET (base44 reskin at the root)"
# NOTE: make sure aws-config.js is filled in and copied into the site root first.
# First sync the raw site (brings every file — aws-config.js, seed-data.js, etc.)...
aws s3 sync "$SITE_DIR" "s3://$BUCKET" \
  --exclude ".git/*" --exclude "aws-native/*" --exclude ".idea/*" \
  --exclude "AWS-native2/*" \
  --exclude "*.md" --exclude "deploy.sh" \
  --exclude "*.DS_Store" --exclude ".env" --exclude "*.local.md"
# ...then overlay the base44 reskin on the root pages (reskinned HTML + skin.css +
# hero image). BASE_PREFIX="" keeps all links/redirects root-relative. No behaviour
# change — CSS/asset overlay only. No --delete (leave the raw-synced files in place).
if [ -x "$NEW_BUILD" ]; then
  ROOT_DIST="$HERE/.root-dist"
  BASE_PREFIX="" SITE_SRC="$SITE_DIR" "$NEW_BUILD" "$ROOT_DIST"
  aws s3 sync "$ROOT_DIST" "s3://$BUCKET" --exclude "*.DS_Store"
else
  echo "    (skipped root reskin: $NEW_BUILD not found or not executable)"
fi

echo "==> 4/4  Invalidate CloudFront cache"
aws cloudfront create-invalidation --distribution-id "$DIST" --paths "/*" >/dev/null

echo "Done. Site URL:"
aws cloudformation describe-stacks --region "$REGION" --stack-name "${APP}-hosting" \
  --query "Stacks[0].Outputs[?OutputKey=='SiteURL'].OutputValue" --output text

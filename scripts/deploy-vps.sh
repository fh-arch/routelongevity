#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="${APP_DIR:-/var/www/routelongevity}"
BRANCH="${BRANCH:-main}"
PM2_APP="${PM2_APP:-routelongevity-api}"
HEALTH_URL="${HEALTH_URL:-https://routelongevity.com}"

cd "$APP_DIR"

echo "==> Route Longevity deploy"
echo "    app: $APP_DIR"
echo "    branch: $BRANCH"
echo "    pm2: $PM2_APP"
echo "    health: $HEALTH_URL"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "ERROR: Working tree has local changes. Commit, stash, or inspect them before deploy:"
  git status --short
  exit 1
fi

echo "==> Pulling latest code"
git pull origin "$BRANCH"

echo "==> Installing dependencies"
npm install

echo "==> Type-checking"
npm run lint

echo "==> Building frontend"
npm run build

echo "==> Seeding content and listings"
npm run db:seed-content

echo "==> Restarting API"
pm2 restart "$PM2_APP" --update-env
pm2 save

echo "==> Checking Nginx"
nginx -t
systemctl reload nginx

echo "==> Running production health check"
npm run health -- --url "$HEALTH_URL"

echo "==> Deploy complete"

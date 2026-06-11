# Route Longevity

Route Longevity is a React + Express + PostgreSQL platform for verified longevity listings, maps, partner applications, account access, and AI-assisted route planning.

## Local Development

```bash
npm install
npm run dev
```

Run the API locally:

```bash
npm run api
```

Important environment variables are documented in `.env.example`.

## Data Seeding

Preview seed counts:

```bash
npm run db:seed-content:check
```

Seed blogs, events, and all listing datasets into PostgreSQL:

```bash
npm run db:seed-content
```

## Production Deploy On VPS

From the server:

```bash
cd /var/www/routelongevity
bash scripts/deploy-vps.sh
```

The deploy script:

- Refuses to continue if the server working tree has uncommitted changes
- Pulls `origin/main`
- Runs `npm install`
- Runs TypeScript checks
- Builds the frontend
- Seeds content/listings
- Restarts `routelongevity-api` with PM2
- Tests and reloads Nginx
- Runs the health check

Optional overrides:

```bash
APP_DIR=/var/www/routelongevity \
BRANCH=main \
PM2_APP=routelongevity-api \
HEALTH_URL=https://routelongevity.com \
bash scripts/deploy-vps.sh
```

## Health Check

Run locally or on the VPS:

```bash
npm run health -- --url https://routelongevity.com
```

The health check verifies:

- Frontend HTML loads
- `/api/health` returns the API service response
- `/api/listings` returns a listings array

For basic monitoring, add a cron entry on the VPS:

```bash
*/5 * * * * cd /var/www/routelongevity && npm run health -- --url https://routelongevity.com >> /var/log/routelongevity-health.log 2>&1
```

Useful manual checks:

```bash
pm2 status
pm2 logs routelongevity-api --lines 100
systemctl status nginx
certbot certificates
```

# Route Longevity Website Guide

Route Longevity is a bilingual longevity travel and partner platform. It combines a public discovery website, an interactive map, user accounts, partner applications, admin content tools, and a PostgreSQL-backed API.

## What The Website Does

The website helps visitors discover verified longevity destinations, clinics, retreats, hammams, thermal spas, food producers, and wellness experiences across Turkiye, Europe, and MENA.

The main product idea is:

> Route Longevity is building an agentic AI layer for longevity travel, connecting heritage wellness, medical prevention, curated routes, and verified partner data.

The current website is already structured for that future AI layer because listings, blogs, events, favorites, applications, and user profiles are stored through backend APIs instead of being only static front-end content.

## Main User Areas

### Splash Entrance

The first screen presents the Route Longevity brand and the positioning message:

- Logo-led glass-style entrance.
- "Enter Route Longevity" button.
- Short explanation of the agentic AI direction.
- Brand keywords such as Natural, Holistic, and Premium.

The splash screen is visual only. After entering, users reach the main application.

### Explore

The Explore page is the homepage experience. It highlights:

- Premium partners.
- Curated route ideas.
- Latest blog/research content.
- Calls to action for travelers and partners.
- Category browsing for longevity themes.
- Featured placements and sponsored visibility areas.

Explore is designed for scanning and conversion: a visitor can quickly understand the platform, open the map, read articles, or apply as a partner.

### Map

The Map page is the core discovery tool.

Features:

- Interactive map powered by Leaflet.
- Real destination pins from the project dataset.
- Category filters.
- Country filter.
- Search by place, category, city, country, or specialty.
- Premium partner highlighting.
- Density layer toggle.
- Route focus from experience cards.
- Partner detail cards with website/contact links when available.

The map now supports Turkiye, Europe, and MENA expansion data.

### Experiences

Experiences are curated multi-stop longevity journeys.

Examples of use:

- A visitor selects a route theme.
- The app shows route stops and related partners.
- The selected route can be opened on the map.
- Logged-in users can save experience journeys as favorites.

Experiences are connected to the backend through `/api/experiences`.

### Favorites

Favorites are available after login.

Users can save:

- Listing pins.
- Curated journey routes.

The backend stores favorites per user, so saved items can persist across sessions and devices.

### Blog

The Blog section contains scientific, cultural, and editorial articles about longevity.

Current behavior:

- Blog content is loaded from the backend.
- Supports English and Turkish fields.
- Admins can create or update posts from the admin panel.
- Published posts appear publicly.

Backend endpoint:

```text
GET /api/blog-posts
```

### Events

Events contain workshops, programs, wellness gatherings, and Route Longevity activations.

Current behavior:

- Event content is loaded from the backend.
- Supports English and Turkish fields.
- Admins can create or update events.
- Visitors can register for events.

Backend endpoints:

```text
GET /api/events
POST /api/event-registrations
```

## Account Types

### Traveler Account

Travelers can:

- Sign up.
- Verify email with a 6-digit code.
- Sign in.
- Save favorite listings.
- Save favorite experiences.
- View profile summary.
- Register for events.

Traveler role in the database:

```text
user
```

### Partner Account

Partners can:

- Sign up as a partner.
- Add business name during signup.
- Verify email.
- Access partner/profile area after login.
- Submit listing requests.
- Submit ad applications.
- View application-related profile stats.

Partner role in the database:

```text
partner
```

### Admin Account

Admins can access the management panel after their user role is set to `admin`.

Admins can:

- View platform stats.
- Review contact messages.
- Review listing applications.
- Review partner applications.
- Review ad applications.
- Review event registrations.
- Approve or reject application records.
- Create new map listings.
- Update existing listings.
- Create blog posts.
- Create events.
- View travelers/users.
- Change user roles.

Admin role in the database:

```text
admin
```

## Forms And Applications

The website stores important submissions in PostgreSQL.

Current forms include:

- Contact form.
- "I want to be listed" application.
- Partner application.
- Ad application.
- Event registration.

These records are visible to admins through the admin dashboard.

Email notification support is prepared for admin notifications. Real email delivery should be connected through Resend when production sender/domain settings are finalized.

## Backend Overview

The backend is an Express API running with Node.js.

Main files:

```text
server/index.js
server/auth.js
server/db.js
server/sql/
server/scripts/seed-content.js
```

Main environment variables:

```text
DATABASE_URL
JWT_SECRET
PORT
APP_URL
CORS_ORIGIN
COOKIE_SECURE
DATABASE_SSL
RESEND_API_KEY
AUTH_EMAIL_FROM
ADMIN_NOTIFY_EMAIL
```

The API is usually served through Nginx at:

```text
https://routelongevity.com/api/...
```

Health check:

```text
GET /api/health
```

Expected response:

```json
{"ok":true,"service":"route-longevity-api"}
```

## Key API Routes

Authentication:

```text
POST /api/auth/signup
POST /api/auth/verify-email
POST /api/auth/signin
POST /api/auth/signout
GET  /api/auth/me
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

User profile:

```text
GET /api/profile
```

Public content:

```text
GET /api/listings
GET /api/blog-posts
GET /api/events
GET /api/experiences
```

Favorites:

```text
GET    /api/favorites
PUT    /api/favorites/listings/:id
DELETE /api/favorites/listings/:id
PUT    /api/favorites/journeys/:id
DELETE /api/favorites/journeys/:id
```

Applications and forms:

```text
POST /api/contact-messages
POST /api/listing-applications
POST /api/partner-applications
POST /api/ad-applications
POST /api/event-registrations
```

Admin:

```text
GET   /api/admin/overview
PATCH /api/admin/applications/:type/:id
POST  /api/admin/listings
PATCH /api/admin/listings/:id
POST  /api/admin/blog-posts
POST  /api/admin/events
PATCH /api/admin/users/:id/role
```

Partner listing submission:

```text
POST /api/listings
```

## Database Structure

The database is PostgreSQL.

Important tables include:

```text
users
partner_profiles
password_reset_tokens
email_verification_codes
listing_categories
listings
ad_slots
ad_applications
favorite_listings
favorite_journeys
route_journeys
blog_posts
events
event_registrations
contact_messages
listing_applications
partner_applications
```

The database supports:

- User auth.
- Email verification.
- Password reset.
- Partner profiles.
- Listings and categories.
- Blog posts.
- Events.
- Event registrations.
- Favorites.
- Contact and application queues.
- Ad applications.

## SEO, AEO, And GEO Files

The project includes public search/discovery files:

```text
public/robots.txt
public/sitemap.xml
public/llms.txt
```

Purpose:

- `robots.txt` guides search engine crawlers.
- `sitemap.xml` provides important public URLs.
- `llms.txt` gives AI systems a structured summary of the website.

The frontend also includes meta tags and structured data in `index.html`.

## Frontend Structure

The frontend is React + Vite + TypeScript.

Important areas:

```text
src/App.tsx
src/api.ts
src/data.ts
src/components/
src/context/
src/types.ts
src/index.css
```

Main navigation tabs:

```text
Explore
Map
Experiences
Favorites
Blog
Events
Profile / Partner / Admin
```

The visible profile tab changes depending on account role:

- Traveler sees profile/favorites behavior.
- Partner sees partner tools.
- Admin sees admin dashboard.

## Branding And Design

Current brand direction:

- Logo-centered identity.
- Deep teal and green palette.
- Glassy surfaces.
- Clean wellness/travel interface.
- Premium but practical dashboard UX.

Main color family:

```text
Deep logo teal: #042f2c
Primary logo teal: #086058
Clinical green: #0e655c
Turquoise green: #0e7a70
Soft glass background: #f6fbf9
Warm mint border: #d8ebe6
```

Logo usage:

- Header uses the teal logo.
- Footer uses the white/reverse logo.
- Logos should not be placed inside visible boxes or underlined with decorative lines.

## Deployment Flow

Production is hosted on the Contabo VPS.

Typical deploy commands:

```bash
cd /var/www/routelongevity
git pull
npm install
npm run build
systemctl reload nginx
pm2 restart routelongevity-api
```

Frontend build output:

```text
dist/
```

Backend process:

```text
pm2 process name: routelongevity-api
port: 4000
```

Public domain:

```text
https://routelongevity.com
```

API health check:

```bash
curl https://routelongevity.com/api/health
```

## Current Production Notes

Working:

- Public website.
- HTTPS through Nginx/Certbot.
- Backend API.
- PostgreSQL connection.
- Signup/signin.
- Email verification flow structure.
- Favorites.
- Experiences.
- Listings.
- Blog and event content APIs.
- Contact/application storage.
- Admin dashboard structure.

Important next improvements:

- Finalize Resend sender/domain configuration.
- Send real verification and admin notification emails through Resend.
- Continue replacing any remaining demo/static content with database content.
- Add more admin editing controls where needed.
- Improve bundle splitting if performance becomes a priority.


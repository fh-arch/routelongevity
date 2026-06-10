# Route Longevity Agentic AI Upgrade Task List

Source document: `RouteLongevity_AgentAI_TaskList.docx`

This task list adapts the document into the current Route Longevity codebase. The original plan is strong, but several database examples use integer IDs. Our current app uses:

- `users.id`: `uuid`
- `listings.id`: `uuid`
- `listings.external_id`: public/listing seed identifier such as `p2`
- `route_journeys.id`: text journey ID such as `j1`
- `user_favorite_listings.listing_external_id`: text external listing ID

So all backend and database work below should use UUIDs and existing external IDs correctly.

## Upgrade Goal

Build Route Longevity into an agentic AI route planner:

1. User writes a health/longevity goal.
2. AI agent asks or uses profile context.
3. Backend filters real listings from PostgreSQL.
4. AI returns route suggestions only from verified listings.
5. User can open suggestions on map, save favorites, register, or submit outcomes.
6. Outcome data improves future suggestions.

## Phase 0 - Preparation And Architecture

### Task 0.1 - Confirm AI Provider And Model

Priority: Critical  
Estimate: 0.5 day  
Owner: Backend

Decide production AI provider and model.

Recommended for now:

```text
AI_PROVIDER=openai
AI_MODEL=gpt-4.1-mini or gpt-4o-mini equivalent
AGENT_MAX_TOKENS=800
```

Acceptance:

- `.env.example` includes AI provider variables.
- Server fails gracefully when AI key is missing.
- Local dev can run with a mock agent mode.

### Task 0.2 - Define Agent Data Contract

Priority: Critical  
Estimate: 0.5 day  
Owner: Full stack

Add shared TypeScript types for:

```ts
export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  type: 'text' | 'route_suggestion' | 'loading';
  content: string;
  suggestions?: RouteSuggestion[];
  timestamp: string;
}

export interface RouteSuggestion {
  listingId: string;
  externalId: string | null;
  name: string;
  categoryId: string;
  city: string | null;
  country: string | null;
  reason: string;
  durationDays?: number;
  priceRange?: string;
  rating?: number | null;
}

export interface HealthProfile {
  goals: string[];
  budgetRange: 'economy' | 'premium' | 'luxury';
  travelDays: number;
  preferredRegions: string[];
  biomarkers?: Record<string, unknown>;
}
```

Acceptance:

- Types live in `src/types.ts`.
- Frontend and API payloads use same field names.
- No integer listing assumptions remain.

## Phase 1 - Frontend Agent Experience

### Task 1 - Homepage Agent Search Bar

Priority: Critical  
Estimate: 3-4 days  
Location:

```text
src/components/AgentSearchBar.tsx
src/components/ExploreView.tsx
```

Goal:

Add a premium AI prompt area to the homepage/Explore hero.

Behavior:

- User types a goal.
- Pressing Enter or clicking CTA opens chat.
- Query is passed into the chat as the first user message.
- Loading/typing state appears immediately.

Suggested placeholder rotation:

```text
I have sleep problems, where should I go?
Plan a 7-day longevity route with a EUR 3000 budget.
Find hammam + clinic options near Istanbul.
Create a stress reset route for Turkiye and Greece.
```

CTA copy:

```text
Create My Route
```

Acceptance:

- Works on desktop and mobile.
- Does not break current Explore layout.
- Opens AgentChat with the submitted query.

### Task 2 - AgentChat Panel

Priority: Critical  
Estimate: 4-5 days  
Location:

```text
src/components/AgentChat/AgentChat.tsx
src/context/AgentContext.tsx
src/api.ts
```

Goal:

Create a slide-in or modal chat interface for multi-turn route planning.

Features:

- User and agent bubbles.
- Loading message.
- Route suggestion cards.
- Bottom input for follow-up questions.
- ESC closes panel.
- "New Route" clears session.
- Chat history stored in `sessionStorage`.

API:

```text
POST /api/agent/chat
```

Acceptance:

- Chat can open from homepage query.
- Chat can continue with follow-up messages.
- Loading and error states are clear.
- Session ID is sent with every message.

### Task 3 - Route Suggestion Card

Priority: High  
Estimate: 2-3 days  
Location:

```text
src/components/AgentChat/RouteCard.tsx
src/components/MapContainer.tsx
```

Goal:

Show each AI suggestion as a clean card.

Card content:

- Listing name.
- Category badge.
- City and country.
- Agent reasoning.
- Rating if available.
- Price range if provided.

Actions:

- View on map.
- Save favorite.

Map integration:

- Use current tab system, not React Router.
- Add app state such as `agentHighlightedExternalIds`.
- When "View on map" is clicked, set active tab to `map` and focus the pin.

Acceptance:

- Cards do not require page reload.
- Favorite button uses existing favorites API.
- Suggested map pin gets highlighted.

### Task 4 - Health Wizard

Priority: High  
Estimate: 3-4 days  
Location:

```text
src/components/AgentChat/HealthWizard.tsx
src/context/AgentContext.tsx
```

Goal:

Collect basic user goals before agent planning.

Show when:

- User is logged in.
- No `user_health_profiles` record exists.
- User opens the agent chat.

Steps:

1. Goals: sleep, stress, inflammation, nutrition, general longevity, biohacking.
2. Budget: economy, premium, luxury.
3. Travel duration and preferred regions.

API:

```text
GET  /api/agent/profile
POST /api/agent/profile
```

Acceptance:

- Profile saves to PostgreSQL.
- Wizard can be skipped, but agent explains that suggestions are less personalized.
- After save, first agent suggestion uses profile data.

### Task 5 - Outcome Form

Priority: Medium  
Estimate: 2-3 days  
Location:

```text
src/components/AgentChat/OutcomeForm.tsx
src/components/FavoritesView.tsx
```

Goal:

Collect post-visit feedback to create the data flywheel.

Trigger:

- Favorites page.
- Manual "How was it?" button for saved listings.

Fields:

- Listing.
- Visit date.
- Score 1-10.
- Notes.
- Optional sleep, energy, stress changes.

API:

```text
POST /api/agent/outcomes
```

Acceptance:

- User can submit only for their own account.
- Score validates between 1 and 10.
- User sees thank-you message.

### Task 6 - Agent Context And Session Management

Priority: Critical  
Estimate: 2 days  
Location:

```text
src/context/AgentContext.tsx
```

Responsibilities:

- `messages`
- `sessionId`
- `isLoading`
- `userProfile`
- `suggestions`
- `sendMessage(text)`
- `clearSession()`

Storage:

- `sessionId`: `sessionStorage`
- `messages`: `sessionStorage`
- Profile: API-backed

Acceptance:

- Reload during same tab keeps chat history.
- New browser tab starts clean.
- "New Route" clears messages and creates a new session.

## Phase 2 - Backend Agent API

### Task 7 - Agent API Router

Priority: Critical  
Estimate: 5-7 days  
Location:

```text
server/routes/agent.js
server/agent/index.js
server/index.js
```

Endpoints:

```text
POST /api/agent/chat
GET  /api/agent/profile
POST /api/agent/profile
POST /api/agent/outcomes
```

Chat behavior:

1. Require authenticated user.
2. Validate `message` and `session_id`.
3. Load health profile.
4. Load recent session messages.
5. Filter real listings.
6. Build AI prompt.
7. Call AI provider.
8. Save assistant reply and suggestions.
9. Return normalized JSON.

Acceptance:

- Rate limit: 10 requests/minute per user.
- Timeout: 30 seconds.
- Fallback message when AI fails.
- Suggestions only reference listings that exist in DB.

### Task 8 - Listing Filter Tool

Priority: Critical  
Estimate: 3-4 days  
Location:

```text
server/agent/tools/listingTool.js
```

Goal:

Convert health goals and message keywords into a PostgreSQL listing query.

Category mapping must use current category IDs:

```text
hammams
thermal-spa
mediterranean-diet
longevity-clinics
retreat-nature
traditional-med
local-producers
```

Recommended mapping:

```js
const GOAL_CATEGORY_MAP = {
  sleep: ['retreat-nature', 'thermal-spa', 'hammams'],
  stress: ['retreat-nature', 'hammams', 'thermal-spa'],
  inflammation: ['thermal-spa', 'mediterranean-diet', 'longevity-clinics'],
  nutrition: ['mediterranean-diet', 'local-producers', 'longevity-clinics'],
  biohacking: ['longevity-clinics'],
  general: ['hammams', 'thermal-spa', 'retreat-nature', 'longevity-clinics'],
};
```

Acceptance:

- Query returns only `status = 'approved'`.
- Search supports country, city, and region keywords.
- Premium and outcome scoring influence ranking.
- Limit first response to 5-8 listings.

### Task 9 - Prompt Builder

Priority: High  
Estimate: 2-3 days  
Location:

```text
server/agent/prompts/buildPrompt.js
```

Rules:

- Agent must recommend only DB-provided listings.
- Agent must cite listing IDs/external IDs.
- Agent must explain why each listing matches.
- Agent must answer in the user's language.
- Agent must avoid medical diagnosis.
- Agent must keep output in strict JSON.

Expected AI output:

```json
{
  "text": "Here is a 5-day route focused on sleep and stress reset.",
  "suggestions": [
    {
      "listingId": "uuid",
      "externalId": "p2",
      "reason": "Combines heat therapy with cultural ritual near Istanbul.",
      "durationDays": 2,
      "priceRange": "premium"
    }
  ]
}
```

Acceptance:

- JSON parser rejects invalid suggestions.
- Server filters out hallucinated listing IDs.
- User receives friendly fallback if parsing fails.

### Task 10 - Memory Tool

Priority: High  
Estimate: 3-4 days  
Location:

```text
server/agent/tools/memoryTool.js
```

Memory types:

- Session memory: recent chat messages from `agent_sessions`.
- Longitudinal memory: last 5 outcomes from `user_journey_outcomes`.

Acceptance:

- Agent context includes recent visited places and scores.
- Max 10 messages loaded into context.
- No partner can access individual user memory.

### Task 11 - Health Profile API

Priority: High  
Estimate: 2 days  
Location:

```text
server/routes/agent.js
server/sql/007_agent_ai.sql
```

Endpoints:

```text
GET  /api/agent/profile
POST /api/agent/profile
```

Acceptance:

- Create/update with upsert.
- Uses `user_id uuid`.
- Only logged-in user can access their own profile.
- Validates goals, budget, days, and regions with Zod.

### Task 12 - Outcomes API

Priority: High  
Estimate: 1-2 days  
Location:

```text
server/routes/agent.js
```

Endpoint:

```text
POST /api/agent/outcomes
```

Acceptance:

- Uses `listing_id uuid`.
- Optional `listing_external_id` may be accepted and resolved to UUID.
- Score range 1-10.
- Duplicate same user/listing/date is prevented.

## Phase 3 - Database Migrations

### Task 13 - Migration: user_health_profiles

Priority: Critical  
Estimate: 1 day  
Location:

```text
server/sql/007_agent_ai.sql
```

Schema:

```sql
CREATE TABLE IF NOT EXISTS user_health_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  goals text[] NOT NULL DEFAULT '{}',
  budget_range text NOT NULL DEFAULT 'premium',
  travel_days integer NOT NULL DEFAULT 7,
  preferred_regions text[] NOT NULL DEFAULT '{turkiye}',
  biomarkers jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_health_profiles_user_id_idx
  ON user_health_profiles (user_id);
```

### Task 14 - Migration: ai_route_suggestions

Priority: Critical  
Estimate: 1 day

Schema:

```sql
CREATE TABLE IF NOT EXISTS ai_route_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  suggested_listing_ids uuid[] NOT NULL DEFAULT '{}',
  suggested_external_ids text[] NOT NULL DEFAULT '{}',
  reasoning text,
  user_message text,
  agent_response text,
  status text NOT NULL DEFAULT 'suggested',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ai_route_suggestions_user_id_idx
  ON ai_route_suggestions (user_id);

CREATE INDEX IF NOT EXISTS ai_route_suggestions_session_idx
  ON ai_route_suggestions (session_id);
```

### Task 15 - Migration: user_journey_outcomes

Priority: Critical  
Estimate: 1 day

Schema:

```sql
CREATE TABLE IF NOT EXISTS user_journey_outcomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  visited_at date NOT NULL,
  self_reported_score integer NOT NULL CHECK (self_reported_score BETWEEN 1 AND 10),
  notes text,
  biomarker_change jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, listing_id, visited_at)
);

CREATE OR REPLACE VIEW listing_outcome_scores AS
SELECT
  listing_id,
  AVG(self_reported_score)::numeric(4, 2) AS avg_score,
  COUNT(*)::integer AS visit_count,
  MAX(visited_at) AS last_visited
FROM user_journey_outcomes
GROUP BY listing_id;

CREATE INDEX IF NOT EXISTS user_journey_outcomes_listing_idx
  ON user_journey_outcomes (listing_id);

CREATE INDEX IF NOT EXISTS user_journey_outcomes_user_idx
  ON user_journey_outcomes (user_id);
```

### Task 16 - Migration: agent_sessions

Priority: Medium  
Estimate: 0.5 day

Schema:

```sql
CREATE TABLE IF NOT EXISTS agent_sessions (
  id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_active timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT now() + interval '24 hours'
);

CREATE INDEX IF NOT EXISTS agent_sessions_user_id_idx
  ON agent_sessions (user_id);

CREATE INDEX IF NOT EXISTS agent_sessions_expires_idx
  ON agent_sessions (expires_at);
```

## Phase 4 - Data Flywheel And Dashboards

### Task 17 - Admin AI Analytics

Priority: Medium  
Estimate: 3-4 days  
Location:

```text
src/components/AdminDashboard.tsx
server/index.js or server/routes/admin-agent.js
```

Endpoint:

```text
GET /api/admin/agent-analytics
```

Metrics:

- Total agent sessions.
- Total route suggestions.
- Average outcome score.
- Top suggested listings.
- Highest outcome score listings.
- Goal distribution.

Acceptance:

- Add new Admin tab: AI Analytics.
- Use aggregate data only.
- No private user notes shown in charts.

### Task 18 - Partner Outcome Score

Priority: Medium  
Estimate: 2-3 days  
Location:

```text
src/components/PartnerSaaSView.tsx
server/index.js or server/routes/partner.js
```

Endpoint:

```text
GET /api/partner/listing-outcomes
```

Show:

- Average outcome score.
- Total outcomes.
- 30-day trend.
- Score distribution.

Privacy:

- Partners see aggregate listing data only.
- No names, emails, notes, or biomarkers.

### Task 19 - Outcome-Aware Listing Ranking

Priority: High  
Estimate: 1 day  
Location:

```text
server/agent/tools/listingTool.js
```

Use `listing_outcome_scores` view:

```sql
SELECT
  l.*,
  lc.id AS category_id,
  COALESCE(los.avg_score, 5.0) AS outcome_score,
  COALESCE(los.visit_count, 0) AS visit_count
FROM listings l
JOIN listing_categories lc ON l.category_id = lc.id
LEFT JOIN listing_outcome_scores los ON l.id = los.listing_id
WHERE l.status = 'approved'
  AND lc.id = ANY($1)
ORDER BY
  outcome_score DESC,
  l.is_premium DESC,
  l.created_at DESC
LIMIT 8;
```

Acceptance:

- New listings get neutral score `5.0`.
- Premium still matters but does not fully override outcomes.

### Task 20 - Resend Agent Emails

Priority: Medium  
Estimate: 2 days  
Location:

```text
server/email/agentEmails.js
server/index.js
```

Emails:

1. Route ready email.
2. Post-visit outcome reminder.
3. Admin notification when new outcome is submitted.

Acceptance:

- Uses existing Resend environment variables.
- Does not block API response if email fails.
- Logs email errors without crashing server.

### Task 21 - Map AI Highlight Integration

Priority: High  
Estimate: 2-3 days  
Location:

```text
src/App.tsx
src/components/MapContainer.tsx
src/components/AgentChat/RouteCard.tsx
```

Goal:

AI suggestions should be visually highlighted on the map.

Implementation:

- Store highlighted external IDs in app state.
- MapContainer receives `agentHighlightedExternalIds`.
- Suggested pins get a larger/ringed marker.
- Sidebar shows mini section: "AI Suggestions".

Acceptance:

- Clicking RouteCard opens map and focuses selected listing.
- Multiple suggestions fit map bounds.
- User can clear highlights.

### Task 22 - Tests, Deploy, Monitoring

Priority: Critical  
Estimate: 3-4 days

Testing:

- Unit tests for listing goal-category mapping.
- Integration test for `/api/agent/chat`.
- Validation tests for profile and outcomes.
- Manual UI test for chat, map highlight, favorites, and outcome form.

Deploy:

```bash
cd /var/www/routelongevity
git pull
npm install
npm run build
psql "$DATABASE_URL" -f server/sql/007_agent_ai.sql
pm2 restart routelongevity-api
systemctl reload nginx
```

Monitoring:

```bash
pm2 logs routelongevity-api --lines 100
curl https://routelongevity.com/api/health
```

New environment variables:

```text
AI_PROVIDER=
AI_API_KEY=
AI_MODEL=
AGENT_MAX_TOKENS=800
AGENT_REQUEST_TIMEOUT_MS=30000
```

## Recommended Build Order

### Sprint 1 - Foundation

1. Task 0.1 - Confirm AI provider.
2. Task 0.2 - Define shared types.
3. Task 13-16 - Add database migration.
4. Task 6 - AgentContext.

Why:

The UI and API both need stable contracts before chat work grows.

### Sprint 2 - Frontend MVP

1. Task 1 - AgentSearchBar.
2. Task 2 - AgentChat shell.
3. Task 3 - RouteCard.
4. Mock `/api/agent/chat` response for UI testing.

Why:

This creates the user-facing AI experience before connecting a real model.

### Sprint 3 - Backend MVP

1. Task 7 - Agent API router.
2. Task 8 - Listing filter tool.
3. Task 9 - Prompt builder.
4. Task 11 - Health profile API.

Why:

After this sprint, the AI can answer using real listings.

### Sprint 4 - Personalization And Flywheel

1. Task 4 - HealthWizard.
2. Task 5 - OutcomeForm.
3. Task 10 - Memory tool.
4. Task 12 - Outcomes API.
5. Task 19 - Outcome-aware ranking.

Why:

This makes the system improve over time.

### Sprint 5 - Admin, Partner, Email, Map Polish

1. Task 17 - Admin AI analytics.
2. Task 18 - Partner outcome score.
3. Task 20 - Resend emails.
4. Task 21 - Map AI highlight.
5. Task 22 - Test, deploy, monitor.

## MVP Definition

The first usable Agentic AI MVP is complete when:

- User can type a route request on homepage.
- Chat opens and returns AI suggestions.
- Suggestions are real approved listings from PostgreSQL.
- User can open suggestion on map.
- User can favorite suggestion.
- Logged-in user can save health profile.
- Admin can see agent suggestion counts.

Outcome forms and analytics can follow immediately after MVP.

## Risks And Notes

- The original document's SQL examples used integer IDs; do not use those directly.
- Current map/listing UI often uses `external_id`; backend must return both UUID `id` and `external_id`.
- AI must never recommend non-existent places.
- Medical claims must be careful: position the AI as a route guide, not a doctor.
- Resend sender/domain setup should be finalized before production email features.
- Bundle is already large; AgentChat should be code-split if possible.


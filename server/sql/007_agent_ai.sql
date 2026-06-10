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

CREATE INDEX IF NOT EXISTS ai_route_suggestions_created_idx
  ON ai_route_suggestions (created_at DESC);

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

CREATE INDEX IF NOT EXISTS user_journey_outcomes_listing_idx
  ON user_journey_outcomes (listing_id);

CREATE INDEX IF NOT EXISTS user_journey_outcomes_user_idx
  ON user_journey_outcomes (user_id);

CREATE OR REPLACE VIEW listing_outcome_scores AS
SELECT
  listing_id,
  AVG(self_reported_score)::numeric(4, 2) AS avg_score,
  COUNT(*)::integer AS visit_count,
  MAX(visited_at) AS last_visited
FROM user_journey_outcomes
GROUP BY listing_id;

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS external_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS category_label text,
  ADD COLUMN IF NOT EXISTS rating numeric(3, 2),
  ADD COLUMN IF NOT EXISTS review_count integer,
  ADD COLUMN IF NOT EXISTS license_type text,
  ADD COLUMN IF NOT EXISTS annual_fee integer,
  ADD COLUMN IF NOT EXISTS specialty text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS analytics jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS listings_external_id_idx
  ON listings (external_id);

CREATE TABLE IF NOT EXISTS blog_posts (
  id text PRIMARY KEY,
  title jsonb NOT NULL,
  subtitle jsonb NOT NULL DEFAULT '{}'::jsonb,
  category jsonb NOT NULL DEFAULT '{}'::jsonb,
  read_time jsonb NOT NULL DEFAULT '{}'::jsonb,
  date_label jsonb NOT NULL DEFAULT '{}'::jsonb,
  author jsonb NOT NULL DEFAULT '{}'::jsonb,
  image_url text,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  tags jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'published',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id text PRIMARY KEY,
  title jsonb NOT NULL,
  date_label jsonb NOT NULL DEFAULT '{}'::jsonb,
  time_label jsonb NOT NULL DEFAULT '{}'::jsonb,
  location jsonb NOT NULL DEFAULT '{}'::jsonb,
  city jsonb NOT NULL DEFAULT '{}'::jsonb,
  description jsonb NOT NULL DEFAULT '{}'::jsonb,
  spots_left integer NOT NULL DEFAULT 0,
  tags jsonb NOT NULL DEFAULT '{}'::jsonb,
  image_url text,
  status text NOT NULL DEFAULT 'published',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS event_registrations_event_id_idx
  ON event_registrations (event_id);

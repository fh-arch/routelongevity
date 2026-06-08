CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'partner', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE listing_status AS ENUM ('draft', 'pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE ad_application_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role user_role NOT NULL DEFAULT 'user',
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  email_verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS partner_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  contact_phone text,
  website text,
  approval_status listing_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS listing_categories (
  id text PRIMARY KEY,
  name_en text NOT NULL,
  name_tr text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  category_id text REFERENCES listing_categories(id),
  name text NOT NULL,
  description text,
  city text,
  region text,
  country text NOT NULL DEFAULT 'Türkiye',
  address text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  image_url text,
  website text,
  phone text,
  is_premium boolean NOT NULL DEFAULT false,
  status listing_status NOT NULL DEFAULT 'pending',
  source text NOT NULL DEFAULT 'partner',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ad_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  title text NOT NULL,
  placement text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ad_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  business_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  website text,
  requested_slot text,
  campaign_goal text,
  budget_range text,
  status ad_application_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO listing_categories (id, name_en, name_tr) VALUES
  ('hammams', 'Hammams', 'Hamamlar'),
  ('thermal-spa', 'Thermal & Spa', 'Termal & Spa'),
  ('mediterranean-diet', 'Mediterranean Diet', 'Akdeniz Diyeti'),
  ('longevity-clinics', 'Longevity Clinics', 'Uzun Yaşam Klinikleri'),
  ('retreat-nature', 'Retreat & Nature', 'Retreat & Doğa'),
  ('traditional-med', 'Traditional Medicine', 'Geleneksel Tıp'),
  ('local-producers', 'Local Producers', 'Yerel Üreticiler')
ON CONFLICT (id) DO NOTHING;

INSERT INTO ad_slots (key, title, placement) VALUES
  ('home-featured', 'Homepage featured banner', 'home'),
  ('map-sidebar', 'Map sidebar sponsor', 'map'),
  ('blog-inline', 'Scientific blog inline sponsor', 'blog')
ON CONFLICT (key) DO NOTHING;

CREATE TABLE IF NOT EXISTS route_journeys (
  id text PRIMARY KEY,
  title text NOT NULL,
  subtitle text,
  duration text,
  cities jsonb NOT NULL DEFAULT '[]'::jsonb,
  description text,
  image_url text,
  tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS route_journey_stops (
  journey_id text NOT NULL REFERENCES route_journeys(id) ON DELETE CASCADE,
  listing_external_id text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (journey_id, listing_external_id)
);

CREATE TABLE IF NOT EXISTS user_favorite_listings (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_external_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, listing_external_id)
);

CREATE TABLE IF NOT EXISTS user_favorite_journeys (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  journey_id text NOT NULL REFERENCES route_journeys(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, journey_id)
);

INSERT INTO route_journeys (id, title, subtitle, duration, cities, description, image_url, tags, sort_order)
VALUES
  (
    'j1',
    'The Byzantine & Ottoman Thermal Route',
    'Re-align cells with traditional Roman heat & Ottoman herbal rituals',
    '5 Days',
    '["Istanbul", "Bursa"]'::jsonb,
    'This journey starting from the historical capital on the Bosporus, connecting the majestic Hürrem Sultan Hamamı with the healing mineral hot thermal spring baths of Bursa. Ideal for skin restoration and stress system reset.',
    'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80',
    '["Skin Reborn", "Balneology", "Heat Therapy"]'::jsonb,
    10
  ),
  (
    'j2',
    'Aegean Anti-Inflammatory Fasting Route',
    'Optimize cardiovascular pathways with high-polyphenol diet & DNA testing',
    '7 Days',
    '["Ayvalık", "Izmir", "Bodrum"]'::jsonb,
    'A coastal drive focused entirely on the science-backed Aegean diet. Start with high-polyphenol olive oil sensory training in Ayvalık, wild herbs culinary lessons in Urla, and finish with genetic-informed fasting in Bodrum.',
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
    '["Atherosclerosis prevention", "Epigenetics", "Sirtfoods"]'::jsonb,
    20
  ),
  (
    'j3',
    'Anatolian Highlands Meditation & Apitherapy Route',
    'Saturate lungs and immune system in pristine pine forests',
    '6 Days',
    '["Muğla", "Antalya"]'::jsonb,
    'Connect deep mountain breathing exercises in Fethiye Kabak canyon with raw propolis apitherapy on the shore, and and finish with natural fitotherapist cupping rituals in the pristine high forests of the Toros mountains.',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    '["Immune Fortification", "Vagal Tone", "Forest Bathing"]'::jsonb,
    30
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  duration = EXCLUDED.duration,
  cities = EXCLUDED.cities,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  tags = EXCLUDED.tags,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

INSERT INTO route_journey_stops (journey_id, listing_external_id, sort_order)
VALUES
  ('j1', 'p2', 10),
  ('j1', 'p1', 20),
  ('j2', 'p5', 10),
  ('j2', 'p3', 20),
  ('j2', 'p12', 30),
  ('j3', 'p6', 10),
  ('j3', 'p10', 20),
  ('j3', 'p11', 30)
ON CONFLICT (journey_id, listing_external_id) DO UPDATE SET
  sort_order = EXCLUDED.sort_order;

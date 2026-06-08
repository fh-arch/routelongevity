INSERT INTO listing_categories (id, name_en, name_tr)
VALUES ('traditional-med', 'Traditional Medicine', 'Geleneksel Tıp')
ON CONFLICT (id) DO UPDATE SET
  name_en = EXCLUDED.name_en,
  name_tr = EXCLUDED.name_tr;

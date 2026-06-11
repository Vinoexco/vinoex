-- Baseline source row for manual price observations (script also upserts per retailer).
INSERT INTO sources (slug, name, base_url, enabled, trust_weight, config)
VALUES (
  'manual-observation',
  'Manual observation',
  'https://manual.vinoex.local',
  false,
  0.75,
  '{"ingest_type": "manual"}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- Seed initial market estimates for core wines.
-- Values are rough early-preview LOT estimates (total GBP for the listed format/pack),
-- not per-bottle retail. Safe to re-run: upserts on (wine_id, as_of_date).

INSERT INTO estimated_values (
  wine_id,
  estimated_value_gbp,
  source_count,
  last_updated,
  as_of_date
)
SELECT
  w.id,
  v.estimated_value_gbp,
  v.source_count,
  now(),
  current_date
FROM (
  VALUES
    -- Bordeaux (typical 12x750ml OWC lot estimates for first growths)
    ('chateau-lafite-rothschild-2018-750ml', 6750.00, 6),
    ('chateau-latour-2016-750ml', 8400.00, 7),
    ('chateau-mouton-rothschild-2015-750ml', 7250.00, 5),
    ('chateau-margaux-2017-750ml', 5200.00, 4),
    ('chateau-petrus-2015-750ml-x6', 21500.00, 6),
    ('chateau-dyquem-2015-750ml', 4850.00, 5),

    -- Burgundy (single-bottle lots — standard investment unit for top Burgundy)
    ('domaine-de-la-romanee-conti-romanee-conti-2018-750ml', 22500.00, 8),
    ('domaine-de-la-romanee-conti-la-tache-2019-750ml', 6850.00, 7),
    ('domaine-leroy-musigny-2017-750ml', 10400.00, 6),
    ('henri-jayer-cros-parantoux-1990-750ml', 17500.00, 3),

    -- Champagne (6x750ml case lots where that is the typical trade unit)
    ('dom-perignon-2013-750ml', 1425.00, 8),
    ('krug-clos-du-mesnil-2004-750ml', 875.00, 4),

    -- Italy
    ('tenuta-san-guido-sassicaia-2018-750ml', 2950.00, 6),
    ('masseto-2017-750ml', 825.00, 5),
    ('giacomo-conterno-monfortino-2016-750ml', 540.00, 4),

    -- California
    ('opus-one-2019-750ml', 3180.00, 7),
    ('screaming-eagle-2018-750ml', 4350.00, 3),
    ('harlan-estate-2017-750ml', 795.00, 5),

    -- Spirits (single-bottle lots)
    ('macallan-25-year-old-sherry-oak-700ml', 2250.00, 6),
    ('pappy-van-winkle-15-year-750ml', 1075.00, 2)
) AS v (slug, estimated_value_gbp, source_count)
JOIN wines w ON w.slug = v.slug
ON CONFLICT (wine_id, as_of_date) DO UPDATE SET
  estimated_value_gbp = EXCLUDED.estimated_value_gbp,
  source_count = EXCLUDED.source_count,
  last_updated = EXCLUDED.last_updated;

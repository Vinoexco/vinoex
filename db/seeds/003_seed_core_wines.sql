-- Seed investment-grade wines for market dashboard and scraper matching.
-- Safe to re-run: existing slugs are skipped; classification is backfilled below.

INSERT INTO wines (
  slug,
  canonical_producer,
  vintage,
  format_ml,
  pack_size,
  format_label,
  region,
  country,
  category,
  asset_type
)
VALUES
  -- Bordeaux
  ('chateau-lafite-rothschild-2018-750ml', 'Château Lafite Rothschild', 2018, 750, 1, '750ml', 'Bordeaux', 'France', 'Bordeaux', 'Wine'),
  ('chateau-latour-2016-750ml', 'Château Latour', 2016, 750, 1, '750ml', 'Bordeaux', 'France', 'Bordeaux', 'Wine'),
  ('chateau-mouton-rothschild-2015-750ml', 'Château Mouton Rothschild', 2015, 750, 1, '750ml', 'Bordeaux', 'France', 'Bordeaux', 'Wine'),
  ('chateau-margaux-2017-750ml', 'Château Margaux', 2017, 750, 1, '750ml', 'Bordeaux', 'France', 'Bordeaux', 'Wine'),
  ('chateau-haut-brion-2014-750ml', 'Château Haut-Brion', 2014, 750, 1, '750ml', 'Bordeaux', 'France', 'Bordeaux', 'Wine'),
  ('chateau-petrus-2018-750ml', 'Château Pétrus', 2018, 750, 1, '750ml', 'Bordeaux', 'France', 'Bordeaux', 'Wine'),
  ('chateau-cheval-blanc-2019-750ml', 'Château Cheval Blanc', 2019, 750, 1, '750ml', 'Bordeaux', 'France', 'Bordeaux', 'Wine'),
  ('chateau-dyquem-2015-750ml', 'Château d''Yquem', 2015, 750, 1, '750ml', 'Bordeaux', 'France', 'Bordeaux', 'Wine'),
  ('chateau-palmer-2016-750ml', 'Château Palmer', 2016, 750, 1, '750ml', 'Bordeaux', 'France', 'Bordeaux', 'Wine'),
  ('chateau-leoville-las-cases-2018-750ml', 'Château Léoville Las Cases', 2018, 750, 1, '750ml', 'Bordeaux', 'France', 'Bordeaux', 'Wine'),
  ('chateau-lafite-rothschild-2010-1500ml', 'Château Lafite Rothschild', 2010, 1500, 1, 'Magnum 1.5L', 'Bordeaux', 'France', 'Bordeaux', 'Wine'),

  -- Burgundy
  ('domaine-de-la-romanee-conti-la-tache-2019-750ml', 'Domaine de la Romanée-Conti', 2019, 750, 1, '750ml La Tâche', 'Burgundy', 'France', 'Burgundy', 'Wine'),
  ('domaine-de-la-romanee-conti-romanee-conti-2018-750ml', 'Domaine de la Romanée-Conti', 2018, 750, 1, '750ml Romanée-Conti', 'Burgundy', 'France', 'Burgundy', 'Wine'),
  ('domaine-leroy-musigny-2017-750ml', 'Domaine Leroy', 2017, 750, 1, '750ml Musigny', 'Burgundy', 'France', 'Burgundy', 'Wine'),
  ('henri-jayer-cros-parantoux-1990-750ml', 'Henri Jayer', 1990, 750, 1, '750ml Cros-Parantoux', 'Burgundy', 'France', 'Burgundy', 'Wine'),
  ('domaine-armand-rousseau-chambertin-2018-750ml', 'Domaine Armand Rousseau', 2018, 750, 1, '750ml Chambertin', 'Burgundy', 'France', 'Burgundy', 'Wine'),
  ('domaine-georges-roumier-musigny-2019-750ml', 'Domaine Georges Roumier', 2019, 750, 1, '750ml Musigny', 'Burgundy', 'France', 'Burgundy', 'Wine'),
  ('domaine-leflaive-montrachet-2020-750ml', 'Domaine Leflaive', 2020, 750, 1, '750ml Montrachet', 'Burgundy', 'France', 'Burgundy', 'Wine'),
  ('bouchard-pere-et-fils-montrachet-2019-750ml', 'Bouchard Père & Fils', 2019, 750, 1, '750ml Montrachet', 'Burgundy', 'France', 'Burgundy', 'Wine'),
  ('domaine-dugat-py-charmes-chambertin-2018-750ml', 'Domaine Dugat-Py', 2018, 750, 1, '750ml Charmes-Chambertin', 'Burgundy', 'France', 'Burgundy', 'Wine'),

  -- Champagne
  ('dom-perignon-2013-750ml', 'Dom Pérignon', 2013, 750, 1, '750ml', 'Champagne', 'France', 'Champagne', 'Wine'),
  ('krug-grande-cuvee-nv-750ml', 'Krug', 0, 750, 1, '750ml Grande Cuvée NV', 'Champagne', 'France', 'Champagne', 'Wine'),
  ('louis-roederer-cristal-2008-750ml', 'Louis Roederer', 2008, 750, 1, '750ml Cristal', 'Champagne', 'France', 'Champagne', 'Wine'),
  ('salon-blanc-de-blancs-2012-750ml', 'Salon', 2012, 750, 1, '750ml Blanc de Blancs', 'Champagne', 'France', 'Champagne', 'Wine'),
  ('bollinger-rd-2004-750ml', 'Bollinger', 2004, 750, 1, '750ml RD', 'Champagne', 'France', 'Champagne', 'Wine'),
  ('pol-roger-sir-winston-churchill-2015-750ml', 'Pol Roger', 2015, 750, 1, '750ml Sir Winston Churchill', 'Champagne', 'France', 'Champagne', 'Wine'),
  ('jacquesson-cuvee-745-nv-750ml', 'Jacquesson', 0, 750, 1, '750ml Cuvée 745 NV', 'Champagne', 'France', 'Champagne', 'Wine'),
  ('krug-clos-du-mesnil-2004-750ml', 'Krug', 2004, 750, 1, '750ml Clos du Mesnil', 'Champagne', 'France', 'Champagne', 'Wine'),

  -- Italy
  ('giacomo-conterno-monfortino-2016-750ml', 'Giacomo Conterno', 2016, 750, 1, '750ml Monfortino', 'Italy', 'Italy', 'Italy', 'Wine'),
  ('gaja-barbaresco-sori-san-lorenzo-2019-750ml', 'Gaja', 2019, 750, 1, '750ml Barbaresco Sorì San Lorenzo', 'Italy', 'Italy', 'Italy', 'Wine'),
  ('tenuta-san-guido-sassicaia-2018-750ml', 'Tenuta San Guido', 2018, 750, 1, '750ml Sassicaia', 'Italy', 'Italy', 'Italy', 'Wine'),
  ('biondi-santi-brunello-riserva-2015-750ml', 'Biondi-Santi', 2015, 750, 1, '750ml Brunello Riserva', 'Italy', 'Italy', 'Italy', 'Wine'),
  ('antinori-tignanello-2019-750ml', 'Antinori', 2019, 750, 1, '750ml Tignanello', 'Italy', 'Italy', 'Italy', 'Wine'),
  ('ornellaia-2018-750ml', 'Ornellaia', 2018, 750, 1, '750ml', 'Italy', 'Italy', 'Italy', 'Wine'),
  ('giuseppe-quintarelli-amarone-2011-750ml', 'Giuseppe Quintarelli', 2011, 750, 1, '750ml Amarone', 'Italy', 'Italy', 'Italy', 'Wine'),
  ('masseto-2017-750ml', 'Masseto', 2017, 750, 1, '750ml', 'Italy', 'Italy', 'Italy', 'Wine'),
  ('giuseppe-mascarello-monprivato-2019-750ml', 'Giuseppe Mascarello', 2019, 750, 1, '750ml Monprivato', 'Italy', 'Italy', 'Italy', 'Wine'),

  -- California
  ('opus-one-2019-750ml', 'Opus One', 2019, 750, 1, '750ml', 'California', 'USA', 'California', 'Wine'),
  ('screaming-eagle-2018-750ml', 'Screaming Eagle', 2018, 750, 1, '750ml', 'California', 'USA', 'California', 'Wine'),
  ('harlan-estate-2017-750ml', 'Harlan Estate', 2017, 750, 1, '750ml', 'California', 'USA', 'California', 'Wine'),
  ('dominus-estate-2018-750ml', 'Dominus Estate', 2018, 750, 1, '750ml', 'California', 'USA', 'California', 'Wine'),
  ('ridge-monte-bello-2019-750ml', 'Ridge Vineyards', 2019, 750, 1, '750ml Monte Bello', 'California', 'USA', 'California', 'Wine'),
  ('stags-leap-wine-cellars-cask-23-2016-750ml', 'Stag''s Leap Wine Cellars', 2016, 750, 1, '750ml Cask 23', 'California', 'USA', 'California', 'Wine'),
  ('heitz-cellar-martha-s-vineyard-2017-750ml', 'Heitz Cellar', 2017, 750, 1, '750ml Martha''s Vineyard', 'California', 'USA', 'California', 'Wine'),
  ('colgin-ix-estate-2018-750ml', 'Colgin Cellars', 2018, 750, 1, '750ml IX Estate', 'California', 'USA', 'California', 'Wine'),

  -- Spirits
  ('macallan-25-year-old-sherry-oak-700ml', 'The Macallan', 0, 700, 1, '700ml 25 Year Old Sherry Oak', 'Spirits', 'Scotland', 'Spirits', 'Spirit'),
  ('macallan-18-year-old-sherry-oak-700ml', 'The Macallan', 0, 700, 1, '700ml 18 Year Old Sherry Oak', 'Spirits', 'Scotland', 'Spirits', 'Spirit'),
  ('hibiki-30-year-old-700ml', 'Suntory', 0, 700, 1, '700ml Hibiki 30 Year Old', 'Spirits', 'Japan', 'Spirits', 'Spirit'),
  ('yamazaki-18-year-old-700ml', 'Suntory', 0, 700, 1, '700ml Yamazaki 18 Year Old', 'Spirits', 'Japan', 'Spirits', 'Spirit'),
  ('pappy-van-winkle-15-year-750ml', 'Old Rip Van Winkle', 0, 750, 1, '750ml 15 Year', 'Spirits', 'USA', 'Spirits', 'Spirit'),
  ('hennessy-paradis-700ml', 'Hennessy', 0, 700, 1, '700ml Paradis', 'Spirits', 'France', 'Spirits', 'Spirit'),
  ('remy-martin-louis-xiii-700ml', 'Rémy Martin', 0, 700, 1, '700ml Louis XIII', 'Spirits', 'France', 'Spirits', 'Spirit'),
  ('glenfiddich-50-year-old-700ml', 'Glenfiddich', 0, 700, 1, '700ml 50 Year Old', 'Spirits', 'Scotland', 'Spirits', 'Spirit'),

  -- Mixed formats (cases)
  ('chateau-petrus-2015-750ml-x6', 'Château Pétrus', 2015, 750, 6, '750ml x6', 'Bordeaux', 'France', 'Bordeaux', 'Wine'),
  ('domaine-de-la-romanee-conti-romanee-conti-2015-750ml-x12', 'Domaine de la Romanée-Conti', 2015, 750, 12, '750ml x12 Romanée-Conti', 'Burgundy', 'France', 'Burgundy', 'Wine')

ON CONFLICT (slug) DO NOTHING;

-- Backfill classification on rows inserted before this seed was updated.
UPDATE wines SET region = 'Bordeaux', country = 'France', category = 'Bordeaux', asset_type = 'Wine'
WHERE category IS NULL AND slug IN (
  'chateau-lafite-rothschild-2018-750ml',
  'chateau-latour-2016-750ml',
  'chateau-mouton-rothschild-2015-750ml',
  'chateau-margaux-2017-750ml',
  'chateau-haut-brion-2014-750ml',
  'chateau-petrus-2018-750ml',
  'chateau-cheval-blanc-2019-750ml',
  'chateau-dyquem-2015-750ml',
  'chateau-palmer-2016-750ml',
  'chateau-leoville-las-cases-2018-750ml',
  'chateau-lafite-rothschild-2010-1500ml',
  'chateau-petrus-2015-750ml-x6'
);

UPDATE wines SET region = 'Burgundy', country = 'France', category = 'Burgundy', asset_type = 'Wine'
WHERE category IS NULL AND slug IN (
  'domaine-de-la-romanee-conti-la-tache-2019-750ml',
  'domaine-de-la-romanee-conti-romanee-conti-2018-750ml',
  'domaine-leroy-musigny-2017-750ml',
  'henri-jayer-cros-parantoux-1990-750ml',
  'domaine-armand-rousseau-chambertin-2018-750ml',
  'domaine-georges-roumier-musigny-2019-750ml',
  'domaine-leflaive-montrachet-2020-750ml',
  'bouchard-pere-et-fils-montrachet-2019-750ml',
  'domaine-dugat-py-charmes-chambertin-2018-750ml',
  'domaine-de-la-romanee-conti-romanee-conti-2015-750ml-x12'
);

UPDATE wines SET region = 'Champagne', country = 'France', category = 'Champagne', asset_type = 'Wine'
WHERE category IS NULL AND slug IN (
  'dom-perignon-2013-750ml',
  'krug-grande-cuvee-nv-750ml',
  'louis-roederer-cristal-2008-750ml',
  'salon-blanc-de-blancs-2012-750ml',
  'bollinger-rd-2004-750ml',
  'pol-roger-sir-winston-churchill-2015-750ml',
  'jacquesson-cuvee-745-nv-750ml',
  'krug-clos-du-mesnil-2004-750ml'
);

UPDATE wines SET region = 'Italy', country = 'Italy', category = 'Italy', asset_type = 'Wine'
WHERE category IS NULL AND slug IN (
  'giacomo-conterno-monfortino-2016-750ml',
  'gaja-barbaresco-sori-san-lorenzo-2019-750ml',
  'tenuta-san-guido-sassicaia-2018-750ml',
  'biondi-santi-brunello-riserva-2015-750ml',
  'antinori-tignanello-2019-750ml',
  'ornellaia-2018-750ml',
  'giuseppe-quintarelli-amarone-2011-750ml',
  'masseto-2017-750ml',
  'giuseppe-mascarello-monprivato-2019-750ml'
);

UPDATE wines SET region = 'California', country = 'USA', category = 'California', asset_type = 'Wine'
WHERE category IS NULL AND slug IN (
  'opus-one-2019-750ml',
  'screaming-eagle-2018-750ml',
  'harlan-estate-2017-750ml',
  'dominus-estate-2018-750ml',
  'ridge-monte-bello-2019-750ml',
  'stags-leap-wine-cellars-cask-23-2016-750ml',
  'heitz-cellar-martha-s-vineyard-2017-750ml',
  'colgin-ix-estate-2018-750ml'
);

UPDATE wines SET region = 'Spirits', country = 'Scotland', category = 'Spirits', asset_type = 'Spirit'
WHERE category IS NULL AND slug IN (
  'macallan-25-year-old-sherry-oak-700ml',
  'macallan-18-year-old-sherry-oak-700ml',
  'glenfiddich-50-year-old-700ml'
);

UPDATE wines SET region = 'Spirits', country = 'Japan', category = 'Spirits', asset_type = 'Spirit'
WHERE category IS NULL AND slug IN (
  'hibiki-30-year-old-700ml',
  'yamazaki-18-year-old-700ml'
);

UPDATE wines SET region = 'Spirits', country = 'USA', category = 'Spirits', asset_type = 'Spirit'
WHERE category IS NULL AND slug = 'pappy-van-winkle-15-year-750ml';

UPDATE wines SET region = 'Spirits', country = 'France', category = 'Spirits', asset_type = 'Spirit'
WHERE category IS NULL AND slug IN (
  'hennessy-paradis-700ml',
  'remy-martin-louis-xiii-700ml'
);

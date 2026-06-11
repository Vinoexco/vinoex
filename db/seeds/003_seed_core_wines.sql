-- Seed investment-grade wines for market dashboard and scraper matching.
-- Safe to re-run: existing slugs are skipped.

INSERT INTO wines (slug, canonical_producer, vintage, format_ml, pack_size, format_label)
VALUES
  -- Bordeaux
  ('chateau-lafite-rothschild-2018-750ml', 'Château Lafite Rothschild', 2018, 750, 1, '750ml'),
  ('chateau-latour-2016-750ml', 'Château Latour', 2016, 750, 1, '750ml'),
  ('chateau-mouton-rothschild-2015-750ml', 'Château Mouton Rothschild', 2015, 750, 1, '750ml'),
  ('chateau-margaux-2017-750ml', 'Château Margaux', 2017, 750, 1, '750ml'),
  ('chateau-haut-brion-2014-750ml', 'Château Haut-Brion', 2014, 750, 1, '750ml'),
  ('chateau-petrus-2018-750ml', 'Château Pétrus', 2018, 750, 1, '750ml'),
  ('chateau-cheval-blanc-2019-750ml', 'Château Cheval Blanc', 2019, 750, 1, '750ml'),
  ('chateau-dyquem-2015-750ml', 'Château d''Yquem', 2015, 750, 1, '750ml'),
  ('chateau-palmer-2016-750ml', 'Château Palmer', 2016, 750, 1, '750ml'),
  ('chateau-leoville-las-cases-2018-750ml', 'Château Léoville Las Cases', 2018, 750, 1, '750ml'),
  ('chateau-lafite-rothschild-2010-1500ml', 'Château Lafite Rothschild', 2010, 1500, 1, 'Magnum 1.5L'),

  -- Burgundy
  ('domaine-de-la-romanee-conti-la-tache-2019-750ml', 'Domaine de la Romanée-Conti', 2019, 750, 1, '750ml La Tâche'),
  ('domaine-de-la-romanee-conti-romanee-conti-2018-750ml', 'Domaine de la Romanée-Conti', 2018, 750, 1, '750ml Romanée-Conti'),
  ('domaine-leroy-musigny-2017-750ml', 'Domaine Leroy', 2017, 750, 1, '750ml Musigny'),
  ('henri-jayer-cros-parantoux-1990-750ml', 'Henri Jayer', 1990, 750, 1, '750ml Cros-Parantoux'),
  ('domaine-armand-rousseau-chambertin-2018-750ml', 'Domaine Armand Rousseau', 2018, 750, 1, '750ml Chambertin'),
  ('domaine-georges-roumier-musigny-2019-750ml', 'Domaine Georges Roumier', 2019, 750, 1, '750ml Musigny'),
  ('domaine-leflaive-montrachet-2020-750ml', 'Domaine Leflaive', 2020, 750, 1, '750ml Montrachet'),
  ('bouchard-pere-et-fils-montrachet-2019-750ml', 'Bouchard Père & Fils', 2019, 750, 1, '750ml Montrachet'),
  ('domaine-dugat-py-charmes-chambertin-2018-750ml', 'Domaine Dugat-Py', 2018, 750, 1, '750ml Charmes-Chambertin'),

  -- Champagne
  ('dom-perignon-2013-750ml', 'Dom Pérignon', 2013, 750, 1, '750ml'),
  ('krug-grande-cuvee-nv-750ml', 'Krug', 0, 750, 1, '750ml Grande Cuvée NV'),
  ('louis-roederer-cristal-2008-750ml', 'Louis Roederer', 2008, 750, 1, '750ml Cristal'),
  ('salon-blanc-de-blancs-2012-750ml', 'Salon', 2012, 750, 1, '750ml Blanc de Blancs'),
  ('bollinger-rd-2004-750ml', 'Bollinger', 2004, 750, 1, '750ml RD'),
  ('pol-roger-sir-winston-churchill-2015-750ml', 'Pol Roger', 2015, 750, 1, '750ml Sir Winston Churchill'),
  ('jacquesson-cuvee-745-nv-750ml', 'Jacquesson', 0, 750, 1, '750ml Cuvée 745 NV'),
  ('krug-clos-du-mesnil-2004-750ml', 'Krug', 2004, 750, 1, '750ml Clos du Mesnil'),

  -- Italy
  ('giacomo-conterno-monfortino-2016-750ml', 'Giacomo Conterno', 2016, 750, 1, '750ml Monfortino'),
  ('gaja-barbaresco-sori-san-lorenzo-2019-750ml', 'Gaja', 2019, 750, 1, '750ml Barbaresco Sorì San Lorenzo'),
  ('tenuta-san-guido-sassicaia-2018-750ml', 'Tenuta San Guido', 2018, 750, 1, '750ml Sassicaia'),
  ('biondi-santi-brunello-riserva-2015-750ml', 'Biondi-Santi', 2015, 750, 1, '750ml Brunello Riserva'),
  ('antinori-tignanello-2019-750ml', 'Antinori', 2019, 750, 1, '750ml Tignanello'),
  ('ornellaia-2018-750ml', 'Ornellaia', 2018, 750, 1, '750ml'),
  ('giuseppe-quintarelli-amarone-2011-750ml', 'Giuseppe Quintarelli', 2011, 750, 1, '750ml Amarone'),
  ('masseto-2017-750ml', 'Masseto', 2017, 750, 1, '750ml'),
  ('giuseppe-mascarello-monprivato-2019-750ml', 'Giuseppe Mascarello', 2019, 750, 1, '750ml Monprivato'),

  -- California
  ('opus-one-2019-750ml', 'Opus One', 2019, 750, 1, '750ml'),
  ('screaming-eagle-2018-750ml', 'Screaming Eagle', 2018, 750, 1, '750ml'),
  ('harlan-estate-2017-750ml', 'Harlan Estate', 2017, 750, 1, '750ml'),
  ('dominus-estate-2018-750ml', 'Dominus Estate', 2018, 750, 1, '750ml'),
  ('ridge-monte-bello-2019-750ml', 'Ridge Vineyards', 2019, 750, 1, '750ml Monte Bello'),
  ('stags-leap-wine-cellars-cask-23-2016-750ml', 'Stag''s Leap Wine Cellars', 2016, 750, 1, '750ml Cask 23'),
  ('heitz-cellar-martha-s-vineyard-2017-750ml', 'Heitz Cellar', 2017, 750, 1, '750ml Martha''s Vineyard'),
  ('colgin-ix-estate-2018-750ml', 'Colgin Cellars', 2018, 750, 1, '750ml IX Estate'),

  -- Spirits
  ('macallan-25-year-old-sherry-oak-700ml', 'The Macallan', 0, 700, 1, '700ml 25 Year Old Sherry Oak'),
  ('macallan-18-year-old-sherry-oak-700ml', 'The Macallan', 0, 700, 1, '700ml 18 Year Old Sherry Oak'),
  ('hibiki-30-year-old-700ml', 'Suntory', 0, 700, 1, '700ml Hibiki 30 Year Old'),
  ('yamazaki-18-year-old-700ml', 'Suntory', 0, 700, 1, '700ml Yamazaki 18 Year Old'),
  ('pappy-van-winkle-15-year-750ml', 'Old Rip Van Winkle', 0, 750, 1, '750ml 15 Year'),
  ('hennessy-paradis-700ml', 'Hennessy', 0, 700, 1, '700ml Paradis'),
  ('remy-martin-louis-xiii-700ml', 'Rémy Martin', 0, 700, 1, '700ml Louis XIII'),
  ('glenfiddich-50-year-old-700ml', 'Glenfiddich', 0, 700, 1, '700ml 50 Year Old'),

  -- Mixed formats (cases)
  ('chateau-petrus-2015-750ml-x6', 'Château Pétrus', 2015, 750, 6, '750ml x6'),
  ('domaine-de-la-romanee-conti-romanee-conti-2015-750ml-x12', 'Domaine de la Romanée-Conti', 2015, 750, 12, '750ml x12 Romanée-Conti')

ON CONFLICT (slug) DO NOTHING;

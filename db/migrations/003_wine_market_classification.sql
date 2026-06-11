-- Market classification columns for wines catalogue filtering.

ALTER TABLE wines
  ADD COLUMN region     TEXT,
  ADD COLUMN country    TEXT,
  ADD COLUMN category   TEXT,
  ADD COLUMN asset_type TEXT;

CREATE INDEX idx_wines_category ON wines (category);
CREATE INDEX idx_wines_region ON wines (region);

-- Backfill core seed catalogue (safe if rows are absent).
UPDATE wines SET region = 'Bordeaux', country = 'France', category = 'Bordeaux', asset_type = 'Wine'
WHERE slug IN (
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
WHERE slug IN (
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
WHERE slug IN (
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
WHERE slug IN (
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
WHERE slug IN (
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
WHERE slug IN (
  'macallan-25-year-old-sherry-oak-700ml',
  'macallan-18-year-old-sherry-oak-700ml',
  'glenfiddich-50-year-old-700ml'
);

UPDATE wines SET region = 'Spirits', country = 'Japan', category = 'Spirits', asset_type = 'Spirit'
WHERE slug IN (
  'hibiki-30-year-old-700ml',
  'yamazaki-18-year-old-700ml'
);

UPDATE wines SET region = 'Spirits', country = 'USA', category = 'Spirits', asset_type = 'Spirit'
WHERE slug = 'pappy-van-winkle-15-year-750ml';

UPDATE wines SET region = 'Spirits', country = 'France', category = 'Spirits', asset_type = 'Spirit'
WHERE slug IN (
  'hennessy-paradis-700ml',
  'remy-martin-louis-xiii-700ml'
);

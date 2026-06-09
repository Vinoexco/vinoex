-- Vinoex scraper core schema (PostgreSQL / Supabase compatible)
-- Phase A: foundation tables only

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- wines
-- ---------------------------------------------------------------------------
CREATE TABLE wines (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT NOT NULL UNIQUE,
  canonical_producer TEXT NOT NULL,
  vintage         SMALLINT NOT NULL DEFAULT 0,
  format_ml       INTEGER NOT NULL,
  pack_size       INTEGER NOT NULL DEFAULT 1,
  format_label    TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- sources
-- ---------------------------------------------------------------------------
CREATE TABLE sources (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  base_url        TEXT NOT NULL,
  config          JSONB NOT NULL DEFAULT '{}',
  enabled         BOOLEAN NOT NULL DEFAULT false,
  trust_weight    NUMERIC(3, 2) NOT NULL DEFAULT 0.80
    CHECK (trust_weight >= 0 AND trust_weight <= 1),
  permission_ref  TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- fx_rates_daily (rates expressed as: 1 GBP = rate units of quote currency)
-- ---------------------------------------------------------------------------
CREATE TABLE fx_rates_daily (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rate_date       DATE NOT NULL,
  quote           CHAR(3) NOT NULL,
  rate            NUMERIC(12, 6) NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (rate_date, quote)
);

-- ---------------------------------------------------------------------------
-- scrape_runs
-- ---------------------------------------------------------------------------
CREATE TABLE scrape_runs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id       UUID NOT NULL REFERENCES sources (id) ON DELETE CASCADE,
  scheduled_for   DATE NOT NULL,
  status          TEXT NOT NULL DEFAULT 'running'
    CHECK (status IN ('running', 'success', 'partial', 'failed', 'skipped')),
  started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at     TIMESTAMPTZ,
  pages_attempted INTEGER NOT NULL DEFAULT 0,
  pages_succeeded INTEGER NOT NULL DEFAULT 0,
  error_count     INTEGER NOT NULL DEFAULT 0,
  UNIQUE (source_id, scheduled_for)
);

-- ---------------------------------------------------------------------------
-- html_snapshots
-- ---------------------------------------------------------------------------
CREATE TABLE html_snapshots (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scrape_run_id   UUID NOT NULL REFERENCES scrape_runs (id) ON DELETE CASCADE,
  source_id       UUID NOT NULL REFERENCES sources (id) ON DELETE CASCADE,
  source_url      TEXT NOT NULL,
  captured_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  snapshot_date   DATE NOT NULL,
  storage_path    TEXT NOT NULL,
  content_hash    TEXT NOT NULL,
  http_status     INTEGER,
  content_length  INTEGER,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_html_snapshots_source_date
  ON html_snapshots (source_id, snapshot_date DESC);

-- ---------------------------------------------------------------------------
-- scrape_extractions
-- ---------------------------------------------------------------------------
CREATE TABLE scrape_extractions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_id       UUID NOT NULL REFERENCES html_snapshots (id) ON DELETE CASCADE,
  source_id         UUID NOT NULL REFERENCES sources (id) ON DELETE CASCADE,
  wine_id           UUID REFERENCES wines (id) ON DELETE SET NULL,
  wine_name         TEXT,
  producer          TEXT,
  vintage           SMALLINT,
  format_raw        TEXT,
  format_ml         INTEGER,
  pack_size         INTEGER,
  price_original    NUMERIC(12, 2),
  currency_original CHAR(3),
  price_gbp         NUMERIC(12, 2),
  fx_rate           NUMERIC(10, 6),
  fx_date           DATE,
  source_name       TEXT NOT NULL,
  source_url        TEXT NOT NULL,
  captured_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  extract_status    TEXT NOT NULL DEFAULT 'ok'
    CHECK (extract_status IN ('ok', 'partial', 'failed'))
);

CREATE INDEX idx_scrape_extractions_source_captured
  ON scrape_extractions (source_id, captured_at DESC);

CREATE INDEX idx_scrape_extractions_wine_captured
  ON scrape_extractions (wine_id, captured_at DESC);

-- ---------------------------------------------------------------------------
-- scrape_errors
-- ---------------------------------------------------------------------------
CREATE TABLE scrape_errors (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scrape_run_id   UUID REFERENCES scrape_runs (id) ON DELETE SET NULL,
  source_id       UUID NOT NULL REFERENCES sources (id) ON DELETE CASCADE,
  source_url      TEXT,
  error_code      TEXT NOT NULL,
  message         TEXT NOT NULL,
  stack           TEXT,
  screenshot_path TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_scrape_errors_source_created
  ON scrape_errors (source_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- estimated_values
-- ---------------------------------------------------------------------------
CREATE TABLE estimated_values (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wine_id             UUID NOT NULL REFERENCES wines (id) ON DELETE CASCADE,
  estimated_value_gbp NUMERIC(12, 2) NOT NULL,
  source_count        INTEGER NOT NULL DEFAULT 0,
  last_updated        TIMESTAMPTZ NOT NULL,
  as_of_date          DATE NOT NULL,
  computed_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (wine_id, as_of_date)
);

CREATE INDEX idx_estimated_values_wine_date
  ON estimated_values (wine_id, as_of_date DESC);

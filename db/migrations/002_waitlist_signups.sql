-- Waitlist signups (homepage early access)

CREATE TABLE waitlist_signups (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL UNIQUE,
  name       TEXT,
  interest   TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert on waitlist_signups"
  ON waitlist_signups
  FOR INSERT
  TO anon
  WITH CHECK (true);

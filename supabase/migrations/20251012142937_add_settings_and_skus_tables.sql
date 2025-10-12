/*
  # Add Settings and SKUs tables

  1. New Tables
    - `settings` - Key-value store for app configuration
      - `key` (text, primary key) - Setting key
      - `value` (jsonb) - Setting value as JSON
    
    - `skus` - Product/SKU registry for Stripe and PayPal
      - `sku` (text, primary key) - SKU identifier (e.g., CREDITS_200)
      - `provider` (text) - Payment provider (STRIPE or PAYPAL)
      - `provider_id` (text) - Provider's price/product ID
      - `kind` (text) - Type (CREDIT_PACK or SUBSCRIPTION)
      - `amount_credits` (integer, nullable) - Credits granted
      - `meta` (jsonb, nullable) - Additional metadata

  2. Seed Data
    - Default credit prices
    - Plan definitions
    - Feature flags

  3. Security
    - Enable RLS on both tables
    - Settings: read-only for authenticated users
    - SKUs: read-only for authenticated users
*/

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings are viewable by authenticated users"
  ON settings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS skus (
  sku TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  amount_credits INTEGER,
  meta JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE skus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SKUs are viewable by authenticated users"
  ON skus
  FOR SELECT
  TO authenticated
  USING (true);

-- Seed default settings
INSERT INTO settings (key, value) VALUES 
('creditPrices', '{"logo.concept":5,"logo.restyle":2,"vectorize.upload":3,"mockups.batch":1,"brandkit.pdf":5,"animation.export":5}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value) VALUES 
('plans', '{"FREE":{"monthlyCredits":50,"watermark":true},"STARTER":{"priceUSD":12,"monthlyCredits":300},"PRO":{"priceUSD":29,"monthlyCredits":1000},"STUDIO":{"priceUSD":79,"monthlyCredits":4000,"seats":3}}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value) VALUES 
('featureFlags', '{"LOGO_STUDIO":true,"ANIMATION":true,"MARKETPLACE":true,"TEAM_SHARING":true,"DOMAIN_MAPPING":false}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Seed SKUs (placeholder provider IDs - replace with real ones from Stripe/PayPal dashboards)
INSERT INTO skus (sku, provider, provider_id, kind, amount_credits) VALUES 
('CREDITS_200', 'STRIPE', 'price_credits_200', 'CREDIT_PACK', 200),
('CREDITS_500', 'STRIPE', 'price_credits_500', 'CREDIT_PACK', 500),
('CREDITS_1000', 'STRIPE', 'price_credits_1000', 'CREDIT_PACK', 1000),
('PLAN_STARTER_MONTHLY', 'STRIPE', 'price_starter_monthly', 'SUBSCRIPTION', 300),
('PLAN_PRO_MONTHLY', 'STRIPE', 'price_pro_monthly', 'SUBSCRIPTION', 1000),
('PLAN_STUDIO_MONTHLY', 'STRIPE', 'price_studio_monthly', 'SUBSCRIPTION', 4000)
ON CONFLICT (sku) DO NOTHING;

-- Create index for faster settings lookups
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_skus_provider ON skus(provider, kind);

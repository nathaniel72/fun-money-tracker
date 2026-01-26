/*
  # Fun Money Tracker Database Schema

  1. New Tables
    - `settings`
      - `id` (uuid, primary key)
      - `pay_period_amount` (decimal) - Fun money allocated per pay period
      - `pay_period_days` (integer) - Number of days in a pay period
      - `current_period_start` (date) - Start date of current pay period
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `expenses`
      - `id` (uuid, primary key)
      - `amount` (decimal) - Expense amount
      - `description` (text) - What the expense was for
      - `expense_date` (date) - When the expense occurred
      - `pay_period_start` (date) - Which pay period this belongs to
      - `created_at` (timestamp)
    
    - `savings`
      - `id` (uuid, primary key)
      - `amount` (decimal) - Amount saved from a pay period
      - `period_start` (date) - Start date of the completed pay period
      - `period_end` (date) - End date of the completed pay period
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (single-user app)
*/

CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pay_period_amount decimal(10,2) NOT NULL DEFAULT 0,
  pay_period_days integer NOT NULL DEFAULT 14,
  current_period_start date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount decimal(10,2) NOT NULL,
  description text NOT NULL,
  expense_date date NOT NULL DEFAULT CURRENT_DATE,
  pay_period_start date NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS savings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount decimal(10,2) NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to settings"
  ON settings FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to settings"
  ON settings FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to settings"
  ON settings FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Allow public read access to expenses"
  ON expenses FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to expenses"
  ON expenses FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public delete to expenses"
  ON expenses FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Allow public read access to savings"
  ON savings FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to savings"
  ON savings FOR INSERT
  TO anon
  WITH CHECK (true);

INSERT INTO settings (pay_period_amount, pay_period_days, current_period_start)
VALUES (0, 14, CURRENT_DATE)
ON CONFLICT DO NOTHING;
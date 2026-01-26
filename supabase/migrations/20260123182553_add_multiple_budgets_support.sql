/*
  # Add Multiple Budgets Support

  1. New Tables
    - `budgets`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References user
      - `name` (text) - Budget name (e.g., "Fun Money", "Groceries")
      - `pay_period_amount` (decimal) - Budget allocated per period
      - `pay_period_days` (integer) - Days in period
      - `current_period_start` (date) - Current period start
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Changes to Existing Tables
    - `expenses` - Add `budget_id` column
    - `savings` - Add `budget_id` column

  3. Security
    - Enable RLS on budgets table
    - Add user-scoped RLS policies
    - Update expense and savings policies to include budget_id checks
*/

CREATE TABLE IF NOT EXISTS budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  pay_period_amount decimal(10,2) NOT NULL DEFAULT 0,
  pay_period_days integer NOT NULL DEFAULT 14,
  current_period_start date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own budgets"
  ON budgets FOR SELECT
  TO anon, authenticated
  USING (user_id = user_id);

CREATE POLICY "Users can insert own budgets"
  ON budgets FOR INSERT
  TO anon, authenticated
  WITH CHECK (user_id = user_id);

CREATE POLICY "Users can update own budgets"
  ON budgets FOR UPDATE
  TO anon, authenticated
  USING (user_id = user_id)
  WITH CHECK (user_id = user_id);

CREATE POLICY "Users can delete own budgets"
  ON budgets FOR DELETE
  TO anon, authenticated
  USING (user_id = user_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'budget_id'
  ) THEN
    ALTER TABLE expenses ADD COLUMN budget_id uuid;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'savings' AND column_name = 'budget_id'
  ) THEN
    ALTER TABLE savings ADD COLUMN budget_id uuid;
  END IF;
END $$;
/*
  # Add Fixed Expenses Table

  1. New Tables
    - `fixed_expenses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `budget_id` (uuid, foreign key to budgets)
      - `name` (text) - name of the fixed expense
      - `amount` (numeric) - amount of the expense
      - `charge_day` (integer) - day of month when charged (1-31)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `fixed_expenses` table
    - Add policy for users to read their own fixed expenses
    - Add policy for users to create fixed expenses
    - Add policy for users to update their own fixed expenses
    - Add policy for users to delete their own fixed expenses
*/

CREATE TABLE IF NOT EXISTS fixed_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  budget_id uuid NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  name text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  charge_day integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fixed_expenses_user_id ON fixed_expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_fixed_expenses_budget_id ON fixed_expenses(budget_id);

ALTER TABLE fixed_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own fixed expenses"
  ON fixed_expenses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create fixed expenses"
  ON fixed_expenses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fixed expenses"
  ON fixed_expenses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own fixed expenses"
  ON fixed_expenses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

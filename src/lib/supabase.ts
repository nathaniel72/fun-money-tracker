import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const USER_ID_KEY = 'fun_money_user_id';

export function getUserId(): string {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

export interface Budget {
  id: string;
  user_id: string;
  name: string;
  pay_period_amount: number;
  pay_period_days: number;
  current_period_start: string;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  id: string;
  user_id: string;
  pay_period_amount: number;
  pay_period_days: number;
  current_period_start: string;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  budget_id?: string;
  amount: number;
  description: string;
  expense_date: string;
  pay_period_start: string;
  created_at: string;
}

export interface Savings {
  id: string;
  user_id: string;
  budget_id?: string;
  amount: number;
  period_start: string;
  period_end: string;
  created_at: string;
}

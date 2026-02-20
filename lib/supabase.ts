import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fiezadmlmidsuzdqujvh.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZXphZG1sbWlkc3V6ZHF1anZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4MDU4NDMsImV4cCI6MjA4MjM4MTg0M30.v4baJOTB30hLKXIdHxVKyB3l7SBusf-sy6m8J_tqTSw';

export function getSupabase(): SupabaseClient<Database> {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials missing:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey
    });
    throw new Error('Supabase credentials are not configured');
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

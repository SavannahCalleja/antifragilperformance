import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../config/supabaseEnv';

// Realtime relies on WHATWG URL with writable `protocol` / `pathname`. Ensure `index.js` imports
// `react-native-url-polyfill/auto` before any Supabase usage.

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!SUPABASE_URL?.trim() || !SUPABASE_ANON_KEY?.trim()) {
    return null;
  }
  if (!client) {
    client = createClient(SUPABASE_URL.trim(), SUPABASE_ANON_KEY.trim());
  }
  return client;
}

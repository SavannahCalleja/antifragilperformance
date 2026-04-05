import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Browser / server Supabase client for the Next.js app only.
 * Uses `@antifragil/shared-api` for queries and types — do not import from `apps/mobile`.
 */
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) {
    return null;
  }
  if (!client) {
    client = createClient(url, key);
  }
  return client;
}

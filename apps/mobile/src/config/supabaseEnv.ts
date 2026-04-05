import {
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_URL,
} from '@env';

/** Bundled from `.env` via `react-native-dotenv`. Use RLS on your tables. */
export const SUPABASE_URL = (NEXT_PUBLIC_SUPABASE_URL ?? '').trim();
export const SUPABASE_ANON_KEY = (NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim();

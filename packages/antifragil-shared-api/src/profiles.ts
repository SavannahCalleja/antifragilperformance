import type { SupabaseClient } from '@supabase/supabase-js';
import { PROFILE_SELECT, TABLES } from './schema';
import type { ProfileRow } from './types';

export async function fetchProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ data: ProfileRow | null; error: Error | null }> {
  const { data, error } = await supabase
    .from(TABLES.profiles)
    .select(PROFILE_SELECT)
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }
  return { data: data as ProfileRow | null, error: null };
}

export async function fetchAthleteProfiles(
  supabase: SupabaseClient,
): Promise<{ data: ProfileRow[]; error: Error | null }> {
  const { data, error } = await supabase
    .from(TABLES.profiles)
    .select(PROFILE_SELECT)
    .eq('role', 'athlete')
    .order('full_name', { ascending: true });

  if (error) {
    return { data: [], error: new Error(error.message) };
  }
  return { data: (data as ProfileRow[]) ?? [], error: null };
}

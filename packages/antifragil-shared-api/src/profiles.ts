import type { SupabaseClient } from '@supabase/supabase-js';
import { PROFILE_SELECT, TABLES } from './schema';
import type { MmaLevel, ProfileRow, ProfileRole } from './types';

export type CompletedProfilePayload = {
  full_name: string;
  gender: string;
  age: number;
  weight_lb: number;
  height_in: number;
  /** Stored lowercase to satisfy the DB CHECK (`professional` | `amateur`). */
  mma_level: MmaLevel;
  /** Preserve coach role when updating an existing staff row */
  role?: ProfileRole | string;
};

function mmaLevelForDatabase(raw: string): { value: MmaLevel } | { error: string } {
  const v = raw.trim().toLowerCase();
  if (v === 'professional' || v === 'amateur') {
    return { value: v };
  }
  return { error: 'mma_level must be professional or amateur (lowercase)' };
}

/**
 * True when the user should see profile + MMA onboarding.
 * Treat as incomplete unless `profile_setup_complete` is exactly true (covers DB default false and null/missing).
 */
export function profileNeedsSetup(profile: ProfileRow | null): boolean {
  if (!profile) return true;
  return profile.profile_setup_complete !== true;
}

export async function upsertCompletedProfile(
  supabase: SupabaseClient,
  userId: string,
  payload: CompletedProfilePayload,
): Promise<{ error: Error | null }> {
  const mma = mmaLevelForDatabase(String(payload.mma_level));
  if ('error' in mma) {
    return { error: new Error(mma.error) };
  }
  const { value: mma_level } = mma;

  const role =
    payload.role === 'coach' || payload.role === 'athlete' ? payload.role : 'athlete';

  const { error } = await supabase.from(TABLES.profiles).upsert(
    {
      id: userId,
      full_name: payload.full_name,
      gender: payload.gender,
      age: payload.age,
      weight_lb: payload.weight_lb,
      height_in: payload.height_in,
      mma_level,
      profile_setup_complete: true,
      role,
    },
    { onConflict: 'id' },
  );

  if (error) {
    return { error: new Error(error.message) };
  }
  return { error: null };
}

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

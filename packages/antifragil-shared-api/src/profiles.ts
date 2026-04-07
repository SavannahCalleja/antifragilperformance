import type { SupabaseClient } from '@supabase/supabase-js';
import { PROFILE_SELECT, TABLES } from './schema';
import type { MmaLevel, ProfileRow, ProfileRole } from './types';

export type CompletedProfilePayload = {
  full_name: string;
  gender: string;
  /** Fighters required; coaches may omit (null in DB if column allows). */
  age: number | null;
  /** Fighters only; coaches omit (null in DB). */
  weight_lb: number | null;
  height_in: number | null;
  /** Stored lowercase (`professional` | `amateur` | `coach`). */
  mma_level: MmaLevel;
  /** Optional hint when not inferrable from `mma_level` (e.g. staff row). */
  role?: ProfileRole | string;
};

function mmaLevelForDatabase(raw: string): { value: MmaLevel } | { error: string } {
  const v = raw.trim().toLowerCase();
  if (v === 'professional' || v === 'amateur' || v === 'coach') {
    return { value: v };
  }
  return { error: 'mma_level must be professional, amateur, or coach (lowercase)' };
}

/**
 * True when the user should not see the main app: no profile row yet, or `profile_setup_complete` is not true.
 * Flow: MMA tier first (client-only until bio), then bio + tier saved together with `profile_setup_complete: true`.
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

  const role: ProfileRole =
    mma_level === 'coach'
      ? 'coach'
      : payload.role === 'coach'
        ? 'coach'
        : 'athlete';

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

import type { SupabaseClient } from '@supabase/supabase-js';
import {
  fetchAthleteProfiles,
  fetchExercises,
  fetchProfile,
  groupExercisesByCategory,
} from '@antifragil/shared-api';
import type { ExerciseRow, ProfileRow, ProgramAssignmentRow, ProgramRow } from '../types/database';

export { fetchProfile, fetchAthleteProfiles, fetchExercises, groupExercisesByCategory };

export async function fetchTodayAssignment(
  supabase: SupabaseClient,
  athleteId: string,
  localDateKey: string,
): Promise<{ data: ProgramAssignmentRow | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('program_assignments')
    .select('id, athlete_id, program_id, assigned_date, completed_at, programs ( id, name )')
    .eq('athlete_id', athleteId)
    .eq('assigned_date', localDateKey)
    .maybeSingle();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }
  return { data: data as ProgramAssignmentRow | null, error: null };
}

function programNameFromRow(row: ProgramAssignmentRow): string {
  const p = row.programs;
  if (!p) return 'Assigned session';
  const prog = Array.isArray(p) ? p[0] : p;
  return prog?.name ?? 'Assigned session';
}

export function formatAssignmentTitle(row: ProgramAssignmentRow | null): string {
  if (!row) return '';
  return programNameFromRow(row);
}

export async function fetchCompletedAssignmentsForAthletes(
  supabase: SupabaseClient,
  athleteIds: string[],
): Promise<{ data: ProgramAssignmentRow[]; error: Error | null }> {
  if (athleteIds.length === 0) {
    return { data: [], error: null };
  }

  const { data, error } = await supabase
    .from('program_assignments')
    .select('id, athlete_id, program_id, assigned_date, completed_at, programs ( id, name )')
    .in('athlete_id', athleteIds)
    .not('completed_at', 'is', null)
    .order('completed_at', { ascending: false });

  if (error) {
    return { data: [], error: new Error(error.message) };
  }
  return { data: (data as ProgramAssignmentRow[]) ?? [], error: null };
}

export async function fetchCompletedDatesForAthlete(
  supabase: SupabaseClient,
  athleteId: string,
): Promise<{ data: string[]; error: Error | null }> {
  const { data, error } = await supabase
    .from('program_assignments')
    .select('completed_at, assigned_date')
    .eq('athlete_id', athleteId)
    .not('completed_at', 'is', null);

  if (error) {
    return { data: [], error: new Error(error.message) };
  }

  const dates: string[] = [];
  for (const row of data ?? []) {
    const c = (row as { completed_at?: string; assigned_date?: string }).completed_at;
    const a = (row as { completed_at?: string; assigned_date?: string }).assigned_date;
    if (c) dates.push(c);
    else if (a) dates.push(a);
  }
  return { data: dates, error: null };
}

/** Consecutive training days counting back from today; allows skipping “today” once if not logged yet. */
export function computeTrainingStreak(isoTimestampsOrDates: string[]): number {
  const daySet = new Set(isoTimestampsOrDates.map((d) => d.slice(0, 10)));
  if (daySet.size === 0) return 0;

  const key = (d: Date) => {
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);
  let allowSkipFirstMiss = true;

  for (let i = 0; i < 400; i++) {
    const k = key(cursor);
    if (daySet.has(k)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
      allowSkipFirstMiss = false;
    } else if (allowSkipFirstMiss) {
      allowSkipFirstMiss = false;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export { programNameFromRow };
export type { ProgramRow, ProfileRow, ExerciseRow };

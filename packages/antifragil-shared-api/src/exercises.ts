import type { SupabaseClient } from '@supabase/supabase-js';
import { EXERCISE_SELECT, TABLES } from './schema';
import type { ExerciseRow } from './types';

export async function fetchExercises(
  supabase: SupabaseClient,
): Promise<{ data: ExerciseRow[]; error: Error | null }> {
  const { data, error } = await supabase
    .from(TABLES.exercises)
    .select(EXERCISE_SELECT)
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    return { data: [], error: new Error(error.message) };
  }
  return { data: (data as ExerciseRow[]) ?? [], error: null };
}

export function groupExercisesByCategory(exercises: ExerciseRow[]): Record<string, ExerciseRow[]> {
  const map: Record<string, ExerciseRow[]> = {};
  for (const ex of exercises) {
    const key = ex.category?.trim() || 'General';
    if (!map[key]) map[key] = [];
    map[key].push(ex);
  }
  return map;
}

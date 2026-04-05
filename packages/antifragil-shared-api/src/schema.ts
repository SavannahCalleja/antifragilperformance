/**
 * Single source of truth for Supabase table names and select lists.
 * When you add columns to `profiles` or `exercises`, update these strings and
 * the types in `./types` — both the app and the website should import from this package.
 */

export const TABLES = {
  profiles: 'profiles',
  exercises: 'exercises',
} as const;

/** PostgREST `.select()` fragment — keep in sync with DB + RLS-exposed columns */
export const PROFILE_SELECT = 'id, full_name, role' as const;

export const EXERCISE_SELECT = 'id, name, category, description' as const;

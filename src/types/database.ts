/**
 * Program-related rows (Command Center). Profile & exercise shapes live in @antifragil/shared-api.
 */
export type {
  ProfileRole,
  ProfileRow,
  ExerciseRow,
} from '@antifragil/shared-api';

export type ProgramRow = {
  id: string;
  name: string;
  coach_id?: string | null;
};

export type ProgramAssignmentRow = {
  id: string;
  athlete_id: string;
  program_id: string;
  assigned_date: string;
  completed_at: string | null;
  programs?: ProgramRow | ProgramRow[] | null;
};

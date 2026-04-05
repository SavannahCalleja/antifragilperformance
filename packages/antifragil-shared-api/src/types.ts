export type ProfileRole = 'coach' | 'athlete';

export type ProfileRow = {
  id: string;
  full_name: string | null;
  role: ProfileRole | string;
};

export type ExerciseRow = {
  id: string;
  name: string;
  category: string | null;
  description?: string | null;
};

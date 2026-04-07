export type ProfileRole = 'coach' | 'athlete';

export type MmaLevel = 'professional' | 'amateur';

/** Values allowed by the DB CHECK constraint — always lowercase. */
export const MMA_LEVEL_PROFESSIONAL = 'professional' as const;
export const MMA_LEVEL_AMATEUR = 'amateur' as const;

export type ProfileRow = {
  id: string;
  full_name: string | null;
  role: ProfileRole | string;
  gender: string | null;
  age: number | null;
  weight_lb: number | null;
  height_in: number | null;
  mma_level: MmaLevel | string | null;
  profile_setup_complete: boolean | null;
};

export type ExerciseRow = {
  id: string;
  name: string;
  category: string | null;
  description?: string | null;
};

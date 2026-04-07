import type { MmaLevel } from '@antifragil/shared-api';

export type AuthStackParamList = {
  Home: undefined;
  Login: undefined;
  Signup: undefined;
  PrivacyPolicy: undefined;
};

export type AppStackParamList = {
  CoachDashboard: undefined;
  AthleteDashboard: undefined;
  BuildProgram: undefined;
  MovementVault: undefined;
  AthleteRoster: undefined;
  ReviewData: undefined;
};

export type OnboardingStackParamList = {
  /** First step after email verify: tier before bio (profile_setup_complete stays false until bio save). */
  MmaLevel: undefined;
  ProfileSetup: { mmaLevel: MmaLevel };
};

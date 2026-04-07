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

export type ProfileBasicsForMma = {
  fullName: string;
  gender: string;
  age: number;
  weightLb: number;
  heightIn: number;
};

export type OnboardingStackParamList = {
  ProfileSetup: undefined;
  MmaLevel: ProfileBasicsForMma;
};

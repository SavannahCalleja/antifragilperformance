import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AppStackParamList } from './types';
import { useAuth } from '../context/AuthContext';
import { CoachDashboardScreen } from '../screens/coach/CoachDashboardScreen';
import { AthleteDashboardScreen } from '../screens/athlete/AthleteDashboardScreen';
import { BuildProgramScreen } from '../screens/coach/BuildProgramScreen';
import { MovementVaultScreen } from '../screens/coach/MovementVaultScreen';
import { AthleteRosterScreen } from '../screens/coach/AthleteRosterScreen';
import { ReviewDataScreen } from '../screens/coach/ReviewDataScreen';
import { cc } from '../theme/commandCenter';

const Stack = createNativeStackNavigator<AppStackParamList>();

const subScreenOptions = {
  headerShown: true as const,
  headerBackTitle: 'Back',
  headerTintColor: cc.accent,
  headerStyle: { backgroundColor: cc.bg },
  headerTitleStyle: { color: cc.text, fontWeight: '700' as const },
  contentStyle: { backgroundColor: cc.bg },
};

export function AppNavigator() {
  const { profile } = useAuth();
  const initialRouteName =
    profile?.role === 'coach' ? 'CoachDashboard' : 'AthleteDashboard';

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: cc.bg },
      }}
    >
      <Stack.Screen name="CoachDashboard" component={CoachDashboardScreen} />
      <Stack.Screen name="AthleteDashboard" component={AthleteDashboardScreen} />
      <Stack.Screen
        name="BuildProgram"
        component={BuildProgramScreen}
        options={{ ...subScreenOptions, title: 'Build Program' }}
      />
      <Stack.Screen
        name="MovementVault"
        component={MovementVaultScreen}
        options={{ ...subScreenOptions, title: 'Movement Vault' }}
      />
      <Stack.Screen
        name="AthleteRoster"
        component={AthleteRosterScreen}
        options={{ ...subScreenOptions, title: 'Athlete Roster' }}
      />
      <Stack.Screen
        name="ReviewData"
        component={ReviewDataScreen}
        options={{ ...subScreenOptions, title: 'Review Data' }}
      />
    </Stack.Navigator>
  );
}

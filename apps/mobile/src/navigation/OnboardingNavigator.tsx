import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from './types';
import { ProfileSetupScreen } from '../screens/onboarding/ProfileSetupScreen';
import { MmaLevelScreen } from '../screens/onboarding/MmaLevelScreen';
import { cc } from '../theme/commandCenter';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

const headerScreen = {
  headerShown: true as const,
  headerBackTitle: 'Back',
  headerTintColor: cc.accent,
  headerStyle: { backgroundColor: cc.bg },
  headerTitleStyle: { color: cc.text, fontWeight: '700' as const },
  contentStyle: { backgroundColor: cc.bg },
};

export function OnboardingNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MmaLevel"
      screenOptions={{
        ...headerScreen,
        title: '',
      }}
    >
      <Stack.Screen
        name="MmaLevel"
        component={MmaLevelScreen}
        options={{ title: 'Your role' }}
      />
      <Stack.Screen
        name="ProfileSetup"
        component={ProfileSetupScreen}
        options={{ title: 'Your bio', headerBackTitle: 'MMA level' }}
      />
    </Stack.Navigator>
  );
}

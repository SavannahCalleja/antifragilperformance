import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen';
import { PrivacyPolicyScreen } from '../screens/PrivacyPolicyScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const headerScreen = {
  headerShown: true as const,
  headerBackTitle: 'Back',
  headerTintColor: '#FF69B4',
  headerStyle: { backgroundColor: '#050505' },
  contentStyle: { backgroundColor: '#050505' },
};

export function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#000000' },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ ...headerScreen, title: '' }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ ...headerScreen, title: '' }} />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{
          ...headerScreen,
          title: 'Privacy Policy',
          headerTitleStyle: { color: '#C0C0C0', fontWeight: '700' },
        }}
      />
    </Stack.Navigator>
  );
}

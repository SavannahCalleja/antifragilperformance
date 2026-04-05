import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import { ProfileMissingScreen } from './src/screens/ProfileMissingScreen';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#000000',
    card: '#050505',
    text: '#C0C0C0',
    border: '#333333',
    primary: '#FF69B4',
  },
};

function AppGate() {
  const { session, profile, initializing, signOut } = useAuth();

  if (initializing) {
    return (
      <View style={gateStyles.boot}>
        <ActivityIndicator color="#ff69b4" size="large" />
      </View>
    );
  }

  if (session && !profile) {
    return <ProfileMissingScreen onSignOut={signOut} />;
  }

  if (session && profile) {
    const role = profile.role;
    if (role !== 'coach' && role !== 'athlete') {
      return (
        <ProfileMissingScreen
          onSignOut={signOut}
          message="Your profile role is not set to coach or athlete. Update your row in the profiles table, then sign in again."
        />
      );
    }
    return <AppNavigator />;
  }

  return <AuthNavigator />;
}

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer theme={navTheme}>
          <AppGate />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

const gateStyles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: '#030303',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;

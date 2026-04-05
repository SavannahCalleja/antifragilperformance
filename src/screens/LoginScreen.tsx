import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/types';
import { getSupabase } from '../lib/supabase';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const emailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export function LoginScreen(_props: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSignIn =
    emailValid(email) && password.length >= 1 && !submitting;

  const onSignIn = async () => {
    if (!canSignIn) return;

    const supabase = getSupabase();
    if (!supabase) {
      Alert.alert(
        'Supabase not configured',
        'Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env file, restart Metro, and try again.',
      );
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        Alert.alert('Sign in failed', error.message);
        return;
      }

      // Auth stack swaps to Command Center when session + profile load.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.inner}>
          <Text style={styles.title}>LOGIN</Text>

          <Text style={styles.fieldLabel}>EMAIL</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#555"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
          />

          <Text style={styles.fieldLabel}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#555"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="password"
            returnKeyType="done"
            onSubmitEditing={onSignIn}
          />

          <TouchableOpacity
            style={[styles.mainBtn, !canSignIn && styles.mainBtnDisabled]}
            onPress={onSignIn}
            disabled={!canSignIn}
          >
            {submitting ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.mainBtnText}>SIGN IN</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#050505' },
  flex: { flex: 1 },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 4,
    marginBottom: 28,
    alignSelf: 'center',
  },
  fieldLabel: {
    color: '#FF69B4',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    backgroundColor: '#111',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
  },
  mainBtn: {
    backgroundColor: '#FF69B4',
    width: '100%',
    padding: 18,
    borderRadius: 5,
    alignItems: 'center',
  },
  mainBtnDisabled: { opacity: 0.45 },
  mainBtnText: { color: '#000', fontWeight: '900', fontSize: 16, letterSpacing: 2 },
});

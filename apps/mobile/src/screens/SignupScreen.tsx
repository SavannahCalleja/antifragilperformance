import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const emailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export function SignupScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pactAccepted, setPactAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const nameOk = fullName.trim().length > 0;
  const emailOk = emailValid(email);
  const passwordOk = password.length >= 8;
  const canCreateAccount =
    nameOk && emailOk && passwordOk && pactAccepted && !submitting;

  const onCreateAccount = async () => {
    if (!canCreateAccount) return;

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
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            accepted_pact: pactAccepted,
            pact_version: '1.0',
          },
        },
      });

      if (error) {
        Alert.alert('Sign up failed', error.message);
        return;
      }

      Alert.alert('Check your email', 'Confirm your address to finish creating your account.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
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
          <Text style={styles.title}>CREATE ACCOUNT</Text>

          <Text style={styles.fieldLabel}>NAME</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Your full name"
            placeholderTextColor="#555"
            autoCapitalize="words"
            autoCorrect
            autoComplete="name"
          />

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
            placeholder="At least 8 characters"
            placeholderTextColor="#555"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="password-new"
          />

          <View style={styles.pactRow}>
            <Pressable
              style={styles.checkboxHit}
              onPress={() => setPactAccepted(!pactAccepted)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: pactAccepted }}
            >
              <View style={[styles.checkbox, pactAccepted && styles.checkboxOn]}>
                {pactAccepted ? <Text style={styles.checkMark}>✓</Text> : null}
              </View>
            </Pressable>
            <Text style={styles.pactLabel}>
              I agree to the Antifragil Performance Pact (required).{' '}
              <Text
                style={styles.privacyInline}
                onPress={() => navigation.navigate('PrivacyPolicy')}
                accessibilityRole="link"
                accessibilityLabel="Privacy Policy"
              >
                Privacy Policy
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.mainBtn, !canCreateAccount && styles.mainBtnDisabled]}
            onPress={onCreateAccount}
            disabled={!canCreateAccount}
          >
            {submitting ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.mainBtnText}>CREATE ACCOUNT</Text>
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
  pactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  checkboxHit: {
    marginRight: 12,
    paddingVertical: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#C0C0C0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
  },
  checkboxOn: {
    borderColor: '#FF69B4',
    backgroundColor: '#1a1a1a',
  },
  checkMark: {
    color: '#FF69B4',
    fontSize: 14,
    fontWeight: '900',
  },
  pactLabel: {
    flex: 1,
    color: '#C0C0C0',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  privacyInline: {
    color: '#FF69B4',
    fontSize: 12,
    fontWeight: '700',
    textDecorationLine: 'underline',
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

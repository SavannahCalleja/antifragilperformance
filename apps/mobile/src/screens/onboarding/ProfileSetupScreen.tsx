import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/types';
import { upsertCompletedProfile } from '../../api/commandCenter';
import { useAuth } from '../../context/AuthContext';
import { getSupabase } from '../../lib/supabase';
import { cc } from '../../theme/commandCenter';

const GENDERS = ['Female', 'Male', 'Non-binary', 'Prefer not to say'] as const;

type Props = NativeStackScreenProps<OnboardingStackParamList, 'ProfileSetup'>;

function parsePositiveInt(raw: string): number | null {
  const n = parseInt(raw.replace(/[^\d]/g, ''), 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

function parsePositiveFloat(raw: string): number | null {
  const n = parseFloat(raw.replace(/[^\d.]/g, ''));
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export function ProfileSetupScreen({ navigation, route }: Props) {
  const { mmaLevel } = route.params;
  const { session, profile, refreshProfile, signOut } = useAuth();
  const userId = session?.user?.id;
  const metaName = session?.user?.user_metadata?.full_name;
  const initialName = typeof metaName === 'string' ? metaName : '';

  const [fullName, setFullName] = useState(initialName.trim());
  const [gender, setGender] = useState<string>(GENDERS[0]);
  const [ageStr, setAgeStr] = useState('');
  const [weightStr, setWeightStr] = useState('');
  const [heightStr, setHeightStr] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canFinish = useMemo(() => {
    const age = parsePositiveInt(ageStr);
    const w = parsePositiveFloat(weightStr);
    const h = parsePositiveFloat(heightStr);
    return (
      fullName.trim().length > 0 &&
      gender.length > 0 &&
      age !== null &&
      age <= 120 &&
      w !== null &&
      w < 2000 &&
      h !== null &&
      h < 120
    );
  }, [fullName, gender, ageStr, weightStr, heightStr]);

  const onFinish = async () => {
    const age = parsePositiveInt(ageStr);
    const weightLb = parsePositiveFloat(weightStr);
    const heightIn = parsePositiveFloat(heightStr);
    if (
      !userId ||
      !fullName.trim() ||
      age === null ||
      weightLb === null ||
      heightIn === null ||
      !gender
    ) {
      Alert.alert('Check fields', 'Enter your name, gender, age, weight, and height.');
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      Alert.alert('Configuration', 'Supabase is not configured on this build.');
      return;
    }

    setSubmitting(true);
    const role =
      profile?.role === 'coach' || profile?.role === 'athlete' ? profile.role : 'athlete';

    const { error } = await upsertCompletedProfile(supabase, userId, {
      full_name: fullName.trim(),
      gender,
      age,
      weight_lb: weightLb,
      height_in: heightIn,
      mma_level: mmaLevel,
      role,
    });

    if (error) {
      setSubmitting(false);
      Alert.alert('Could not save', error.message);
      return;
    }

    await refreshProfile();
    setSubmitting(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity onPress={() => navigation.navigate('MmaLevel')} hitSlop={12}>
            <Text style={styles.backLink}>← Change MMA level</Text>
          </TouchableOpacity>

          <Text style={styles.kicker}>STEP 2</Text>
          <Text style={styles.headline}>Your bio</Text>
          <Text style={styles.sub}>
            Name, gender, age, weight, and height. Saving unlocks the Command Center
            (profile_setup_complete).
          </Text>

          <Text style={styles.label}>NAME</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Full name"
            placeholderTextColor={cc.dim}
            autoCapitalize="words"
            autoCorrect
          />

          <Text style={styles.label}>GENDER</Text>
          <View style={styles.genderRow}>
            {GENDERS.map((g) => {
              const on = gender === g;
              return (
                <Pressable
                  key={g}
                  onPress={() => setGender(g)}
                  style={[styles.genderChip, on && styles.genderChipOn]}
                >
                  <Text style={[styles.genderChipText, on && styles.genderChipTextOn]}>{g}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>AGE</Text>
          <TextInput
            style={styles.input}
            value={ageStr}
            onChangeText={setAgeStr}
            placeholder="Years"
            placeholderTextColor={cc.dim}
            keyboardType="number-pad"
          />

          <Text style={styles.label}>WEIGHT (LB)</Text>
          <TextInput
            style={styles.input}
            value={weightStr}
            onChangeText={setWeightStr}
            placeholder="Pounds"
            placeholderTextColor={cc.dim}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>HEIGHT (IN)</Text>
          <TextInput
            style={styles.input}
            value={heightStr}
            onChangeText={setHeightStr}
            placeholder="Total inches"
            placeholderTextColor={cc.dim}
            keyboardType="decimal-pad"
          />

          <TouchableOpacity
            style={[styles.primary, (!canFinish || submitting) && styles.primaryDisabled]}
            onPress={() => void onFinish()}
            disabled={!canFinish || submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.primaryText}>SAVE & ENTER COMMAND CENTER</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOut} onPress={signOut} hitSlop={12}>
            <Text style={styles.signOutText}>Sign out</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: cc.bg },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 22, paddingBottom: 32, maxWidth: 440, width: '100%', alignSelf: 'center' },
  backLink: {
    color: cc.accent,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 4,
  },
  kicker: {
    color: cc.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 4,
    marginBottom: 12,
  },
  headline: {
    color: cc.text,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  sub: { color: cc.muted, fontSize: 14, lineHeight: 22, marginBottom: 24 },
  label: {
    color: cc.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },
  input: {
    backgroundColor: cc.card,
    borderWidth: 1,
    borderColor: cc.borderStrong,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: cc.text,
    fontSize: 16,
    marginBottom: 18,
  },
  genderRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  genderChip: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cc.borderStrong,
    backgroundColor: cc.surface,
  },
  genderChipOn: {
    borderColor: cc.accent,
    backgroundColor: '#1a0a12',
  },
  genderChipText: { color: cc.muted, fontSize: 13, fontWeight: '700' },
  genderChipTextOn: { color: cc.text },
  primary: {
    backgroundColor: cc.accent,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryDisabled: { opacity: 0.4 },
  primaryText: { color: '#000', fontWeight: '900', letterSpacing: 1, fontSize: 13 },
  signOut: { alignSelf: 'center', marginTop: 20, padding: 8 },
  signOutText: { color: cc.muted, fontSize: 14, fontWeight: '600' },
});

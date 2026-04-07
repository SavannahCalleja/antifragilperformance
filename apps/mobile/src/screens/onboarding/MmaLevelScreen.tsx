import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/types';
import { MMA_LEVEL_AMATEUR, MMA_LEVEL_PROFESSIONAL } from '@antifragil/shared-api';
import { upsertCompletedProfile } from '../../api/commandCenter';
import { useAuth } from '../../context/AuthContext';
import { getSupabase } from '../../lib/supabase';
import { cc } from '../../theme/commandCenter';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'MmaLevel'>;

type MmaChoice = typeof MMA_LEVEL_PROFESSIONAL | typeof MMA_LEVEL_AMATEUR;

export function MmaLevelScreen({ route }: Props) {
  const { fullName, gender, age, weightLb, heightIn } = route.params;
  const { session, profile, refreshProfile } = useAuth();
  const userId = session?.user?.id;
  const [saving, setSaving] = useState(false);
  const [picked, setPicked] = useState<MmaChoice | null>(null);

  const save = async (mma_level: MmaChoice) => {
    if (!userId || saving) return;
    const supabase = getSupabase();
    if (!supabase) {
      Alert.alert('Configuration', 'Supabase is not configured on this build.');
      return;
    }

    setSaving(true);
    setPicked(mma_level);

    const role =
      profile?.role === 'coach' || profile?.role === 'athlete' ? profile.role : 'athlete';

    const { error } = await upsertCompletedProfile(supabase, userId, {
      full_name: fullName,
      gender,
      age,
      weight_lb: weightLb,
      height_in: heightIn,
      mma_level,
      role,
    });

    if (error) {
      setSaving(false);
      setPicked(null);
      Alert.alert('Could not save', error.message);
      return;
    }

    await refreshProfile();
    setSaving(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <View style={styles.inner}>
        <Text style={styles.kicker}>STEP 2</Text>
        <Text style={styles.title}>MMA LEVEL</Text>
        <Text style={styles.sub}>Choose one. This locks your competitive tier in the system.</Text>

        <TouchableOpacity
          style={styles.cardPro}
          onPress={() => save(MMA_LEVEL_PROFESSIONAL)}
          activeOpacity={0.92}
          disabled={saving}
          accessibilityRole="button"
          accessibilityLabel="Professional"
        >
          {saving && picked === MMA_LEVEL_PROFESSIONAL ? (
            <ActivityIndicator color="#000" size="large" />
          ) : (
            <>
              <Text style={styles.cardProLabel}>PROFESSIONAL</Text>
              <Text style={styles.cardProHint}>Paid bouts · pro ruleset · full contact career</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cardAm}
          onPress={() => save(MMA_LEVEL_AMATEUR)}
          activeOpacity={0.92}
          disabled={saving}
          accessibilityRole="button"
          accessibilityLabel="Amateur"
        >
          {saving && picked === MMA_LEVEL_AMATEUR ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <>
              <Text style={styles.cardAmLabel}>AMATEUR</Text>
              <Text style={styles.cardAmHint}>Development · sanctioned amateur · skill building</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#000' },
  inner: { flex: 1, paddingHorizontal: 20, paddingTop: 12, justifyContent: 'center' },
  kicker: {
    color: cc.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 4,
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 8,
  },
  sub: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 28,
    maxWidth: 360,
  },
  cardPro: {
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingVertical: 36,
    paddingHorizontal: 20,
    marginBottom: 16,
    minHeight: 140,
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  cardProLabel: {
    color: '#000',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 3,
  },
  cardProHint: {
    color: 'rgba(0,0,0,0.55)',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
    lineHeight: 18,
  },
  cardAm: {
    backgroundColor: '#000',
    borderRadius: 4,
    paddingVertical: 36,
    paddingHorizontal: 20,
    minHeight: 140,
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  cardAmLabel: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 3,
  },
  cardAmHint: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
    lineHeight: 18,
  },
});

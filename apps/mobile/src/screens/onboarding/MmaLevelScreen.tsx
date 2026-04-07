import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/types';
import { MMA_LEVEL_AMATEUR, MMA_LEVEL_PROFESSIONAL } from '@antifragil/shared-api';
import { cc } from '../../theme/commandCenter';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'MmaLevel'>;

type MmaChoice = typeof MMA_LEVEL_PROFESSIONAL | typeof MMA_LEVEL_AMATEUR;

export function MmaLevelScreen({ navigation }: Props) {
  const goBio = (mmaLevel: MmaChoice) => {
    navigation.navigate('ProfileSetup', { mmaLevel });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <View style={styles.inner}>
        <Text style={styles.kicker}>STEP 1</Text>
        <Text style={styles.title}>MMA LEVEL</Text>
        <Text style={styles.sub}>
          Choose your tier first. Next you&apos;ll add your bio—only then you enter the Command
          Center.
        </Text>

        <TouchableOpacity
          style={styles.cardPro}
          onPress={() => goBio(MMA_LEVEL_PROFESSIONAL)}
          activeOpacity={0.92}
          accessibilityRole="button"
          accessibilityLabel="Professional"
        >
          <Text style={styles.cardProLabel}>PROFESSIONAL</Text>
          <Text style={styles.cardProHint}>Paid bouts · pro ruleset · full contact career</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cardAm}
          onPress={() => goBio(MMA_LEVEL_AMATEUR)}
          activeOpacity={0.92}
          accessibilityRole="button"
          accessibilityLabel="Amateur"
        >
          <Text style={styles.cardAmLabel}>AMATEUR</Text>
          <Text style={styles.cardAmHint}>Development · sanctioned amateur · skill building</Text>
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

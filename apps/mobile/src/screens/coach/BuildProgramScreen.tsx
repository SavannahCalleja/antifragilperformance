import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { cc } from '../../theme/commandCenter';

type Props = NativeStackScreenProps<AppStackParamList, 'BuildProgram'>;

export function BuildProgramScreen(_props: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <View style={styles.inner}>
        <Text style={styles.title}>BUILD PROGRAM</Text>
        <Text style={styles.p}>
          Session template builder: define blocks, prescribe loads, and assign to athletes via{' '}
          <Text style={styles.em}>programs</Text> and <Text style={styles.em}>program_assignments</Text>.
        </Text>
        <Text style={styles.p}>
          Wire this screen to your <Text style={styles.em}>programs</Text> table next — create rows,
          attach coach ownership, then publish assignments from Command Center.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: cc.bg },
  inner: { flex: 1, padding: 20 },
  title: {
    color: cc.text,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 3,
    marginBottom: 20,
  },
  p: { color: cc.muted, fontSize: 15, lineHeight: 24, marginBottom: 16 },
  em: { color: cc.accent, fontWeight: '700' },
});

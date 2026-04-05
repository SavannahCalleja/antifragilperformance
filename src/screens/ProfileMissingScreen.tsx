import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cc } from '../theme/commandCenter';

type Props = {
  onSignOut: () => void;
  message?: string;
};

export function ProfileMissingScreen({
  onSignOut,
  message = 'No athlete profile was found for this account. Ask your staff lead to finish setup, or sign out and use a different login.',
}: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.inner}>
        <Text style={styles.title}>COMMAND CENTER</Text>
        <Text style={styles.body}>{message}</Text>
        <TouchableOpacity style={styles.btn} onPress={onSignOut}>
          <Text style={styles.btnText}>SIGN OUT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: cc.bg },
  inner: { flex: 1, padding: 24, justifyContent: 'center' },
  title: {
    color: cc.accent,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 4,
    marginBottom: 20,
  },
  body: { color: cc.text, fontSize: 16, lineHeight: 24, marginBottom: 28 },
  btn: {
    backgroundColor: cc.accent,
    paddingVertical: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnText: { color: '#000', fontWeight: '900', letterSpacing: 2 },
});

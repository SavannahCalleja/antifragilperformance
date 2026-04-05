import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { cc } from '../theme/commandCenter';

type Props = {
  title: string;
  subtitle?: string;
  onPress: () => void;
};

export function DashboardTile({ title, subtitle, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.tile}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.accentBar} />
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '100%',
    minHeight: 112,
    backgroundColor: cc.card,
    borderWidth: 1,
    borderColor: cc.border,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 14,
  },
  accentBar: {
    height: 3,
    backgroundColor: cc.accent,
    width: '100%',
  },
  body: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  title: {
    color: cc.text,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  subtitle: {
    marginTop: 6,
    color: cc.muted,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
});

import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { DashboardTile } from '../../components/DashboardTile';
import { useAuth } from '../../context/AuthContext';
import { cc } from '../../theme/commandCenter';

type Props = NativeStackScreenProps<AppStackParamList, 'CoachDashboard'>;

export function CoachDashboardScreen({ navigation }: Props) {
  const { profile, signOut } = useAuth();
  const name = profile?.full_name?.trim() || 'Coach';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <TouchableOpacity onPress={signOut} hitSlop={12} accessibilityLabel="Sign out">
            <Text style={styles.signOut}>Sign out</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.welcome}>
          Welcome back, Coach{' '}
          <Text style={styles.nameHighlight}>{name}</Text>
        </Text>
        <Text style={styles.subhead}>Antifragil Command Center — roster & programming</Text>

        <View style={styles.gridRow}>
          <View style={styles.half}>
            <DashboardTile
              title="Build Program"
              subtitle="Create session templates for your athletes."
              onPress={() => navigation.navigate('BuildProgram')}
            />
          </View>
          <View style={styles.half}>
            <DashboardTile
              title="Movement Vault"
              subtitle="Exercise library by category."
              onPress={() => navigation.navigate('MovementVault')}
            />
          </View>
        </View>

        <View style={styles.gridRow}>
          <View style={styles.half}>
            <DashboardTile
              title="Athlete Roster"
              subtitle="Everyone on your squad with athlete access."
              onPress={() => navigation.navigate('AthleteRoster')}
            />
          </View>
          <View style={styles.half}>
            <DashboardTile
              title="Review Data"
              subtitle="Completed sessions from the roster."
              onPress={() => navigation.navigate('ReviewData')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: cc.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 32 },
  topRow: { alignItems: 'flex-end', marginBottom: 8, marginTop: 4 },
  signOut: { color: cc.accent, fontSize: 13, fontWeight: '700' },
  welcome: {
    color: cc.text,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  nameHighlight: { color: cc.accent },
  subhead: {
    color: cc.muted,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 28,
    letterSpacing: 0.3,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  half: { width: '48%' },
});

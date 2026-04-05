import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import {
  computeTrainingStreak,
  fetchCompletedDatesForAthlete,
  fetchTodayAssignment,
  formatAssignmentTitle,
} from '../../api/commandCenter';
import { useAuth } from '../../context/AuthContext';
import { getSupabase } from '../../lib/supabase';
import type { ProgramAssignmentRow } from '../../types/database';
import { cc } from '../../theme/commandCenter';

type Props = NativeStackScreenProps<AppStackParamList, 'AthleteDashboard'>;

function todayLocalKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function AthleteDashboardScreen(_props: Props) {
  const { profile, signOut, session } = useAuth();
  const name = profile?.full_name?.trim() || 'Athlete';
  const athleteId = session?.user?.id;

  const [assignment, setAssignment] = useState<ProgramAssignmentRow | null>(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase || !athleteId) {
      setError(!athleteId ? 'Not signed in.' : 'Supabase not configured.');
      setLoading(false);
      return;
    }
    setError(null);

    const dateKey = todayLocalKey();
    const [todayRes, streakRes] = await Promise.all([
      fetchTodayAssignment(supabase, athleteId, dateKey),
      fetchCompletedDatesForAthlete(supabase, athleteId),
    ]);

    if (todayRes.error) {
      setError(todayRes.error.message);
      setAssignment(null);
    } else {
      setAssignment(todayRes.data);
    }

    if (!streakRes.error) {
      setStreak(computeTrainingStreak(streakRes.data));
    }

    setLoading(false);
    setRefreshing(false);
  }, [athleteId]);

  React.useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  const sessionTitle = formatAssignmentTitle(assignment);
  const isComplete = Boolean(assignment?.completed_at);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={cc.accent}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <TouchableOpacity onPress={signOut} hitSlop={12} accessibilityLabel="Sign out">
            <Text style={styles.signOut}>Sign out</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.welcome}>
          Welcome back, Athlete <Text style={styles.nameHighlight}>{name}</Text>
        </Text>
        <Text style={styles.subhead}>Antifragil Command Center — today’s edge</Text>

        {loading ? (
          <ActivityIndicator color={cc.accent} style={styles.loader} />
        ) : error ? (
          <Text style={styles.err}>{error}</Text>
        ) : (
          <>
            <Text style={styles.sectionLabel}>DAILY FOCUS</Text>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Today’s assigned session</Text>
              {assignment ? (
                <>
                  <Text style={styles.sessionName}>{sessionTitle}</Text>
                  <Text style={styles.cardMeta}>
                    {isComplete
                      ? 'Status · Complete'
                      : 'Status · Locked in — execute when you’re ready'}
                  </Text>
                </>
              ) : (
                <Text style={styles.cardEmpty}>
                  Rest day or no assignment on the calendar. Check with your coach if this looks
                  off.
                </Text>
              )}
            </View>

            <Text style={styles.sectionLabel}>CONSISTENCY TRACKER</Text>
            <View style={styles.streakCard}>
              <Text style={styles.streakNumber}>{streak}</Text>
              <Text style={styles.streakCopy}>
                You’ve stayed consistent for {streak} day{streak === 1 ? '' : 's'}.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: cc.bg },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
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
    marginBottom: 24,
    letterSpacing: 0.3,
  },
  loader: { marginTop: 32 },
  err: { color: '#f87171', marginTop: 16 },
  sectionLabel: {
    color: cc.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 3,
    marginBottom: 10,
    marginTop: 8,
  },
  card: {
    backgroundColor: cc.card,
    borderWidth: 1,
    borderColor: cc.borderStrong,
    borderRadius: 10,
    padding: 18,
    marginBottom: 8,
  },
  cardTitle: {
    color: cc.muted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  sessionName: { color: cc.text, fontSize: 20, fontWeight: '800' },
  cardMeta: { color: cc.muted, fontSize: 14, marginTop: 10, fontWeight: '600' },
  cardEmpty: { color: cc.muted, fontSize: 15, lineHeight: 22 },
  streakCard: {
    backgroundColor: cc.surface,
    borderWidth: 1,
    borderColor: cc.border,
    borderRadius: 10,
    padding: 20,
    alignItems: 'flex-start',
  },
  streakNumber: {
    color: cc.success,
    fontSize: 40,
    fontWeight: '900',
    marginBottom: 8,
  },
  streakCopy: { color: cc.text, fontSize: 16, fontWeight: '700', lineHeight: 24 },
});

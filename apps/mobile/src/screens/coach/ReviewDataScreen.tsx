import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import {
  fetchAthleteProfiles,
  fetchCompletedAssignmentsForAthletes,
  programNameFromRow,
} from '../../api/commandCenter';
import { getSupabase } from '../../lib/supabase';
import type { ProgramAssignmentRow } from '../../types/database';
import { cc } from '../../theme/commandCenter';

type Props = NativeStackScreenProps<AppStackParamList, 'ReviewData'>;

type Row = ProgramAssignmentRow & { athleteLabel: string };

export function ReviewDataScreen(_props: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) {
      setError('Supabase not configured.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    const { data: athletes, error: aErr } = await fetchAthleteProfiles(supabase);
    if (aErr) {
      setError(aErr.message);
      setRows([]);
      setLoading(false);
      return;
    }

    const ids = athletes.map((a) => a.id);
    const { data: assigns, error: cErr } = await fetchCompletedAssignmentsForAthletes(
      supabase,
      ids,
    );
    if (cErr) {
      setError(cErr.message);
      setRows([]);
      setLoading(false);
      return;
    }

    const nameMap = new Map<string, string>();
    for (const a of athletes) {
      nameMap.set(a.id, a.full_name?.trim() || 'Athlete');
    }

    const enriched: Row[] = assigns.map((r) => ({
      ...r,
      athleteLabel: nameMap.get(r.athlete_id) ?? 'Athlete',
    }));
    setRows(enriched);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const renderItem = useCallback(({ item }: { item: Row }) => {
    const completed = item.completed_at
      ? new Date(item.completed_at).toLocaleString()
      : '—';
    return (
      <View style={styles.card}>
        <Text style={styles.sessionTitle}>{programNameFromRow(item)}</Text>
        <Text style={styles.meta}>Athlete · {item.athleteLabel}</Text>
        <Text style={styles.meta}>Completed · {completed}</Text>
        <Text style={styles.meta}>Assigned date · {item.assigned_date}</Text>
      </View>
    );
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <View style={styles.inner}>
        <Text style={styles.head}>REVIEW DATA</Text>
        <Text style={styles.sub}>Completed sessions from your athlete roster.</Text>

        {loading ? (
          <ActivityIndicator color={cc.accent} style={styles.loader} />
        ) : error ? (
          <Text style={styles.err}>{error}</Text>
        ) : (
          <FlatList
            data={rows}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={styles.empty}>No completed sessions yet.</Text>}
            contentContainerStyle={styles.listPad}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: cc.bg },
  inner: { flex: 1, paddingHorizontal: 20 },
  head: {
    color: cc.text,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 3,
    marginBottom: 6,
  },
  sub: { color: cc.muted, fontSize: 13, marginBottom: 16 },
  loader: { marginTop: 24 },
  err: { color: '#f87171', marginTop: 16 },
  listPad: { paddingBottom: 32 },
  card: {
    backgroundColor: cc.card,
    borderWidth: 1,
    borderColor: cc.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  sessionTitle: { color: cc.text, fontSize: 16, fontWeight: '800' },
  meta: { color: cc.muted, fontSize: 13, marginTop: 6, fontWeight: '600' },
  empty: { color: cc.muted, marginTop: 24 },
});

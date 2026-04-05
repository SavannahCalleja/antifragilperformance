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
import { fetchAthleteProfiles } from '../../api/commandCenter';
import { getSupabase } from '../../lib/supabase';
import type { ProfileRow } from '../../types/database';
import { cc } from '../../theme/commandCenter';

type Props = NativeStackScreenProps<AppStackParamList, 'AthleteRoster'>;

export function AthleteRosterScreen(_props: Props) {
  const [athletes, setAthletes] = useState<ProfileRow[]>([]);
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
    const { data, error: qErr } = await fetchAthleteProfiles(supabase);
    if (qErr) {
      setError(qErr.message);
      setAthletes([]);
    } else {
      setAthletes(data);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <View style={styles.inner}>
        <Text style={styles.head}>ATHLETE ROSTER</Text>
        <Text style={styles.sub}>Athletes with Command Center access.</Text>

        {loading ? (
          <ActivityIndicator color={cc.accent} style={styles.loader} />
        ) : error ? (
          <Text style={styles.err}>{error}</Text>
        ) : (
          <FlatList
            data={athletes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.name}>{item.full_name?.trim() || 'Athlete'}</Text>
                <Text style={styles.meta}>Athlete ID · {item.id.slice(0, 8)}…</Text>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.empty}>No athletes in roster.</Text>}
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
  name: { color: cc.text, fontSize: 17, fontWeight: '800' },
  meta: { color: cc.dim, fontSize: 12, marginTop: 6, fontWeight: '600' },
  empty: { color: cc.muted, marginTop: 24 },
});

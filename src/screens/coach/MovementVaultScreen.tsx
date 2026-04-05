import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { fetchExercises, groupExercisesByCategory } from '../../api/commandCenter';
import { getSupabase } from '../../lib/supabase';
import type { ExerciseRow } from '../../types/database';
import { cc } from '../../theme/commandCenter';

type Props = NativeStackScreenProps<AppStackParamList, 'MovementVault'>;

type Section = { title: string; data: ExerciseRow[] };

export function MovementVaultScreen(_props: Props) {
  const [sections, setSections] = useState<Section[]>([]);
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
    const { data, error: qErr } = await fetchExercises(supabase);
    if (qErr) {
      setError(qErr.message);
      setSections([]);
    } else {
      const grouped = groupExercisesByCategory(data);
      const next = Object.keys(grouped)
        .sort((a, b) => a.localeCompare(b))
        .map((title) => ({ title, data: grouped[title] }));
      setSections(next);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <View style={styles.inner}>
        <Text style={styles.head}>MOVEMENT VAULT</Text>
        <Text style={styles.sub}>Categorized exercise library for your athletes.</Text>

        {loading ? (
          <ActivityIndicator color={cc.accent} style={styles.loader} />
        ) : error ? (
          <Text style={styles.err}>{error}</Text>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.sectionTitle}>{title}</Text>
            )}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.exName}>{item.name}</Text>
                {item.description ? (
                  <Text style={styles.exDesc} numberOfLines={2}>
                    {item.description}
                  </Text>
                ) : null}
              </View>
            )}
            ListEmptyComponent={<Text style={styles.empty}>No exercises yet.</Text>}
            stickySectionHeadersEnabled={false}
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
  sectionTitle: {
    color: cc.accent,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 20,
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: cc.border,
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: cc.border,
  },
  exName: { color: cc.text, fontSize: 16, fontWeight: '700' },
  exDesc: { color: cc.muted, fontSize: 13, marginTop: 4, lineHeight: 18 },
  empty: { color: cc.muted, marginTop: 24 },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FloatingCard from '../components/FloatingCard';

interface StatRowProps {
  icon: string;
  label: string;
  value: string;
  unit: string;
  color: string;
  progress: number; // 0–1
}

function StatRow({ icon, label, value, unit, color, progress }: StatRowProps) {
  return (
    <View style={styles.statRow}>
      <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.statInfo}>
        <Text style={styles.statLabel}>{label}</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
        </View>
      </View>
      <View style={styles.valueBox}>
        <Text style={[styles.value, { color }]}>{value}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );
}

export default function TodayActivity() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Today's Activity</Text>

      <FloatingCard>
        <StatRow
          icon="👟"
          label="Steps"
          value="6,240"
          unit="/ 10k"
          color="#7B4FD8"
          progress={0.62}
        />
        <View style={styles.divider} />
        <StatRow
          icon="🔥"
          label="Calories Burned"
          value="389"
          unit="kcal"
          color="#F97316"
          progress={0.55}
        />
        <View style={styles.divider} />
        <StatRow
          icon="💧"
          label="Water Intake"
          value="1.4"
          unit="/ 2.5L"
          color="#06B6D4"
          progress={0.56}
        />
      </FloatingCard>

      {/* Summary Ring Cards */}
      <View style={styles.ringRow}>
        <FloatingCard style={styles.ringCard}>
          <Text style={styles.ringEmoji}>🏃</Text>
          <Text style={styles.ringValue}>32</Text>
          <Text style={styles.ringLabel}>Active{'\n'}Minutes</Text>
        </FloatingCard>
        <FloatingCard style={styles.ringCard}>
          <Text style={styles.ringEmoji}>🎯</Text>
          <Text style={styles.ringValue}>62%</Text>
          <Text style={styles.ringLabel}>Daily{'\n'}Goal</Text>
        </FloatingCard>
        <FloatingCard style={styles.ringCard}>
          <Text style={styles.ringEmoji}>⚡</Text>
          <Text style={styles.ringValue}>82</Text>
          <Text style={styles.ringLabel}>Activity{'\n'}Score</Text>
        </FloatingCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 14,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 18 },
  statInfo: { flex: 1 },
  statLabel: { fontSize: 13, color: '#6B7280', marginBottom: 6, fontWeight: '500' },
  progressTrack: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },
  valueBox: { alignItems: 'flex-end' },
  value: { fontSize: 16, fontWeight: '700' },
  unit: { fontSize: 11, color: '#9CA3AF', marginTop: 1 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 4 },
  ringRow: { flexDirection: 'row', gap: 10 },
  ringCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  ringEmoji: { fontSize: 22, marginBottom: 6 },
  ringValue: { fontSize: 18, fontWeight: '800', color: '#1A1A2E' },
  ringLabel: { fontSize: 11, color: '#9CA3AF', textAlign: 'center', marginTop: 3 },
});

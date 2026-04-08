import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FloatingCard from '../components/FloatingCard';

interface VitalItemProps {
  icon: string;
  label: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'danger';
}

const STATUS_COLORS = {
  normal: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
};

function VitalItem({ icon, label, value, unit, status }: VitalItemProps) {
  const color = STATUS_COLORS[status];
  return (
    <FloatingCard style={styles.vitalCard}>
      <View style={[styles.vitalIconBox, { backgroundColor: color + '15' }]}>
        <Text style={styles.vitalIcon}>{icon}</Text>
      </View>
      <Text style={styles.vitalValue}>
        <Text style={{ color }}>{value}</Text>
        <Text style={styles.vitalUnit}> {unit}</Text>
      </Text>
      <Text style={styles.vitalLabel}>{label}</Text>
      <View style={[styles.statusDot, { backgroundColor: color }]} />
    </FloatingCard>
  );
}

interface BodyVitalsProps {
  hasMedicalCondition?: boolean;
}

export default function BodyVitals({ hasMedicalCondition = true }: BodyVitalsProps) {
  if (!hasMedicalCondition) {
    return (
      <View style={styles.container}>
        <FloatingCard style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>💚</Text>
          <Text style={styles.emptyTitle}>All Clear!</Text>
          <Text style={styles.emptyText}>
            Body vitals tracking is enabled for users with medical conditions. You're healthy!
          </Text>
        </FloatingCard>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Body Vitals</Text>
      <View style={styles.grid}>
        <VitalItem icon="❤️" label="Heart Rate" value="78" unit="bpm" status="normal" />
        <VitalItem icon="🩸" label="Blood Pressure" value="122/81" unit="mmHg" status="warning" />
      </View>
      <View style={styles.grid}>
        <VitalItem icon="💨" label="Oxygen Level" value="98" unit="%" status="normal" />
        <VitalItem icon="🌡️" label="Temperature" value="98.6" unit="°F" status="normal" />
      </View>

      <FloatingCard>
        <Text style={styles.cardTitle}>Vitals Summary</Text>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.legendText}>Normal</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.legendText}>Watch</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.legendText}>Alert</Text>
          </View>
        </View>
        <Text style={styles.summaryNote}>
          ⚠️ Blood pressure is slightly elevated. Consider consulting your doctor.
        </Text>
      </FloatingCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E', marginBottom: 14 },
  grid: { flexDirection: 'row', gap: 12 },
  vitalCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 18,
    position: 'relative',
  },
  vitalIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  vitalIcon: { fontSize: 20 },
  vitalValue: { fontSize: 18, fontWeight: '800', color: '#1A1A2E' },
  vitalUnit: { fontSize: 12, fontWeight: '400', color: '#9CA3AF' },
  vitalLabel: { fontSize: 12, color: '#6B7280', marginTop: 3 },
  statusDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyCard: { alignItems: 'center', padding: 32 },
  emptyIcon: { fontSize: 44, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E', marginBottom: 6 },
  emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 12 },
  legendRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 13, color: '#6B7280' },
  summaryNote: { fontSize: 13, color: '#92400E', backgroundColor: '#FEF3C7', padding: 10, borderRadius: 10, lineHeight: 18 },
});

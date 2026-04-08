import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FloatingCard from '../components/FloatingCard';

function QualityDot({ filled }: { filled: boolean }) {
  return (
    <View
      style={[
        styles.dot,
        { backgroundColor: filled ? '#7B4FD8' : '#E5E7EB' },
      ]}
    />
  );
}

export default function SleepWellness() {
  const sleepHours = 6.5;
  const quality = 72; // 0–100
  const stressLevel = 35; // 0–100

  const qualityDots = Array.from({ length: 10 }, (_, i) => i < Math.round(quality / 10));

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Sleep & Wellness</Text>

      {/* Sleep Card */}
      <FloatingCard>
        <View style={styles.sleepRow}>
          <View>
            <Text style={styles.sleepHours}>{sleepHours}h</Text>
            <Text style={styles.sleepLabel}>Last Night</Text>
          </View>
          <View style={styles.sleepRight}>
            <Text style={styles.sleepEmoji}>🌙</Text>
            <Text style={styles.sleepStatus}>
              {sleepHours >= 7 ? 'Great Sleep' : sleepHours >= 5 ? 'Fair Sleep' : 'Poor Sleep'}
            </Text>
          </View>
        </View>

        <View style={styles.bedtimeRow}>
          <View style={styles.bedItem}>
            <Text style={styles.bedIcon}>😴</Text>
            <Text style={styles.bedLabel}>Bedtime</Text>
            <Text style={styles.bedValue}>11:30 PM</Text>
          </View>
          <View style={styles.bedDivider} />
          <View style={styles.bedItem}>
            <Text style={styles.bedIcon}>☀️</Text>
            <Text style={styles.bedLabel}>Wake Up</Text>
            <Text style={styles.bedValue}>6:00 AM</Text>
          </View>
        </View>
      </FloatingCard>

      {/* Quality */}
      <FloatingCard>
        <Text style={styles.cardTitle}>Sleep Quality</Text>
        <View style={styles.dotsRow}>
          {qualityDots.map((filled, i) => (
            <QualityDot key={i} filled={filled} />
          ))}
        </View>
        <Text style={styles.qualityScore}>{quality}% — {quality >= 80 ? 'Excellent' : quality >= 60 ? 'Good' : 'Needs Improvement'}</Text>
      </FloatingCard>

      {/* Stress */}
      <FloatingCard>
        <View style={styles.stressHeader}>
          <Text style={styles.cardTitle}>Stress Level</Text>
          <Text style={styles.stressBadge}>
            {stressLevel < 40 ? '😌 Low' : stressLevel < 70 ? '😐 Medium' : '😰 High'}
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${stressLevel}%`,
                backgroundColor:
                  stressLevel < 40 ? '#10B981' : stressLevel < 70 ? '#F59E0B' : '#EF4444',
              },
            ]}
          />
        </View>
        <Text style={styles.stressValue}>{stressLevel} / 100</Text>
      </FloatingCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E', marginBottom: 14 },
  sleepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sleepHours: { fontSize: 36, fontWeight: '800', color: '#7B4FD8' },
  sleepLabel: { fontSize: 13, color: '#9CA3AF', marginTop: 2 },
  sleepRight: { alignItems: 'center' },
  sleepEmoji: { fontSize: 28 },
  sleepStatus: { fontSize: 13, fontWeight: '600', color: '#6B7280', marginTop: 4 },
  bedtimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  bedItem: { alignItems: 'center', gap: 4 },
  bedIcon: { fontSize: 20 },
  bedLabel: { fontSize: 12, color: '#9CA3AF' },
  bedValue: { fontSize: 15, fontWeight: '700', color: '#1A1A2E' },
  bedDivider: { width: 1, backgroundColor: '#F3F4F6' },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 10 },
  dotsRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  dot: { width: 16, height: 16, borderRadius: 8 },
  qualityScore: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  stressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stressBadge: { fontSize: 13, fontWeight: '600' },
  progressTrack: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 10,
  },
  progressFill: { height: '100%', borderRadius: 4 },
  stressValue: { fontSize: 12, color: '#9CA3AF' },
});

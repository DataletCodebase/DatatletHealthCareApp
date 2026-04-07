import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FloatingCard from '../components/FloatingCard';

interface MealProps {
  icon: string;
  meal: string;
  calories: number;
  time: string;
  color: string;
}

function MealRow({ icon, meal, calories, time, color }: MealProps) {
  return (
    <View style={styles.mealRow}>
      <View style={[styles.mealIcon, { backgroundColor: color + '20' }]}>
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </View>
      <View style={styles.mealInfo}>
        <Text style={styles.mealName}>{meal}</Text>
        <Text style={styles.mealTime}>{time}</Text>
      </View>
      <Text style={[styles.mealCal, { color }]}>{calories} kcal</Text>
    </View>
  );
}

export default function Diet() {
  const totalIntake = 1430;
  const targetCal = 2000;
  const progress = totalIntake / targetCal;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Diet & Nutrition</Text>

      {/* Calories Card */}
      <FloatingCard>
        <View style={styles.calHeader}>
          <View>
            <Text style={styles.calValue}>{totalIntake}</Text>
            <Text style={styles.calLabel}>of {targetCal} kcal consumed</Text>
          </View>
          <Text style={styles.calEmoji}>🥗</Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(progress * 100, 100)}%`,
                backgroundColor: progress > 0.9 ? '#EF4444' : '#7B4FD8',
              },
            ]}
          />
        </View>
        <View style={styles.calFooter}>
          <Text style={styles.calRemain}>{targetCal - totalIntake} kcal remaining</Text>
          <Text style={styles.calPct}>{Math.round(progress * 100)}%</Text>
        </View>
      </FloatingCard>

      {/* Macro Breakdown */}
      <FloatingCard>
        <Text style={styles.cardTitle}>Macro Breakdown</Text>
        <View style={styles.macroRow}>
          <View style={styles.macroItem}>
            <Text style={styles.macroEmoji}>🍞</Text>
            <Text style={[styles.macroValue, { color: '#F97316' }]}>180g</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroEmoji}>🥩</Text>
            <Text style={[styles.macroValue, { color: '#7B4FD8' }]}>72g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroEmoji}>🧈</Text>
            <Text style={[styles.macroValue, { color: '#F59E0B' }]}>38g</Text>
            <Text style={styles.macroLabel}>Fats</Text>
          </View>
        </View>
      </FloatingCard>

      {/* Meal Log */}
      <FloatingCard>
        <Text style={styles.cardTitle}>Today's Meals</Text>
        <MealRow icon="🍳" meal="Breakfast" calories={420} time="7:30 AM" color="#F97316" />
        <View style={styles.divider} />
        <MealRow icon="🥗" meal="Lunch" calories={610} time="1:00 PM" color="#10B981" />
        <View style={styles.divider} />
        <MealRow icon="🍎" meal="Snack" calories={200} time="4:30 PM" color="#F59E0B" />
        <View style={styles.divider} />
        <MealRow icon="🍽️" meal="Dinner" calories={200} time="Pending" color="#6B7280" />
      </FloatingCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E', marginBottom: 14 },
  calHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  calValue: { fontSize: 32, fontWeight: '800', color: '#7B4FD8' },
  calLabel: { fontSize: 13, color: '#9CA3AF', marginTop: 2 },
  calEmoji: { fontSize: 36 },
  progressTrack: { height: 10, backgroundColor: '#F3F4F6', borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 5 },
  calFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  calRemain: { fontSize: 12, color: '#6B7280' },
  calPct: { fontSize: 12, fontWeight: '700', color: '#7B4FD8' },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 14 },
  macroRow: { flexDirection: 'row', justifyContent: 'space-around' },
  macroItem: { alignItems: 'center', gap: 6 },
  macroEmoji: { fontSize: 22 },
  macroValue: { fontSize: 18, fontWeight: '800' },
  macroLabel: { fontSize: 12, color: '#9CA3AF' },
  mealRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 12 },
  mealIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  mealInfo: { flex: 1 },
  mealName: { fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
  mealTime: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  mealCal: { fontSize: 14, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 2 },
});

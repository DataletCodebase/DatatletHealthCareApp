import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import DashboardHeader from './DashboardHeader';
import FloatingCard from './FloatingCard';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const userName: string = user?.name || user?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {/* Shared Header */}
        <DashboardHeader userName={userName} credits={120} />

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Shared Banner Card */}
          <View style={styles.bannerWrapper}>
            <LinearGradient
              colors={['#7B4FD8', '#B06EF5', '#E040FB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.banner}
            >
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>Stay Healthy! 💪</Text>
                <Text style={styles.bannerSubtitle}>
                  You've hit 62% of your daily goal.{'\n'}Keep it up!
                </Text>
                <View style={styles.bannerBadge}>
                  <Text style={styles.bannerBadgeText}>🏆 On Track</Text>
                </View>
              </View>
              <Text style={styles.bannerEmoji}>🌟</Text>
            </LinearGradient>
          </View>

          {/* Shared Quick Stats */}
          <View style={styles.quickStats}>
            <FloatingCard style={styles.quickCard}>
              <Text style={styles.quickIcon}>🏃</Text>
              <Text style={styles.quickValue}>6.2k</Text>
              <Text style={styles.quickLabel}>Steps</Text>
            </FloatingCard>
            <FloatingCard style={styles.quickCard}>
              <Text style={styles.quickIcon}>🔥</Text>
              <Text style={styles.quickValue}>389</Text>
              <Text style={styles.quickLabel}>Calories</Text>
            </FloatingCard>
            <FloatingCard style={styles.quickCard}>
              <Text style={styles.quickIcon}>💧</Text>
              <Text style={styles.quickValue}>1.4L</Text>
              <Text style={styles.quickLabel}>Water</Text>
            </FloatingCard>
          </View>

          {/* Section-Specific Content */}
          {children}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F6FA' },
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },

  /* Banner */
  bannerWrapper: { paddingHorizontal: 20, marginBottom: 18 },
  banner: {
    borderRadius: 24,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bannerContent: { flex: 1 },
  bannerTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', marginBottom: 6 },
  bannerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 19, marginBottom: 12 },
  bannerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  bannerBadgeText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  bannerEmoji: { fontSize: 52 },

  /* Quick Stats */
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 4,
  },
  quickCard: { flex: 1, alignItems: 'center', paddingVertical: 14, paddingHorizontal: 6, marginBottom: 18 },
  quickIcon: { fontSize: 22, marginBottom: 4 },
  quickValue: { fontSize: 16, fontWeight: '800', color: '#1A1A2E' },
  quickLabel: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },

  bottomSpacer: { height: 20 },
});

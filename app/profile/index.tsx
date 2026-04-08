import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';

// Components
import ProfileHeader from '@/components/profile/ProfileHeader';

// Sections
import BasicProfile from '@/components/profile/sections/BasicProfile';
import ChangePlan from '@/components/profile/sections/ChangePlan';
import EmergencyContacts from '@/components/profile/sections/EmergencyContacts';
import MedicalConditions from '@/components/profile/sections/MedicalConditions';
import Prescriptions from '@/components/profile/sections/Prescriptions';

const TABS = [
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'health', label: 'Health', icon: '🩺' },
];

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ section?: string }>();

  // If "Health Profile" drawer item was tapped, open directly on health tab
  const initialTab = params.section === 'health' ? 'health' : 'profile';
  const [activeTab, setActiveTab] = React.useState<'profile' | 'health'>(initialTab);

  const userName: string =
    user?.name || user?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail: string = user?.email || '';

  const firstName = userName.split(' ')[0] || '';
  const lastName = userName.split(' ').slice(1).join(' ') || '';


  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Custom Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>My Profile</Text>
        <View style={styles.topBarRight} />
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id as 'profile' | 'health')}
            activeOpacity={0.75}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header Banner */}
        <ProfileHeader name={userName} email={userEmail} />

        {/* ─── PROFILE TAB ─── */}
        {activeTab === 'profile' && (
          <View style={styles.tabContent}>
            <BasicProfile
              initialData={{ firstName, lastName, email: userEmail }}
            />
            <ChangePlan currentPlan="premium" />
          </View>
        )}

        {/* ─── HEALTH TAB ─── */}
        {activeTab === 'health' && (
          <View style={styles.tabContent}>
            <MedicalConditions />
            <Prescriptions />
            <EmergencyContacts />
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F5F6FA',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  backIcon: {
    fontSize: 26,
    color: '#7B4FD8',
    fontWeight: '300',
    lineHeight: 28,
  },
  topBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  topBarRight: { width: 40 },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 4,
    marginBottom: 8,
    shadowColor: '#7B4FD8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 13,
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#7B4FD8',
  },
  tabIcon: { fontSize: 15 },
  tabLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  tabLabelActive: {
    color: '#FFFFFF',
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  tabContent: {
    paddingTop: 8,
  },
  bottomSpacer: {
    height: 32,
  },
});

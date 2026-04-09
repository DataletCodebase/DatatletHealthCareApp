import { useRouter, useLocalSearchParams } from 'expo-router';
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

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ section?: string }>();

  const isHealthView = params.section === 'health';

  const userName: string =
    user?.name || user?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail: string = user?.email || '';

  const firstName = userName.split(' ')[0] || '';
  const lastName = userName.split(' ').slice(1).join(' ') || '';

  const handleBack = () => {
    router.replace('/(tabs)?openDrawer=true' as any);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Custom Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.7}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>{isHealthView ? 'Medical Profile' : 'My Profile'}</Text>
        <View style={styles.topBarRight} />
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header Banner */}
        <ProfileHeader name={userName} email={userEmail} />

        {/* CONTENT */}
        <View style={styles.tabContent}>
          {isHealthView ? (
            <React.Fragment>
              <MedicalConditions />
              <Prescriptions />
              <EmergencyContacts />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <BasicProfile
                initialData={{ firstName, lastName, email: userEmail }}
              />
              <ChangePlan currentPlan="premium" />
            </React.Fragment>
          )}
        </View>

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
    color: '#7B00CC',
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

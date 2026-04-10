import { useRouter } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.replace('/(tabs)?openDrawer=true' as any);
  };

  const SETTINGS_OPTIONS = [
    {
      id: 'permissions',
      label: 'Permissions',
      icon: '🔐',
      subtitle: 'Manage app access & privacy',
      route: '/profile/settings/permissions',
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.7}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Settings</Text>
        <View style={styles.topBarRight} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          {SETTINGS_OPTIONS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.optionItem}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <View style={styles.optionIconBox}>
                <Text style={styles.optionIcon}>{item.icon}</Text>
              </View>
              <View style={styles.optionTextBlock}>
                <Text style={styles.optionLabel}>{item.label}</Text>
                <Text style={styles.optionSub}>{item.subtitle}</Text>
              </View>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  scroll: { flex: 1 },
  scrollContent: { padding: 20 },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
  },
  optionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionIcon: { fontSize: 20 },
  optionTextBlock: { flex: 1 },
  optionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  optionSub: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  optionArrow: {
    fontSize: 22,
    color: '#C4B5FD',
    fontWeight: '300',
  },
});

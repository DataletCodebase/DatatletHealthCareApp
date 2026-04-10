import { AppPermissionsState, permissionService, PermissionStatus } from '@/services/permissionService';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PermissionsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<AppPermissionsState | null>(null);

  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    const state = await permissionService.getPermissionsState();
    setPermissions(state);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const handleRequest = async (type: 'location' | 'camera' | 'storage') => {
    const status = await permissionService.requestOnDemand(type);
    if (status === 'blocked') {
      Alert.alert(
        'Permission Blocked',
        'Please enable this permission in your app settings to use this feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => permissionService.openSettings() },
        ]
      );
    }
    fetchPermissions();
  };

  const getStatusColor = (status: PermissionStatus) => {
    switch (status) {
      case 'granted': return '#10B981'; // Green
      case 'denied': return '#F59E0B'; // Amber
      case 'blocked': return '#EF4444'; // Red
      default: return '#9CA3AF'; // Gray
    }
  };

  const getStatusLabel = (status: PermissionStatus) => {
    switch (status) {
      case 'granted': return 'Allowed';
      case 'denied': return 'Denied';
      case 'blocked': return 'Blocked';
      default: return 'Needs Action';
    }
  };

  const PERMISSION_ITEMS = [
    { id: 'location', label: 'Location Access', icon: '📍', key: 'location' as const },
    { id: 'camera', label: 'Camera Access', icon: '📷', key: 'camera' as const },
    { id: 'storage', label: 'Storage & Files', icon: '📁', key: 'storage' as const },
  ];

  const allGranted = permissions && Object.values(permissions).every(s => s === 'granted');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>App Permissions</Text>
        <View style={styles.topBarRight} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color="#7B00CC" style={{ marginTop: 40 }} />
        ) : (
          <>
            {allGranted ? (
              <View style={styles.successCard}>
                <Text style={styles.successIcon}>✅</Text>
                <Text style={styles.successTitle}>All Access Granted!</Text>
                <Text style={styles.successSub}>Thank you for providing the necessary permissions to give you the best experience.</Text>
              </View>
            ) : (
              <View style={styles.infoCard}>
                <Text style={styles.infoText}>
                  To provide the best healthcare services, we need access to some system features.
                  You can manage them below.
                </Text>
              </View>
            )}

            <View style={styles.listContainer}>
              {PERMISSION_ITEMS.map((item) => {
                const status = permissions ? permissions[item.key] : 'undetermined';
                const isGranted = status === 'granted';

                return (
                  <View key={item.id} style={styles.permissionItem}>
                    <View style={styles.iconBox}>
                      <Text style={styles.mainIcon}>{item.icon}</Text>
                    </View>

                    <View style={styles.contentBox}>
                      <Text style={styles.itemLabel}>{item.label}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) + '15' }]}>
                        <View style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]} />
                        <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
                          {getStatusLabel(status)}
                        </Text>
                      </View>
                    </View>

                    {!isGranted && (
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => handleRequest(item.key)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.actionBtnText}>Request</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F6FA' },
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

  successCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  successIcon: { fontSize: 44, marginBottom: 12 },
  successTitle: { fontSize: 20, fontWeight: '800', color: '#065F46', marginBottom: 8 },
  successSub: { fontSize: 13, color: '#047857', textAlign: 'center', lineHeight: 20 },

  infoCard: {
    backgroundColor: '#F3F0FF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  infoText: { fontSize: 13, color: '#6B21A8', lineHeight: 20, textAlign: 'center' },

  listContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  mainIcon: { fontSize: 22 },
  contentBox: { flex: 1 },
  itemLabel: { fontSize: 15, fontWeight: '700', color: '#1A1A2E', marginBottom: 6 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  actionBtn: {
    backgroundColor: '#7B00CC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  actionBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
});

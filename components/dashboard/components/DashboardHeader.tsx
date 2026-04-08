import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '@/hooks/useAuth';

const { width } = Dimensions.get('window');

interface DashboardHeaderProps {
  userName?: string;
  credits?: number;
  onMenuPress?: () => void;
}

export default function DashboardHeader({
  userName = 'User',
  credits = 120,
  onMenuPress,
}: DashboardHeaderProps) {
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={styles.container}>
      {/* Left: Menu */}
      <TouchableOpacity style={styles.menuBtn} onPress={onMenuPress} activeOpacity={0.7}>
        <View style={styles.menuLine} />
        <View style={[styles.menuLine, { width: 16 }]} />
        <View style={styles.menuLine} />
      </TouchableOpacity>

      {/* Center: Greeting */}
      <View style={styles.center}>
        <Text style={styles.greeting}>Good Day 👋</Text>
        <Text style={styles.name}>{userName}</Text>
      </View>

      {/* Right: Credits Badge & Avatar */}
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeEmoji}>⚡</Text>
          <Text style={styles.badgeText}>{credits}</Text>
        </View>
        <TouchableOpacity 
          style={styles.avatar} 
          onPress={() => setIsMenuOpen(!isMenuOpen)}
          activeOpacity={0.8}
        >
          <Text style={styles.avatarText}>{initials}</Text>
        </TouchableOpacity>

        {/* 📋 Dropdown Menu */}
        {isMenuOpen && (
          <View style={styles.dropdown}>
            <TouchableOpacity 
              style={styles.dropdownItem} 
              onPress={() => {
                setIsMenuOpen(false);
                logout();
              }}
            >
              <Text style={styles.logoutText}>🚪 Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    zIndex: 1000,
  },
  menuBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    gap: 5,
  },
  menuLine: {
    width: 22,
    height: 2.5,
    backgroundColor: '#1A1A2E',
    borderRadius: 2,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginTop: 1,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    position: 'relative',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 3,
  },
  badgeEmoji: { fontSize: 12 },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#7B4FD8',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  dropdown: {
    position: 'absolute',
    top: 45,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    width: 120,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 14,
  },
});

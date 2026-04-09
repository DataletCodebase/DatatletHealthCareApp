import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProfileHeaderProps {
  name: string;
  email?: string;
  onEditPress?: () => void;
}

export default function ProfileHeader({ name, email, onEditPress }: ProfileHeaderProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#7B00CC', '#CC00FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Avatar */}
        <View style={styles.avatarOuter}>
          <LinearGradient
            colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0.1)']}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </LinearGradient>
          {onEditPress && (
            <TouchableOpacity style={styles.editBtn} onPress={onEditPress} activeOpacity={0.8}>
              <Text style={styles.editIcon}>✏️</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Name + Email */}
        <Text style={styles.name}>{name}</Text>
        {email && <Text style={styles.email}>{email}</Text>}

        {/* Plan badge */}
        <View style={styles.planBadge}>
          <Text style={styles.planText}>✦ Premium Plan</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  gradient: {
    paddingTop: 50,
    paddingBottom: 32,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  avatarOuter: {
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
  },
  editBtn: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  editIcon: { fontSize: 13 },
  name: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  email: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginBottom: 14,
    textAlign: 'center',
  },
  planBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  planText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});

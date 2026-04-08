import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface SectionCardProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function SectionCard({ title, icon, children, style }: SectionCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.titleRow}>
        {icon && <Text style={styles.titleIcon}>{icon}</Text>}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.divider} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#7B4FD8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: 0.2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F0FF',
    marginBottom: 16,
  },
});

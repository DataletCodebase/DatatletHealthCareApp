import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface FloatingCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function FloatingCard({ children, style }: FloatingCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    shadowColor: '#7B4FD8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    marginBottom: 14,
  },
});

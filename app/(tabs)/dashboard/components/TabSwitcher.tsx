import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export type TabKey = 'today' | 'sleep' | 'vitals' | 'diet';

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'today', label: 'Today', icon: '🏃' },
  { key: 'sleep', label: 'Sleep', icon: '🌙' },
  { key: 'vitals', label: 'Vitals', icon: '❤️' },
  { key: 'diet', label: 'Diet', icon: '🥗' },
];

interface TabSwitcherProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

export default function TabSwitcher({ active, onChange }: TabSwitcherProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {TABS.map((tab) => {
          const isActive = tab.key === active;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => onChange(tab.key)}
              activeOpacity={0.8}
              style={styles.tabWrapper}
            >
              {isActive ? (
                <LinearGradient
                  colors={['#7B4FD8', '#B06EF5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.tab}
                >
                  <Text style={styles.tabIcon}>{tab.icon}</Text>
                  <Text style={[styles.tabLabel, styles.tabLabelActive]}>{tab.label}</Text>
                </LinearGradient>
              ) : (
                <View style={[styles.tab, styles.tabInactive]}>
                  <Text style={styles.tabIcon}>{tab.icon}</Text>
                  <Text style={styles.tabLabel}>{tab.label}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    marginBottom: 18,
  },
  scroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  tabWrapper: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 50,
    gap: 6,
  },
  tabInactive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#7B4FD8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  tabIcon: { fontSize: 15 },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabLabelActive: {
    color: '#FFFFFF',
  },
});

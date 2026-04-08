// import { Tabs } from 'expo-router';
// import React from 'react';

// import { HapticTab } from '@/components/haptic-tab';
// import { IconSymbol } from '@/components/ui/icon-symbol';
// import { Colors } from '@/constants/theme';
// import { useColorScheme } from '@/hooks/use-color-scheme';

// export default function TabLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//         headerShown: false,
//         tabBarButton: HapticTab,
//       }}>
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="explore"
//         options={{
//           title: 'Explore',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
//         }}
//       />
//     </Tabs>
//   );
// }
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();

  // ⏳ Wait until auth loads
  if (loading) return null;

  // 🔐 If NOT logged in → go to login
  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          padding: 13,
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 24,
          left: 16,
          right: 16,
          backgroundColor: '#7B4FD8',
          borderTopWidth: 0,
          borderRadius: 32,
          height: 64,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          paddingBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIconItem, focused && styles.tabIconActive]}>
              <IconSymbol size={24} name="today.fill" color={color} />
              {focused && <Text style={styles.tabLabel}>{`Today`}</Text>}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="sleep"
        options={{
          title: 'Sleep',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIconItem, focused && styles.tabIconActive]}>
              <IconSymbol size={24} name="bed.double.fill" color={color} />
              {focused && <Text style={styles.tabLabel}>{`Sleep`}</Text>}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="vitals"
        options={{
          title: 'Vitals',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIconItem, focused && styles.tabIconActive]}>
              <IconSymbol size={24} name="heart.fill" color={color} />
              {focused && <Text style={styles.tabLabel}>{`Vitals`}</Text>}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="diet"
        options={{
          title: 'Diet',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabIconItem, focused && styles.tabIconActive]}>
              <IconSymbol size={24} name="leaf.fill" color={color} />
              {focused && <Text style={styles.tabLabel}>{`Diet`}</Text>}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
  },
  tabIconActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 4,
  },
});

import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';
import { CustomTabBar } from '@/components/CustomTabBar';

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
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
        }}
      />

      <Tabs.Screen
        name="sleep"
        options={{
          title: 'Sleep',
        }}
      />

      <Tabs.Screen
        name="vitals"
        options={{
          title: 'Vitals',
        }}
      />

      <Tabs.Screen
        name="diet"
        options={{
          title: 'Diet',
        }}
      />
    </Tabs>
  );
}



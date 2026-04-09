import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

export const unstable_settings = {
  anchor: '(tabs)',
};

import { ActivityIndicator, View } from 'react-native';

function InitialLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const publicRoutes = ['index', 'login', 'signup', 'otp', 'create-password'];
  const isOnPublicRoute = !segments[0] || publicRoutes.includes(segments[0] as string);
  const isOnTabsRoute = segments[0] === '(tabs)';

  useEffect(() => {
    if (loading) return;

    if (!user && !isOnPublicRoute && !isOnTabsRoute) {
      router.replace('/');
    } else if (user && isOnPublicRoute) {
      router.replace('/(tabs)');
    }
  }, [user, loading, segments, isOnPublicRoute, isOnTabsRoute]);

  // Prevent ANY glimpse of the landing page if the user is logged in
  // We show a blank screen while loading OR while we are waiting for the redirect to /(tabs)
  if (loading || (user && isOnPublicRoute)) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F5F6FA' }} />
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="otp" options={{ headerShown: false }} />
      <Stack.Screen name="create-password" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <InitialLayout />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Pressable,
  Image,
  Linking,
  Platform,
  Dimensions,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const videoRef = useRef<Video>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade-in + slide-up on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded && !videoLoaded) {
      setVideoLoaded(true);
    }
  };

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handleLoginPress = () => {
    router.push('/login');
  };

  const openTerms = () => Linking.openURL('https://yourapp.com/terms');
  const openPrivacy = () => Linking.openURL('https://yourapp.com/privacy');

  return (
    <View style={styles.container}>
      {/* ── Background Video ── */}
      <Video
        ref={videoRef}
        source={require('../assets/videos/login-bg.mp4')}
        style={StyleSheet.absoluteFillObject}
        resizeMode={ResizeMode.COVER}
        isLooping
        isMuted
        shouldPlay
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />

      {/* ── Dark overlay ── */}
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        {/* ═══════════════ CENTER LOGO & BRAND ═══════════════ */}
        <Animated.View
          style={[
            styles.centerSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Logo */}
          <View style={styles.logoWrapper}>
            <Image
              source={require('../assets/images/app-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* App Name */}
          <Text style={styles.appName}>Datalet Health</Text>
          <Text style={styles.tagline}>Your personal wellness companion</Text>
        </Animated.View>

        {/* ═══════════════ BOTTOM SECTION ═══════════════ */}
        <Animated.View
          style={[
            styles.bottomSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* CTA Button */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handleLoginPress}
              style={styles.loginButton}
              accessibilityRole="button"
              accessibilityLabel="Log In or Sign Up"
            >
              <Text style={styles.loginButtonText}>Log In / Sign Up</Text>
            </Pressable>
          </Animated.View>

          {/* Footer Legal */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>By continuing, you agree to our </Text>
            <TouchableOpacity onPress={openTerms} activeOpacity={0.7}>
              <Text style={styles.footerLink}>Terms & Conditions</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}> and </Text>
            <TouchableOpacity onPress={openPrivacy} activeOpacity={0.7}>
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>

      {/* Video loading shimmer indicator (hidden once loaded) */}
      {!videoLoaded && <View style={styles.videoPlaceholder} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628', // fallback while video loads
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'android' ? 24 : 0,
  },

  // ── CENTER SECTION ──
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoWrapper: {
    width: 96,
    height: 96,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 16,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.60)',
    letterSpacing: 0.3,
    textAlign: 'center',
    fontWeight: '400',
  },

  // ── BOTTOM SECTION ──
  bottomSection: {
    paddingHorizontal: 28,
    paddingBottom: 16,
    alignItems: 'center',
    gap: 16,
  },
  loginButton: {
    width: width - 56,
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  loginButtonText: {
    color: '#0A1628',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  // ── FOOTER ──
  footerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  footerText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11.5,
    lineHeight: 18,
  },
  footerLink: {
    color: 'rgba(255,255,255,0.80)',
    fontSize: 11.5,
    lineHeight: 18,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  // ── VIDEO PLACEHOLDER ──
  videoPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0A1628',
  },
});

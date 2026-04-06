import AuthButton from '@/components/AuthButton';
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const videoRef = useRef<Video>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

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

  useEffect(() => {
    // Autoplay fallback
    if (videoRef.current) {
      videoRef.current.playAsync().catch(() => {
        // Ignore playback errors
      });
    }
  }, [videoLoaded]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded && !videoLoaded) {
      setVideoLoaded(true);
      if (videoRef.current) {
        videoRef.current.playAsync();
      }
    }
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

      {/* ── Light overlay for typography contrast ── */}
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
          <AuthButton
            label="Log In / Sign Up"
            onPress={handleLoginPress}
            style={styles.loginButtonContainer}
          />

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
    backgroundColor: '#0A1628',
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
    elevation: 8,
    backgroundColor: 'transparent',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: 'black',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(5, 5, 5, 0.6)',
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
  loginButtonContainer: {
    width: width - 56,
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
    color: '#d1d9e8ff',
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

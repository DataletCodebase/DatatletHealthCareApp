import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import AuthInput from '@/components/AuthInput';
import AuthButton from '@/components/AuthButton';
import { sendPhoneOTP, signInWithEmailPassword } from '@/services/firebase';

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v: string) => /^\+?[1-9]\d{7,14}$/.test(v.replace(/\s/g, ''));

type LoginMode = 'otp' | 'password';

export default function LoginScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>('password');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const tabSlide = useRef(new Animated.Value(mode === 'password' ? 0 : 1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const switchMode = (m: LoginMode) => {
    setMode(m);
    setErrors({});
    Animated.spring(tabSlide, {
      toValue: m === 'password' ? 0 : 1,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!identifier.trim()) {
      e.identifier = 'Phone number or email is required';
    } else if (!isEmail(identifier) && !isPhone(identifier)) {
      e.identifier = 'Enter a valid email or phone (include country code, e.g. +91)';
    }
    if (mode === 'password' && !password) {
      e.password = 'Password is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === 'otp') {
        await sendPhoneOTP(identifier);
        router.push({
          pathname: '/otp',
          params: { mode: 'login', identifier, identifierType: isEmail(identifier) ? 'email' : 'phone' },
        });
      } else {
        // Password login — email only (Firebase)
        if (!isEmail(identifier)) {
          setErrors({ identifier: 'Password login requires an email address.' });
          return;
        }
        await signInWithEmailPassword(identifier, password);
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      const msg =
        err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password'
          ? 'Invalid email or password.'
          : err.code === 'auth/too-many-requests'
          ? 'Too many attempts. Please try again later.'
          : err.message || 'Login failed. Please try again.';
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  const tabTranslateX = tabSlide.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150], // half of toggle width ~300
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
              {/* Back */}
              <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>

              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Log in to continue your wellness journey.</Text>

              {/* ── Mode Toggle ── */}
              <View style={styles.toggleContainer}>
                <Animated.View
                  style={[styles.toggleIndicator, { transform: [{ translateX: tabTranslateX }] }]}
                />
                <TouchableOpacity style={styles.toggleBtn} onPress={() => switchMode('password')}>
                  <Text style={[styles.toggleLabel, mode === 'password' && styles.toggleLabelActive]}>
                    Password
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toggleBtn} onPress={() => switchMode('otp')}>
                  <Text style={[styles.toggleLabel, mode === 'otp' && styles.toggleLabelActive]}>
                    OTP Login
                  </Text>
                </TouchableOpacity>
              </View>

              {/* ── Form ── */}
              <View style={styles.form}>
                <AuthInput
                  label={mode === 'otp' ? 'Mobile Number or Email' : 'Email Address'}
                  placeholder={
                    mode === 'otp' ? '+91 9876543210  or  you@email.com' : 'you@email.com'
                  }
                  value={identifier}
                  onChangeText={setIdentifier}
                  error={errors.identifier}
                  keyboardType="email-address"
                />

                {mode === 'password' && (
                  <AuthInput
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    error={errors.password}
                    isPassword
                  />
                )}

                {errors.general ? (
                  <Text style={styles.generalError}>{errors.general}</Text>
                ) : null}

                <AuthButton
                  label={mode === 'otp' ? 'Send OTP' : 'Log In'}
                  onPress={handleLogin}
                  loading={loading}
                  style={styles.btn}
                />
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/signup')}>
                  <Text style={styles.footerLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  safe: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 16, paddingBottom: 40 },

  backBtn: { marginBottom: 28 },
  backText: { color: 'rgba(255,255,255,0.55)', fontSize: 15 },

  title: { fontSize: 32, fontWeight: '800', color: '#FFFFFF', marginBottom: 8 },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.50)',
    lineHeight: 20,
    marginBottom: 28,
  },

  // ── Toggle ──
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 4,
    marginBottom: 28,
    position: 'relative',
    overflow: 'hidden',
  },
  toggleIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: '50%',
    bottom: 4,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    zIndex: 1,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.45)',
  },
  toggleLabelActive: {
    color: '#0A1628',
  },

  form: {},
  generalError: {
    color: '#FF6B6B',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },
  btn: { marginTop: 12 },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: { color: 'rgba(255,255,255,0.45)', fontSize: 14 },
  footerLink: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});

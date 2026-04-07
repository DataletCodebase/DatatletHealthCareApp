import AuthButton from '@/components/AuthButton';
import AuthInput from '@/components/AuthInput';
import { authStorage, loginAPI } from '@/services/auth';
import { sendPhoneOTP } from '@/services/firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const TOGGLE_INNER_WIDTH = width - 56 - 8; // container width (width - 28 padding h x 2) minus inner padding (4x2)
const HALF_TOGGLE_WIDTH = TOGGLE_INNER_WIDTH / 2;

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

  // const handleLogin = async () => {
  //   if (!validate()) return;
  //   setLoading(true);
  //   try {
  //     if (mode === 'otp') {
  //       await sendPhoneOTP(identifier);
  //       router.push({
  //         pathname: '/otp',
  //         params: { mode: 'login', identifier, identifierType: isEmail(identifier) ? 'email' : 'phone' },
  //       });
  //     } else {
  //       // Password login — email only (Firebase)
  //       if (!isEmail(identifier)) {
  //         setErrors({ identifier: 'Password login requires an email address.' });
  //         return;
  //       }
  //       await signInWithEmailPassword(identifier, password);
  //       router.replace('/(tabs)');
  //     }
  //   } catch (err: any) {
  //     const msg =
  //       err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password'
  //         ? 'Invalid email or password.'
  //         : err.code === 'auth/too-many-requests'
  //           ? 'Too many attempts. Please try again later.'
  //           : err.message || 'Login failed. Please try again.';
  //     setErrors({ general: msg });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      if (mode === 'otp') {
        await sendPhoneOTP(identifier);
        router.push({
          pathname: '/otp',
          params: {
            mode: 'login',
            identifier,
            identifierType: isEmail(identifier) ? 'email' : 'phone',
          },
        });
      } else {
        await login({
          identifier,
          password,
        });
      }
    } catch (err: any) {
      const msg =
        err.message?.includes('not found')
          ? 'User not found'
          : err.message?.includes('Invalid')
            ? 'Invalid password'
            : err.message || 'Login failed';

      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  const tabTranslateX = tabSlide.interpolate({
    inputRange: [0, 1],
    outputRange: [0, HALF_TOGGLE_WIDTH],
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
              <AuthButton
                label="← Back"
                onPress={() => router.replace('/')}
                style={styles.backBtn}
              />

              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Log in to continue your wellness journey.</Text>

              {/* ── Mode Toggle ── */}
              <View style={styles.toggleContainer}>
                <Animated.View
                  style={[styles.toggleIndicator, { transform: [{ translateX: tabTranslateX }] }]}
                >
                  <LinearGradient
                    colors={['rgb(123, 0, 204)', 'rgb(204, 0, 255)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ flex: 1, borderRadius: 10 }}
                  />
                </Animated.View>
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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safe: {
    flex: 1,

  },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 16, paddingBottom: 40 },

  backBtn: {
    marginBottom: 28,
    marginTop: 30,
    alignSelf: 'flex-start',
  },

  title: { fontSize: 32, fontWeight: '800', color: '#111827', marginBottom: 8 },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 28,
  },

  // ── Toggle ──
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
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
    shadowColor: 'rgb(123, 0, 204)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  toggleLabelActive: {
    color: '#FFFFFF',
  },

  form: {},
  generalError: {
    color: '#EF4444',
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
  footerText: { color: '#6B7280', fontSize: 14 },
  footerLink: { color: '#7B00CC', fontSize: 14, fontWeight: '700' },
});

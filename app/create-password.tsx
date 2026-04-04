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
import { useRouter, useLocalSearchParams } from 'expo-router';
import AuthInput from '@/components/AuthInput';
import AuthButton from '@/components/AuthButton';
import { signUpWithEmail } from '@/services/firebase';

export default function CreatePasswordScreen() {
  const router = useRouter();
  const { identifier, identifierType, firstName, lastName } = useLocalSearchParams<{
    identifier: string;
    identifierType: string;
    firstName: string;
    lastName: string;
  }>();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!password) {
      e.password = 'Password is required';
    } else if (password.length < 6) {
      e.password = 'Password must be at least 6 characters';
    }
    if (!confirm) {
      e.confirm = 'Please confirm your password';
    } else if (password !== confirm) {
      e.confirm = 'Passwords do not match';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (identifierType === 'email') {
        // Real Firebase email/password signup
        await signUpWithEmail(identifier, password, firstName, lastName);
      }
      // For phone signup: user is already verified via OTP, account is considered created
      router.replace('/(tabs)');
    } catch (err: any) {
      const msg =
        err.code === 'auth/email-already-in-use'
          ? 'This email is already registered. Please log in.'
          : err.message || 'Account creation failed. Please try again.';
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

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
              <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>

              <Text style={styles.title}>Create Password</Text>
              <Text style={styles.subtitle}>
                Welcome, {firstName}! Set a secure password to protect your account.
              </Text>

              <View style={styles.form}>
                <AuthInput
                  label="Password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChangeText={setPassword}
                  error={errors.password}
                  isPassword
                />
                <AuthInput
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  value={confirm}
                  onChangeText={setConfirm}
                  error={errors.confirm}
                  isPassword
                />

                {/* Strength hint */}
                {password.length > 0 && (
                  <View style={styles.strengthRow}>
                    {[1, 2, 3, 4].map((level) => (
                      <View
                        key={level}
                        style={[
                          styles.strengthBar,
                          {
                            backgroundColor:
                              password.length >= level * 3
                                ? level <= 1
                                  ? '#FF6B6B'
                                  : level <= 2
                                  ? '#FFB86C'
                                  : level <= 3
                                  ? '#4ADE80'
                                  : '#22D3EE'
                                : 'rgba(255,255,255,0.12)',
                          },
                        ]}
                      />
                    ))}
                    <Text style={styles.strengthLabel}>
                      {password.length < 6
                        ? 'Weak'
                        : password.length < 9
                        ? 'Fair'
                        : password.length < 12
                        ? 'Good'
                        : 'Strong'}
                    </Text>
                  </View>
                )}

                {errors.general ? (
                  <Text style={styles.generalError}>{errors.general}</Text>
                ) : null}

                <AuthButton
                  label="Create Account"
                  onPress={handleCreate}
                  loading={loading}
                  style={styles.btn}
                />
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
    marginBottom: 36,
  },

  form: {},

  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    marginTop: -4,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 4,
  },
  strengthLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    marginLeft: 4,
    width: 36,
  },

  generalError: {
    color: '#FF6B6B',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },

  btn: { marginTop: 8 },
});

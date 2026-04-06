import AuthButton from '@/components/AuthButton';
import AuthInput from '@/components/AuthInput';
import { sendPhoneOTP } from '@/services/firebase';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ── Helpers ────────────────────────────────────────────────────────────────
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v: string) => /^\+?[1-9]\d{7,14}$/.test(v.replace(/\s/g, ''));

export default function SignUpScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [identifier, setIdentifier] = useState(''); // phone or email
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = 'First name is required';
    if (!lastName.trim()) e.lastName = 'Last name is required';
    if (!identifier.trim()) {
      e.identifier = 'Phone number or email is required';
    } else if (!isEmail(identifier) && !isPhone(identifier)) {
      e.identifier = 'Enter a valid email or phone number (include country code e.g. +91)';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const identifierType = isEmail(identifier) ? 'email' : 'phone';
      if (identifierType === 'phone') {
        await sendPhoneOTP(identifier);
      }
      router.push({
        pathname: '/otp',
        params: {
          mode: 'signup',
          identifier,
          identifierType,
          firstName,
          lastName,
        },
      });
    } catch (err: any) {
      setErrors({ general: err.message || 'Failed to send OTP. Please try again.' });
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
              {/* Header */}
              <AuthButton
                label="← Back"
                onPress={() => router.back()}
                style={styles.backBtn}
              />

              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join Datalet Health — your wellness journey starts here.</Text>

              {/* Form */}
              <View style={styles.form}>
                <AuthInput
                  label="First Name"
                  placeholder="John"
                  value={firstName}
                  onChangeText={setFirstName}
                  error={errors.firstName}
                />
                <AuthInput
                  label="Last Name"
                  placeholder="Doe"
                  value={lastName}
                  onChangeText={setLastName}
                  error={errors.lastName}
                />
                <AuthInput
                  label="Mobile Number or Email"
                  placeholder="+91 9876543210  or  you@email.com"
                  value={identifier}
                  onChangeText={setIdentifier}
                  error={errors.identifier}
                  keyboardType="email-address"
                />

                {errors.general ? (
                  <Text style={styles.generalError}>{errors.general}</Text>
                ) : null}

                <AuthButton
                  label="Send OTP"
                  onPress={handleContinue}
                  loading={loading}
                  style={styles.btn}
                />
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text style={styles.footerLink}>Log In</Text>
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
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  safe: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 16, paddingBottom: 40 },

  backBtn: { 
    marginBottom: 28,
    marginTop: 20,
    alignSelf: 'flex-start',
  },

  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 36,
  },

  form: { gap: 0 },

  generalError: {
    color: '#EF4444',
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
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

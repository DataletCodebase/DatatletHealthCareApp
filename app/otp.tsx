import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AuthButton from '@/components/AuthButton';
import { verifyPhoneOTP, sendPhoneOTP } from '@/services/firebase';

const OTP_LENGTH = 6;

export default function OtpScreen() {
  const router = useRouter();
  const { mode, identifier, identifierType, firstName, lastName, verificationId } =
    useLocalSearchParams<{
      mode: string;
      identifier: string;
      identifierType: string;
      firstName: string;
      lastName: string;
      verificationId: string;
    }>();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    startCountdown();
  }, []);

  const startCountdown = () => {
    setCountdown(60);
    setCanResend(false);
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError('');
    if (digit && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }
    setLoading(true);
    try {
      await verifyPhoneOTP(verificationId || 'mock', code);
      if (mode === 'signup') {
        router.push({
          pathname: '/create-password',
          params: { identifier, identifierType, firstName, lastName },
        });
      } else {
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await sendPhoneOTP(identifier);
      startCountdown();
    } catch {
      setError('Could not resend OTP. Please try again.');
    }
  };

  const maskedIdentifier =
    identifier?.includes('@')
      ? identifier.replace(/(.{3}).*(@.*)/, '$1***$2')
      : identifier?.replace(/(\+?\d{2,3})\d+(\d{4})/, '$1****$2');

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Enter OTP</Text>
            <Text style={styles.subtitle}>
              We sent a 6-digit code to{'\n'}
              <Text style={styles.identifier}>{maskedIdentifier}</Text>
            </Text>

            {/* ── OTP Boxes ── */}
            <View style={styles.otpRow}>
              {Array(OTP_LENGTH)
                .fill(0)
                .map((_, i) => (
                  <TextInput
                    key={i}
                    ref={(ref) => { inputs.current[i] = ref; }}
                    style={[styles.otpBox, otp[i] ? styles.otpBoxFilled : null]}
                    value={otp[i]}
                    onChangeText={(t) => handleChange(t, i)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                    selectionColor="#7B00CC"
                  />
                ))}
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Resend */}
            <View style={styles.resendRow}>
              {canResend ? (
                <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendLink}>Resend OTP</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.resendTimer}>Resend in {countdown}s</Text>
              )}
            </View>

            <AuthButton
              label="Verify OTP"
              onPress={handleVerify}
              loading={loading}
              disabled={otp.join('').length < OTP_LENGTH}
              style={styles.btn}
            />

            {/* Dev hint */}
            <View style={styles.hint}>
              <Text style={styles.hintText}>🧪 Test Mode: use code </Text>
              <Text style={styles.hintCode}>123456</Text>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  safe: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 28, paddingTop: 16 },

  backBtn: { marginBottom: 28 },
  backText: { color: '#6B7280', fontSize: 15 },

  title: { fontSize: 32, fontWeight: '800', color: '#111827', marginBottom: 8 },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 40,
  },
  identifier: { color: '#111827', fontWeight: '600' },

  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    color: '#111827',
    fontSize: 22,
    fontWeight: '700',
  },
  otpBoxFilled: {
    borderColor: '#7B00CC',
    backgroundColor: '#FFFFFF',
  },

  errorText: { color: '#EF4444', fontSize: 13, textAlign: 'center', marginBottom: 8 },

  resendRow: { alignItems: 'center', marginVertical: 20 },
  resendLink: { color: '#7B00CC', fontSize: 14, fontWeight: '700', textDecorationLine: 'underline' },
  resendTimer: { color: '#9CA3AF', fontSize: 14 },

  btn: { marginTop: 4 },

  hint: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    alignItems: 'center',
  },
  hintText: { color: '#9CA3AF', fontSize: 12 },
  hintCode: {
    color: '#4B5563',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

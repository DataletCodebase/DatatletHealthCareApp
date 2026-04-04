import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

// ── Firebase Config ─────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: 'AIzaSyBSnxOETYbR0pasMG7lymoj_rbzYbNjtRg',
  authDomain: 'datalethealthcareapp.firebaseapp.com',
  projectId: 'datalethealthcareapp',
  storageBucket: 'datalethealthcareapp.firebasestorage.app',
  messagingSenderId: '676015479460',
  appId: '1:676015479460:web:2ced5c9eedbd6f92d7a431',
  measurementId: 'G-L7RYRD4MCJ',
};

// Prevent duplicate app initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

// ── MOCK OTP (use code "123456" in Expo Go) ──────────────────────────────────
// Replace MOCK_OTP_MODE = false and use real RecaptchaVerifier in a dev build.
const MOCK_OTP_MODE = true;
const MOCK_OTP_CODE = '123456';

let _mockConfirmationResult = null;

/**
 * Send OTP to a phone number.
 * In MOCK mode, always succeeds — use code "123456" to verify.
 * In real mode, uses Firebase signInWithPhoneNumber.
 */
export async function sendPhoneOTP(phoneNumber) {
  if (MOCK_OTP_MODE) {
    _mockConfirmationResult = { phone: phoneNumber };
    return { verificationId: 'mock-verification-id' };
  }
  // Real implementation (requires dev build + RecaptchaVerifier):
  // const { signInWithPhoneNumber } = await import('firebase/auth');
  // const recaptcha = new RecaptchaVerifier('recaptcha-container', { size: 'invisible' }, auth);
  // return await signInWithPhoneNumber(auth, phoneNumber, recaptcha);
  throw new Error('Real phone auth requires a native dev build.');
}

/**
 * Verify OTP code.
 * In MOCK mode, accepts "123456" as valid.
 */
export async function verifyPhoneOTP(verificationId, code) {
  if (MOCK_OTP_MODE) {
    if (code !== MOCK_OTP_CODE) throw new Error('Invalid OTP. Use 123456 in test mode.');
    return { uid: `mock-uid-${Date.now()}`, phone: _mockConfirmationResult?.phone };
  }
  // Real: confirmationResult.confirm(code)
  throw new Error('Real phone auth requires a native dev build.');
}

// ── EMAIL / PASSWORD AUTH ────────────────────────────────────────────────────

/**
 * Create a new Firebase user with email and password.
 */
export async function signUpWithEmail(email, password, firstName, lastName) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, {
    displayName: `${firstName} ${lastName}`,
  });
  return credential.user;
}

/**
 * Sign in an existing user with email and password.
 */
export async function signInWithEmailPassword(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export default app;
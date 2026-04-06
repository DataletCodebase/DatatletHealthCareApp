import React, { useRef } from 'react';
import {
  Text,
  Pressable,
  StyleSheet,
  Animated,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AuthButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
  style?: StyleProp<ViewStyle>;
}

export default function AuthButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
}: AuthButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50, bounciness: 4 }).start();

  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4 }).start();

  const isPrimary = variant === 'primary';

  const CustomButton = () => (
    <Pressable
      onPressIn={pressIn}
      onPressOut={pressOut}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        !isPrimary && styles.outline,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : '#111827'} size="small" />
      ) : (
        <Text style={[styles.label, isPrimary ? styles.labelPrimary : styles.labelOutline]}>
          {label}
        </Text>
      )}
    </Pressable>
  );

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style, (disabled || loading) && styles.disabled]}>
      {isPrimary ? (
        <LinearGradient
          colors={['rgb(123, 0, 204)', 'rgb(204, 0, 255)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
          <CustomButton />
        </LinearGradient>
      ) : (
        <CustomButton />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    borderRadius: 16,
    shadowColor: 'rgb(123, 0, 204)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  button: {
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  disabled: {
    opacity: 0.6,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  labelPrimary: {
    color: '#FFFFFF',
  },
  labelOutline: {
    color: '#111827',
  },
});

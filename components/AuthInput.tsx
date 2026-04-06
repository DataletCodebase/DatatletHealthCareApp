import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export default function AuthInput({
  label,
  error,
  isPassword = false,
  ...props
}: AuthInputProps) {
  const [Show, setShow] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, error ? styles.inputError : null]}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword && !Show}
          autoCapitalize="none"
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShow(!Show)} style={styles.eyeBtn}>
            <Ionicons
              name={Show ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  input: {
    flex: 1,
    color: '#111827',
    fontSize: 15,
    fontWeight: '400',
  },
  eyeBtn: {
    padding: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 2,
  },
});

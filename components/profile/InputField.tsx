import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TextInputProps,
} from 'react-native';

interface InputFieldProps extends TextInputProps {
  label: string;
  unit?: string;
  normalRange?: string;
  error?: string;
}

export default function InputField({
  label,
  unit,
  normalRange,
  error,
  ...rest
}: InputFieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, unit ? styles.inputWithUnit : null, error ? styles.inputError : null]}
          placeholderTextColor="#C4B5FD"
          {...rest}
        />
        {unit && (
          <View style={styles.unitBadge}>
            <Text style={styles.unitText}>{unit}</Text>
          </View>
        )}
      </View>
      {normalRange && (
        <Text style={styles.normalRange}>Normal: {normalRange}</Text>
      )}
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: '#1A1A2E',
    fontWeight: '500',
  },
  inputWithUnit: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRightWidth: 0,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  unitBadge: {
    backgroundColor: '#F3F0FF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderLeftWidth: 0,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 11,
    minWidth: 52,
    alignItems: 'center',
  },
  unitText: {
    fontSize: 12,
    color: '#7B4FD8',
    fontWeight: '600',
  },
  normalRange: {
    fontSize: 11,
    color: '#10B981',
    marginTop: 4,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 11,
    color: '#EF4444',
    marginTop: 4,
  },
});

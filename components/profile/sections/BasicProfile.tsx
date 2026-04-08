import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import InputField from '../InputField';
import SectionCard from '../SectionCard';

interface BasicProfileData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
}

interface BasicProfileProps {
  initialData?: Partial<BasicProfileData>;
}

export default function BasicProfile({ initialData = {} }: BasicProfileProps) {
  const [data, setData] = useState<BasicProfileData>({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email || '',
    mobile: initialData.mobile || '',
  });
  const [errors, setErrors] = useState<Partial<BasicProfileData>>({});
  const [saved, setSaved] = useState(false);

  const validate = () => {
    const newErrors: Partial<BasicProfileData> = {};
    if (!data.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!data.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!data.email.trim() || !data.email.includes('@'))
      newErrors.email = 'Valid email is required';
    if (!data.mobile.trim() || data.mobile.length < 10)
      newErrors.mobile = 'Enter a valid 10-digit number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <SectionCard title="Basic Profile" icon="👤">
      <InputField
        label="First Name"
        value={data.firstName}
        onChangeText={(v) => setData({ ...data, firstName: v })}
        placeholder="Enter first name"
        error={errors.firstName}
      />
      <InputField
        label="Last Name"
        value={data.lastName}
        onChangeText={(v) => setData({ ...data, lastName: v })}
        placeholder="Enter last name"
        error={errors.lastName}
      />
      <InputField
        label="Email Address"
        value={data.email}
        onChangeText={(v) => setData({ ...data, email: v })}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />
      <InputField
        label="Mobile Number"
        value={data.mobile}
        onChangeText={(v) => setData({ ...data, mobile: v })}
        placeholder="+91 XXXXX XXXXX"
        keyboardType="phone-pad"
        error={errors.mobile}
      />

      <TouchableOpacity onPress={handleSave} activeOpacity={0.85} style={styles.saveBtn}>
        <LinearGradient
          colors={['#7B4FD8', '#E040FB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.saveBtnGradient}
        >
          <Text style={styles.saveBtnText}>
            {saved ? '✓ Saved!' : '💾 Save Profile'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  saveBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 4,
  },
  saveBtnGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.3,
  },
});

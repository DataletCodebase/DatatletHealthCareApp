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
    
    // Name validation: Letters and spaces only
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!data.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (!nameRegex.test(data.firstName)) {
      newErrors.firstName = 'Names cannot contain numbers or special characters';
    }

    if (!data.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (!nameRegex.test(data.lastName)) {
      newErrors.lastName = 'Names cannot contain numbers or special characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(data.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    // Mobile validation: Exactly 10 digits
    const mobileRegex = /^[0-9]{10}$/;
    if (!data.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!mobileRegex.test(data.mobile)) {
      newErrors.mobile = 'Enter a valid 10-digit numeric mobile number';
    }

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
        onChangeText={(v) => {
          const alphaValue = v.replace(/[^A-Za-z\s]/g, '');
          setData({ ...data, firstName: alphaValue });
        }}
        placeholder="Enter first name"
        error={errors.firstName}
      />
      <InputField
        label="Last Name"
        value={data.lastName}
        onChangeText={(v) => {
          const alphaValue = v.replace(/[^A-Za-z\s]/g, '');
          setData({ ...data, lastName: alphaValue });
        }}
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
        onChangeText={(v) => {
          const numericValue = v.replace(/[^0-9]/g, '');
          setData({ ...data, mobile: numericValue });
        }}
        placeholder="e.g. 9876543210"
        keyboardType="number-pad"
        maxLength={10}
        error={errors.mobile}
      />

      <TouchableOpacity onPress={handleSave} activeOpacity={0.85} style={styles.saveBtn}>
        <LinearGradient
          colors={['#7B00CC', '#CC00FF']}
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

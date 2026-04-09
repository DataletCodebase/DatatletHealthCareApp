import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import InputField from '../InputField';
import SectionCard from '../SectionCard';

interface Contact {
  name: string;
  relation: string;
  phone: string;
  email: string;
}

const EMPTY_CONTACT: Contact = { name: '', relation: '', phone: '', email: '' };

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState<Contact[]>([{ ...EMPTY_CONTACT }]);
  const [errors, setErrors] = useState<{ [key: number]: Partial<Contact> }>({});
  const [saved, setSaved] = useState(false);

  const handleChange = (index: number, field: keyof Contact, value: string) => {
    setContacts((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
    // Clear error for this field when typing
    if (errors[index]?.[field]) {
      const newIndexErrors = { ...errors[index] };
      delete newIndexErrors[field];
      setErrors({ ...errors, [index]: newIndexErrors });
    }
  };

  const addContact = () => {
    if (contacts.length >= 5) {
      Alert.alert('Limit reached', 'You can add up to 5 emergency contacts.');
      return;
    }
    setContacts((prev) => [...prev, { ...EMPTY_CONTACT }]);
  };

  const removeContact = (index: number) => {
    if (contacts.length <= 1) {
      Alert.alert('Cannot remove', 'At least one contact is required.');
      return;
    }
    Alert.alert('Remove Contact', 'Delete this emergency contact?', [
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setContacts((prev) => prev.filter((_, i) => i !== index)),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const validate = () => {
    const newErrors: { [key: number]: Partial<Contact> } = {};
    let isValid = true;

    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    contacts.forEach((c, index) => {
      const indexErrors: Partial<Contact> = {};
      
      if (!c.name.trim()) {
        indexErrors.name = 'Name is required';
      } else if (!nameRegex.test(c.name)) {
        indexErrors.name = 'Letters only';
      }

      if (!c.relation.trim()) {
        indexErrors.relation = 'Relation is required';
      }

      if (!c.phone.trim()) {
        indexErrors.phone = 'Phone is required';
      } else if (!phoneRegex.test(c.phone)) {
        indexErrors.phone = '10 digits';
      }

      if (c.email.trim() && !emailRegex.test(c.email)) {
        indexErrors.email = 'Invalid email';
      }

      if (Object.keys(indexErrors).length > 0) {
        newErrors[index] = indexErrors;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (!validate()) {
      Alert.alert('Validation Error', 'Please fix the errors in your emergency contacts.');
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <SectionCard title="Emergency Contacts" icon="🚨">
      <Text style={styles.hint}>
        Add people to contact in case of a health emergency.
      </Text>

      {contacts.map((contact, index) => (
        <View key={index} style={styles.contactBlock}>
          <View style={styles.contactHeader}>
            <View style={styles.contactBadge}>
              <Text style={styles.contactNum}>Contact {index + 1}</Text>
            </View>
            <TouchableOpacity
              onPress={() => removeContact(index)}
              style={styles.removeBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.removeIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>

          <InputField
            label="Full Name"
            value={contact.name}
            onChangeText={(v) => {
              const alphaValue = v.replace(/[^A-Za-z\s]/g, '');
              handleChange(index, 'name', alphaValue);
            }}
            placeholder="e.g. Rahul Swain"
            error={errors[index]?.name}
          />
          <InputField
            label="Relation"
            value={contact.relation}
            onChangeText={(v) => handleChange(index, 'relation', v)}
            placeholder="e.g. Father, Sister, Spouse"
            error={errors[index]?.relation}
          />
          <InputField
            label="Phone Number"
            value={contact.phone}
            onChangeText={(v) => {
              const numericValue = v.replace(/[^0-9]/g, '');
              handleChange(index, 'phone', numericValue);
            }}
            placeholder="e.g. 9876543210"
            keyboardType="number-pad"
            maxLength={10}
            error={errors[index]?.phone}
          />
          <InputField
            label="Email Address"
            value={contact.email}
            onChangeText={(v) => handleChange(index, 'email', v)}
            placeholder="contact@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors[index]?.email}
          />
        </View>
      ))}

      {/* Add Contact Button */}
      <TouchableOpacity style={styles.addBtn} onPress={addContact} activeOpacity={0.7}>
        <Text style={styles.addIcon}>＋</Text>
        <Text style={styles.addText}>Add Another Contact</Text>
      </TouchableOpacity>

      {/* Save Button */}
      <TouchableOpacity onPress={handleSave} activeOpacity={0.85} style={styles.saveBtn}>
        <LinearGradient
          colors={['#7B00CC', '#CC00FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.saveBtnGradient}
        >
          <Text style={styles.saveBtnText}>
            {saved ? '✓ Saved!' : '💾 Save Contacts'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  hint: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 14,
    lineHeight: 18,
  },
  contactBlock: {
    backgroundColor: '#F9F9FF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  contactBadge: {
    backgroundColor: '#F3F0FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  contactNum: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7B4FD8',
  },
  removeBtn: {
    padding: 4,
  },
  removeIcon: { fontSize: 16 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 13,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#C4B5FD',
    borderStyle: 'dashed',
    gap: 6,
    marginBottom: 16,
  },
  addIcon: {
    fontSize: 18,
    color: '#7B4FD8',
    fontWeight: '700',
  },
  addText: {
    fontSize: 14,
    color: '#7B4FD8',
    fontWeight: '700',
  },
  saveBtn: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  saveBtnGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
});

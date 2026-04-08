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
}

const EMPTY_CONTACT: Contact = { name: '', relation: '', phone: '' };

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState<Contact[]>([{ ...EMPTY_CONTACT }]);
  const [saved, setSaved] = useState(false);

  const handleChange = (index: number, field: keyof Contact, value: string) => {
    setContacts((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
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
    for (const c of contacts) {
      if (!c.name.trim()) return false;
      if (!c.relation.trim()) return false;
      if (!c.phone.trim() || c.phone.length < 10) return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validate()) {
      Alert.alert('Incomplete', 'Please fill in all contact fields with valid phone numbers.');
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
            onChangeText={(v) => handleChange(index, 'name', v)}
            placeholder="e.g. Rahul Swain"
          />
          <InputField
            label="Relation"
            value={contact.relation}
            onChangeText={(v) => handleChange(index, 'relation', v)}
            placeholder="e.g. Father, Sister, Spouse"
          />
          <InputField
            label="Phone Number"
            value={contact.phone}
            onChangeText={(v) => handleChange(index, 'phone', v)}
            placeholder="+91 XXXXX XXXXX"
            keyboardType="phone-pad"
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
          colors={['#7B4FD8', '#E040FB']}
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

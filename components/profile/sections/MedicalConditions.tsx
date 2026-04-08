import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import InputField from '../InputField';
import SectionCard from '../SectionCard';

type Condition = 'kidney' | 'heart' | 'diabetes' | 'normal';

interface FieldDef {
  key: string;
  label: string;
  unit: string;
  range: string;
  placeholder: string;
}

const KIDNEY_FIELDS: FieldDef[] = [
  { key: 'creatinine', label: 'Creatinine', unit: 'mg/dL', range: '0.6-1.3', placeholder: '0.0' },
  { key: 'potassium', label: 'Potassium', unit: 'mmol/L', range: '3.5-5.1', placeholder: '0.0' },
  { key: 'sodium', label: 'Sodium', unit: 'mmol/L', range: '135-145', placeholder: '0' },
  { key: 'urea', label: 'Urea', unit: 'mg/dL', range: '7-20', placeholder: '0.0' },
  { key: 'egfr', label: 'Estimated GFR', unit: 'mL/min/1.73m²', range: '>60', placeholder: '0.0' },
  { key: 'albumin', label: 'Albumin', unit: 'g/dL', range: '3.4-5.4', placeholder: '0.0' },
  { key: 'calcium', label: 'Calcium', unit: 'mg/dL', range: '8.5-10.2', placeholder: '0.0' },
  { key: 'phosphate', label: 'Phosphate', unit: 'mg/dL', range: '2.5-4.5', placeholder: '0.0' },
  { key: 'uricAcid', label: 'Uric Acid', unit: 'mg/dL', range: '3.4-7.0', placeholder: '0.0' },
];

const HEART_FIELDS: FieldDef[] = [
  { key: 'totalCholesterol', label: 'Total Cholesterol', unit: 'mg/dL', range: '<200', placeholder: '0' },
  { key: 'ldl', label: 'LDL Cholesterol', unit: 'mg/dL', range: '<100', placeholder: '0' },
  { key: 'hdl', label: 'HDL Cholesterol', unit: 'mg/dL', range: '>40', placeholder: '0' },
  { key: 'triglycerides', label: 'Triglycerides', unit: 'mg/dL', range: '<150', placeholder: '0' },
  { key: 'systolicBP', label: 'Systolic Blood Pressure', unit: 'mmHg', range: '<120', placeholder: '0' },
  { key: 'diastolicBP', label: 'Diastolic Blood Pressure', unit: 'mmHg', range: '<80', placeholder: '0' },
  { key: 'heartRate', label: 'Heart Rate', unit: 'bpm', range: '60-100', placeholder: '0' },
  { key: 'bmi', label: 'BMI', unit: 'kg/m²', range: '18.5-24.9', placeholder: '0.0' },
];

const DIABETES_FIELDS: FieldDef[] = [
  { key: 'fastingGlucose', label: 'Fasting Glucose', unit: 'mg/dL', range: '70-100', placeholder: '0' },
  { key: 'postprandialGlucose', label: 'Postprandial Glucose', unit: 'mg/dL', range: '<140', placeholder: '0' },
  { key: 'hba1c', label: 'HbA1c', unit: '%', range: '<5.7', placeholder: '0.0' },
  { key: 'totalCholesterol', label: 'Total Cholesterol', unit: 'mg/dL', range: '<200', placeholder: '0' },
  { key: 'triglycerides', label: 'Triglycerides', unit: 'mg/dL', range: '<150', placeholder: '0' },
  { key: 'bmi', label: 'BMI', unit: 'kg/m²', range: '18.5-24.9', placeholder: '0.0' },
  { key: 'systolicBP', label: 'Systolic Blood Pressure', unit: 'mmHg', range: '<120', placeholder: '0' },
  { key: 'diastolicBP', label: 'Diastolic Blood Pressure', unit: 'mmHg', range: '<80', placeholder: '0' },
];

const NORMAL_FIELDS: FieldDef[] = [
  { key: 'systolicBP', label: 'Systolic Blood Pressure', unit: 'mmHg', range: '<120', placeholder: '0' },
  { key: 'diastolicBP', label: 'Diastolic Blood Pressure', unit: 'mmHg', range: '<80', placeholder: '0' },
  { key: 'heartRate', label: 'Heart Rate', unit: 'bpm', range: '60-100', placeholder: '0' },
  { key: 'bmi', label: 'BMI', unit: 'kg/m²', range: '18.5-24.9', placeholder: '0.0' },
  { key: 'totalCholesterol', label: 'Total Cholesterol', unit: 'mg/dL', range: '<200', placeholder: '0' },
  { key: 'fastingGlucose', label: 'Fasting Glucose', unit: 'mg/dL', range: '70-100', placeholder: '0' },
  { key: 'creatinine', label: 'Creatinine', unit: 'mg/dL', range: '0.6-1.3', placeholder: '0.0' },
];

const CONDITIONS: { label: string; value: Condition; icon: string }[] = [
  { label: 'Kidney Disease', value: 'kidney', icon: '🫘' },
  { label: 'Heart Disease', value: 'heart', icon: '❤️' },
  { label: 'Diabetes', value: 'diabetes', icon: '🩸' },
  { label: 'Normal Adult', value: 'normal', icon: '✅' },
];

function getFields(condition: Condition): FieldDef[] {
  switch (condition) {
    case 'kidney': return KIDNEY_FIELDS;
    case 'heart': return HEART_FIELDS;
    case 'diabetes': return DIABETES_FIELDS;
    case 'normal': return NORMAL_FIELDS;
  }
}

export default function MedicalConditions() {
  const [selected, setSelected] = useState<Condition>('kidney');
  const [values, setValues] = useState<Record<string, Record<string, string>>>({
    kidney: {},
    heart: {},
    diabetes: {},
    normal: {},
  });
  const [saved, setSaved] = useState(false);

  const fields = getFields(selected);

  const handleChange = (key: string, text: string) => {
    setValues((prev) => ({
      ...prev,
      [selected]: { ...prev[selected], [key]: text },
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const conditionTitle = CONDITIONS.find((c) => c.value === selected)?.label || '';

  return (
    <SectionCard title="Medical Conditions" icon="🩺">
      {/* Condition Selector */}
      <View style={styles.selectorRow}>
        {CONDITIONS.map((c) => (
          <TouchableOpacity
            key={c.value}
            style={[styles.condBtn, selected === c.value && styles.condBtnActive]}
            onPress={() => setSelected(c.value)}
            activeOpacity={0.75}
          >
            <Text style={styles.condIcon}>{c.icon}</Text>
            <Text style={[styles.condLabel, selected === c.value && styles.condLabelActive]}>
              {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Condition Title */}
      <View style={styles.condHeader}>
        <Text style={styles.condHeaderText}>
          Medical Conditions — {conditionTitle}
        </Text>
      </View>

      {/* Fields grid */}
      <View style={styles.fieldsGrid}>
        {fields.map((field) => (
          <View key={field.key} style={styles.fieldHalf}>
            <InputField
              label={field.label}
              value={values[selected][field.key] || ''}
              onChangeText={(v) => handleChange(field.key, v)}
              placeholder={field.placeholder}
              unit={field.unit}
              normalRange={field.range}
              keyboardType="numeric"
            />
          </View>
        ))}
      </View>

      <TouchableOpacity onPress={handleSave} activeOpacity={0.85} style={styles.saveBtn}>
        <LinearGradient
          colors={['#7B4FD8', '#E040FB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.saveBtnGradient}
        >
          <Text style={styles.saveBtnText}>
            {saved ? '✓ Saved!' : '💾 Save Health Data'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  selectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  condBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9F9FF',
    gap: 4,
  },
  condBtnActive: {
    borderColor: '#7B4FD8',
    backgroundColor: '#F3F0FF',
  },
  condIcon: { fontSize: 14 },
  condLabel: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  condLabelActive: {
    color: '#7B4FD8',
  },
  condHeader: {
    backgroundColor: '#F3F0FF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  condHeaderText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#7B4FD8',
  },
  fieldsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  fieldHalf: {
    width: '100%',
  },
  saveBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 8,
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

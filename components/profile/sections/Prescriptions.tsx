import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SectionCard from '../SectionCard';
import UploadCard from '../UploadCard';

interface UploadedFile {
  name: string;
  uri: string;
  type?: string;
}

export default function Prescriptions() {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleUpload = () => {
    Alert.alert(
      'Upload Prescription',
      'Choose upload method',
      [
        { text: 'Camera Roll / Gallery', onPress: pickFromGallery },
        { text: 'Documents / PDF', onPress: pickDocument },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.85,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const name = asset.fileName || `prescription_${Date.now()}.jpg`;
      setFiles((prev) => [...prev, { name, uri: asset.uri, type: 'image' }]);
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setFiles((prev) => [
        ...prev,
        { name: asset.name, uri: asset.uri, type: asset.mimeType },
      ]);
    }
  };

  const handleView = (file: UploadedFile) => {
    Linking.openURL(file.uri).catch(() => {
      Alert.alert('Error', 'Cannot open this file on device.');
    });
  };

  const handleDelete = (index: number) => {
    Alert.alert('Delete File', 'Remove this prescription?', [
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setFiles((prev) => prev.filter((_, i) => i !== index)),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <SectionCard title="Prescriptions" icon="📋">
      <Text style={styles.hint}>
        Upload your doctor's prescriptions (PDF or image).
      </Text>
      <UploadCard
        files={files}
        onUploadPress={handleUpload}
        onViewFile={handleView}
        onDeleteFile={handleDelete}
      />
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
});

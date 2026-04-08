import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface UploadedFile {
  name: string;
  uri: string;
  type?: string;
}

interface UploadCardProps {
  files: UploadedFile[];
  onUploadPress: () => void;
  onViewFile: (file: UploadedFile) => void;
  onDeleteFile: (index: number) => void;
}

export default function UploadCard({
  files,
  onUploadPress,
  onViewFile,
  onDeleteFile,
}: UploadCardProps) {
  return (
    <View>
      {/* Upload Button */}
      <TouchableOpacity onPress={onUploadPress} activeOpacity={0.85} style={styles.uploadBtn}>
        <LinearGradient
          colors={['#7B4FD8', '#E040FB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.uploadBtnGradient}
        >
          <Text style={styles.uploadIcon}>📄</Text>
          <Text style={styles.uploadBtnText}>Upload Prescription</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* File List */}
      {files.length > 0 && (
        <View style={styles.fileList}>
          {files.map((file, index) => (
            <View key={index} style={styles.fileItem}>
              <View style={styles.fileInfo}>
                <Text style={styles.fileIcon}>
                  {file.name.endsWith('.pdf') ? '📕' : '🖼️'}
                </Text>
                <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
                  {file.name}
                </Text>
              </View>
              <View style={styles.fileActions}>
                <TouchableOpacity
                  style={styles.viewBtn}
                  onPress={() => onViewFile(file)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.viewBtnText}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => onDeleteFile(index)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {files.length === 0 && (
        <Text style={styles.emptyNote}>No prescriptions uploaded yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  uploadBtn: {
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  uploadBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 18,
    gap: 8,
  },
  uploadIcon: { fontSize: 16 },
  uploadBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  fileList: {
    gap: 8,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9FF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fileInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 10,
  },
  fileIcon: { fontSize: 18 },
  fileName: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  fileActions: {
    flexDirection: 'row',
    gap: 6,
  },
  viewBtn: {
    backgroundColor: '#F3F0FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewBtnText: {
    color: '#7B4FD8',
    fontSize: 12,
    fontWeight: '700',
  },
  deleteBtn: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyNote: {
    fontSize: 13,
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 12,
  },
});

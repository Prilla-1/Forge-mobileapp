// components/SaveButton.tsx
import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useCanvas } from '../../context/CanvasContext';
import { saveShapes, saveToBackend } from '../../utils/saveUtils';

export default function SaveButton() {
  const { shapes } = useCanvas();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveShapes(shapes);        // Save locally
      await saveToBackend(shapes);     // Save to backend
      Alert.alert('✅ Success', 'Saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      Alert.alert('❌ Error', 'Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, isSaving && styles.disabled]}
      onPress={handleSave}
      disabled={isSaving}
    >
      {isSaving ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>💾 Save</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignSelf: 'center',
    margin: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.7,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

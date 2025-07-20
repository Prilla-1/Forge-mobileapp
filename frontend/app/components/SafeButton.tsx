// components/SaveButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useCanvas } from '../context/CanvasContext';
import { saveShapes, saveToBackend } from '../../utils/saveUtils';

export default function SaveButton() {
  const { shapes } = useCanvas();

  const handleSave = async () => {
    await saveShapes(shapes);       // Save locally
    await saveToBackend(shapes);    // Save to backend
    alert('Saved successfully!');
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleSave}>
      <Text style={styles.text}>💾 Save</Text>
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
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

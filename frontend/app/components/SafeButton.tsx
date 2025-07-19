// components/SaveButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useCanvas } from '../context/CanvasContext';
import { saveShapes, saveToBackend } from '../../utils/saveUtils';

export default function SaveButton() {
  const { shapes } = useCanvas();

  const handleSave = async () => {
    await saveShapes(shapes);       // local
    await saveToBackend(shapes);    // backend
    alert('Saved successfully!');
  };

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

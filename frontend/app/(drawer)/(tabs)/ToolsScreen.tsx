import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useCanvas } from '../../context/CanvasContext';
import { generateUUID } from '@/utils/generateUUID';

export default function ToolsScreen() {
  const {
    setShapes,
    shapes,
    undo,
    redo,
    saveToHistory,
    addImageFromGallery,
  } = useCanvas();

  const addShape = (type: 'rectangle' | 'circle' | 'oval' | 'text') => {
    const baseShape = {
      id: generateUUID(),
      type,
      position: { x: 100, y: 100 },
      style: {
        width: 120,
        height: 50,
        backgroundColor: type === 'text' ? 'transparent' : '#3498db',
        borderColor: '#000',
        borderWidth: 1,
      },
    };

    const newShape = type === 'text'
      ? {
          ...baseShape,
          text: 'Edit Me',
          fontSize: 18,
          fontColor: '#000000',
        }
      : baseShape;

    const updated = [...shapes, newShape];
    saveToHistory(updated);
  };

  const deleteAll = () => {
    saveToHistory([]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tools</Text>

      <TouchableOpacity style={styles.button} onPress={() => addShape('rectangle')}>
        <Text style={styles.text}>Add Rectangle</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => addShape('circle')}>
        <Text style={styles.text}>Add Circle</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => addShape('oval')}>
        <Text style={styles.text}>Add Oval</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => addShape('text')}>
        <Text style={styles.text}>Add Text</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={addImageFromGallery}>
        <Text style={styles.text}>Insert Image</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={undo}>
        <Text style={styles.text}>Undo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={redo}>
        <Text style={styles.text}>Redo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#e74c3c' }]} onPress={deleteAll}>
        <Text style={styles.text}>Delete All</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    width: '100%',
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#2980b9',
    marginBottom: 16,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});

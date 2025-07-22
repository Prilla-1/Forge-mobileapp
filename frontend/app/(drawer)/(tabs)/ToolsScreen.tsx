import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCanvas } from '../../../context/CanvasContext';
import { generateUUID } from '@/utils/generateUUID';
import { ShapeType } from '../../../constants/type';

export default function ToolsScreen() {
  const { addShape: addShapeToCanvas, undo, redo, saveToHistory, addImageFromGallery } = useCanvas();

  const createShapeStyle = (type: string) => {
    const base = {
      width: 140,
      height: type === 'oval' ? 70 : 120,
      backgroundColor: '#3498db',
      borderRadius: type === 'circle' ? 60 : type === 'oval' ? 35 : 8,
    };

    if (type === 'text') {
      return {
        ...base,
        backgroundColor: 'transparent',
        fontSize: 18,
        color: '#000000',
      };
    }

    return base;
  };

  const addShape = (type: ShapeType['type']) => {
    const shape: ShapeType = {
      id: generateUUID(),
      type,
      position: { x: 100, y: 100 },
      style: createShapeStyle(type),
    };

    if (type === 'text') {
      shape.text = 'Edit Me';
    }

    addShapeToCanvas(shape);
  };

  const deleteAll = () => saveToHistory([]);

  const tools = [
    { name: 'Add Rectangle', icon: 'square-outline', action: () => addShape('rectangle') },
    { name: 'Add Circle', icon: 'ellipse-outline', action: () => addShape('circle') },
    {
      name: 'Add Oval',
      icon: null,
      customIcon: <Text style={styles.emojiIcon}>◉</Text>,
      action: () => addShape('oval'),
    },
    {
      name: 'Add Kite',
      icon: null,
      customIcon: <Text style={styles.emojiIcon}>🪁</Text>,
      action: () => addShape('kite'),
    },
    { name: 'Add Text', icon: 'text', action: () => addShape('text') },
    { name: 'Insert Image', icon: 'image-outline', action: addImageFromGallery },
    { name: 'Undo', icon: 'arrow-undo-outline', action: undo },
    { name: 'Redo', icon: 'arrow-redo-outline', action: redo },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TOOLS</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.grid}>
          {tools.map((tool) => (
            <TouchableOpacity key={tool.name} style={styles.button} onPress={tool.action}>
              {tool.customIcon ? (
                tool.customIcon
              ) : (
                <Ionicons name={tool.icon as any} size={40} color="#34495e" />
              )}
              <Text style={styles.buttonText}>{tool.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.button, styles.deleteAllButton]} onPress={deleteAll}>
          <Ionicons name="trash-outline" size={40} color="#c0392b" />
          <Text style={[styles.buttonText, { color: '#c0392b' }]}>Delete All</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50',
  },
  container: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#a5b9d0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#34495e',
    textAlign: 'center',
  },
  deleteAllButton: {
    width: '100%',
    height: 80,
    backgroundColor: '#fdecea',
    borderWidth: 1,
    borderColor: '#f9c5c0',
    aspectRatio: undefined,
  },
  emojiIcon: {
    fontSize: 36,
    lineHeight: 40,
  },
});

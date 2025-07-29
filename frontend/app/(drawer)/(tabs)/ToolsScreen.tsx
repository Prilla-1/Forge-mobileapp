import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCanvas } from '../../../context/CanvasContext';
import { generateUUID } from '@/utils/generateUUID';
import { ShapeType } from '../../../constants/type';
import Svg, { Polygon } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function ToolsScreen() {
  const { addShape: addShapeToCanvas, undo, redo, saveToHistory, addImageFromGallery } = useCanvas();
  const router = useRouter();

  const createShapeStyle = (type: string) => {
    const base = {
      width: type === 'rectangle' ? 140 : type === 'kite' ? 100 : 140,
      height: type === 'oval' ? 70 : type === 'rectangle' ? 80 : type === 'kite' ? 100 : 120,
      backgroundColor: '#3498db',
      borderRadius: type === 'circle' ? 60 : type === 'oval' ? 35 : type === 'kite' ? 0 : 8,
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
    // Navigate to Canvas screen immediately after adding shape
    setTimeout(() => {
      router.push('/(drawer)/(tabs)/CanvasScreen');
    }, 100);
  };

  const deleteAll = () => saveToHistory([]);

  const handleAddImage = async () => {
    await addImageFromGallery();
    // Navigate to Canvas screen after adding image
    setTimeout(() => {
      router.push('/(drawer)/(tabs)/CanvasScreen');
    }, 100);
  };

  const tools = [
    { 
      name: 'Add Rectangle', 
      customIcon: <View style={styles.rectIcon} />,
      action: () => addShape('rectangle') 
    },
    { name: 'Add Circle', icon: 'ellipse-outline', action: () => addShape('circle') },
    {
      name: 'Add Oval',
      customIcon: <View style={styles.ovalIcon} />,
      action: () => addShape('oval'),
    },
    {
      name: 'Add Kite',
      customIcon: <Svg width="40" height="40" viewBox="0 0 100 100">
        <Polygon
          points="50,0 100,50 50,100 0,50"
          fill="transparent"
          stroke="#34495e"
          strokeWidth="3"
        />
      </Svg>,
      action: () => addShape('kite'),
    },
    { name: 'Add Text', icon: 'text', action: () => addShape('text') },
    { name: 'Insert Image', icon: 'image-outline', action: handleAddImage },
    { name: 'Undo', icon: 'arrow-undo-outline', action: undo },
    { name: 'Redo', icon: 'arrow-redo-outline', action: redo },
  ];

  return (
    <LinearGradient colors={["#E9D5FF", "#F6F2F7"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: '#f5f7fa',
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
  rectIcon: {
    width: 44,
    height: 24,
    borderWidth: 3,
    borderColor: '#34495e',
    backgroundColor: 'transparent',
    borderRadius: 4,
    marginBottom: 2,
  },
  ovalIcon: {
    width: 40,
    height: 20,
    borderWidth: 3,
    borderColor: '#34495e',
    backgroundColor: 'transparent',
    borderRadius: 20,
    marginBottom: 2,
  },
});

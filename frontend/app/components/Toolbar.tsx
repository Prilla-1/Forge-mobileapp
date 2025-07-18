import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useCanvas } from '../context/CanvasContext';
import { generateUUID } from '../../utils/generateUUID';
import { ShapeType } from '../../constants/type';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const COLORS = ['#2196F3', '#E91E63', '#4CAF50', '#FF9800', '#9C27B0'];

const Toolbar = () => {
  const router = useRouter();
  const { shapes, setShapes, undo, redo, saveToHistory } = useCanvas();
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const addShape = (type: 'rectangle' | 'circle' | 'triangle') => {
    const newShape = {
      id: generateUUID(),
      type,
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      color: selectedColor,
    };
    setShapes([...shapes, newShape]);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Camera roll permission is needed to insert images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const newImage: ShapeType = {
        id: generateUUID(),
        type: 'image',
        x: 100,
        y: 100,
        width: 150,
        height: 150,
        uri: asset.uri,
        color: 'transparent',
      };
      setShapes([...shapes, newImage]);
    }
  };

  return (
    <View style={styles.toolbar}>
      <TouchableOpacity style={styles.button} onPress={() => addShape('rectangle')}>
        <Text style={styles.text}>▭</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => addShape('circle')}>
        <Text style={styles.text}>◯</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => addShape('triangle')}>
        <Text style={styles.text}>△</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Ionicons name="image-outline" size={22} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/trash')}>
        <Ionicons name="trash-bin-outline" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={undo}>
        <Ionicons name="arrow-undo" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={redo}>
        <Ionicons name="arrow-redo" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => saveToHistory(shapes)}>
        <Ionicons name="save-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default Toolbar;

const styles = StyleSheet.create({
  toolbar: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    marginHorizontal: 10,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 12,
  },
  text: {
    fontSize: 22,
  },
});

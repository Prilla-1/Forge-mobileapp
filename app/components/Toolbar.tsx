import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useCanvas } from '../../context/CanvasContext';
import { generateUUID } from '../../utils/generateUUID';
import { ShapeType } from '../../constants/type';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Toolbar = () => {
  const router = useRouter();
  const { shapes, setShapes, undo, redo, saveToHistory } = useCanvas();

  const addShape = (type: ShapeType['type']) => {
    const newShape: ShapeType = {
      id: generateUUID(),
      type,
      position: { x: 100, y: 100 },
      style: {
        width: 100,
        height: 100,
        backgroundColor: '#3498db',
        color: 'transparent', // for non-text shapes
      },
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
        uri: asset.uri,
        position: { x: 100, y: 100 },
        style: {
          width: 150,
          height: 150,
          color: 'transparent',
        },
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
      <TouchableOpacity style={styles.button} onPress={() => addShape('oval')}>
        <Text style={styles.text}>△</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => addShape('kite')}>
        <Text style={styles.text}>🪁</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => addShape('arrow')}>
        <Text style={styles.text}>➔</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Ionicons name="image-outline" size={22} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/trash')}>
        <Ionicons name="trash-bin-outline" size={22} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={undo}>
        <Ionicons name="arrow-undo" size={22} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={redo}>
        <Ionicons name="arrow-redo" size={22} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => saveToHistory(shapes)}>
        <Ionicons name="save-outline" size={22} color="#333" />
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
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
  },
});

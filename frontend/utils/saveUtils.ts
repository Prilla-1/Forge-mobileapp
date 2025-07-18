// utils/saveUtils.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShapeType } from '../constants/type';

const STORAGE_KEY = '@figma_shapes';

export const saveShapes = async (shapes: ShapeType[]) => {
  try {
    const json = JSON.stringify(shapes);
    await AsyncStorage.setItem(STORAGE_KEY, json);
  } catch (e) {
    console.error('Error saving to local storage', e);
  }
};

export const loadShapes = async (): Promise<ShapeType[]> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Error loading from local storage', e);
    return [];
  }
};

export const saveToBackend = async (shapes: ShapeType[]) => {
  try {
    await fetch('http://10.230.179.165:8081/api/shapes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shapes),
    });
  } catch (e) {
    console.error('Error saving to backend', e);
  }
};

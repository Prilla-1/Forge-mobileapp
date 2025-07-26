import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShapeType } from '../constants/type';

const BACKEND_URL = 'http://10.222.231.165:8081/api';

// const BACKEND_URL = 'http://10.21.192.165:8081';


export const saveShapes = async (shapes: ShapeType[]) => {
  try {
    await AsyncStorage.setItem('shapes', JSON.stringify(shapes));
  } catch (error) {
    console.error('Error saving to AsyncStorage:', error);
  }
};

export const loadShapes = async (): Promise<ShapeType[]> => {
  try {
    const json = await AsyncStorage.getItem('shapes');
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Error loading from AsyncStorage:', error);
    return [];
  }
};

export const saveToBackend = async (shapes: ShapeType[]) => {
  try {
    const response = await fetch(`${BACKEND_URL}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shapes),
    });

    if (!response.ok) throw new Error('Failed to save shapes');
    return await response.json();
  } catch (err) {
    console.error('Save failed:', err);
  }
};


export const loadFromBackend = async (): Promise<ShapeType[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/shapes`);
    if (!response.ok) throw new Error('Failed to load shapes');
    return await response.json();
  } catch (err) {
    console.error('Load failed:', err);
    return [];
  }
};

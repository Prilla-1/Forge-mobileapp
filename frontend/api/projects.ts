import axios from 'axios';
import { ShapeType } from '../constants/type';
import { API_BASE_URL } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Project {
  id: number;
  name: string;
  description?: string;
  content: ShapeType[];
}

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    throw new Error('No auth token found');
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getProjects = async (): Promise<Project[]> => {
  const headers = await getAuthHeaders();
  const response = await axios.get(`${API_BASE_URL}/projects`, headers);
  return response.data;
};

export const createProject = async (name: string, content: ShapeType[]): Promise<Project> => {
  const headers = await getAuthHeaders();
  const response = await axios.post(`${API_BASE_URL}/projects`, { name, content: JSON.stringify(content) }, headers);
  return response.data;
};

export const updateProject = async (id: number, name: string, content: ShapeType[]): Promise<Project> => {
  const headers = await getAuthHeaders();
  const response = await axios.put(`${API_BASE_URL}/projects/${id}`, { name, content: JSON.stringify(content) }, headers);
  return response.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  const headers = await getAuthHeaders();
  await axios.delete(`${API_BASE_URL}/projects/${id}`, headers);
}; 
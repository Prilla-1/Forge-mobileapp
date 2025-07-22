import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCanvas } from '../../context/CanvasContext';

const colorOptions = [
  { label: '🔴 Red', value: '#FF0000' },
  { label: '🟢 Green', value: '#00FF00' },
  { label: '🔵 Blue', value: '#0000FF' },
  { label: '🟡 Yellow', value: '#FFFF00' },
  { label: '🟣 Purple', value: '#800080' },
  { label: '⚫ Black', value: '#000000' },
  { label: '⚪ White', value: '#FFFFFF' },
];

const PopupToolbar = ({ shapeId }: { shapeId: string }) => {
  const { deleteShapeById, updateShape } = useCanvas();

  const handleColorChange = (color: string) => {
    updateShape(shapeId, { color });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎨 Color</Text>
      {colorOptions.map((option) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => handleColorChange(option.value)}
        >
          <Text style={styles.option}>{option.label}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity onPress={() => deleteShapeById(shapeId)}>
        <Text style={styles.delete}>🗑️ Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PopupToolbar;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  option: {
    fontSize: 16,
    marginVertical: 4,
  },
  delete: {
    fontSize: 16,
    marginTop: 12,
    color: 'red',
    fontWeight: '600',
  },
});

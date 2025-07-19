
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCanvas } from '../context/CanvasContext';

const PopupToolbar = ({ shapeId }: { shapeId: string }) => {
  const { deleteShapeById, updateShape } = useCanvas();

  const handleColorChange = (color: string) => {
    updateShape(shapeId, { color });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleColorChange('#FF0000')}>
        <Text style={styles.option}>🔴 Red</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleColorChange('#00FF00')}>
        <Text style={styles.option}>🟢 Green</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleColorChange('#0000FF')}>
        <Text style={styles.option}>🔵 Blue</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteShapeById(shapeId)}>
        <Text style={styles.delete}>🗑️ Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  option: {
    fontSize: 16,
    marginVertical: 4,
  },
  delete: {
    fontSize: 16,
    marginTop: 8,
    color: 'red',
  },
});

export default PopupToolbar;

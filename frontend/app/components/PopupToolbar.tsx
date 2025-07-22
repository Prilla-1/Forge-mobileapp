import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useCanvas } from '../context/CanvasContext';
import { MaterialIcons } from '@expo/vector-icons';

interface PopupMenuProps {
  shapeId: string;
  shapeType: string;
  onRequestClose: () => void;
}

const PopupMenu: React.FC<PopupMenuProps> = ({ shapeId, shapeType, onRequestClose }) => {
  const {
    deleteShapeById,
    updateShapeStyle,
    addShape,
    shapes,
    selectShape,
    setPopupShapeId,
  } = useCanvas();

  const handleDelete = () => {
    deleteShapeById(shapeId);
    setPopupShapeId(null);
  };

  const handleDuplicate = () => {
    const original = shapes.find(s => s.id === shapeId);
    if (!original) return;
    const copy = {
      ...original,
      id: Math.random().toString(),
      position: {
        x: original.position.x + 20,
        y: original.position.y + 20,
      },
    };
    addShape(copy);
    setPopupShapeId(null);
  };

  const renderTextToolbar = () => (
    <View style={styles.toolbarRow}>
      <TouchableOpacity onPress={() => updateShapeStyle(shapeId, { fontWeight: 'bold' })}>
        <Text style={styles.text}>B</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => updateShapeStyle(shapeId, { fontStyle: 'italic' })}>
        <Text style={styles.text}>I</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => updateShapeStyle(shapeId, { textDecorationLine: 'underline' })}>
        <Text style={styles.text}>U</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDelete}>
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  const renderShapeOptions = () => (
    <View style={styles.toolbarRow}>
      <TouchableOpacity onPress={handleDuplicate}>
        <MaterialIcons name="content-copy" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDelete}>
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.popupContainer}>
      {shapeType === 'text' ? renderTextToolbar() : renderShapeOptions()}
    </View>
  );
};

export default PopupMenu;

const styles = StyleSheet.create({
  popupContainer: {
    position: 'absolute',
    top: -50,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    elevation: 5,
    flexDirection: 'row',
    zIndex: 100,
  },
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    fontSize: 18,
    marginHorizontal: 8,
    fontWeight: 'bold',
  },
});

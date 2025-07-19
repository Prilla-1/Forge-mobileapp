import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Text,
} from 'react-native';
import Canvas from '../../components/Canvas';
import { Ionicons } from '@expo/vector-icons';
import { useCanvas } from '../../context/CanvasContext';
import { useRouter } from 'expo-router';

export default function CanvasScreen() {
  const router = useRouter();
  const {
    saveToMirror,
    undo,
    redo,
    saveToStorage,
    selectedShapeId,
    updateShape,
    deleteToTrash,
    addShape,
    shapes,
  } = useCanvas();

  const selectedShape = shapes.find((s) => s.id === selectedShapeId);
  const [fontColorModal, setFontColorModal] = useState(false);
  const [textInput, setTextInput] = useState('');

  const isText = selectedShape?.type === 'text';

  // Sync text input when selection changes
  useEffect(() => {
    if (isText && selectedShape?.text) {
      setTextInput(selectedShape.text);
    } else {
      setTextInput('');
    }
  }, [selectedShapeId, selectedShape?.text, isText]);

  const handleTextChange = (text: string) => {
    setTextInput(text);
    if (selectedShapeId && selectedShape?.type === 'text') {
      updateShape(selectedShapeId, { text });
    }
  };
  const handleAddButton = () => {
  addShape({
    id: Date.now().toString(),
    type: 'button',
    position: { x: 150, y: 150 },
    style: {
      fontSize: 16,
      color: 'white',
      backgroundColor: '#3498db',
      fontFamily: 'System',
    },
    text: 'Click Me',
  });
};


  const toggleBold = () => {
    if (!selectedShapeId || selectedShape?.type !== 'text') return;
    const currentWeight = selectedShape?.style?.fontWeight || 'normal';
    updateShape(selectedShapeId, {
      style: {
        ...selectedShape?.style,
        fontWeight: currentWeight === 'bold' ? 'normal' : 'bold',
      },
    });
  };

  const toggleItalic = () => {
    if (!selectedShapeId || selectedShape?.type !== 'text') return;
    const currentStyle = selectedShape?.style?.fontStyle || 'normal';
    updateShape(selectedShapeId, {
      style: {
        ...selectedShape?.style,
        fontStyle: currentStyle === 'italic' ? 'normal' : 'italic',
      },
    });
  };

  const changeFontSize = (delta: number) => {
    if (!selectedShapeId || selectedShape?.type !== 'text') return;
    const current = selectedShape?.style?.fontSize || 16;
    updateShape(selectedShapeId, {
      style: {
        ...selectedShape?.style,
        fontSize: current + delta,
      },
    });
  };

  const changeFontColor = (color: string) => {
    if (!selectedShapeId || selectedShape?.type !== 'text') return;
    updateShape(selectedShapeId, {
      style: {
        ...selectedShape?.style,
        color,
      },
    });
    setFontColorModal(false);
  };

  const handleAddText = () => {
    addShape({
      id: Date.now().toString(),
      type: 'text',
      position: { x: 100, y: 100 },
      style: {
        fontSize: 18,
        color: 'black',
        fontFamily: 'System',
      },
      text: 'New Text',
    });
  };

  return (
    <View style={styles.container}>
      <Canvas />

      {/*  Floating Formatting Toolbar (Text Only) */}
      {isText && (
        <View style={styles.formattingBar}>
          <TouchableOpacity onPress={toggleBold}>
            <Ionicons name="text" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleItalic}>
            <Ionicons name="text-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeFontSize(2)}>
            <Ionicons name="add" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeFontSize(-2)}>
            <Ionicons name="remove" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFontColorModal(true)}>
            <Ionicons name="color-palette" size={24} color="black" />
          </TouchableOpacity>
   

        </View>
      )}

      {/* ✏️ Inline Text Editor */}
      {isText && (
        <TextInput
          style={styles.inlineInput}
          value={textInput}
          onChangeText={handleTextChange}
          placeholder="Edit text"
        />
      )}

      {/* 🎨 Color Picker Modal */}
      <Modal visible={fontColorModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.colorPicker}>
            {['black', 'red', 'blue', 'green', 'purple'].map((color) => (
              <TouchableOpacity
                key={color}
                style={[styles.colorBox, { backgroundColor: color }]}
                onPress={() => changeFontColor(color)}
              />
            ))}
            <TouchableOpacity onPress={() => setFontColorModal(false)}>
              <Text style={{ marginTop: 10, color: 'blue' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 🛠️ Bottom Toolbar */}
      <View style={styles.bottomToolbar}>
        <TouchableOpacity onPress={undo}>
          <Ionicons name="arrow-undo" size={28} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={redo}>
          <Ionicons name="arrow-redo-sharp" size={28} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleAddText}>
          <Ionicons name="text" size={28} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(drawer)/(tabs)/Templates')}>
          <Ionicons name="albums-outline" size={28} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            saveToMirror();
            router.push('/mirror');
          }}
        >
          <Ionicons name="eye" size={28} color="black" />
        </TouchableOpacity>
               <TouchableOpacity onPress={handleAddButton}>
  <Ionicons name="radio-button-on" size={28} color="black" />
</TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            saveToMirror();
            router.push('/(drawer)/(tabs)/mirror');
          }}
        >
          <Ionicons name="save-outline" size={28} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/trash')}>
          <Ionicons name="trash-outline" size={28} color="black" />
        </TouchableOpacity>

        {selectedShapeId && (
          <TouchableOpacity onPress={() => deleteToTrash(selectedShapeId)}>
            <Ionicons name="close-circle" size={28} color="black" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomToolbar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
  },
  formattingBar: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    zIndex: 999,
  },
  inlineInput: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    zIndex: 999,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorPicker: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  colorBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginVertical: 5,
  },
});

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useCanvas } from '../context/CanvasContext';
import { ShapeType } from '../../constants/type';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';

const Canvas = () => {
  const {
    shapes,
    addTextShape,
    updateShape,
    selectedShapeId,
    selectShape,
  } = useCanvas();

  const [textInputVisible, setTextInputVisible] = useState(false);
  const [formatModalVisible, setFormatModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [fontColor, setFontColor] = useState('black');
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);

  const selectedShape = shapes.find((shape) => shape.id === selectedShapeId);

  useEffect(() => {
    if (selectedShape?.type === 'text') {
      setInputText(selectedShape.text || '');
      setFontSize(selectedShape.style?.fontSize || 16);
      setFontColor(selectedShape.style?.color || 'black');
      setBold(selectedShape.style?.fontWeight === 'bold');
      setItalic(selectedShape.style?.fontStyle === 'italic');
    }
  }, [selectedShapeId]);

  const handleFormatUpdate = () => {
    if (selectedShape && selectedShape.type === 'text') {
      updateShape(selectedShape.id, {
        ...selectedShape,
        text: inputText,
        style: {
          ...selectedShape.style,
          fontSize,
          color: fontColor,
          fontWeight: bold ? 'bold' : 'normal',
          fontStyle: italic ? 'italic' : 'normal',
        },
      });
    }
    setFormatModalVisible(false);
  };

  const renderShape = (shape: ShapeType) => {
    const isSelected = selectedShapeId === shape.id;

    if (shape.type === 'text') {
      return (
        <TouchableOpacity
          key={shape.id}
          style={[
            styles.shape,
            {
              top: shape.position.y,
              left: shape.position.x,
              position: 'absolute',
            },
          ]}
          onLongPress={() => {
            selectShape(shape.id);
            setFormatModalVisible(true);
          }}
        >
          <Text
            style={{
              fontSize: shape.style?.fontSize || 16,
              color: shape.style?.color || 'black',
              fontWeight: shape.style?.fontWeight || 'normal',
              fontStyle: shape.style?.fontStyle || 'normal',
            }}
          >
            {shape.text}
          </Text>
        </TouchableOpacity>
      );
    }

    // Placeholder for rectangle/circle/image
    return (
      <View
        key={shape.id}
        style={[
          styles.shape,
          {
            backgroundColor: shape.style?.backgroundColor || '#ccc',
            width: shape.style?.width || 100,
            height: shape.style?.height || 100,
            top: shape.position.y,
            left: shape.position.x,
            position: 'absolute',
          },
        ]}
      />
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {shapes.map(renderShape)}

        {/* Floating toolbar */}
        <View style={styles.toolbar}>
          <TouchableOpacity
            onPress={() => {
              addTextShape();
            }}
          >
            <FontAwesome name="plus" size={24} color="white" />
            <Text style={styles.toolbarText}>Add Text</Text>
          </TouchableOpacity>
        </View>

        {/* Format Modal */}
        <Modal visible={formatModalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Format Text</Text>

              <TextInput
                placeholder="Enter text"
                value={inputText}
                onChangeText={setInputText}
                style={styles.textInput}
              />

              <TextInput
                placeholder="Font size"
                keyboardType="numeric"
                value={fontSize.toString()}
                onChangeText={(text) => setFontSize(Number(text))}
                style={styles.textInput}
              />

              <TextInput
                placeholder="Font color"
                value={fontColor}
                onChangeText={setFontColor}
                style={styles.textInput}
              />

              <View style={styles.formatButtons}>
                <TouchableOpacity onPress={() => setBold(!bold)}>
                  <Text style={{ fontWeight: bold ? 'bold' : 'normal' }}>B</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setItalic(!italic)}>
                  <Text style={{ fontStyle: italic ? 'italic' : 'normal' }}>I</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleFormatUpdate}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
};

export default Canvas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  shape: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolbar: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 10,
  },
  toolbarText: {
    color: 'white',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 20,
    borderRadius: 10,
  },
  textInput: {
    borderBottomWidth: 1,
    borderColor: '#999',
    marginVertical: 10,
    padding: 5,
  },
  formatButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  saveBtn: {
    backgroundColor: '#000',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  saveText: {
    color: 'white',
  },
});

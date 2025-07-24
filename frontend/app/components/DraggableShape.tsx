import React, { useState, useEffect,useRef } from 'react';
import { Image, Text, StyleSheet, View, TextInput, TouchableOpacity, Modal, ViewStyle } from 'react-native';
import type { TextInput as RNTextInput } from 'react-native';
import type { Ref } from 'react'
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {useSharedValue,useAnimatedStyle,withSpring,runOnJS,} from 'react-native-reanimated';
import { useCanvas } from '../../context/CanvasContext';
import { ShapeType } from '../../constants/type';
import { Ionicons } from '@expo/vector-icons';
import { generateUUID } from '@/utils/generateUUID';

const HANDLE_SIZE = 8;
const MIN_SIZE = 40;
const COLORS = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#34495e', '#fff', '#000'];
const scaleFactor = 0.3;

interface DraggableShapeProps {
  shape: ShapeType;
  onLongPress: (params: { id: string; x: number; y: number }) => void;
  setPreviewLine: (line: { x1: number; y1: number; x2: number; y2: number } | null) => void;
  onTap: (shapeId: string) => void;
  connectMode: boolean;
  connectStartShapeId: string | null;
}
type Anchor = 'tl' | 'tr' | 'bl' | 'br' | 't' | 'b' | 'l' | 'r';
type StartPos = { x: number; y: number };

const DraggableShape: React.FC<DraggableShapeProps> = ({ shape, onLongPress, setPreviewLine, onTap, connectMode }) => {
  const [editTextModal, setEditTextModal] = useState(false);
  const [editText, setEditText] = useState(shape.text || '');
  const [colorModal, setColorModal] = useState(false);
  const { updateShape, selectedShapeId, setSelectedShapeId, addLine, shapes } = useCanvas();
  const isSelected = selectedShapeId === shape.id;
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);

  useEffect(() => {
    setEditText(shape.text || '');
    setBold(shape.style?.fontWeight === 'bold');
    setItalic(shape.style?.fontStyle === 'italic');
    setUnderline(shape.style?.textDecorationLine === 'underline');
  }, [shape.text, shape.id, shape.style]);

  // Close modals if shape is deselected to prevent modal conflicts
  useEffect(() => {
  if (!isSelected) {
    setEditTextModal(false);
    setColorModal(false);
  }
}, [isSelected]);
  if (shape.isVisible === false) return null;

  const translateX = useSharedValue(shape.position.x);
  const translateY = useSharedValue(shape.position.y);
  const resizeWidth = useSharedValue(shape.style.width || 100);
  const resizeHeight = useSharedValue(shape.style.height || 100);

 
const baseHandleStyle = {
  position: 'absolute' as const,
  width: HANDLE_SIZE,
  height: HANDLE_SIZE,
  backgroundColor: '#fff',
  borderRadius: 2,
  borderColor: '#888',
  borderWidth: 1,
  zIndex: 10,
};
  const baseStyle: ViewStyle = {
    backgroundColor: shape.style?.backgroundColor || '#ccc',
    borderRadius: shape.type === 'circle' || shape.type === 'oval' ? 999 : (shape.style?.borderRadius || 0),
  };

  const diamondOuterStyle: ViewStyle = shape.type === 'diamond' ? { transform: [{ rotate: '45deg' }] } : {};
  const diamondInnerStyle: ViewStyle = shape.type === 'diamond' ? { transform: [{ rotate: '-45deg' }] } : {};

  const updatePositionAndSize = () => {
    runOnJS(updateShape)(shape.id, {
      position: { x: translateX.value, y: translateY.value },
      style: { width: resizeWidth.value, height: resizeHeight.value },
    });
  };

  const createResizeGesture = (anchor: Anchor) =>
    Gesture.Pan()
      .onBegin(() => runOnJS(setSelectedShapeId)(shape.id))
      .onUpdate((event) => {
  const scaleFactor = 0.2;

  let newWidth = resizeWidth.value;
  let newHeight = resizeHeight.value;
  let newX = translateX.value;
  let newY = translateY.value;

  if (shape.type === 'diamond') {
    const change = Math.max(event.translationX, event.translationY) * scaleFactor;
    newWidth = resizeWidth.value + change;
    newHeight = resizeWidth.value + change;
  } else {
    if (anchor.includes('l')) {
      newWidth = resizeWidth.value - event.translationX * scaleFactor;
      newX = shape.position.x + event.translationX * scaleFactor;
    } else if (anchor.includes('r')) {
      newWidth = resizeWidth.value + event.translationX * scaleFactor;
    }

    if (anchor.includes('t')) {
      newHeight = resizeHeight.value - event.translationY * scaleFactor;
      newY = shape.position.y + event.translationY * scaleFactor;
    } else if (anchor.includes('b')) {
      newHeight = resizeHeight.value + event.translationY * scaleFactor;
    }
  }

  resizeWidth.value = Math.max(MIN_SIZE, newWidth);
  resizeHeight.value = Math.max(MIN_SIZE, newHeight);
  translateX.value = newX;
  translateY.value = newY;
})
.onEnd(updatePositionAndSize);

  const panGesture = Gesture.Pan()
    .onBegin(() => runOnJS(setSelectedShapeId)(shape.id))
    .onUpdate((event) => {
      const scaleFactor=0.2;
      if (shape.isLocked) return;
      translateX.value = withSpring((event.translationX*scaleFactor) + shape.position.x);
      translateY.value = withSpring((event.translationY*scaleFactor) + shape.position.y);
    })
    .onEnd(updatePositionAndSize);

  const createConnectionGesture = (startPos: StartPos) =>
    Gesture.Pan()
      .onBegin(() => runOnJS(setSelectedShapeId)(shape.id))
      .onStart(() => runOnJS(setPreviewLine)({ x1: startPos.x, y1: startPos.y, x2: startPos.x, y2: startPos.y }))
      .onUpdate((event) => runOnJS(setPreviewLine)({ x1: startPos.x, y1: startPos.y, x2: event.absoluteX, y2: event.absoluteY }))
      .onEnd((event) => {
        const endShape = shapes.find((s: ShapeType) =>
          event.absoluteX >= s.position.x &&
          event.absoluteX <= s.position.x + (s.style.width || 0) &&
          event.absoluteY >= s.position.y &&
          event.absoluteY <= s.position.y + (s.style.height || 0) &&
          s.id !== shape.id
        );
        if (endShape) {
          runOnJS(addLine)({ id: generateUUID(), startShapeId: shape.id, endShapeId: endShape.id });
        }
        runOnJS(setPreviewLine)(null);
      });

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: translateX.value,
    top: translateY.value,
    width: resizeWidth.value,
    height: resizeHeight.value,
  }));

  const toolbarStyle = useAnimatedStyle(() => ({
        position: 'absolute',
    left: 0,
    top: -40,
    width: resizeWidth.value,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 30,
  }));

  const animatedTextStyle = useAnimatedStyle(() => {
    const shapeSize = Math.min(resizeWidth.value, resizeHeight.value);
    const fontSize = Math.max(8, shapeSize / 6);
    return {
      fontSize: fontSize,
      color: shape.style?.color || '#333',
      fontWeight: bold ? 'bold' : 'normal',
      fontStyle: italic ? 'italic' : 'normal',
      textDecorationLine: underline ? 'underline' : 'none',
    };
  });

  // Animated styles for each handle
  
const handleTL = useAnimatedStyle(() => ({
  ...baseHandleStyle,
  left: -HANDLE_SIZE / 2,
  top: -HANDLE_SIZE / 2,
}));

const handleTR = useAnimatedStyle(() => ({
  ...baseHandleStyle,
  left: resizeWidth.value - HANDLE_SIZE / 2,
  top: -HANDLE_SIZE / 2,
}));

const handleBL = useAnimatedStyle(() => ({
  ...baseHandleStyle,
  left: -HANDLE_SIZE / 2,
  top: resizeHeight.value - HANDLE_SIZE / 2,
}));

const handleBR = useAnimatedStyle(() => ({
  ...baseHandleStyle,
  left: resizeWidth.value - HANDLE_SIZE / 2,
  top: resizeHeight.value - HANDLE_SIZE / 2,
}));

const handleT = useAnimatedStyle(() => ({
  ...baseHandleStyle,
  left: (resizeWidth.value - HANDLE_SIZE) / 2,
  top: -HANDLE_SIZE / 2,
}));

const handleB = useAnimatedStyle(() => ({
  ...baseHandleStyle,
  left: (resizeWidth.value - HANDLE_SIZE) / 2,
  top: resizeHeight.value - HANDLE_SIZE / 2,
}));

const handleL = useAnimatedStyle(() => ({
  ...baseHandleStyle,
  left: -HANDLE_SIZE / 2,
  top: (resizeHeight.value - HANDLE_SIZE) / 2,
}));

const handleR = useAnimatedStyle(() => ({
  ...baseHandleStyle,
  left: resizeWidth.value - HANDLE_SIZE / 2,
  top: (resizeHeight.value - HANDLE_SIZE) / 2,
}));
  // Ref for TextInput to blur on save
  const textInputRef = React.useRef<TextInput>(null);

  // Pinch-to-resize gesture
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      // Calculate new width/height based on scale
      const newWidth = Math.max(MIN_SIZE, resizeWidth.value * event.scale);
      const newHeight = Math.max(MIN_SIZE, resizeHeight.value * event.scale);
      resizeWidth.value = newWidth;
      resizeHeight.value = newHeight;
    })
    .onEnd(() => {
  runOnJS(updateShape)(shape.id, {
    position: { x: Math.round(translateX.value), y: Math.round(translateY.value) },
  });
});


  // Combine pan and pinch gestures
  const panAndPinch = Gesture.Simultaneous(panGesture, pinchGesture);

  // Tap handler for connect mode or normal selection
  const handleTap = () => {
    if (connectMode && onTap) {
      onTap(shape.id);
    } else {
      setSelectedShapeId(shape.id);
    }
  };

  return (
    <>
      {isSelected && (
        <>
          {/* Global Modal for Text Editing */}
        <Modal
  visible={editTextModal}
  transparent
  animationType="fade"
  onRequestClose={() => setEditTextModal(false)}
>
  <View style={[styles.modalOverlay]}>
    <View style={styles.modalContent}>
      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Edit Text</Text>

      {/* Toolbar */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 8 }}>
        <TouchableOpacity
          onPress={() => setBold(b => !b)}
          style={[styles.toolbarBtn, bold && { backgroundColor: '#eee' }]}
        >
          <Text style={{ fontWeight: 'bold' }}>B</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setItalic(i => !i)}
          style={[styles.toolbarBtn, italic && { backgroundColor: '#eee' }]}
        >
          <Text style={{ fontStyle: 'italic' }}>I</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setUnderline(u => !u)}
          style={[styles.toolbarBtn, underline && { backgroundColor: '#eee' }]}
        >
          <Text style={{ textDecorationLine: 'underline' }}>U</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        ref={textInputRef as React.Ref<TextInput>}
        value={editText}
        onChangeText={setEditText}
        autoFocus
        style={[
          styles.textInput,
          {
            textAlign: 'center',
            fontWeight: bold ? 'bold' : 'normal',
            fontStyle: italic ? 'italic' : 'normal',
            textDecorationLine: underline ? 'underline' : 'none',
          },
        ]}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
        <TouchableOpacity onPress={() => setEditTextModal(false)} style={styles.cancelBtn}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={() => {
           updateShape(shape.id, {
              text: editText,
               style: {
             ...(shape.style || {}),
              fontWeight: bold ? 'bold' : 'normal',
               fontStyle: italic ? 'italic' : 'normal',
                textDecorationLine: underline ? 'underline' : 'none', },
                     });
            setEditTextModal(false);
          }}
        >
          <Text style={{ color: 'white' }}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

          {/* Color Picker Modal */}
          <Modal
            visible={colorModal}
            transparent
            animationType="fade"
            onRequestClose={() => setColorModal(false)}
          >
            <View style={[styles.modalOverlay, { flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }]}>
              <View style={styles.modalContent}>
                <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Pick a Color</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {COLORS.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: color,
                        margin: 6,
                        borderWidth: 2,
                        borderColor: '#ccc',
                      }}
                      onPress={() => {
                        try {
                          updateShape(shape.id, {
                             style: {
                         ...shape.style, 
                              backgroundColor: color,
                                 },
                         });
                       } finally {
                      setColorModal(false);
                          }}}
                    />
                  ))}
                </View>
                <TouchableOpacity onPress={() => setColorModal(false)} style={[styles.cancelBtn, { alignSelf: 'center', marginTop: 12 }]}>
                  <Text>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
      <GestureDetector gesture={panAndPinch}>
        <Animated.View style={[animatedStyle, styles.shapeContainer]}>
          <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={handleTap}>
            <Animated.View style={[styles.shape, baseStyle, diamondOuterStyle, isSelected && !shape.isLocked && styles.selectedBorder]}>
              <View style={[styles.contentContainer, diamondInnerStyle]}>
                {(shape.type === 'rectangle' || shape.type === 'circle' || shape.type === 'text' || shape.type === 'oval' || shape.type === 'diamond') && shape.text && (
                  <Animated.Text style={[styles.shapeText, animatedTextStyle]}>{shape.text}</Animated.Text>
                )}
                {/* Kite shape: render as a diamond (rotated square) */}
                {shape.type === 'kite' && (
                  <View style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: shape.style?.backgroundColor || '#3498db',
                    transform: [{ rotate: '45deg' }],
                    borderRadius: 8,
                  }} />
                )}
                {/* Arrow shape: render as a right-pointing arrow */}
                {shape.type === 'arrow' && (
                  <View style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <View style={{
                      width: '60%',
                      height: 10,
                      backgroundColor: shape.style?.backgroundColor || '#3498db',
                    }} />
                    <View style={{
                      position: 'absolute',
                      right: 0,
                      width: 0,
                      height: 0,
                      borderTopWidth: 15,
                      borderBottomWidth: 15,
                      borderLeftWidth: 20,
                      borderTopColor: 'transparent',
                      borderBottomColor: 'transparent',
                      borderLeftColor: shape.style?.backgroundColor || '#3498db',
                    }} />
                  </View>
                )}
              </View>
            </Animated.View>
            <Animated.View style={toolbarStyle}>
              {isSelected && !shape.isLocked && (
                <>
                  <TouchableOpacity style={styles.toolbarBtn} onPress={() => setEditTextModal(true)}>
                    <Ionicons name="pencil" size={20} color="#333" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.toolbarBtn} onPress={() => setColorModal(true)}>
                    <Ionicons name="color-palette" size={20} color="#333" />
                  </TouchableOpacity>
                </>
              )}
            </Animated.View>
            {shape.isLocked && (
              <View style={styles.lockOverlay}>
                <Ionicons name="lock-closed" size={24} color="white" />
              </View>
            )}
          {shape.type === 'image' && shape.uri && (
            <Image source={{ uri: shape.uri }} style={{ width: '100%', height: '100%', borderRadius: 8 }} resizeMode="cover" />
          )}
            {isSelected && !shape.isLocked && (
              <>
                <GestureDetector gesture={createConnectionGesture({ x: shape.position.x + (shape.style.width || 0) / 2, y: shape.position.y })}>
                  <View style={[styles.connectionPoint, styles.topPoint]} />
                </GestureDetector>
                <GestureDetector gesture={createConnectionGesture({ x: shape.position.x + (shape.style.width || 0) / 2, y: shape.position.y + (shape.style.height || 0) })}>
                  <View style={[styles.connectionPoint, styles.bottomPoint]} />
                </GestureDetector>
                <GestureDetector gesture={createConnectionGesture({ x: shape.position.x, y: shape.position.y + (shape.style.height || 0) / 2 })}>
                  <View style={[styles.connectionPoint, styles.leftPoint]} />
                </GestureDetector>
                <GestureDetector gesture={createConnectionGesture({ x: shape.position.x + (shape.style.width || 0), y: shape.position.y + (shape.style.height || 0) / 2 })}>
                  <View style={[styles.connectionPoint, styles.rightPoint]} />
                </GestureDetector>
              </>
            )}
          {/* Resize Handles */}
{isSelected && !shape.isLocked && (
  <>
    {(['tl', 'tr', 'bl', 'br', 't', 'b', 'l', 'r'] as Anchor[]).map((anchor) => {
      const handleStyle =
        anchor === 'tl' ? handleTL :
        anchor === 'tr' ? handleTR :
        anchor === 'bl' ? handleBL :
        anchor === 'br' ? handleBR :
        anchor === 't'  ? handleT  :
        anchor === 'b'  ? handleB  :
        anchor === 'l'  ? handleL  :
        handleR;

      return (
        <GestureDetector key={anchor} gesture={createResizeGesture(anchor)}>
          <Animated.View style={handleStyle} />
        </GestureDetector>
      );
    })}
  </>
)}

          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </>
  );
};

const styles = StyleSheet.create({
  shapeContainer: {
    position: 'absolute',
  },
  shape: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  selectedBorder: {
    borderWidth: 2,
  borderColor: '#888',
  borderStyle: 'dashed',
},
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  connectionPoint: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3498db',
    borderColor: '#fff',
    borderWidth: 2,
    zIndex: 20,
  },
  topPoint: {
    top: -8,
    alignSelf: 'center',
  },
  bottomPoint: {
    bottom: -8,
    alignSelf: 'center',
  },
  leftPoint: {
    left: -8,
    top: '50%',
    transform: [{ translateY: -8 }],
  },
  rightPoint: {
    right: -8,
    top: '50%',
    transform: [{ translateY: -8 }],
  },
  shapeText: {
    textAlign: 'center',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 250,
    alignItems: 'stretch',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
    marginBottom: 8,
  },
  cancelBtn: {
    marginRight: 16,
    padding: 8,
  },
  saveBtn: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 6,
  },
  toolbarBtn: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 6,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
});

export default DraggableShape;
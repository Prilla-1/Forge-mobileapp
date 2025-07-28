import React, { useState, useEffect,useRef } from 'react';
import { Image, Text, StyleSheet, View, TextInput, TouchableOpacity, Modal, ViewStyle, TouchableWithoutFeedback } from 'react-native';
import type { TextInput as RNTextInput } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {useSharedValue,useAnimatedStyle,withSpring,runOnJS,} from 'react-native-reanimated';
import { useCanvas } from '../../context/CanvasContext';
import { ShapeType } from '../../constants/type';
import { Ionicons } from '@expo/vector-icons';
import { generateUUID } from '@/utils/generateUUID';
import Svg, { Polygon } from 'react-native-svg';

const HANDLE_SIZE = 8;
const MIN_SIZE = 40;
const COLORS = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#34495e', '#fff', '#000'];

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
  const [colorModal, setColorModal] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);
  const [editText, setEditText] = useState(shape.text || '');
  const { updateShape, selectedShapeId, setSelectedShapeId, addLine, shapes } = useCanvas();
  const textInputRef = useRef<RNTextInput>(null);
  const isSelected = selectedShapeId === shape.id;

  // All React hooks must be called before any conditional returns
  const translateX = useSharedValue(shape.position.x);
  const translateY = useSharedValue(shape.position.y);
  const resizeWidth = useSharedValue(shape.style.width || 100);
  const resizeHeight = useSharedValue(shape.style.height || 100);

  // Animated styles - all hooks must be called before conditional returns
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
      fontWeight: shape.style?.fontWeight || 'normal',
      fontStyle: shape.style?.fontStyle || 'normal',
      textDecorationLine: shape.style?.textDecorationLine || 'none',
    };
  });

  // Animated styles for each handle
  const handleTL = useAnimatedStyle(() => ({
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    backgroundColor: '#fff',
    borderRadius: 2,
    borderColor: '#888',
    borderWidth: 1,
    zIndex: 10,
    left: -HANDLE_SIZE / 2,
    top: -HANDLE_SIZE / 2,
  }));

  const handleTR = useAnimatedStyle(() => ({
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    backgroundColor: '#fff',
    borderRadius: 2,
    borderColor: '#888',
    borderWidth: 1,
    zIndex: 10,
    left: resizeWidth.value - HANDLE_SIZE / 2,
    top: -HANDLE_SIZE / 2,
  }));

  const handleBL = useAnimatedStyle(() => ({
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    backgroundColor: '#fff',
    borderRadius: 2,
    borderColor: '#888',
    borderWidth: 1,
    zIndex: 10,
    left: -HANDLE_SIZE / 2,
    top: resizeHeight.value - HANDLE_SIZE / 2,
  }));

  const handleBR = useAnimatedStyle(() => ({
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    backgroundColor: '#fff',
    borderRadius: 2,
    borderColor: '#888',
    borderWidth: 1,
    zIndex: 10,
    left: resizeWidth.value - HANDLE_SIZE / 2,
    top: resizeHeight.value - HANDLE_SIZE / 2,
  }));

  const handleT = useAnimatedStyle(() => ({
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    backgroundColor: '#fff',
    borderRadius: 2,
    borderColor: '#888',
    borderWidth: 1,
    zIndex: 10,
    left: (resizeWidth.value - HANDLE_SIZE) / 2,
    top: -HANDLE_SIZE / 2,
  }));

  const handleB = useAnimatedStyle(() => ({
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    backgroundColor: '#fff',
    borderRadius: 2,
    borderColor: '#888',
    borderWidth: 1,
    zIndex: 10,
    left: (resizeWidth.value - HANDLE_SIZE) / 2,
    top: resizeHeight.value - HANDLE_SIZE / 2,
  }));

  const handleL = useAnimatedStyle(() => ({
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    backgroundColor: '#fff',
    borderRadius: 2,
    borderColor: '#888',
    borderWidth: 1,
    zIndex: 10,
    left: -HANDLE_SIZE / 2,
    top: (resizeHeight.value - HANDLE_SIZE) / 2,
  }));

  const handleR = useAnimatedStyle(() => ({
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    backgroundColor: '#fff',
    borderRadius: 2,
    borderColor: '#888',
    borderWidth: 1,
    zIndex: 10,
    left: resizeWidth.value - HANDLE_SIZE / 2,
    top: (resizeHeight.value - HANDLE_SIZE) / 2,
  }));

  // Close modals if shape is deselected to prevent modal conflicts
  useEffect(() => {
  if (!isSelected) {
    setColorModal(false);
    setIsEditingText(false);
  }
}, [isSelected]);

  // Update edit text when shape text changes
  useEffect(() => {
    console.log('Shape text changed:', shape.text); // Debug log
    setEditText(shape.text || '');
  }, [shape.text]);

  // Focus TextInput when editing starts
  useEffect(() => {
    if (isEditingText && textInputRef.current) {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    }
  }, [isEditingText]);

  // Additional focus effect when component mounts and isEditingText is true
  useEffect(() => {
    if (isEditingText) {
      const timer = setTimeout(() => {
        textInputRef.current?.focus();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isEditingText]);

  // Early return after all hooks
  if (shape.isVisible === false) return null;
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
  const scaleFactor = 0.05;

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
    .onBegin(() => {
      if (isEditingText) return; // Don't start pan if editing text
      runOnJS(setSelectedShapeId)(shape.id);
    })
    .onUpdate((event) => {
      if (isEditingText || shape.isLocked) return; // Don't pan if editing text
      const scaleFactor=1;
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
  const noOpGesture = Gesture.Pan().onBegin(() => {});

  // Tap handler for connect mode or normal selection
  const handleTap = () => {
    if (connectMode && onTap) {
      onTap(shape.id);
    } else {
      setSelectedShapeId(shape.id);
    }
  };

  // Text editing handlers
  const handleStartTextEdit = () => {
    setIsEditingText(true);
    setEditText(shape.text || '');
    // Focus the TextInput after a short delay to ensure the component is rendered
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 100);
    // Additional focus attempt with longer delay
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 300);
    // Third attempt to ensure focus
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 500);
  };

  const handleSaveText = () => {
    console.log('Saving text:', editText); // Debug log
    if (editText.trim()) {
      updateShape(shape.id, { text: editText.trim() });
    }
    setIsEditingText(false);
  };
  
  return (
    <>
      {isSelected && (
        <>
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
      <GestureDetector gesture={isEditingText ? noOpGesture : panAndPinch}>
        <Animated.View style={[animatedStyle, styles.shapeContainer]}>
          <TouchableOpacity 
            activeOpacity={1} 
            style={{ flex: 1 }} 
            onPress={isEditingText ? undefined : handleTap}
            disabled={isEditingText}
          >
            {/* Render kite as SVG with overlayed text or text input */}
            {shape.type === 'kite' ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Svg width="100%" height="100%" viewBox="0 0 100 100" style={StyleSheet.absoluteFill}>
                  <Polygon
                    points="50,0 100,50 50,100 0,50"
                    fill={shape.style?.backgroundColor || '#3498db'}
                    stroke="#34495e"
                    strokeWidth="2"
                  />
                </Svg>
                {isEditingText ? (
                  <View style={{ 
                    width: '80%', 
                    height: '60%', 
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <TextInput
                      ref={textInputRef}
                      value={editText}
                      onChangeText={setEditText}
                      autoFocus={true}
                      multiline={true}
                      style={{
                        width: '100%',
                        height: '100%',
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        fontSize: Math.max(12, Math.min(resizeWidth.value, resizeHeight.value) / 8),
                        fontWeight: 'bold',
                        color: '#333',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderWidth: 2,
                        borderColor: '#007AFF',
                        borderRadius: 4,
                        padding: 4,
                        minHeight: 40,
                      }}
                      onBlur={handleSaveText}
                      onEndEditing={handleSaveText}
                      placeholder="Enter text..."
                      placeholderTextColor="#999"
                    />
                    <TouchableOpacity 
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        backgroundColor: '#007AFF',
                        borderRadius: 12,
                        padding: 4,
                        zIndex: 10,
                      }}
                      onPress={handleSaveText}
                    >
                      <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>Save</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  shape.text && shape.text.trim() && (
                    <Text style={{
                      position: 'absolute',
                      width: '80%',
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      fontWeight: 'bold',
                      color: '#000',
                      fontSize: Math.max(12, Math.min(resizeWidth.value, resizeHeight.value) / 8),
                      includeFontPadding: false,
                    }}>
                      {shape.text}
                    </Text>
                  )
                )}
              </View>
            ) : (
              <Animated.View style={[styles.shape, baseStyle, diamondOuterStyle, isSelected && !shape.isLocked && styles.selectedBorder]}>
                <View style={[styles.contentContainer, diamondInnerStyle]}>
                  {/* Text editing for ALL shape types */}
                  {isEditingText ? (
                    <View style={{ 
                      width: '100%', 
                      height: '100%', 
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 8,
                    }}>
                      <TextInput
                        ref={textInputRef}
                        value={editText}
                        onChangeText={setEditText}
                        autoFocus={true}
                        multiline={true}
                        style={{
                          width: '100%',
                          height: '100%',
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          fontSize: Math.max(12, Math.min(resizeWidth.value, resizeHeight.value) / 8),
                          fontWeight: 'bold',
                          color: '#333',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderWidth: 2,
                          borderColor: '#007AFF',
                          borderRadius: 4,
                          padding: 4,
                          minHeight: 40,
                        }}
                        onBlur={handleSaveText}
                        onEndEditing={handleSaveText}
                        placeholder="Enter text..."
                        placeholderTextColor="#999"
                      />
                      <TouchableOpacity 
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: '#007AFF',
                          borderRadius: 12,
                          padding: 4,
                          zIndex: 10,
                        }}
                        onPress={handleSaveText}
                      >
                        <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    // Show existing text for all shape types
                    shape.text && shape.text.trim() && (
                      <Animated.Text style={[styles.shapeText, animatedTextStyle, { 
                        width: '100%', 
                        height: '100%', 
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        includeFontPadding: false,
                        fontWeight: 'bold',
                        color: '#000', // Dark text for better visibility
                      }]}> 
                        {shape.text}
                      </Animated.Text>
                    )
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
            )}
            <Animated.View style={toolbarStyle}>
              {isSelected && !shape.isLocked && (
                <>
                  <TouchableOpacity style={styles.toolbarBtn} onPress={handleStartTextEdit}>
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
 <View
  style={{
    position: 'absolute',
    left: shape.position.x,
    top: shape.position.y,
    width: shape.style.width,
    height: shape.style.height,
    borderColor: isSelected ? 'dodgerblue' : 'transparent', // ✅ show only on select
    borderWidth: isSelected ? 1 : 0,
    backgroundColor: 'transparent', // ✅ important
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <Image
    source={{ uri: shape.uri }}
    style={{
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
      borderRadius: shape.style.borderRadius || 0,
    }}
  />

  {/* Resize handles — show only if selected */}
  {isSelected && (
    <>
      {/* top-left, top-right, etc. resize handles */}
    </>
  )}
</View>

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
image: {
  resizeMode: 'contain',
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
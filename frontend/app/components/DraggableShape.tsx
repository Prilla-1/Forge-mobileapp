import React, { useState, useEffect,useRef } from 'react';
import { Image, Text, StyleSheet, View, TextInput, TouchableOpacity, ViewStyle, Alert } from 'react-native';
import type { TextInput as RNTextInput } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {useSharedValue,useAnimatedStyle,withSpring,runOnJS,} from 'react-native-reanimated';
import { useCanvas } from '../../context/CanvasContext';
import { ShapeType } from '../../constants/type';
import { Ionicons } from '@expo/vector-icons';
import { generateUUID } from '@/utils/generateUUID';
import Svg, { Polygon } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';

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
  const [showTextColorPalette, setShowTextColorPalette] = useState(false);

  // Ensure shapes with text have adequate height
  useEffect(() => {
    if (shape.text && shape.text.length > 0) {
      const currentHeight = shape.style?.height || 100;
      const currentWidth = shape.style?.width || 100;
      const fontSize = shape.fontSize || 16;
      
      // Calculate minimum required dimensions based on text length and font size
      const minRequiredHeight = fontSize + 20; // Font size + padding
      const minRequiredWidth = shape.text.length * fontSize * 1.2 + 40; // Much more generous width calculation + extra padding
      
      let needsUpdate = false;
      const newStyle = { ...shape.style };
      
      // Always ensure adequate dimensions for text visibility
      if (currentHeight < minRequiredHeight) {
        newStyle.height = minRequiredHeight;
        needsUpdate = true;
      }
      
      if (currentWidth < minRequiredWidth) {
        newStyle.width = minRequiredWidth;
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        updateShape(shape.id, { style: newStyle });
      }
    }
  }, [shape.text, shape.fontSize, shape.style?.height, shape.style?.width, shape.id]);

  // Immediate sizing on mount for template shapes
  useEffect(() => {
    if (shape.text && shape.text.length > 0) {
      const fontSize = shape.fontSize || 16;
      const minRequiredWidth = shape.text.length * fontSize * 1.2 + 40; // Much more generous width
      const minRequiredHeight = fontSize + 20;
      
      // Force update if shape is too small (for template shapes)
      if ((shape.style?.width || 100) < minRequiredWidth || (shape.style?.height || 100) < minRequiredHeight) {
        updateShape(shape.id, {
          style: {
            ...shape.style,
            width: Math.max(shape.style?.width || 100, minRequiredWidth),
            height: Math.max(shape.style?.height || 100, minRequiredHeight)
          }
        });
      }
    }
  }, []); // Run only once on mount

  // Force immediate text sizing for critical text like "NETFLIX" and "Continue Watching"
  useEffect(() => {
    if (shape.text && (shape.text.includes('NETFLIX') || shape.text.includes('Continue Watching') || shape.text.includes('Stranger Things'))) {
      const fontSize = shape.fontSize || 16;
      const minRequiredWidth = shape.text.length * fontSize * 1.5 + 50; // Extra generous for important text
      const minRequiredHeight = fontSize + 25;
      
      // Always ensure these important texts are fully visible
      if ((shape.style?.width || 100) < minRequiredWidth || (shape.style?.height || 100) < minRequiredHeight) {
        setTimeout(() => {
          updateShape(shape.id, {
            style: {
              ...shape.style,
              width: Math.max(shape.style?.width || 100, minRequiredWidth),
              height: Math.max(shape.style?.height || 100, minRequiredHeight)
            }
          });
        }, 100); // Small delay to ensure component is fully mounted
      }
    }
  }, [shape.text]); // Run when text changes

  // Debug color modal state
  useEffect(() => {
    if (colorModal) {
      console.log('Color modal is now true for shape:', shape.id);
      console.log('Shape position:', shape.position);
    }
  }, [colorModal, shape.id, shape.position]);

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
    backgroundColor: shape.backgroundImage ? 'transparent' : (shape.style?.backgroundColor || '#ccc'),
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
    if (editText.trim()) {
      updateShape(shape.id, { text: editText.trim() });
    }
    setIsEditingText(false);
  };

  const handleAddImage = async () => {
    try {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission Denied', 'Please grant permission to access your photo library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
        aspect: [1, 1], // Force square aspect ratio to fit shape better
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        
        updateShape(shape.id, { 
          backgroundImage: selectedImage.uri,
          backgroundImageMode: 'cover' // This will make the image fill the entire shape area
        });
        
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };
  
  return (
    <>
      {isSelected && (
        <>
          {/* Test background when color modal is true */}
          {colorModal && (
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 0, 0, 0.1)', // Red tint
              zIndex: 9998,
            }} />
          )}
          {/* Simple Color Picker Bar */}
          {colorModal && (
            <View style={{
              position: 'absolute',
              top: shape.position.y - 120, // Position relative to shape's Y position
              left: shape.position.x - 50, // Position relative to shape's X position
              width: 300, // Fixed width
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 15,
              zIndex: 9999, // Very high z-index to ensure it's on top
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 10,
              borderWidth: 2,
              borderColor: '#007AFF',
              minHeight: 60, // Ensure minimum height
            }}>
              <Text style={{ 
                position: 'absolute', 
                top: -25, 
                left: 0, 
                right: 0, 
                textAlign: 'center', 
                fontSize: 12, 
                color: '#007AFF',
                fontWeight: 'bold'
              }}>
                COLOR PICKER
              </Text>
              {COLORS.slice(0, 5).map((color) => (
                <TouchableOpacity
                  key={color}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 17,
                    backgroundColor: color,
                    marginHorizontal: 6,
                    borderWidth: 3,
                    borderColor: color === shape.style?.backgroundColor ? '#007AFF' : '#ddd',
                  }}
                  onPress={() => {
                    updateShape(shape.id, {
                      style: {
                        ...shape.style,
                        backgroundColor: color,
                      },
                    });
                    setColorModal(false);
                  }}
                />
              ))}
              <TouchableOpacity
                style={{
                  marginLeft: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  backgroundColor: '#FF3B30',
                  borderRadius: 15,
                }}
                onPress={() => {
                  setColorModal(false);
                }}
              >
                <Text style={{ fontSize: 14, color: 'white', fontWeight: 'bold' }}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
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
            {/* Render kite as regular View with diamond styling */}
            {shape.type === 'kite' ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={[
                  {
                    width: '100%',
                    height: '100%',
                    backgroundColor: shape.backgroundImage ? 'transparent' : (shape.style?.backgroundColor || '#3498db'),
                    borderWidth: 2,
                    borderColor: '#34495e',
                    transform: [{ rotate: '45deg' }],
                    overflow: 'hidden', // This will clip the image
                  },
                  isSelected && !shape.isLocked && styles.selectedBorder
                ]}>
                  {/* Background Image for kite */}
                  {shape.backgroundImage && (
                    <View style={{
                      position: 'absolute',
                      width: '141%', // Larger to account for rotation
                      height: '141%', // Larger to account for rotation
                      backgroundColor: 'transparent',
                      zIndex: 1,
                      transform: [{ rotate: '-45deg' }], // Counter-rotate to show image normally
                      marginLeft: '-20%',
                      marginTop: '-20%',
                    }}>
                      <Image
                        source={{ uri: shape.backgroundImage }}
                        style={{
                          width: '100%',
                          height: '100%',
                          resizeMode: shape.backgroundImageMode || 'cover',
                        }}
                      />
                    </View>
                  )}
                  {/* Text content */}
                  <View style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2,
                    transform: [{ rotate: '-45deg' }], // Counter-rotate text
                  }}>
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
                            width: '80%',
                            height: '60%',
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            fontSize: shape.fontSize,
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
                          width: '100%',
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          fontWeight: 'bold',
                          color: shape.fontColor || shape.style?.color || '#000',
                          fontSize: shape.fontSize,
                          includeFontPadding: false,
                          paddingHorizontal: 4,
                          paddingVertical: 2,
                          minHeight: 20,
                          lineHeight: shape.fontSize ? shape.fontSize + 4 : 20,
                        }}>
                          {shape.text}
                        </Text>
                      )
                    )}
                  </View>
                </View>
              </View>
            ) : shape.type === 'image' && shape.uri ? (
              // Special handling for images - no background container
              <Image 
                source={{ uri: shape.uri }} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: 8 
                }} 
                resizeMode="cover" 
              />
            ) : (
              <Animated.View style={[styles.shape, baseStyle, diamondOuterStyle, isSelected && !shape.isLocked && styles.selectedBorder]}>
                {/* Background Image */}
                {shape.backgroundImage && (
                  <View style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: shape.style?.backgroundColor || '#ccc',
                    borderRadius: shape.type === 'circle' || shape.type === 'oval' ? 999 : (shape.style?.borderRadius || 0),
                    zIndex: 1,
                  }}>
                                         <Image
                       source={{ uri: shape.backgroundImage }}
                       style={{
                         width: '100%',
                         height: '100%',
                         resizeMode: shape.backgroundImageMode || 'cover',
                         borderRadius: shape.type === 'circle' || shape.type === 'oval' ? 999 : (shape.style?.borderRadius || 0),
                       }}
                     />
                  </View>
                )}
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
                          fontSize: shape.fontSize,
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
                      <Text style={{
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        fontWeight: 'bold',
                        color: shape.fontColor || shape.style?.color || '#000',
                        fontSize: shape.fontSize,
                        includeFontPadding: false,
                        paddingHorizontal: 4,
                        paddingVertical: 2,
                        minHeight: 20,
                        lineHeight: shape.fontSize ? shape.fontSize + 4 : 20,
                      }}> 
                        {shape.text}
                      </Text>
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
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 8, zIndex: 20 }}>
                  {shape.text && !isEditingText && (
                    <>
                      <TouchableOpacity onPress={() => updateShape(shape.id, { fontSize: Math.max(8, (shape.fontSize || 16) - 2) })} style={{ padding: 4, marginHorizontal: 2, backgroundColor: '#eee', borderRadius: 4 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>-</Text>
                      </TouchableOpacity>
                      <Text style={{ fontSize: 16, marginHorizontal: 4 }}>{shape.fontSize || 16}</Text>
                      <TouchableOpacity onPress={() => updateShape(shape.id, { fontSize: (shape.fontSize || 16) + 2 })} style={{ padding: 4, marginHorizontal: 2, backgroundColor: '#eee', borderRadius: 4 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>+</Text>
                      </TouchableOpacity>
                      {/* Yellow 'A' icon for text color */}
                      <View style={{ alignItems: 'center', justifyContent: 'flex-end', marginHorizontal: 4, position: 'relative' }}>
                        {showTextColorPalette && (
                          <View style={{ position: 'absolute', bottom: 32, left: '50%', transform: [{ translateX: -66 }], zIndex: 100, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: 4, elevation: 4, flexDirection: 'row', alignItems: 'center' }}>
                            {['#000', '#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#fff'].map(color => (
                              <TouchableOpacity
                                key={color}
                                onPress={() => { 
                                  updateShape(shape.id, { fontColor: color, style: { ...shape.style, color } }); 
                                  setShowTextColorPalette(false); 
                                }}
                                style={{
                                  width: 22, height: 22, borderRadius: 11, backgroundColor: color,
                                  marginHorizontal: 2, borderWidth: shape.fontColor === color ? 2 : 0, borderColor: '#333',
                                }}
                              />
                            ))}
                          </View>
                        )}
                        <TouchableOpacity onPress={() => setShowTextColorPalette(v => !v)}>
                          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'gold', textShadowColor: '#333', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 }}>A</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                  <TouchableOpacity style={styles.toolbarBtn} onPress={handleStartTextEdit}>
                    <Ionicons name="pencil" size={20} color="#333" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.toolbarBtn} onPress={() => setColorModal(true)}>
                    <Ionicons name="color-palette" size={20} color="#333" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.toolbarBtn} onPress={handleAddImage}>
                    <Ionicons name="image" size={20} color="#333" />
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>
            {shape.isLocked && (
              <View style={styles.lockOverlay}>
                <View style={styles.blurEffect} />
                <Ionicons name="lock-closed" size={24} color="#666" />
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
              {shape.type === 'kite' ? (
                // Special resize handles for kite shape (diamond)
                <>
                  <GestureDetector gesture={createResizeGesture('t')}>
                    <Animated.View style={[handleT, { transform: [{ rotate: '45deg' }] }]} />
                  </GestureDetector>
                  <GestureDetector gesture={createResizeGesture('r')}>
                    <Animated.View style={[handleR, { transform: [{ rotate: '45deg' }] }]} />
                  </GestureDetector>
                  <GestureDetector gesture={createResizeGesture('b')}>
                    <Animated.View style={[handleB, { transform: [{ rotate: '45deg' }] }]} />
                  </GestureDetector>
                  <GestureDetector gesture={createResizeGesture('l')}>
                    <Animated.View style={[handleL, { transform: [{ rotate: '45deg' }] }]} />
                  </GestureDetector>
                </>
              ) : (
                // Regular resize handles for other shapes
                (['tl', 'tr', 'bl', 'br', 't', 'b', 'l', 'r'] as Anchor[]).map((anchor) => {
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
                })
              )}
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
    backgroundColor: 'transparent',
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
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
    marginBottom: 8,
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
  blurEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    backdropFilter: 'blur(5px)', // Use backdropFilter for blur effect
  },
});

export default DraggableShape;
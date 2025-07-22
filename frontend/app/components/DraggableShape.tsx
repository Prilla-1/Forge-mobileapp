import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import { useCanvas } from '../context/CanvasContext';
import { ShapeType } from '../../constants/type';
import PopupMenu from './PopupToolbar';

const DraggableShape = ({ shape, onLongPress }: any) => {
  const {
    updateShape,
    selectedShapeId,
    setSelectedShapeId,
    popupShapeId,
    setPopupShapeId,
  } = useCanvas();

  const [isEditingText, setIsEditingText] = useState(false);

  const isSelected = selectedShapeId === shape.id;

  const width = useSharedValue(shape?.style?.width ?? 100);
  const height = useSharedValue(shape?.style?.height ?? 100);

  useEffect(() => {
    width.value = shape.style?.width ?? 100;
    height.value = shape.style?.height ?? 100;
  }, []);

  const offsetX = useSharedValue(shape?.position?.x ?? 0);
  const offsetY = useSharedValue(shape?.position?.y ?? 0);
  const rotation = useSharedValue(shape.rotation || 0);

  const resizeHandleSize = 10;

  const createResizeGesture = (xFactor: number, yFactor: number, adjustX: boolean, adjustY: boolean) => {
    return Gesture.Pan()
      .onUpdate((e) => {
        const deltaX = e.translationX * xFactor;
        const deltaY = e.translationY * yFactor;

        width.value = Math.max(30, shape.style?.width + deltaX);
        height.value = Math.max(30, shape.style?.height + deltaY);

        if (adjustX) offsetX.value = withSpring(offsetX.value + e.translationX);
        if (adjustY) offsetY.value = withSpring(offsetY.value + e.translationY);
      })
      .onEnd(() => {
        runOnJS(updateShape)(shape.id, {
          position: {
            x: offsetX.value,
            y: offsetY.value,
          },
          style: {
            ...shape.style,
            width: width.value,
            height: height.value,
          },
        });
      });
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(setSelectedShapeId)(shape.id);
    })
    .onUpdate((e) => {
      offsetX.value = withSpring(e.translationX + (shape.position?.x ?? 0));
      offsetY.value = withSpring(e.translationY + (shape.position?.y ?? 0));
    })
    .onEnd(() => {
      runOnJS(updateShape)(shape.id, {
        position: {
          x: offsetX.value,
          y: offsetY.value,
        },
      });
    });

  const rotateGesture = Gesture.Pan()
    .onUpdate((e) => {
      rotation.value += e.translationX * 0.5;
    })
    .onEnd(() => {
      runOnJS(updateShape)(shape.id, {
        rotation: rotation.value,
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value },
      { rotateZ: `${rotation.value}deg` },
    ],
  }));

  const animatedSizeStyle = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
  }));

  const baseStyle = {
    width: shape.style?.width ?? 100,
    height: shape.style?.height ?? 100,
    borderColor: 'blue',
    borderWidth: isSelected && shape.type !== 'text' ? 1 : 0,
    borderRadius:
      shape.type === 'circle'
        ? width.value / 2
        : shape.type === 'oval'
        ? height.value / 2
        : 0,
  };

  const handleLongPress = () => {
    setSelectedShapeId(shape.id);
    setPopupShapeId(shape.id);
    if (onLongPress) onLongPress(shape.id);
  };

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.shapeContainer, animatedStyle]}>
        <TouchableOpacity
          onLongPress={handleLongPress}
          activeOpacity={1}
          style={[styles.touchable, baseStyle, animatedSizeStyle]}
        >
          {shape.type === 'text' && (
            <View style={{ alignItems: 'center' }}>
              <TextInput
                style={[
                  styles.text,
                  shape.style,
                  isEditingText && { borderWidth: 1, borderColor: 'gray', borderRadius: 4 },
                ]}
                value={shape.text}
                onChangeText={(text) => updateShape(shape.id, { text })}
               onFocus={() => {
                      setIsEditingText(true);
                      setSelectedShapeId(shape.id);
                      setPopupShapeId(shape.id);}}
                onBlur={() => setIsEditingText(false)}
                multiline
              />
              {isEditingText && (
                <TouchableOpacity
                  onPress={() => setIsEditingText(false)}
                  style={styles.doneButton}
                >
                  <Text style={{ color: 'white' }}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {shape.type === 'image' && shape.uri && (
            <Image
              source={{ uri: shape.uri }}
              style={[StyleSheet.absoluteFillObject, shape.style]}
            />
          )}

          {shape.type !== 'text' && shape.type !== 'image' && (
            <Animated.View
    style={[
      styles.genericShape,
      {
        width: width.value,
        height: height.value,
        backgroundColor: shape.style?.backgroundColor || 'skyblue',
        borderRadius:
          shape.type === 'circle'
            ? Math.min(width.value, height.value) / 2
            : shape.type === 'oval'
            ? Math.min(width.value, height.value) / 2
            : 0,
      },
    ]}
  />
)}

          {isSelected && (
            <>
              {/* Rotate Handle */}
              <GestureDetector gesture={rotateGesture}>
                <View
                  style={[
                    styles.rotateHandle,
                    {
                      top: -30,
                      left: (shape.style?.width ?? 100) / 2 - 10,
                    },
                  ]}
                />
              </GestureDetector>

              {/* Resize Handles */}
              <GestureDetector gesture={createResizeGesture(-1, -1, true, true)}>
                <Animated.View style={[styles.resizeHandle, { top: -resizeHandleSize / 2, left: -resizeHandleSize / 2 }]} />
              </GestureDetector>
              <GestureDetector gesture={createResizeGesture(1, -1, false, true)}>
                <Animated.View style={[styles.resizeHandle, { top: -resizeHandleSize / 2, right: -resizeHandleSize / 2 }]} />
              </GestureDetector>
              <GestureDetector gesture={createResizeGesture(-1, 1, true, false)}>
                <Animated.View style={[styles.resizeHandle, { bottom: -resizeHandleSize / 2, left: -resizeHandleSize / 2 }]} />
              </GestureDetector>
              <GestureDetector gesture={createResizeGesture(1, 1, false, false)}>
                <Animated.View style={[styles.resizeHandle, { bottom: -resizeHandleSize / 2, right: -resizeHandleSize / 2 }]} />
              </GestureDetector>
            </>
          )}

          {/* Popup Menu */}
          {popupShapeId === shape.id && (
            <PopupMenu
              shapeId={shape.id}
              shapeType={shape.type}
              onRequestClose={() => setPopupShapeId(null)}
            />
          )}
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
};

export default DraggableShape;

const styles = StyleSheet.create({
  shapeContainer: {
    position: 'absolute',
  },
  touchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genericShape: {
    backgroundColor: 'skyblue',
    flex: 1,
    alignSelf: 'stretch',
  },
  text: {
    fontSize: 18,
    padding: 4,
    color: 'black',
  },
  resizeHandle: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
  },
  rotateHandle: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: 'green',
    borderRadius: 10,
  },
  doneButton: {
    marginTop: 4,
    backgroundColor: 'black',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
});

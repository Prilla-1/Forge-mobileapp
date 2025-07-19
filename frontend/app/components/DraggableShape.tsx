import React from 'react';
import { Image, Text, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useCanvas } from '../context/CanvasContext';
import { ShapeType } from '../../constants/type';

type DraggableShapeProps = {
  shape: ShapeType;
  onLongPress: (params: { id: string; x: number; y: number }) => void;
};

const HANDLE_SIZE = 20;
const MIN_SIZE = 40;

const DraggableShape: React.FC<DraggableShapeProps> = ({ shape, onLongPress }) => {
  const { updateShape,selectedShapeId,setSelectedShapeId } = useCanvas();
  const isSelected = selectedShapeId === shape.id;

  const translateX = useSharedValue(shape.position.x);
  const translateY = useSharedValue(shape.position.y);
  const resizeWidth = useSharedValue(shape.style.width || 100);
  const resizeHeight = useSharedValue(shape.style.height || 100);

  const baseStyle = {
    backgroundColor: shape.style?.backgroundColor || shape.color || '#ccc',
    borderRadius: shape.type === 'circle' ? 999 : shape.type === 'oval' ? 50 : 0,
  };

  const updatePositionAndSize = () => {
    runOnJS(updateShape)(shape.id, {
      position: { x: translateX.value, y: translateY.value },
      style: { width: resizeWidth.value, height: resizeHeight.value },
    });
  };

  const createResizeGesture = (dx: number, dy: number, anchor: 'tl' | 'tr' | 'bl' | 'br' | 't' | 'b' | 'l' | 'r') =>
    Gesture.Pan()
      .onUpdate((event) => {
        let newWidth = resizeWidth.value;
        let newHeight = resizeHeight.value;
        let newX = translateX.value;
        let newY = translateY.value;

        if (anchor.includes('l')) {
          newWidth = resizeWidth.value - event.translationX;
          newX = shape.position.x + event.translationX;
        } else if (anchor.includes('r')) {
          newWidth = resizeWidth.value + event.translationX;
        }

        if (anchor.includes('t')) {
          newHeight = resizeHeight.value - event.translationY;
          newY = shape.position.y + event.translationY;
        } else if (anchor.includes('b')) {
          newHeight = resizeHeight.value + event.translationY;
        }

        resizeWidth.value = Math.max(MIN_SIZE, newWidth);
        resizeHeight.value = Math.max(MIN_SIZE, newHeight);
        translateX.value = newX;
        translateY.value = newY;
      })
      .onEnd(updatePositionAndSize);

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: translateX.value,
    top: translateY.value,
    width: resizeWidth.value,
    height: resizeHeight.value,
  }));

  const handleAnimatedStyle = (x: 'left' | 'center' | 'right', y: 'top' | 'center' | 'bottom') =>
    useAnimatedStyle(() => {
      const style: any = {
        position: 'absolute',
        width: HANDLE_SIZE,
        height: HANDLE_SIZE,
        backgroundColor: '#000',
        borderRadius: 10,
        zIndex: 10,
      };

      if (x === 'left') style.left = -HANDLE_SIZE / 2;
      if (x === 'center') style.left = (resizeWidth.value - HANDLE_SIZE) / 2;
      if (x === 'right') style.left = resizeWidth.value - HANDLE_SIZE / 2;

      if (y === 'top') style.top = -HANDLE_SIZE / 2;
      if (y === 'center') style.top = (resizeHeight.value - HANDLE_SIZE) / 2;
      if (y === 'bottom') style.top = resizeHeight.value - HANDLE_SIZE / 2;

      return style;
    });

  const longPressGesture = Gesture.LongPress()
    .onStart((event) => {
      runOnJS(onLongPress)({
        id: shape.id,
        x: event.absoluteX,
        y: event.absoluteY,
      });
    })
    .minDuration(300);

  const panGesture = Gesture.Pan()
  .onBegin(() => {
  runOnJS(setSelectedShapeId)(shape.id);
})

    .onUpdate((event) => {
      translateX.value = withSpring(event.translationX + shape.position.x);
      translateY.value = withSpring(event.translationY + shape.position.y);
    })
    .onEnd(updatePositionAndSize);

  return (
    <GestureDetector gesture={Gesture.Simultaneous(panGesture, longPressGesture)}>
      <Animated.View style={[animatedStyle, baseStyle, styles.shape,isSelected && styles.selectedBorder]}>
        {shape.type === 'image' && shape.uri && (
          <Image source={{ uri: shape.uri }} style={{ width: '100%', height: '100%', borderRadius: 8 }} resizeMode="cover" />
        )}
        {shape.type === 'text' && (
          <Text style={{ color: shape.style?.color || '#000', fontSize: shape.fontSize || 16 }}>
            {shape.text || 'Sample'}
          </Text>
        )}

        {/* 8 Resize Handles */}
        {isSelected && [
          { pos: ['left', 'top'], anchor: 'tl' },
          { pos: ['right', 'top'], anchor: 'tr' },
          { pos: ['left', 'bottom'], anchor: 'bl' },
          { pos: ['right', 'bottom'], anchor: 'br' },
          { pos: ['center', 'top'], anchor: 't' },
          { pos: ['center', 'bottom'], anchor: 'b' },
          { pos: ['left', 'center'], anchor: 'l' },
          { pos: ['right', 'center'], anchor: 'r' },
        ].map(({ pos, anchor }) => (
          <GestureDetector key={anchor} gesture={createResizeGesture(0, 0, anchor as any)}>
            <Animated.View style={handleAnimatedStyle(pos[0] as any, pos[1] as any)} />
          </GestureDetector>
        ))}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  shape: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedBorder: {
  borderWidth: 1,
  borderColor: '#888',
  borderStyle: 'dashed',
},

});

export default DraggableShape;

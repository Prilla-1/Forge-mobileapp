import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  LongPressGestureHandler,
  GestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
} from 'react-native-reanimated';
import { ShapeType } from '../../constants/type';
import { useCanvas } from '../../context/CanvasContext';

interface Props {
  shape: ShapeType;
}

const HANDLE_SIZE = 20;

const Shape: React.FC<Props> = ({ shape }) => {
  const { deleteToTrash } = useCanvas();

  const offsetX = useSharedValue(shape.position.x);
  const offsetY = useSharedValue(shape.position.y);
  const width = useSharedValue(shape.style.width || 100);
  const height = useSharedValue(shape.style.height || 100);

  // Drag Gesture
  const dragGesture = useAnimatedGestureHandler({
    onActive: (event) => {
      offsetX.value = shape.position.x + event.translationX;
      offsetY.value = shape.position.y + event.translationY;
    },
    onEnd: () => {
      shape.position.x = offsetX.value;
      shape.position.y = offsetY.value;
    },
  });

  // Resize Gesture
  const resizeGesture = useAnimatedGestureHandler({
    onActive: (event) => {
      width.value = Math.max(40, (shape.style.width || 100) + event.translationX);
      height.value = Math.max(40, (shape.style.height || 100) + event.translationY);
    },
    onEnd: () => {
      shape.style.width = width.value;
      shape.style.height = height.value;
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: offsetX.value,
    top: offsetY.value,
    width: width.value,
    height: height.value,
  }));

  const renderShape = () => {
    const bg = shape.style.backgroundColor;
    switch (shape.type) {
      case 'rectangle':
        return <View style={[styles.rect, { backgroundColor: bg || '#2196F3' }]} />;
      case 'circle':
        return <View style={[styles.circle, { backgroundColor: bg || '#E91E63' }]} />;
      case 'oval':
        return (
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent',
              borderStyle: 'solid',
              borderLeftWidth: 40,
              borderRightWidth: 40,
              borderBottomWidth: 70,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: bg || '#4CAF50',
            }}
          />
        );
      case 'image':
        return (
          <Image
            source={{ uri: shape.uri }}
            style={{ width: '100%', height: '100%', borderRadius: 5 }}
            resizeMode="cover"
          />
        );
      default:
        return null;
    }
  };

  const handleLongPress = (event: GestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === 4) {
      Alert.alert('Delete shape?', '', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteToTrash(shape.id),
        },
      ]);
    }
  };

  return (
    <LongPressGestureHandler
      onHandlerStateChange={handleLongPress}
      minDurationMs={600}
    >
      <Animated.View style={[animatedStyle, styles.base]}>
        <PanGestureHandler onGestureEvent={dragGesture}>
          <Animated.View style={{ flex: 1 }}>{renderShape()}</Animated.View>
        </PanGestureHandler>

        {/* Resize Handle */}
        <PanGestureHandler onGestureEvent={resizeGesture}>
          <Animated.View style={styles.resizeHandle} />
        </PanGestureHandler>
      </Animated.View>
    </LongPressGestureHandler>
  );
};

export default Shape;

const styles = StyleSheet.create({
  base: {
    position: 'absolute',
  },
  rect: {
    flex: 1,
    borderRadius: 4,
  },
  circle: {
    flex: 1,
    borderRadius: 9999,
  },
  resizeHandle: {
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    backgroundColor: '#000',
    position: 'absolute',
    right: -10,
    bottom: -10,
    borderRadius: 10,
    zIndex: 2,
  },
});

import React from 'react';
import { View, Image, StyleSheet, Alert } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, LongPressGestureHandler, GestureHandlerStateChangeEvent } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedGestureHandler, withSpring } from 'react-native-reanimated';
import { ShapeType } from '../../constants/type';
import { useCanvas } from '../context/CanvasContext';

interface Props {
  shape: ShapeType;
}

const HANDLE_SIZE = 20;

const Shape: React.FC<Props> = ({ shape }) => {
  const { shapes, setShapes, deleteToTrash } = useCanvas();

  const offsetX = useSharedValue(shape.x);
  const offsetY = useSharedValue(shape.y);
  const width = useSharedValue(shape.width);
  const height = useSharedValue(shape.height);

  const onDrag = useAnimatedGestureHandler({
    onActive: (event) => {
      offsetX.value = event.translationX + shape.x;
      offsetY.value = event.translationY + shape.y;
    },
    onEnd: () => {
      shape.x = offsetX.value;
      shape.y = offsetY.value;
    },
  });

  const onResize = useAnimatedGestureHandler({
    onActive: (event) => {
      width.value = Math.max(40, shape.width + event.translationX);
      height.value = Math.max(40, shape.height + event.translationY);
    },
    onEnd: () => {
      shape.width = width.value;
      shape.height = height.value;
    },
  });

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    left: offsetX.value,
    top: offsetY.value,
    width: width.value,
    height: height.value,
  }));

  const renderShape = () => {
    switch (shape.type) {
      case 'rectangle':
        return <View style={[styles.rect, { backgroundColor: shape.color || '#2196F3' }]} />;
      case 'circle':
        return <View style={[styles.circle, { backgroundColor: shape.color || '#E91E63' }]} />;
      case 'triangle':
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
              borderBottomColor: shape.color || '#4CAF50',
            }}
          />
        );
      case 'image':
        return <Image source={{ uri: shape.uri }} style={{ width: '100%', height: '100%', borderRadius: 5 }} />;
      default:
        return null;
    }
  };

  const deleteShape = () => {
    Alert.alert('Delete shape?', '', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteToTrash(shape.id); // moves to trash
        },
      },
    ]);
  };

  const handleLongPress = (event: GestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === 4) {
      deleteShape();
    }
  };

  return (
    <LongPressGestureHandler onHandlerStateChange={handleLongPress} minDurationMs={600}>
      <Animated.View style={[style, styles.base]}>
        <PanGestureHandler onGestureEvent={onDrag}>
          <Animated.View style={{ flex: 1 }}>{renderShape()}</Animated.View>
        </PanGestureHandler>

        {/* Resize Handle */}
        <PanGestureHandler onGestureEvent={onResize}>
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
  rect: {
    flex: 1,
    borderRadius: 4,
  },
  circle: {
    flex: 1,
    borderRadius: 9999,
  },
});

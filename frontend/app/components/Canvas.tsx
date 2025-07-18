import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Text,
  Image,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { useCanvas } from '../context/CanvasContext';
import { ShapeType } from '../../constants/type';

const DraggableShape = ({ shape }: { shape: ShapeType }) => {
  const { deleteShapeById } = useCanvas();
  const [showMenu, setShowMenu] = useState(false);

  const translateX = useSharedValue(shape.x);
  const translateY = useSharedValue(shape.y);

  const dragGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = withSpring(event.translationX + shape.x);
      translateY.value = withSpring(event.translationY + shape.y);
    });

  const longPressGesture = Gesture.LongPress()
    .minDuration(600)
    .onStart(() => {
      setShowMenu(true);
    });

  const composedGesture = Gesture.Race(longPressGesture, dragGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const handleDelete = () => {
    setShowMenu(false);
    deleteShapeById(shape.id);
  };

  const getShapeStyle = () => {
    const base = {
      width: shape.width,
      height: shape.height,
      position: 'absolute' as const,
    };

    switch (shape.type) {
      case 'rectangle':
        return {
          ...base,
          backgroundColor: shape.color || '#3498db',
          borderRadius: 4,
        };
      case 'circle':
        return {
          ...base,
          backgroundColor: shape.color || '#e74c3c',
          borderRadius: 999,
        };
      case 'triangle':
        return {
          width: 0,
          height: 0,
          borderLeftWidth: shape.width / 2,
          borderRightWidth: shape.width / 2,
          borderBottomWidth: shape.height,
          backgroundColor: 'transparent',
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: shape.color || '#2ecc71',
          borderStyle: 'solid',
          position: 'absolute' as const,
        };
      case 'image':
        return {
          ...base,
        };
      default:
        return base;
    }
  };

  return (
    <>
      <GestureDetector gesture={composedGesture}>
        <Animated.View
          style={[
            getShapeStyle(),
            animatedStyle,
            { left: shape.x, top: shape.y },
          ]}
        >
          {shape.type === 'image' && shape.uri && (
            <Image
              source={{ uri: shape.uri }}
              style={{
                width: shape.width,
                height: shape.height,
                borderRadius: 10,
              }}
              resizeMode="cover"
            />
          )}
        </Animated.View>
      </GestureDetector>

      {/* Pop-up Menu */}
      <Modal transparent visible={showMenu} animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPressOut={() => setShowMenu(false)}
        >
          <View style={styles.menu}>
            <TouchableOpacity onPress={handleDelete}>
              <Text style={styles.menuText}>🗑️ Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const Canvas = () => {
  const { shapes } = useCanvas();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.canvas}>
        {shapes.map((shape) => (
          <DraggableShape key={shape.id} shape={shape} />
        ))}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  overlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 10,
  },
  menuText: {
    fontSize: 18,
    color: 'red',
  },
});

export default Canvas;

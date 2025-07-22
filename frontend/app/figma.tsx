import { GestureResponderEvent, Pressable, View, StyleSheet } from 'react-native';
import React, { useContext } from 'react';
import { useCanvas } from '../context/CanvasContext';

export default function Canvas({
  selectedShape,
}: {
  selectedShape: 'rectangle' | 'circle' | null;
}) {
  const { addShape } = useCanvas();

  const handlePress = (event: GestureResponderEvent) => {
    if (!selectedShape) return;

    const { locationX, locationY } = event.nativeEvent;

    addShape({
      type: selectedShape,
      x: locationX,
      y: locationY,
    });
  };

  return (
    <Pressable onPress={handlePress} style={styles.canvas}>
      <View style={styles.overlay}>
        {/* Render shapes here */}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    backgroundColor: '#fff',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});

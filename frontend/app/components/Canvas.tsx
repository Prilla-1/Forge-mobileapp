import React, { RefObject } from 'react';
import { View, StyleSheet } from 'react-native';
import { useCanvas } from '../context/CanvasContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableShape from './DraggableShape';
import ViewShot from 'react-native-view-shot';


interface CanvasProps {
  canvasRef: RefObject<ViewShot | null>; 
}


const Canvas: React.FC<CanvasProps> = ({ canvasRef }) => {
 const { selectedShapeIds, setSelectedShapeIds, shapes } = useCanvas();

const handleLongPress = (id: string) => {
  setSelectedShapeIds([id]);
};

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ViewShot ref={canvasRef} style={styles.container} options={{ format: 'png', quality: 1.0 }}>
        <View style={styles.container}>
          {shapes.map((shape) => (
            <DraggableShape
              key={shape.id}
              shape={shape}
              onLongPress={() => handleLongPress(shape.id)}
            />
          ))}
        </View>
      </ViewShot>
    </GestureHandlerRootView>
  );
};

export default Canvas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

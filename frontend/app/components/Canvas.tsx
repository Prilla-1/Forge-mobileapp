import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Svg, { Line, G, Text as SvgText } from 'react-native-svg';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useCanvas } from '../../context/CanvasContext';
import { ShapeType } from '../../constants/type';
import DraggableShape from './DraggableShape';
import ViewShot from 'react-native-view-shot';
import type { RefObject } from 'react';

interface CanvasProps {
  panX?: any;
  panY?: any;
  scale?: any;
  setPreviewLine: (line: { x1: number; y1: number; x2: number; y2: number } | null) => void;
  onTap: (shapeId: string) => void;
  connectMode: boolean;
  ref?: RefObject<any>;
  onLongPress: ({ id }: { id: string }) => void;
  connectStartShapeId: string | null;
}

const getEdgeIntersection = (shape: ShapeType, otherShape: ShapeType) => {
  const x1 = shape.position.x + (shape.style.width || 0) / 2;
  const y1 = shape.position.y + (shape.style.height || 0) / 2;
  const x2 = otherShape.position.x + (otherShape.style.width || 0) / 2;
  const y2 = otherShape.position.y + (otherShape.style.height || 0) / 2;

  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx === 0 && dy === 0) return { x: x1, y: y1 };

  const w = (shape.style.width || 0) / 2;
  const h = (shape.style.height || 0) / 2;
  if (w === 0 || h === 0) return { x: x1, y: y1 };

  const t = Math.max(Math.abs(dx) / w, Math.abs(dy) / h);
  return { x: x1 + dx / t, y: y1 + dy / t };
};

const Canvas: React.FC<CanvasProps> = ({
  panX,
  panY,
  scale,
  setPreviewLine,
  onTap,
  connectMode,
}) => {
  const {
    shapes,
    lines,
    previewLine,
    setSelectedShapeId,
    connectStartShapeId,
    setConnectStartShapeId,
  } = useCanvas();

  const maxX = Math.max(500, ...shapes.map(s => s.position.x + (s.style.width || 0)));
  const maxY = Math.max(800, ...shapes.map(s => s.position.y + (s.style.height || 0)));

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: panX?.value || 0 },
      { translateY: panY?.value || 0 },
      { scale: scale?.value || 1 },
    ],
  }), [panX, panY, scale]);

  const handleShapeTap = useCallback((id: string) => {
    onTap(id);
  }, [onTap]);

  const handleShapeLongPress = useCallback((id: string) => {
    if (connectMode) {
      setConnectStartShapeId(id);
    }
  }, [connectMode, setConnectStartShapeId]);

  return (
    <ViewShot
      options={{ format: 'png', quality: 1, result: 'tmpfile' }}
      style={{ flex: 1, backgroundColor: 'transparent' }}
    >
      {/* This View acts as the background to detect taps and deselect shapes */}
     <TouchableWithoutFeedback
  onPress={() => {
    requestAnimationFrame(() => setSelectedShapeId(null));
  }}>
        <View style={styles.canvasContainer}>
          <Animated.View style={animatedContentStyle}>
            <Svg width={maxX} height={maxY} style={StyleSheet.absoluteFill}>
              <G>
                {lines.map(line => {
                  const start = shapes.find(s => s.id === line.startShapeId);
                  const end = shapes.find(s => s.id === line.endShapeId);
                  if (!start || !end) return null;

                  const from = getEdgeIntersection(start, end);
                  const to = getEdgeIntersection(end, start);

                  return (
                    <G key={line.id}>
                      <Line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#555" strokeWidth={2} />
                      {line.label && (
                        <SvgText
                          fill="#333"
                          fontSize={12}
                          x={(from.x + to.x) / 2}
                          y={(from.y + to.y) / 2}
                          textAnchor="middle"
                        >
                          {line.label}
                        </SvgText>
                      )}
                    </G>
                  );
                })}
                {previewLine && (
                  <Line
                    x1={previewLine.x1}
                    y1={previewLine.y1}
                    x2={previewLine.x2}
                    y2={previewLine.y2}
                    stroke="#888"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                  />
                )}
              </G>
            </Svg>

            {shapes.map(shape => (
              <DraggableShape
                key={shape.id}
                shape={shape}
                setPreviewLine={setPreviewLine}
                onTap={() => handleShapeTap(shape.id)}
                onLongPress={() => handleShapeLongPress(shape.id)}
                connectMode={connectMode}
                connectStartShapeId={connectStartShapeId}
              />
            ))}
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </ViewShot>
  );
};

const styles = StyleSheet.create({
  canvasContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    minWidth: '100%',
    minHeight: '100%',
  },
});

export default Canvas;

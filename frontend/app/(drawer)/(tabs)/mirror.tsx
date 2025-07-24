import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
  Dimensions,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { useCanvas } from '../../../context/CanvasContext';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import Svg, { Line as SvgLine } from 'react-native-svg';

export default function MirrorScreen() {
  const { shapes, lines } = useCanvas();
  const router = useRouter();
  const navigation = useNavigation();
  const viewShotRef = useRef<View>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    if (shapes.length === 0) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    shapes.forEach(({ position, style }) => {
      const { x, y } = position;
      const width = style?.width || 0;
      const height = style?.height || 0;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + width);
      maxY = Math.max(maxY, y + height);
    });

    const canvasWidth = maxX - minX;
    const canvasHeight = maxY - minY;
    const scaleX = (screenWidth - 40) / canvasWidth;
    const scaleY = (screenHeight - 200) / canvasHeight;
    const computedScale = Math.min(scaleX, scaleY, 1);

    const offsetX = (screenWidth - canvasWidth * computedScale) / 2 - minX * computedScale;
    const offsetY = (screenHeight - canvasHeight * computedScale) / 2 - minY * computedScale;

    setScale(computedScale);
    setOffset({ x: offsetX, y: offsetY });
  }, [shapes]);

  const renderShape = (shape: any) => {
    const { id, type, style, position, uri, text } = shape;
    const { x, y } = position;

    const positioning: ViewStyle = {
  position: 'absolute',
  left: x * scale + offset.x,
  top: y * scale + offset.y,
};

const viewStyle: ViewStyle = {
  ...positioning,
  width: style?.width ? style.width * scale : undefined,
  height: style?.height ? style.height * scale : undefined,
  backgroundColor: style?.backgroundColor,
  borderRadius: style?.borderRadius ?? 0,
  justifyContent: 'center',
  alignItems: 'center',
};

const textStyle: TextStyle = {
  fontSize: (style?.fontSize || 16) * scale,
  color: style?.color || '#000',
  textAlign: 'center',
};

const imageStyle: ImageStyle = {
  position: 'absolute',
  left: x * scale + offset.x,
  top: y * scale + offset.y,
  width: style?.width ? style.width * scale : undefined,
  height: style?.height ? style.height * scale : undefined,
};


    switch (type) {
      case 'rectangle':
      case 'oval':
        return (
          <View key={id} style={viewStyle}>
            {text && <Text style={textStyle}>{text}</Text>}
          </View>
        );
     case 'text':
  return (
    <Text
  key={id}
  style={[
    {
      position: 'absolute',
      left: x * scale + offset.x,
      top: y * scale + offset.y,
    } as TextStyle,
    textStyle,
  ]}
>
  {text}
</Text>
  );

case 'image':
  return (
    <Image
      key={id}
      source={{ uri }}
      style={imageStyle}
      resizeMode="contain"
    />
  );

    }
  };

  const renderLines = () => (
    <Svg style={StyleSheet.absoluteFill}>
      {lines.map((line, index) => {
        const startShape = shapes.find(s => s.id === line.startShapeId);
        const endShape = shapes.find(s => s.id === line.endShapeId);
        if (!startShape || !endShape) return null;

        const startX = (startShape.position.x + (startShape.style?.width || 0) / 2) * scale + offset.x;
        const startY = (startShape.position.y + (startShape.style?.height || 0) / 2) * scale + offset.y;
        const endX = (endShape.position.x + (endShape.style?.width || 0) / 2) * scale + offset.x;
        const endY = (endShape.position.y + (endShape.style?.height || 0) / 2) * scale + offset.y;

        return (
          <SvgLine
            key={index}
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke="black"
            strokeWidth={2}
          />
        );
      })}
    </Svg>
  );

  const exportToPng = async () => {
    if (!viewShotRef.current) return Alert.alert('Nothing to export');

    try {
      const uri = await captureRef(viewShotRef.current, {
        format: 'png',
        quality: 1,
      });
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') throw new Error('Permission denied');
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Exported!', 'Design saved to your gallery.');
    } catch (error) {
      Alert.alert('Error', 'Export failed: ' + (error as Error).message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Ionicons name="menu" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mirror</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Ionicons name="person-circle-outline" size={32} color="#00C853" />
        </TouchableOpacity>
      </View>

      {/* Preview Area */}
      <View ref={viewShotRef} style={{ flex: 1, backgroundColor: 'white' }}>
        {shapes.length > 0 ? (
          <>
            {renderLines()}
            {shapes.map(shape => renderShape(shape))}
          </>
        ) : (
          <View style={styles.body}>
            <Image
              source={require('../../../assets/images/mirror-placeholder.png')}
              style={styles.illustration}
              resizeMode="contain"
            />
            <Text style={styles.title}>Select a frame or component</Text>
            <Text style={styles.subtitle}>
              Click a top-level frame or component on{"\n"}your computer to get started.
            </Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={exportToPng} style={styles.exportButton}>
          <Ionicons name="download-outline" size={24} color="#fff" />
          <Text style={styles.exportText}>Export PNG</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  illustration: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  exportButton: {
    backgroundColor: '#00C853',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exportText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
});

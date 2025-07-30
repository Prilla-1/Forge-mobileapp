import React, { useRef, useEffect, useState } from 'react';
import {View,Text,StyleSheet,Image,SafeAreaView, StatusBar,TouchableOpacity,Alert,Dimensions,ViewStyle,TextStyle,ImageStyle,Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCanvas } from '../../../context/CanvasContext';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import Svg, { Line as SvgLine, Polygon } from 'react-native-svg';
import { useLocalSearchParams } from 'expo-router';
import { useSharedValue, useAnimatedGestureHandler, useAnimatedStyle } from 'react-native-reanimated';

export default function MirrorScreen() {
  const { shapes, lines } = useCanvas();
  const router = useRouter();
  const params = useLocalSearchParams();
  const canvasRef = useRef<View>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [manualScale, setManualScale] = useState<number|null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [fitToScreenRequested, setFitToScreenRequested] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);

  // Debug: Log all shapes to see what we have
  useEffect(() => {
    console.log('=== MIRROR SCREEN SHAPES DEBUG ===');
    console.log('Total shapes:', shapes.length);
    shapes.forEach((shape, index) => {
      console.log(`Shape ${index}:`, {
        id: shape.id,
        type: shape.type,
        hasBackgroundImage: !!shape.backgroundImage,
        backgroundImage: shape.backgroundImage,
        backgroundImageMode: shape.backgroundImageMode,
        style: shape.style,
        position: shape.position
      });
    });
    console.log('=== END DEBUG ===');
  }, [shapes]);

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // Store the last computed auto-fit scale and offset
  const [autoFit, setAutoFit] = useState({ scale: 1, offset: { x: 0, y: 0 } });

  // Pan and zoom state for the flowchart
  const panX = useSharedValue(0);
  const panY = useSharedValue(0);

  const panGesture = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = panX.value;
      ctx.startY = panY.value;
    },
    onActive: (event, ctx) => {
      panX.value = ctx.startX + event.translationX;
      panY.value = ctx.startY + event.translationY;
    },
  });

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: panX.value + offset.x },
      { translateY: panY.value + offset.y },
      { scale: scale },
    ],
  }));

  // On mount, if params contain panX, panY, scale, use them
  useEffect(() => {
    if (params && params.scale && params.panX && params.panY) {
      setScale(Number(params.scale));
      setOffset({ x: Number(params.panX), y: Number(params.panY) });
      setManualScale(Number(params.scale));
    }
    // Only run once on mount!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-fit effect: recalculate when shapes, canvasWidth, canvasHeight, manualScale, or fitToScreenRequested changes
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

    // Use the device frame size for available space
    const availableWidth = 340;
    const availableHeight = 700;

    // Add some padding around the flowchart
    const padding = 20;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;

    const flowWidth = maxX - minX;
    const flowHeight = maxY - minY;
    
    const scaleX = availableWidth / flowWidth;
    const scaleY = availableHeight / flowHeight;
    
    const MIN_SCALE = 0.5;
    const computedScale = Math.max(Math.min(scaleX, scaleY), MIN_SCALE);

    // Center the flowchart in the frame
    const offsetX = (availableWidth - flowWidth * computedScale) / 2 - minX * computedScale;
    const offsetY = (availableHeight - flowHeight * computedScale) / 2 - minY * computedScale;

    setAutoFit({ scale: computedScale, offset: { x: offsetX, y: offsetY } });
    if (manualScale === null) {
      setScale(computedScale);
      setOffset({ x: offsetX, y: offsetY });
    }
  }, [shapes, manualScale, fitToScreenRequested]);

  // When manualScale changes, update scale and offset
  useEffect(() => {
    if (manualScale === null) {
      setScale(autoFit.scale);
      setOffset(autoFit.offset);
      // Do NOT reset panX.value or panY.value here
    } else {
      setScale(manualScale);
      setOffset(autoFit.offset);
    }
  }, [manualScale, autoFit]);

  const handleZoomIn = () => {
    setManualScale(prev => (prev === null ? scale * 1.2 : prev * 1.2));
  };
  const handleZoomOut = () => {
    setManualScale(prev => (prev === null ? scale / 1.2 : prev / 1.2));
  };
  const handleResetZoom = () => {
    setManualScale(null);
    setFitToScreenRequested(f => f + 1);
  };

  const renderShape = (shape: any) => {
    const { id, type, style, position, uri, text } = shape;
    const { x, y } = position;

    // Debug: Log shape data to see what we're working with
    console.log('Rendering shape:', { 
      id, 
      type, 
      hasBackgroundImage: !!shape.backgroundImage,
      backgroundImage: shape.backgroundImage ? shape.backgroundImage.substring(0, 50) + '...' : 'none',
      backgroundImageMode: shape.backgroundImageMode
    });

    const basePosition = {
      position: 'absolute' as const,
      left: x * scale + offset.x,
      top: y * scale + offset.y,
    };

    switch (type) {
      case 'rectangle':
      case 'oval':
      case 'circle':
      case 'diamond': {
        const viewStyle: ViewStyle = {
          ...basePosition,
          width: style?.width ? style.width * scale : undefined,
          height: style?.height ? style.height * scale : undefined,
          backgroundColor: shape.backgroundImage ? 'transparent' : style?.backgroundColor, // Transparent when image is present
          borderRadius: type === 'circle' || type === 'oval' ? 999 : (style?.borderRadius ?? 0),
          justifyContent: 'center',
          alignItems: 'center',
          transform: type === 'diamond' ? [{ rotate: '45deg' }] : [],
        };

        const textStyle: TextStyle = {
          fontSize: (style?.fontSize || 16) * scale,
          color: shape.fontColor || style?.color || '#000',
          textAlign: 'center',
          transform: type === 'diamond' ? [{ rotate: '-45deg' }] : [],
        };

        return (
          <View key={id} style={viewStyle}>
            {/* Background Image */}
            {shape.backgroundImage && (
              (() => {
                console.log('Rendering background image with URI:', shape.backgroundImage.substring(0, 50) + '...');
                
                // Handle different URI formats
                let imageUri = shape.backgroundImage;
                
                // Convert file:// URIs to proper format for React Native
                if (imageUri.startsWith('file://')) {
                  // Keep as is - React Native should handle file:// URIs
                  console.log('Using file:// URI format');
                } else if (imageUri.startsWith('content://')) {
                  // Android content URI - should work as is
                  console.log('Using content:// URI format');
                } else if (imageUri.startsWith('data:')) {
                  // Base64 data URI - should work as is
                  console.log('Using data: URI format');
                } else {
                  // Try to convert to file:// format if it's a local path
                  if (!imageUri.startsWith('http')) {
                    imageUri = `file://${imageUri}`;
                    console.log('Converted to file:// URI format:', imageUri);
                  }
                }
                
                return (
                  <View style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'transparent', // Make background transparent
                    borderRadius: type === 'circle' || type === 'oval' ? 999 : (style?.borderRadius || 0),
                    zIndex: 2, // Higher z-index to ensure it's on top
                    overflow: 'hidden', // Ensure image respects border radius
                  }}>
                    <Image
                      source={{ uri: imageUri }}
                      style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: shape.backgroundImageMode || 'cover',
                        borderRadius: type === 'circle' || type === 'oval' ? 999 : (style?.borderRadius || 0),
                      }}
                      onError={(error) => console.error('Background image loading error:', error)}
                      onLoad={() => console.log('Background image loaded successfully')}
                    />
                  </View>
                );
              })()
            )}
            {text && <Text style={[textStyle, { zIndex: 3 }]}>{text}</Text>}
          </View>
        );
      }
      case 'kite': {
        // Render kite as SVG Polygon with centered text
        return (
          <View key={id} style={[basePosition, { width: style?.width ? style.width * scale : 100 * scale, height: style?.height ? style.height * scale : 100 * scale, justifyContent: 'center', alignItems: 'center' }]}> 
            {/* Background Image for kite */}
            {shape.backgroundImage && (
              (() => {
                console.log('Rendering kite background image with URI:', shape.backgroundImage.substring(0, 50) + '...');
                
                // Handle different URI formats
                let imageUri = shape.backgroundImage;
                
                // Convert file:// URIs to proper format for React Native
                if (imageUri.startsWith('file://')) {
                  console.log('Using file:// URI format for kite');
                } else if (imageUri.startsWith('content://')) {
                  console.log('Using content:// URI format for kite');
                } else if (imageUri.startsWith('data:')) {
                  console.log('Using data: URI format for kite');
                } else {
                  if (!imageUri.startsWith('http')) {
                    imageUri = `file://${imageUri}`;
                    console.log('Converted kite to file:// URI format:', imageUri);
                  }
                }
                
                return (
                  <Image
                    source={{ uri: imageUri }}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      resizeMode: shape.backgroundImageMode || 'cover',
                      zIndex: 2, // Higher z-index
                    }}
                    onError={(error) => console.error('Kite background image loading error:', error)}
                    onLoad={() => console.log('Kite background image loaded successfully')}
                  />
                );
              })()
            )}
            <Svg width="100%" height="100%" viewBox="0 0 100 100" style={StyleSheet.absoluteFill}>
              <Polygon
                points="50,0 100,50 50,100 0,50"
                fill={shape.backgroundImage ? 'transparent' : (style?.backgroundColor || '#3498db')}
                stroke="#34495e"
                strokeWidth="2"
              />
            </Svg>
            {text && text.trim() && (
              <Text style={{
                position: 'absolute',
                width: '80%',
                textAlign: 'center',
                textAlignVertical: 'center',
                fontWeight: 'bold',
                color: '#000',
                fontSize: Math.max(12, ((style?.width || 100) * scale) / 8),
                includeFontPadding: false,
              }}>
                {text}
              </Text>
            )}
          </View>
        );
      }
      case 'text': {
        const textPositionStyle: TextStyle = {
          ...basePosition,
          fontSize: (style?.fontSize || 16) * scale,
          color: shape.fontColor || style?.color || '#000',
          textAlign: 'center',
        };

        return (
          <Text key={id} style={textPositionStyle}>
            {text}
          </Text>
        );
      }

      case 'arrow': {
        const viewStyle: ViewStyle = {
          ...basePosition,
          width: style?.width ? style.width * scale : undefined,
          height: style?.height ? style.height * scale : undefined,
          backgroundColor: shape.backgroundImage ? 'transparent' : style?.backgroundColor, // Transparent when image is present
          borderRadius: style?.borderRadius ?? 0,
          justifyContent: 'center',
          alignItems: 'center',
        };

        const textStyle: TextStyle = {
          fontSize: (style?.fontSize || 16) * scale,
          color: style?.color || '#000',
          textAlign: 'center',
        };

        return (
          <View key={id} style={viewStyle}>
            {/* Background Image */}
            {shape.backgroundImage && (
              (() => {
                console.log('Rendering arrow background image with URI:', shape.backgroundImage.substring(0, 50) + '...');
                
                // Handle different URI formats
                let imageUri = shape.backgroundImage;
                
                if (imageUri.startsWith('file://')) {
                  console.log('Using file:// URI format for arrow');
                } else if (imageUri.startsWith('content://')) {
                  console.log('Using content:// URI format for arrow');
                } else if (imageUri.startsWith('data:')) {
                  console.log('Using data: URI format for arrow');
                } else {
                  if (!imageUri.startsWith('http')) {
                    imageUri = `file://${imageUri}`;
                    console.log('Converted arrow to file:// URI format:', imageUri);
                  }
                }
                
                return (
                  <View style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'transparent', // Make background transparent
                    borderRadius: style?.borderRadius || 0,
                    zIndex: 2, // Higher z-index
                    overflow: 'hidden', // Ensure image respects border radius
                  }}>
                    <Image
                      source={{ uri: imageUri }}
                      style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: shape.backgroundImageMode || 'cover',
                        borderRadius: style?.borderRadius || 0,
                      }}
                      onError={(error) => console.error('Arrow background image loading error:', error)}
                      onLoad={() => console.log('Arrow background image loaded successfully')}
                    />
                  </View>
                );
              })()
            )}
            {/* Arrow symbol */}
            <Text style={[textStyle, { fontSize: (style?.fontSize || 24) * scale, zIndex: 3 }]}>➔</Text>
            {text && <Text style={[textStyle, { position: 'absolute', bottom: -20, zIndex: 3 }]}>{text}</Text>}
          </View>
        );
      }

      case 'button': {
        const viewStyle: ViewStyle = {
          ...basePosition,
          width: style?.width ? style.width * scale : undefined,
          height: style?.height ? style.height * scale : undefined,
          backgroundColor: shape.backgroundImage ? 'transparent' : style?.backgroundColor, // Transparent when image is present
          borderRadius: style?.borderRadius ?? 8,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: style?.borderColor || '#ccc',
        };

        const textStyle: TextStyle = {
          fontSize: (style?.fontSize || 16) * scale,
          color: style?.color || '#000',
          textAlign: 'center',
        };

        return (
          <View key={id} style={viewStyle}>
            {/* Background Image */}
            {shape.backgroundImage && (
              (() => {
                console.log('Rendering button background image with URI:', shape.backgroundImage.substring(0, 50) + '...');
                
                // Handle different URI formats
                let imageUri = shape.backgroundImage;
                
                if (imageUri.startsWith('file://')) {
                  console.log('Using file:// URI format for button');
                } else if (imageUri.startsWith('content://')) {
                  console.log('Using content:// URI format for button');
                } else if (imageUri.startsWith('data:')) {
                  console.log('Using data: URI format for button');
                } else {
                  if (!imageUri.startsWith('http')) {
                    imageUri = `file://${imageUri}`;
                    console.log('Converted button to file:// URI format:', imageUri);
                  }
                }
                
                return (
                  <View style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'transparent', // Make background transparent
                    borderRadius: style?.borderRadius || 8,
                    zIndex: 2, // Higher z-index
                    overflow: 'hidden', // Ensure image respects border radius
                  }}>
                    <Image
                      source={{ uri: imageUri }}
                      style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: shape.backgroundImageMode || 'cover',
                        borderRadius: style?.borderRadius || 8,
                      }}
                      onError={(error) => console.error('Button background image loading error:', error)}
                      onLoad={() => console.log('Button background image loaded successfully')}
                    />
                  </View>
                );
              })()
            )}
            {text && <Text style={[textStyle, { zIndex: 3 }]}>{text}</Text>}
          </View>
        );
      }

      case 'image': {
        // Ensure we have valid dimensions
        const imageWidth = style?.width ? style.width * scale : 200 * scale;
        const imageHeight = style?.height ? style.height * scale : 200 * scale;
        
        const imageStyle: ImageStyle = {
          ...basePosition,
          width: imageWidth,
          height: imageHeight,
          borderRadius: 8,
        };

        // Ensure the URI is properly formatted for React Native
        const imageUri = uri && uri.startsWith('data:image/') ? uri : `data:image/png;base64,${uri}`;

        // Don't render if no URI
        if (!uri) {
          return null;
        }

        return (
          <Image
            key={id}
            source={{ uri: imageUri }}
            style={imageStyle}
            resizeMode="cover"
          />
        );
      }

      default:
        return null;
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

        return <SvgLine key={index} x1={startX} y1={startY} x2={endX} y2={endY} stroke="black" strokeWidth={2} />;
      })}
    </Svg>
  );

  const exportToPng = async () => {
    if (!canvasRef.current) {
      Alert.alert('Error', 'Canvas not ready');
      return;
    }

    try {
      const uri = await captureRef(canvasRef, {
        format: 'png',
        quality: 1,
      });

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') throw new Error('Permission denied');

      await MediaLibrary.saveToLibraryAsync(uri);
      setShowSuccessModal(true);
    } catch (error) {
      Alert.alert('Error', 'Export failed: ' + (error as Error).message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.deviceFrame}>
        <View
          ref={canvasRef}
          collapsable={false}
          style={styles.canvas}
            onLayout={() => {
              setCanvasWidth(340);
              setCanvasHeight(700);
          }}
        >
          {renderLines()}
          {shapes.map(shape => renderShape(shape))}
        </View>
        </View>
        {/* Unified Vertical Toolbar: AI Button + Fit to Screen */}
        <View style={styles.toolbarColumn}>
          <TouchableOpacity
            style={styles.aiButton}
            onPress={() => router.push('/prompt')}
          >
            <Ionicons name="sparkles" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.fitButton}
            onPress={handleResetZoom}
          >
            <Ionicons name="expand" size={32} color="#6200ee" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer} onLayout={e => setFooterHeight(e.nativeEvent.layout.height)}>
        <TouchableOpacity onPress={exportToPng} style={styles.exportButton}>
          <Ionicons name="download-outline" size={24} color="#fff" />
          <Text style={styles.exportText}>Export PNG</Text>
        </TouchableOpacity>
      </View>
      {/* Custom Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
            </View>
            <Text style={styles.modalTitle}>Success!</Text>
            <Text style={styles.modalMessage}>
              Your design has been successfully saved to your gallery.
            </Text>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerButton: {
    padding: 10,
  },
  canvas: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
    // overflow: 'hidden', // Remove this line to allow panning beyond the visible area
  },
  footer: {
    padding: 16,
    alignItems: 'center',
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
  toolbarColumn: {
    position: 'absolute',
    right: 24,
    bottom: 36,
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 10,
  },
  aiButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginBottom: 18,
  },
  zoomButton: {
    marginVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  modalIconContainer: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#00C853',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  fitButton: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  deviceFrame: {
    width: 340,
    height: 700,
    backgroundColor: '#fff',
    borderRadius: 40,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    borderWidth: 3,
    borderColor: '#bbb',
    marginVertical: 24,
    overflow: 'hidden',
  },
});
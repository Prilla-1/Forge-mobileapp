import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { useCanvas } from '../../context/CanvasContext';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

export default function MirrorScreen() {
  const { savedDesign } = useCanvas();
  const router = useRouter();
  const navigation = useNavigation();
  const viewShotRef = useRef<any>(null);

  const avatarUrl = null;

  const renderShape = (shape: any) => {
    const { type, id, style, position, uri } = shape;

    const commonStyle = {
      position: 'absolute',
      left: position.x,
      top: position.y,
      ...style,
    };

    switch (type) {
      case 'rectangle':
        return <View key={id} style={[commonStyle, { borderRadius: 6 }]} />;
      case 'circle':
        return <View key={id} style={[commonStyle, { borderRadius: 999 }]} />;
      case 'image':
        return (
          <Image
            key={id}
            source={{ uri }}
            style={[commonStyle, { resizeMode: 'cover' }]}
          />
        );
      default:
        return null;
    }
  };

  const exportToPng = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === 'granted') {
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert('Exported!', 'Design saved to your gallery as PNG.');
      } else {
        Alert.alert('Permission denied', 'Cannot save image without permission.');
      }
    } catch (error) {
  if (error instanceof Error) {
    Alert.alert('Error', 'Failed to export PNG: ' + error.message);
  } else {
    Alert.alert('Error', 'Failed to export PNG: ' + String(error));
  }
}

  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔼 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Ionicons name="menu" size={28} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Mirror</Text>

        <TouchableOpacity onPress={() => router.push('/settings')}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="person-circle-outline" size={32} color="#00C853" />
          )}
        </TouchableOpacity>
      </View>

      {/* 🖼 Canvas Preview Area */}
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }} style={{ flex: 1, backgroundColor: '#f5f5f5', position: 'relative' }}>
        {savedDesign?.length === 0 ? (
          <Text style={styles.empty}>No design saved yet.</Text>
        ) : (
          savedDesign.map(renderShape)
        )}
      </ViewShot>

      {/* 📷 Mirror Placeholder */}
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

        <TouchableOpacity onPress={exportToPng} style={styles.exportButton}>
          <Ionicons name="download-outline" size={24} color="#fff" />
          <Text style={styles.exportText}>Export to PNG</Text>
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
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    resizeMode: 'cover',
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
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
  empty: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 18,
    color: '#aaa',
  },
  exportButton: {
    marginTop: 20,
    backgroundColor: '#00C853',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  exportText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
});

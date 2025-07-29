import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useCanvas } from '../../../context/CanvasContext';
import { useRouter } from 'expo-router';

type Template = {
  id: string;
  name: string;
  shapes: string | any[];
  lines: string | any[];
  imageUrl: string;
};

export default function TemplateScreen() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const { loadTemplate } = useCanvas();
  const router = useRouter();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('http://10.212.110.165:8081/api/templates');
        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        console.error('Failed to fetch templates:', error);
        Alert.alert('Error', 'Could not load templates');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleTemplateSelect = (template: Template) => {
    try {
      const parsedShapes =
        typeof template.shapes === 'string' ? JSON.parse(template.shapes) : template.shapes;

      const parsedLines =
        typeof template.lines === 'string' ? JSON.parse(template.lines) : template.lines;

      const sanitizedShapes = parsedShapes.map((shape: any) => ({
        ...shape,
        position: shape.position ?? { x: 0, y: 0 },
        style: {
          width: shape.style?.width ?? 100,
          height: shape.style?.height ?? 100,
          backgroundColor: shape.style?.backgroundColor ?? '#ffffff',
          borderRadius: shape.style?.borderRadius ?? 0,
        },
        color: shape.color ?? '#000000',
        fontSize: shape.fontSize ?? 16,
        fontColor: shape.fontColor ?? '#000000',
        borderColor: shape.borderColor ?? '#000000',
        text: shape.text ?? '',
        uri: shape.uri ?? null,
        isVisible: shape.isVisible ?? true,
        isLocked: shape.isLocked ?? false,
      }));

      loadTemplate({
        ...template,
        shapes: sanitizedShapes,
        lines: parsedLines,
      });

      router.push('/(drawer)/(tabs)/CanvasScreen');
    } catch (error) {
      console.error('Template parsing error:', error);
      Alert.alert('Error', 'This template is invalid or corrupted.');
    }
  };

  return (
    <LinearGradient colors={['#E9D5FF', '#F6F2F7']} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.headerSubtitle}>
          Discover amazing design templates for your next project
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#7C3AED" style={{ marginTop: 40 }} />
        ) : templates.length === 0 ? (
          <Text style={styles.noTemplatesText}>No templates available.</Text>
        ) : (
          <FlatList
            data={templates}
            numColumns={2}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.grid}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => handleTemplateSelect(item)}>
                <Image
                  source={
                    item.imageUrl
                      ? { uri: item.imageUrl }
                      : require('../../../assets/images/template.png')
                  }
                  style={styles.cardImage}
                  resizeMode="cover"
                  onError={(e) => console.log('Image failed to load', e.nativeEvent.error)}
                />

                <TouchableOpacity style={styles.favoriteButton}>
                  <Ionicons name="heart-outline" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.cardTitle}>{item.name || 'Untitled Template'}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 40,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 12,
  },
  noTemplatesText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
  },
  grid: {
    paddingBottom: 16,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    position: 'relative',
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ffffffcc',
    padding: 6,
    borderRadius: 20,
  },
  cardTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});

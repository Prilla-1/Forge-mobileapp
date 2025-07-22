import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useCanvas } from '../../../context/CanvasContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TemplateScreen() {
  const { templates, loadTemplate } = useCanvas();
  const router = useRouter();

  const handleTemplateSelect = (index: number) => {
    loadTemplate(templates[index]);
    router.push('/(drawer)/(tabs)/CanvasScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <Text style={styles.headerTitle}>Templates</Text>
        <Text style={styles.headerSubtitle}>
          Discover amazing design templates for your next project
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
          <Text style={[styles.filterText, styles.activeFilterText]}>All</Text>
        </TouchableOpacity>
      </View>

      {templates.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          No templates available.
        </Text>
      ) : (
        <FlatList
          data={templates}
          keyExtractor={(_, index) => `template-${index}`}
          numColumns={2}
          contentContainerStyle={styles.grid}
          renderItem={({ item, index }) => (
            <TouchableOpacity style={styles.card} onPress={() => handleTemplateSelect(index)}>
              <Image
                source={item.image ?? require('../../../assets/images/template.png')}
                style={styles.cardImage}
              />
              <TouchableOpacity style={styles.favoriteButton}>
                <Ionicons name="heart-outline" size={20} color="#333" />
              </TouchableOpacity>
              <Text style={styles.cardTitle}>Template {index + 1}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  headerWrap: {
    marginTop: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeFilter: {
    backgroundColor: '#007bff',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  grid: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    marginBottom: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
});

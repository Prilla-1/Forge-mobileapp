import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useCanvas } from '../context/CanvasContext';
import { ShapeType } from '../../constants/type';

const TrashScreen = () => {
  const { trash, restoreShapeFromTrash } = useCanvas();

  const renderShapeItem = ({ item }: { item: ShapeType }) => (
    <View style={styles.shapeCard}>
      <Text style={styles.shapeType}>
        {item.type.toUpperCase()} - {item.id.slice(0, 6)}
      </Text>

      {item.type === 'text' && item.text ? (
        <Text style={styles.shapeText}>{item.text}</Text>
      ) : (
        <Text style={styles.preview}>Preview: {item.type}</Text>
      )}

      <TouchableOpacity
        style={styles.restoreButton}
        onPress={() => restoreShapeFromTrash(item.id)}
      >
        <Text style={styles.buttonText}>Restore</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🗑️ Trash</Text>

      {trash.length === 0 ? (
        <Text style={styles.emptyText}>Trash is empty.</Text>
      ) : (
        <FlatList
          data={trash}
          keyExtractor={(item) => item.id}
          renderItem={renderShapeItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default TrashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
  list: {
    paddingBottom: 20,
  },
  shapeCard: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  shapeType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  shapeText: {
    fontSize: 14,
    marginBottom: 8,
  },
  preview: {
    fontStyle: 'italic',
    color: '#333',
    marginBottom: 8,
  },
  restoreButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#4caf50',
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

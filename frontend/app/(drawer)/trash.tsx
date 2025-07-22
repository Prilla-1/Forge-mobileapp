import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import { useCanvas } from '../../context/CanvasContext';
import { ShapeType } from '../../constants/type';

const TrashScreen = () => {
  const { trash, restoreFromTrash } = useCanvas();

  const renderShapeItem: ListRenderItem<ShapeType> = ({ item }) => (
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
        onPress={() => restoreFromTrash(item.id)}
      >
        <Text style={styles.buttonText}>Restore</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <Text style={styles.emptyText}>Trash is empty.</Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🗑️ Trash</Text>

      {trash.length === 0 ? (
        renderEmptyState()
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
    paddingTop: 48,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#222',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 30,
  },
  list: {
    paddingBottom: 24,
  },
  shapeCard: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 10,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  shapeType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  shapeText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  preview: {
    fontStyle: 'italic',
    color: '#444',
    marginBottom: 10,
  },
  restoreButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#4caf50',
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

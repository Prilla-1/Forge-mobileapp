
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useCanvas } from '../../context/CanvasContext';
import { ShapeType } from '../../../constants/type';

export default function LayerScreen() {
  const { shapes } = useCanvas();

  const renderItem = ({ item, index }: { item: ShapeType; index: number }) => (
    <View style={styles.item}>
      <Text style={styles.label}>
        {index + 1}. {item.type} {item.color ? `(${item.color})` : ''}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Layers</Text>
      {shapes.length === 0 ? (
        <Text style={styles.empty}>No shapes on canvas yet.</Text>
      ) : (
        <FlatList
          data={shapes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  empty: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

// app/trash.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useCanvas } from '../context/CanvasContext';

export default function TrashScreen() {
  const { trashedShapes, restoreShape } = useCanvas();

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.item} onPress={() => restoreShape(item)}>
      <Text style={{ fontSize: 18 }}>🗑️ {item.type.toUpperCase()}</Text>
      <Text style={{ fontSize: 12, color: 'gray' }}>Tap to restore</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trash Bin</Text>
      <FlatList
        data={trashedShapes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Trash is empty</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  item: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginBottom: 12,
  },
  empty: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 50,
  },
});

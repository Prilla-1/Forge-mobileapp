// app/(drawer)/(tabs)/LayerScreen.tsx
import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import CanvasContext from '../../context/CanvasContext';

export default function LayerScreen() {
  const { shapes } = useContext(CanvasContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Layers</Text>
      {shapes.length === 0 ? (
        <Text style={styles.empty}>No shapes on canvas yet.</Text>
      ) : (
        <FlatList
          data={shapes}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.item}>
              <Text style={styles.label}>
                {index + 1}. {item.type} ({item.color})
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  label: {
    fontSize: 16,
  },
  empty: {
    fontSize: 16,
    color: '#888',
  },
});

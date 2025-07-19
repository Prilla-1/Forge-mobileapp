import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useCanvas } from '../../context/CanvasContext';
import { useRouter } from 'expo-router';

export default function TemplateScreen() {
  const { templates, loadTemplate } = useCanvas();
  const router = useRouter();

  const handleTemplateSelect = (index: number) => {
    loadTemplate(index);
    router.push('/(drawer)/(tabs)/CanvasScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Template</Text>
      <FlatList
        data={templates}
        keyExtractor={(_, i) => `template-${i}`}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.templateCard}
            onPress={() => handleTemplateSelect(index)}
          >
            <Text style={styles.templateTitle}>Template {index + 1}</Text>
            <Text style={styles.templateDesc}>Tap to customize</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  templateCard: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    alignItems: 'center',
  },
  templateTitle: { fontSize: 18, fontWeight: '600' },
  templateDesc: { fontSize: 14, color: '#555' },
});


import React, { useState } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const dummyData = [
  { id: '1', name: 'Rectangle 1' },
  { id: '2', name: 'Circle 2' },
  { id: '3', name: 'Triangle 3' },
  { id: '4', name: 'Component A' },
  { id: '5', name: 'Frame 5' },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filtered, setFiltered] = useState(dummyData);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const result = dummyData.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(result);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Ionicons name="search-outline" size={20} color="#999" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search shapes or frames..."
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.resultItem}>
            <Text style={styles.resultText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.noResults}>No matches found.</Text>
        }
      />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  resultItem: {
    padding: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
  noResults: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});

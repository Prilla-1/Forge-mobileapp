import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSearch } from '../context/SearchContext';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <View style={styles.inputWrapper}>
      <Ionicons name="search-outline" size={20} color="#999" style={{ marginRight: 8 }} />
      <TextInput
        placeholder="Search shapes or frames..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    marginTop: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
});

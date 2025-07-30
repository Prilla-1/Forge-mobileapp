import React from 'react';
import { View, TextInput, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSearch } from '../../context/SearchContext';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <View style={styles.inputWrapper}>
      <Ionicons
        name="search-outline"
        size={20}
        color="#666"
        style={styles.icon}
        accessibilityLabel="Search icon"
        accessible={true}
      />
      <TextInput
        placeholder="Search shapes or frames..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.input}
        placeholderTextColor="#888"
        accessibilityLabel="Search input"
        returnKeyType="search"
        clearButtonMode={Platform.OS === 'ios' ? 'while-editing' : 'never'}
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
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    marginTop: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    paddingVertical: 2,
  },
});

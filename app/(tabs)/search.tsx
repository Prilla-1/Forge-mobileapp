import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const recentSearches = ['Mobile App', 'Wireframe', 'Login Page'];
const starredFiles = ['Figma Redesign', 'Prototype Flow'];

const mockSearchResults = {
  files: ['Redesign UI', 'User Flow', 'Mobile Cards'],
  prototypes: ['Login Flow Prototype', 'Sign Up Prototype'],
};

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const renderItem = (title: string, index: number) => (
    <TouchableOpacity 
      key={`${title}-${index}`} 
      style={styles.item}
    >
      <Ionicons name="document-text-outline" size={18} color="#444" style={{ marginRight: 8 }} />
      <Text style={styles.itemText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            placeholder="Search files and prototypes"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>

        {/* Recent Searches */}
        {!searchQuery && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            {recentSearches.map((item, index) => renderItem(item, index))}
          </View>
        )}

        {/* Starred Files */}
        {!searchQuery && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Starred</Text>
            {starredFiles.map((item, index) => renderItem(item, index))}
          </View>
        )}

        {/* Search Results */}
        {searchQuery && (
          <View style={styles.searchResults}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Files</Text>
              {mockSearchResults.files.map((item, index) => renderItem(item, index))}
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Prototypes</Text>
              {mockSearchResults.prototypes.map((item, index) => renderItem(item, index))}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
    marginTop: 40,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 12,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemText: {
    fontSize: 15,
    color: '#444',
  },
  searchResults: {
    flex: 1,
  },
});

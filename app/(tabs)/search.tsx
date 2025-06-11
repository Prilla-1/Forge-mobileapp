import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

// Types
type SearchItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  thumbnail: any;
  type: 'design' | 'prototype' | 'file';
};

type SearchFilter = {
  type: 'all' | 'design' | 'prototype' | 'file';
  date: 'all' | 'today' | 'week' | 'month';
  sort: 'recent' | 'name' | 'type';
};

// Mock Data
const mockData: SearchItem[] = [
  {
    id: '1',
    title: 'Landing Page',
    description: 'Website prototype',
    date: 'Today',
    thumbnail: require('../../assets/images/thumbnail1.png'),
    type: 'prototype'
  },
  {
    id: '2',
    title: 'Figma Redesign',
    description: 'Mobile app UI',
    date: 'Yesterday',
    thumbnail: require('../../assets/images/thumbnail2.png'),
    type: 'design'
  },
  {
    id: '3',
    title: 'Marketing Banner',
    description: 'Promotional design',
    date: '2 days ago',
    thumbnail: require('../../assets/images/thumbnail3.png'),
    type: 'file'
  }
];

// Search Result Item Component
const SearchResultItem = ({ item }: { item: SearchItem }) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.8}>
    <Image source={item.thumbnail} style={styles.thumbnail} />
    <View style={styles.cardContent}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.meta}>{item.description} • {item.date}</Text>
    </View>
  </TouchableOpacity>
);

// Search Filters Component
const SearchFilters = ({ 
  filters, 
  onFilterChange 
}: { 
  filters: SearchFilter;
  onFilterChange: (filters: SearchFilter) => void;
}) => {
  return (
    <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: 'row', alignItems: 'center' }}
      >
        <TouchableOpacity 
          style={[styles.filterChip, filters.type === 'all' && styles.activeFilter]}
          onPress={() => onFilterChange({ ...filters, type: 'all' })}
        >
          <Text style={[styles.filterText, filters.type === 'all' && styles.activeFilterText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterChip, filters.type === 'design' && styles.activeFilter]}
          onPress={() => onFilterChange({ ...filters, type: 'design' })}
        >
          <Text style={[styles.filterText, filters.type === 'design' && styles.activeFilterText]}>
            Design
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterChip, filters.type === 'prototype' && styles.activeFilter]}
          onPress={() => onFilterChange({ ...filters, type: 'prototype' })}
        >
          <Text style={[styles.filterText, filters.type === 'prototype' && styles.activeFilterText]}>
            Prototype
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterChip, filters.type === 'file' && styles.activeFilter]}
          onPress={() => onFilterChange({ ...filters, type: 'file' })}
        >
          <Text style={[styles.filterText, filters.type === 'file' && styles.activeFilterText]}>
            File
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// Main Search Screen Component
export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState<SearchItem[]>([]);
  const [filters, setFilters] = useState<SearchFilter>({
    type: 'all',
    date: 'all',
    sort: 'recent'
  });
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const router = useRouter();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  // Handle search
  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.trim() === '') {
      setFilteredData([]);
    } else {
      let results = mockData.filter(item =>
        item.title.toLowerCase().includes(text.toLowerCase())
      );

      // Apply filters
      if (filters.type !== 'all') {
        results = results.filter(item => item.type === filters.type);
      }

      setFilteredData(results);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: SearchFilter) => {
    setFilters(newFilters);
    if (query.trim() !== '') {
      handleSearch(query);
    }
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setFilteredData([]);
  };

  // Add to search history
  const addToHistory = (searchQuery: string) => {
    if (searchQuery.trim() !== '') {
      setSearchHistory(prev => {
        const newHistory = [searchQuery, ...prev.filter(q => q !== searchQuery)].slice(0, 5);
        return newHistory;
      });
    }
  };

  // Render search history
  const renderSearchHistory = () => (
    <View style={styles.historyContainer}>
      <Text style={styles.historyTitle}>Recent Searches</Text>
      {searchHistory.map((item, index) => (
        <TouchableOpacity 
          key={index}
          style={styles.historyItem}
          onPress={() => {
            setQuery(item);
            handleSearch(item);
          }}
        >
          <Ionicons name="time-outline" size={20} color="#666" />
          <Text style={styles.historyText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search files..."
          value={query}
          onChangeText={handleSearch}
          placeholderTextColor="#888"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      <SearchFilters filters={filters} onFilterChange={handleFilterChange} />

      {query === '' ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {renderSearchHistory()}
          {/* Your Projects */}
          <Text style={styles.sectionTitle}>Your Projects</Text>
          <TouchableOpacity onPress={() => router.push({ pathname: '/project-details/[projectId]', params: { projectId: 'team' } })} style={styles.projectRow}>
            <Text style={styles.projectItem}>Team project</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : filteredData.length === 0 ? (
        <ScrollView
          contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
          <Text style={styles.placeholderText}>No results found</Text>
        </ScrollView>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredData.map((item, index) => (
            <SearchResultItem key={index} item={item} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  clearIcon: {
    marginLeft: -30,
    padding: 8,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  cardContent: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  meta: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: '#000',
  },
  filterText: {
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
  },
  historyContainer: {
    padding: 16,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  historyText: {
    marginLeft: 12,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  projectRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  projectItem: {
    fontSize: 16,
    color: '#333',
  },
});

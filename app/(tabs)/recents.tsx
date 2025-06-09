import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  SectionList,
  RefreshControl,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockData = {
  recentPrototypes: [
    {
      id: '1',
      title: 'Landing Page',
      description: 'Website prototype',
      date: 'Today',
      type: 'Prototype',
      thumbnail: require('../../assets/images/thumbnail1.png'),
    }
  ],
  recentFiles: [
    {
      id: '2',
      title: 'Figma Redesign',
      description: 'Mobile app UI',
      date: 'Yesterday',
      type: 'Design File',
      thumbnail: require('../../assets/images/thumbnail2.png'),
    }
  ]
};

function Header() {
  return (
    <View style={styles.header}>
      <TouchableOpacity>
        <Ionicons name="person-circle-outline" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Recents</Text>
      <TouchableOpacity>
        <Ionicons name="search-outline" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

const SkeletonItem = () => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View style={[styles.skeletonCard, { opacity }]}>
      <View style={styles.skeletonThumbnail} />
      <View style={styles.skeletonContent}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonMeta} />
      </View>
    </Animated.View>
  );
};

const RecentsSkeletonLoader = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', marginTop: StatusBar.currentHeight || 0 }}>
      <View style={styles.skeletonHeader}>
        <View style={styles.skeletonCircle} />
        <View style={styles.skeletonHeaderTitle} />
        <View style={styles.skeletonCircle} />
      </View>
      
      <View style={styles.skeletonSectionHeader} />
      
      {[1, 2, 3].map((_, index) => (
        <SkeletonItem key={index} />
      ))}
    </View>
  );
};

export default function RecentsScreen() {
  const [data] = useState(mockData);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      setRefreshing(false);
      setLoading(false);
    }, 1500);
  }, []);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <Image source={item.thumbnail} style={styles.thumbnail} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>{item.description} • {item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="folder-open-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>No recent files</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {loading ? (
        <RecentsSkeletonLoader />
      ) : (
        <>
          <Header />
          <SectionList
            sections={[
              { title: 'Recent Prototypes', data: data.recentPrototypes },
              { title: 'Recent Files', data: data.recentFiles }
            ]}
            renderSectionHeader={({ section: { title }}: { section: { title: string } }) => (
              <Text style={styles.sectionHeader}>{title}</Text>
            )}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={loading ? <ActivityIndicator size="large" color="#999" /> : renderEmpty()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={!data.recentPrototypes.length && !data.recentFiles.length && !loading ? styles.emptyPadding : { paddingBottom: 20 }}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    marginLeft: 10,
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
  thumbnailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 120,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  emptyPadding: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginTop: StatusBar.currentHeight || 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  cardContent: {
    marginLeft: 12,
    flex: 1,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  skeletonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  skeletonThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
  },
  skeletonContent: {
    marginLeft: 12,
    flex: 1,
  },
  skeletonTitle: {
    width: '80%',
    height: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  skeletonMeta: {
    width: '60%',
    height: 13,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginTop: 8,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  skeletonCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
  },
  skeletonHeaderTitle: {
    width: 80,
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  skeletonSectionHeader: {
    width: 150,
    height: 18,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    margin: 16,
  },
});

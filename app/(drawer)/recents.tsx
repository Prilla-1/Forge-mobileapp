import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState, useMemo } from 'react';
import { ActivityIndicator,Animated, FlatList,Image,RefreshControl,SafeAreaView,StatusBar, StyleSheet,Text,TouchableOpacity,View,ScrollView} from 'react-native';
import { useRouter } from 'expo-router';
import { mockProjects as baseMockProjects } from '../../mockProjects';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import { useProjectContext, Project } from '../../context/ProjectContext';

function Header() {
  return null;
}

const SkeletonItem = React.memo(() => {
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
});

const RecentsSkeletonLoader = React.memo(() => {
  const skeletonItems = useMemo(() => {
    return [1, 2, 3].map((_, index) => (
      <SkeletonItem key={index} />
    ));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', marginTop: StatusBar.currentHeight || 0 }}>
      <View style={styles.skeletonHeader}>
        <View style={styles.skeletonCircle} />
        <View style={styles.skeletonHeaderTitle} />
        <View style={styles.skeletonCircle} />
      </View>
      
      <View style={styles.skeletonSectionHeader} />
      
      {skeletonItems}
    </View>
  );
});

const FontLoader = ({ children }: { children: React.ReactNode }) => {
  const [fontsLoaded] = useFonts({
    'SpaceMono-Regular': require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#A07BB7" />
      </View>
    );
  }

  return <>{children}</>;
};

const RecentsContent = React.memo(() => {
  const { projects, setProjects } = useProjectContext();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const toggleFavorite = useCallback((id: string) => {
    setProjects((prev: Project[]) => prev.map((p: Project) =>
      p.id === id ? { ...p, favorite: !p.favorite } : p
    ));
  }, [setProjects]);

  const renderItem = useCallback(({ item }: { item: Project }) => (
    <TouchableOpacity
      style={styles.cardModern}
      activeOpacity={0.85}
      onPress={() => router.push(`/file-details/${item.id}`)}
    >
      <Image
        source={item.thumbnail}
        style={styles.thumbnailModern}
        resizeMode="cover"
      />
      <View style={styles.cardContentModern}>
        <Text style={styles.titleModern} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.metaModern} numberOfLines={2}>{item.description}</Text>
        <View style={styles.cardActions}>
          <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
            <Ionicons
              name={item.favorite ? 'star' : 'star-outline'}
              size={22}
              color={item.favorite ? '#FFD600' : '#A07BB7'}
            />
          </TouchableOpacity>
          <Text style={styles.commentsCount}>{item.comments.length} comments</Text>
        </View>
      </View>
    </TouchableOpacity>
  ), [router, toggleFavorite]);

  const favorites = useMemo(() => projects.filter((item: Project) => item.favorite), [projects]);
  const nonFavorites = useMemo(() => projects.filter((item: Project) => !item.favorite), [projects]);

  return (
    <LinearGradient colors={["#E9D5FF", "#F6F2F7"]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        {loading ? (
          <RecentsSkeletonLoader />
        ) : (
          <ScrollView
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
          >
            {favorites.length > 0 && (
              <>
                <Text style={styles.favoritesTitle}>Favorites</Text>
                {favorites.map((item: Project) => (
                  <View key={item.id}>
                    {renderItem({ item })}
                  </View>
                ))}
                {nonFavorites.length > 0 && <View style={styles.divider} />}
              </>
            )}
            {nonFavorites.map((item: Project) => (
              <View key={item.id}>
                {renderItem({ item })}
              </View>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
});

export default function RecentsScreen() {
  return (
    <FontLoader>
      <RecentsContent />
    </FontLoader>
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
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  cardModern: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginHorizontal: 14,
    marginVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 20,
    shadowColor: '#A07BB7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 18,
    elevation: 7,
    borderWidth: 1,
    borderColor: 'rgba(160,123,183,0.07)',
  },
  thumbnailModern: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#e9d7f7',
  },
  cardContentModern: {
    flex: 1,
    marginLeft: 18,
    justifyContent: 'center',
    fontFamily: 'JetBrainsMono-Medium',
  },
  titleModern: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6C47A6',
    marginBottom: 4,
    fontFamily: 'SpaceMono-Regular',
    letterSpacing: 0.2,
  },
  metaModern: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
    // Use system font for meta
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 8,
  },
  commentsCount: {
    fontSize: 13,
    color: '#A07BB7',
    marginLeft: 12,
    fontWeight: '600',
    // Use system font for comments count
  },
  headerSimple: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitleSimple: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6C47A6',
    letterSpacing: 1,
  },
  favoritesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6C47A6',
    marginLeft: 18,
    marginTop: 8,
    marginBottom: 2,
    fontFamily: 'SpaceMono-Regular',
  },
  divider: {
    height: 2,
    backgroundColor: '#111',
    marginVertical: 10,
    marginHorizontal: 18,
    borderRadius: 2,
  },
  gradient: {
    flex: 1,
  },
});

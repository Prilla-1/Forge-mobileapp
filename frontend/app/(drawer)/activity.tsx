import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, StatusBar, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ActivityScreen() {
  // Mock activity data
  const [activities, setActivities] = useState([
    {
      id: '1',
      text: 'Jane commented on Mobile App UI',
      time: '2h ago',
      unread: true,
    },
    {
      id: '2',
      text: 'You were added to Team Project 1',
      time: '1d ago',
      unread: false,
    },
  ]);
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread'>('all');
  const avatarUrl = null; // Replace with a real URL to test image avatar
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // Calculate unread count
  const unreadCount = activities.filter(a => a.unread).length;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleActivityPress = (id: string) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, unread: false } : a));
    // For demo: show alert or log
    if (typeof window !== 'undefined' && window.alert) {
      window.alert('Viewing activity details (placeholder)');
    } else {
      console.log('Viewing activity details (placeholder)');
    }
  };

  const visibleActivities = selectedTab === 'all'
    ? activities
    : activities.filter(a => a.unread);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Activity</Text>
          <TouchableOpacity style={styles.avatarButton} onPress={() => router.push('/settings')}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person-circle-outline" size={32} color="#00C853" />
            )}
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <Pressable onPress={() => setSelectedTab('all')}>
            <Text style={[styles.tabText, selectedTab === 'all' && styles.activeTab]}>
              All
            </Text>
          </Pressable>
          <Pressable onPress={() => setSelectedTab('unread')} style={styles.unreadTab}>
            <Text style={[styles.tabText, selectedTab === 'unread' && styles.activeTab]}>
              Unread ({unreadCount})
            </Text>
            {unreadCount > 0 && <View style={styles.unreadDot} />}
          </Pressable>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Activity List */}
        {visibleActivities.length > 0 ? (
          <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
            {visibleActivities.map(activity => (
              <TouchableOpacity
                key={activity.id}
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18, opacity: activity.unread ? 1 : 0.6 }}
                onPress={() => handleActivityPress(activity.id)}
                activeOpacity={0.7}
              >
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: activity.unread ? '#FF3B30' : 'transparent', marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: activity.unread ? '600' : '400', color: '#222' }}>{activity.text}</Text>
                  <Text style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{activity.time}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>You're all caught up</Text>
            <Text style={styles.emptySubtitle}>Check back later for new updates.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  avatarButton: {
    padding: 0,
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    resizeMode: 'cover',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 20,
  },
  tabText: {
    fontSize: 16,
    color: '#999',
  },
  activeTab: {
    color: '#000',
    fontWeight: '600',
  },
  unreadTab: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
  },
});

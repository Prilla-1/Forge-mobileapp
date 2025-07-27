import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, StatusBar, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useProjectContext, Activity, Project } from '../../context/ProjectContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Swipeable } from 'react-native-gesture-handler';

export default function ActivityScreen() {
  const { activities, projects, setActivities } = useProjectContext();
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread'>('all');
  const avatarUrl = null;
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // For demo, all activities are 'read'. You can add unread logic if needed.
  const visibleActivities = activities;
  const unreadCount = 0;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleActivityPress = (id: string) => {
    // For demo: show alert or log
    if (typeof window !== 'undefined' && window.alert) {
      window.alert('Viewing activity details (placeholder)');
    } else {
      console.log('Viewing activity details (placeholder)');
    }
  };

  return (
    <LinearGradient colors={["#F6F2F7", "#E9D7F7", "#A07BB7"]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.headerSubtitle}>Stay updated with project activities</Text>
          </View>

          {/* Clean top area, no header/profile/tabs */}
          <View style={styles.divider} />

          {/* Activity List */}
          {visibleActivities.length > 0 ? (
            <View style={{ paddingHorizontal: 10, paddingTop: 12 }}>
              {visibleActivities.map((activity: Activity) => {
                const project = projects.find((p: Project) => p.id === activity.projectId);
                return (
                  <Swipeable
                    key={activity.id}
                    renderRightActions={() => (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => {
                          setActivities((prev: Activity[]) => prev.filter((a: Activity) => a.id !== activity.id));
                        }}
                      >
                        <Ionicons name="trash" size={22} color="#fff" />
                      </TouchableOpacity>
                    )}
                  >
                    <TouchableOpacity
                      style={styles.activityCard}
                      onPress={() => handleActivityPress(activity.id)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.activityIconWrap}>
                        <Ionicons name="chatbubble-ellipses-outline" size={22} color="#A07BB7" />
                      </View>
                      <View style={{ flex: 1 }}>
                        {activity.type === 'comment' ? (
                          <>
                            <Text style={styles.activityProject}>
                              {activity.author || 'Someone'} commented on <Text style={styles.activityProjectName}>{project?.title || 'a project'}</Text>:
                            </Text>
                            <Text style={styles.activityComment}>
                              "{activity.text}"
                            </Text>
                            <Text style={styles.activityDateRight}>{activity.date}{activity.time ? ` ${activity.time}` : ''}</Text>
                          </>
                        ) : activity.type === 'reply' ? (
                          <>
                            <Text style={styles.activityProject}>
                              {activity.author || 'Someone'} replied to a comment on <Text style={styles.activityProjectName}>{project?.title || 'a project'}</Text>:
                            </Text>
                            <Text style={styles.activityComment}>
                              "{activity.text}"
                            </Text>
                            <Text style={styles.activityDateRight}>{activity.date}{activity.time ? ` ${activity.time}` : ''}</Text>
                          </>
                        ) : (
                          <Text style={styles.activityProject}>{activity.text}</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  </Swipeable>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>You're all caught up</Text>
              <Text style={styles.emptySubtitle}>Check back later for new updates.</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  activeTab: {
    color: '#fff',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 0.5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  emptySubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  gradient: {
    flex: 1,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    marginHorizontal: 4,
    shadowColor: '#A07BB7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(160, 123, 183, 0.1)',
  },
  activityIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f6f2f7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#A07BB7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e9d7f7',
  },
  activityProject: {
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
    lineHeight: 20,
    fontWeight: '500',
  },
  activityProjectName: {
    color: '#A07BB7',
    fontWeight: '600',
  },
  activityComment: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 18,
    backgroundColor: '#f8f6f9',
    padding: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#A07BB7',
  },
  activityDateRight: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: '90%',
    borderRadius: 16,
    marginVertical: 4,
    marginRight: 8,
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FF3B30', // Changed to red
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

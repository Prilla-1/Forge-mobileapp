import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const activityData = [
  {
    id: '1',
    icon: 'pencil-outline',
    description: 'You edited "Figma Redesign"',
    time: 'Just now',
  },
  {
    id: '2',
    icon: 'chatbox-outline',
    description: 'You commented on "Prototype Flow"',
    time: '10 mins ago',
  },
  {
    id: '3',
    icon: 'share-outline',
    description: 'You shared "Onboarding UI"',
    time: '1 hour ago',
  },
  {
    id: '4',
    icon: 'cloud-upload-outline',
    description: 'You uploaded "Wireframe Kit"',
    time: 'Yesterday',
  },
  {
    id: '5',
    icon: 'people-outline',
    description: 'You invited Alex to "App Design"',
    time: '2 days ago',
  },
];

export default function ActivityScreen() {
  const renderItem = ({ item }: { item: typeof activityData[0] }) => (
    <TouchableOpacity 
        style={styles.activityItem}
        activeOpacity={0.7}
        onPress={() => {}}
    >
      <Ionicons name={item.icon as any} size={20} color="#333" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Activity</Text>
        <FlatList
          data={activityData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
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
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1a1a1a',
    marginTop: 40,
  },
  list: {
    paddingBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    paddingHorizontal: 2,
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
    opacity: 0.9,
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
    fontWeight: '500',
  },
  time: {
    fontSize: 13,
    color: '#888',
  },
});

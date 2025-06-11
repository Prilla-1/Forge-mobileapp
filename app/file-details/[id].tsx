import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, Button, Alert, Share, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FileDetailsScreen() {
  const { id } = useLocalSearchParams();

  // Mock handlers
  const handleEdit = () => {
    Alert.alert('Edit', 'Edit project feature coming soon!');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this project: ${id}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share the project.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Deleted', 'Project deleted (mock).') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>File/Project Details</Text>
      <Text style={styles.id}>ID: {id}</Text>
      <Text style={styles.placeholder}>Details for this file/project will be displayed here.</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
          <Ionicons name="pencil" size={22} color="#333" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Ionicons name="share-social" size={22} color="#333" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
          <Ionicons name="trash" size={22} color="#d00" />
          <Text style={[styles.actionText, { color: '#d00' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  id: {
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
  },
  placeholder: {
    fontSize: 16,
    color: '#888',
    marginBottom: 32,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  actionButton: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  actionText: {
    marginTop: 6,
    fontSize: 14,
    color: '#333',
  },
}); 
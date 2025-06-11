import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

function ShareButton() {
  return (
    <TouchableOpacity onPress={() => { /* TODO: implement share */ }} style={{ padding: 8 }}>
      <Ionicons name="share-social-outline" size={24} color="#222" />
    </TouchableOpacity>
  );
}

export default function ProjectDetailsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[projectId]"
        options={{
          title: 'Team project',
          headerRight: () => <ShareButton />,
        }}
      />
    </Stack>
  );
} 
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Share } from 'react-native';

function ShareButton() {
  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out this team project in Figma Clone!',
      });
    } catch (error) {
      // Optionally handle error
    }
  };
  return (
    <TouchableOpacity onPress={handleShare} style={{ padding: 8 }}>
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
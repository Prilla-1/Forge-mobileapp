import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import TabBar from '../../components/TabBar'; // Import the new custom tab bar

export default function TabsLayout() {
  const router = useRouter();

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />} // Use the custom tab bar
      screenOptions={({ route }) => ({
        headerTitle: '',
        headerLeft: () => null,
        headerRight: () =>
          route.name !== 'mirror' ? (
            <TouchableOpacity onPress={() => router.push('/components/search')} style={{ marginRight: 16 }}>
              <Ionicons name="search-outline" size={24} color="#000" />
            </TouchableOpacity>
          ) : null,
      })}
    > 
      <Tabs.Screen name="mirror" options={{ headerShown: false, title: 'Mirror' }} />
      <Tabs.Screen name="ToolsScreen" options={{ title: 'Tools' }} />
      <Tabs.Screen name="CanvasScreen" options={{ title: 'Canvas' }} />
      <Tabs.Screen name="Templates" options={{ title: 'Templates' }} />
      <Tabs.Screen name="LayerScreen" options={{ title: 'Layers' }} />
    </Tabs>
  );
}

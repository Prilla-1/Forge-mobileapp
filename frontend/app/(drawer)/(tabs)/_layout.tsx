import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function TabsLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerTitle: '',
        headerLeft: () => null,
        headerRight: () =>
          route.name !== 'mirror' ? (
            <TouchableOpacity onPress={() => router.push('/search')} style={{ marginRight: 16 }}>
              <Ionicons name="search-outline" size={24} color="#000" />
            </TouchableOpacity>
          ) : null,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'apps';

          if (route.name === 'CanvasScreen') iconName = 'brush-outline';
          if (route.name === 'ToolsPanel') iconName = 'construct';
          if (route.name === 'LayerScreen') iconName = 'layers-outline';
          if (route.name === 'mirror') iconName = 'phone-portrait-outline';
          if (route.name === 'PropertiesScreen') iconName = 'settings-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="mirror" options={{ headerShown: false, title: 'Mirror' }} />
      <Tabs.Screen name="ToolsPanel" options={{ title: 'Tools' }} />
      <Tabs.Screen name="CanvasScreen" options={{ title: 'Canvas' }} />
      <Tabs.Screen name="LayerScreen" options={{ title: 'Layers' }} />
      <Tabs.Screen name="PropertiesScreen" options={{ title: 'Props' }} />
    </Tabs>
  );
}

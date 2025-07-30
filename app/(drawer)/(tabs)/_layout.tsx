import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import TabBar from '../../components/TabBar'; 

export default function TabsLayout() {
  const router = useRouter();
  const navigation = useNavigation();

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />} 
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: '#A07BB7',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
        headerTitle: route.name === 'mirror' ? 'MIRROR' : 
                    route.name === 'ToolsScreen' ? 'TOOLS' :
                    route.name === 'CanvasScreen' ? 'CANVAS' :
                    route.name === 'Templates' ? 'TEMPLATES' :
                    route.name === 'LayerScreen' ? 'LAYERS' : '',
        headerLeft: () => (
          route.name === 'mirror' ? (
            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={{ marginLeft: 16 }}>
              <Ionicons name="menu" size={28} color="#fff" />
            </TouchableOpacity>
          ) : null
        ),
        headerRight: () => (
          route.name === 'mirror' ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => router.push('/components/search')} style={{ marginRight: 16 }}>
                <Ionicons name="search-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/settings')} style={{ marginRight: 16 }}>
                <Ionicons name="person-circle-outline" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : null
        ),
      })}
    > 
      <Tabs.Screen name="mirror" options={{ title: 'Mirror' }} />
      <Tabs.Screen name="ToolsScreen" options={{ title: 'Tools' }} />
      <Tabs.Screen name="CanvasScreen" options={{ title: 'Canvas' }} />
      <Tabs.Screen name="Templates" options={{ title: 'Templates' }} />
      <Tabs.Screen name="LayerScreen" options={{ title: 'Layers' }} />
    </Tabs>
  );
}

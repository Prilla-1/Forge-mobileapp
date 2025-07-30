
import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';

function CustomDrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      <View style={styles.divider} />
      <DrawerItemList {...props} />
      <View style={styles.footer}>
        <Text style={styles.footerText}>© {new Date().getFullYear()} Forge Team</Text>
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer drawerContent={CustomDrawerContent} screenOptions={{
      drawerActiveTintColor: '#7e22ce',
      drawerInactiveTintColor: '#333',
      drawerLabelStyle: { fontWeight: 'bold', fontSize: 18 },
      drawerStyle: { backgroundColor: '#f5f1e9', borderTopRightRadius: 32, borderBottomRightRadius: 32 },
    }}>
      <Drawer.Screen name="(tabs)" options={{ headerShown: false, drawerLabel: 'Home' }} />
      <Drawer.Screen name="recents" options={{ title: 'Recents' }} />
      <Drawer.Screen name="activity" options={{ title: 'Activity' }} />
      <Drawer.Screen name="trash" options={{ title: 'Trash' }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#f5f1e9',
    paddingTop: 32,
    paddingBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0d7f7',
    marginVertical: 12,
    marginHorizontal: 16,
    borderRadius: 1,
  },
  drawerLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#a78bfa',
    marginTop: 12,
  },
});

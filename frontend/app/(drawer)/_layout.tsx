
import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
  return (
    <Drawer>
      <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
      <Drawer.Screen name="recents" options={{ title: 'Recents' }} />
      <Drawer.Screen name="activity" options={{ title: 'Activity' }} />
      <Drawer.Screen name="trash" options={{ title: 'Trash' }} />
    </Drawer>
  );
}

import React from 'react';
import { Slot } from 'expo-router';
import { UserProvider } from '../context/UserContext';
import { CanvasProvider } from '../context/CanvasContext';
import { ProjectProvider } from '../context/ProjectContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SearchProvider from '../context/SearchContext';
import { ThemeProvider } from '@/context/ThemeContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
      <UserProvider>
      <SafeAreaProvider>
        <SearchProvider>
          <ProjectProvider>
            <CanvasProvider>
              <Slot />
            </CanvasProvider>
          </ProjectProvider>
        </SearchProvider>
      </SafeAreaProvider>
      </UserProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

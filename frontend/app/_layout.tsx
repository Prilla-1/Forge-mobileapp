import React from 'react';
import { Slot } from 'expo-router';
import { CanvasProvider } from './context/CanvasContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SearchProvider } from './context/SearchContext';

export default function RootLayout() {
  return (
    <SearchProvider>
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <CanvasProvider>
          <Slot />
        </CanvasProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
    </SearchProvider>
  );
}

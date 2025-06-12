// app/layout.tsx
import { Stack } from "expo-router";
import React, { useState } from "react";
import OnboardingScreen from "./onboarding";

export default function RootLayout() {
  // In a real app, use persistent storage (AsyncStorage/SecureStore) for onboarding state
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  if (!onboardingComplete) {
    return <OnboardingScreen onDone={() => setOnboardingComplete(true)} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

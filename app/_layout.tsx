// app/layout.tsx
import { Stack } from "expo-router";
import React, { useState, useEffect } from "react";
import OnboardingScreen from "./onboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("onboardingComplete").then(value => {
      setOnboardingComplete(value === "true");
    });
  }, []);

  const handleOnboardingDone = async () => {
    await AsyncStorage.setItem("onboardingComplete", "true");
    setOnboardingComplete(true);
  };

  if (onboardingComplete === null) {
    // Optionally show a splash/loading screen here
    return null;
  }

  if (!onboardingComplete) {
    return <OnboardingScreen onDone={handleOnboardingDone} />;
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

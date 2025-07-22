import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const rotation = useSharedValue(0);

  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  useEffect(() => {
    const spinAnimation = () => {
      // Reset rotation to 0 before starting the new spin
      rotation.value = 0;
      rotation.value = withTiming(360, {
        duration: 1000, // A single, fast 1-second spin
        easing: Easing.out(Easing.cubic),
      });
    };

    // Start the first spin immediately
    spinAnimation();

    // Set an interval to repeat the spin every 4 seconds (1s spin + 3s pause)
    const interval = setInterval(spinAnimation, 4000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <View style={styles.logoContainer}>
          <Animated.Image
            source={require('../../assets/images/FORGE-logo.png')}
            style={[styles.logo, animatedLogoStyle]}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.title}>Welcome to Forge</Text>
        <Text style={styles.subtitle}>Design and create project flowcharts</Text>

        <TouchableOpacity
          style={[styles.getStartedBtn, { bottom: insets.bottom + 30 }]}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', // Optional: Adds a dark overlay for better text visibility
  },
  logoContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FFFFFF', // Changed to solid white for a clean, opaque background
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden', // This ensures the content is clipped to the container's rounded corners
  },
  logo: {
    width: 300, // Zoomed in even further for maximum impact
    height: 300,
    marginTop: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#eee',
    textAlign: 'center',
    marginBottom: 60,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  getStartedBtn: {
    position: 'absolute',
    backgroundColor: '#a07bb7',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  getStartedText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

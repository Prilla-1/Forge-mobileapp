import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { View,Text,StyleSheet,Image,TouchableOpacity,SafeAreaView,Dimensions,ScrollView,} from 'react-native';
import Animated, {useSharedValue,useAnimatedStyle,withTiming,Easing,} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [step, setStep] = useState(0);

  const fadeIn = useSharedValue(0);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
  }));

  useEffect(() => {
    fadeIn.value = withTiming(1, {
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
    });

    const timeout = setTimeout(() => {
      scrollRef.current?.scrollTo({ x: width, animated: true });
      setStep(1);
    }, 4000); // 4 seconds

    return () => clearTimeout(timeout);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
      >
        {/* First screen_animated */}
        <View style={[styles.page, { backgroundColor: '#f8f5f2' }]}>
          <Animated.Image
            source={require('../../assets/images/FORGE-logo.png')}
            style={[styles.logo, overlayStyle]}
            resizeMode="contain"
          />
        </View>

        {/* Second screen*/}
        <View style={styles.page}>
          <Image
            source={require('../../assets/images/background.png')}
            style={styles.fullscreenBg}
            resizeMode="cover"
          />
          <View style={styles.overlay}>
            <Text style={styles.title}>Mirror & Collaborate</Text>
            <Image
              source={require('../../assets/images/screen3.png')}
              style={styles.stepImage}
              resizeMode="contain"
            />
            <Text style={styles.subtitle}>
              Preview your designs live on your device and keep up with project activity—all in one place.
            </Text>

            <TouchableOpacity
              style={[styles.getStartedBtn, { marginBottom: insets.bottom + 24 }]}
              onPress={() => router.push('/(auth)/login')}
            >
              <Text style={styles.getStartedText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Progress dots */}
      <View style={styles.progressRow}>
        {[0, 1].map((_, i) => (
          <View key={i} style={[styles.dot, step === i && styles.activeDot]} />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f5f2',
  },
  page: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180,
  },
  fullscreenBg: {
    position: 'absolute',
    width,
    height,
    top: 0,
    left: 0,
  },
  overlay: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 16,
  },
  stepImage: {
    width: 173,
    height: 173,
    borderRadius: 86.5,
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  getStartedBtn: {
    backgroundColor: '#a07bb7',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    shadowColor: '#a07bb7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 40,
  },
  getStartedText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressRow: {
    position: 'absolute',
    bottom: 24,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0d6d0',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#a07bb7',
    width: 16,
    borderRadius: 8,
  },
});

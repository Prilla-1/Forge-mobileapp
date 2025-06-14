import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Dimensions, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

type OnboardingScreenProps = {
  onDone: () => void;
};

const steps = [
  {
    key: 1,
    title: 'Welcome to Figmine',
    subtitle: 'Your Figma projects, anywhere, anytime. Access your designs and prototypes on the go.',
    image: require('../assets/images/screen1.png'),
  },
  {
    key: 2,
    title: 'Stay Organized & Connected',
    subtitle: 'Browse recent files, search across teams, and keep up with project activity—all in one place.',
    image: require('../assets/images/screen2.png'),
  },
  {
    key: 3,
    title: 'Mirror & Collaborate',
    subtitle: "Preview your designs live on your device and manage your team's workspaces with ease.",
    image: require('../assets/images/screen3.png'),
  },
];

export default function OnboardingScreen({ onDone }: OnboardingScreenProps) {
  const [step, setStep] = useState(0);
  const insets = useSafeAreaInsets();
  const scrollRef = React.useRef<ScrollView>(null);
  const onScroll = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    if (index !== step) setStep(index);
  };
  const handleNext = () => {
    if (step < steps.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (step + 1), animated: true });
      setStep(step + 1);
    }
  };
  const handleBack = () => {
    if (step > 0) {
      scrollRef.current?.scrollTo({ x: width * (step - 1), animated: true });
      setStep(step - 1);
    }
  };
  const handleSkip = () => {
    onDone();
  };
  const handleGetStarted = () => {
    onDone();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Image source={require('../assets/images/fullscreen.png')} style={styles.fullscreenBg} resizeMode="cover" />
      <View style={styles.overlay}>
        {step < steps.length - 1 && (
          <TouchableOpacity style={[styles.skip, { top: insets.top + 16 }]} onPress={handleSkip} activeOpacity={0.85}>
            <Text style={styles.skipText}>skip</Text>
          </TouchableOpacity>
        )}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ alignItems: 'center' }}
          style={{ flexGrow: 0 }}
        >
          {steps.map((stepItem, i) => (
            <View key={stepItem.key} style={[styles.content, { width }]}> 
              <Image source={stepItem.image} style={styles.stepImage} resizeMode="contain" />
              <Text style={styles.title}>{stepItem.title}</Text>
              <Text style={styles.subtitle}>{stepItem.subtitle}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.progressRow}>
          {steps.map((_, i) => (
            <View key={i} style={[styles.dot, step === i && styles.activeDot]} />
          ))}
        </View>
        <View style={[styles.bottomRow, { marginBottom: insets.bottom + 24 }]}> 
          <TouchableOpacity onPress={handleBack} disabled={step === 0}>
            <Text style={[styles.backText, step === 0 && { opacity: 0.3 }]}>back</Text>
          </TouchableOpacity>
          {step < steps.length - 1 ? (
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.getStartedBtn} onPress={handleGetStarted}>
              <Text style={styles.getStartedText}>Get started</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f5f2',
  },
  fullscreenBg: {
    position: 'absolute',
    width: width,
    height: height,
    top: 0,
    left: 0,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 0,
  },
  skip: {
    position: 'absolute',
    // top will be set dynamically using insets.top + 16
    right: 32,
    zIndex: 2,
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderWidth: 1.5,
    borderColor: '#e0d6d0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  skipText: {
    color: '#a07bb7',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  content: {
    alignItems: 'center',
    marginTop: 80,
  },
  stepImage: {
    width: width * 0.7,
    height: height * 0.3,
    marginBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
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
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width - 64,
    marginTop: 32,
  },
  backText: {
    color: '#3578e5', // blue
    fontSize: 16,
    fontWeight: '500',
  },
  nextBtn: {
    backgroundColor: '#a07bb7',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    shadowColor: '#a07bb7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  nextText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  },
  getStartedText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 
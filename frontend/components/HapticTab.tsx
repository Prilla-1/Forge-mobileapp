import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing } from 'react-native-reanimated';

type HapticTabProps = {
  iconName: keyof typeof Ionicons.glyphMap;
  isFocused: boolean;
  onPress: () => void;
  label: string; // Add label prop
};

const HapticTab: React.FC<HapticTabProps> = ({ iconName, isFocused, onPress, label }) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }, { scale: scale.value }],
    };
  });

  const handlePress = () => {
    rotation.value = withTiming(360, { duration: 300, easing: Easing.inOut(Easing.ease) }, (finished) => {
      if (finished) rotation.value = 0;
    });
    scale.value = withSpring(0.9, {}, () => scale.value = withSpring(1));
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Animated.View style={[styles.inner, isFocused ? styles.focused : {}, animatedStyle]}>
        <Ionicons name={iconName} size={24} color={isFocused ? '#fff' : '#555'} />
      </Animated.View>
      <Text style={[styles.label, isFocused ? styles.focusedLabel : {}]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  inner: {
    width: 44, // Smaller circle
    height: 44,
    borderRadius: 22, // Half of the new width/height
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  focused: {
    backgroundColor: '#a07bb7',
  },
  label: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  focusedLabel: {
    color: '#a07bb7',
    fontWeight: 'bold',
  },
});

export default HapticTab;

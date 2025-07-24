import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/Colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fontsLoaded] = useFonts({
    'JetBrainsMono-Medium': require('../../assets/fonts/fonts/ttf/JetBrainsMono-Medium.ttf'),
  });

  const scale = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(50);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    headerOpacity.value = withTiming(1, { duration: 800 });
    cardTranslateY.value = withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.ease),
    });
    cardOpacity.value = withTiming(1, { duration: 800 });
  }, []);

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ scale: scale.value }],
  }));
  const animatedCardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSignup = async () => {
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      return setError('Please fill out all fields.');
    }
    if (!validateEmail(email)) {
      return setError('Please enter a valid email address.');
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return setError(
        'Password must be 8+ characters and include uppercase, lowercase, number, and symbol.'
      );
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    try {
      const response = await fetch('http://10.21.192.165:8081/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.text();
      console.log('Signup response:', data);

      if (response.ok) {
        Alert.alert('Success', 'Account created successfully.');
        router.replace('/(drawer)/(tabs)/mirror');
      } else {
        setError(data || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#A07BB7', '#F6F2F7']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 24,
              }}
            >
              <Animated.View
                style={[
                  { alignItems: 'center', marginBottom: 24 },
                  animatedHeaderStyle,
                ]}
              >
                <Image
                  source={require('../../assets/images/homepage (1).png')}
                  style={{
                    width: 80,
                    height: 80,
                    marginBottom: 12,
                    borderRadius: 40,
                    borderWidth: 2,
                    borderColor: '#fff',
                  }}
                  resizeMode="cover"
                />
                <Text
                  style={{
                    fontFamily: 'JetBrainsMono-Medium',
                    fontSize: 28,
                    color: '#fff',
                    fontWeight: 'bold',
                    letterSpacing: 1,
                  }}
                >
                  Create Account
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    marginTop: 4,
                    opacity: 0.85,
                  }}
                >
                  Join Forge and start designing!
                </Text>
              </Animated.View>

              <Animated.View style={[styles.card, animatedCardStyle]}>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                {/* Username */}
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="person-outline"
                    size={18}
                    color="#888"
                    style={{ marginRight: 10 }}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor="#aaa"
                  />
                </View>

                {/* Email */}
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color="#888"
                    style={{ marginRight: 10 }}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#aaa"
                  />
                </View>

                {/* Password */}
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color="#888"
                    style={{ marginRight: 10 }}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    placeholderTextColor="#aaa"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((prev) => !prev)}
                    style={{ padding: 8 }}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={18}
                      color="#888"
                    />
                  </TouchableOpacity>
                </View>

                {/* Confirm Password */}
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color="#888"
                    style={{ marginRight: 10 }}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    autoCapitalize="none"
                    placeholderTextColor="#aaa"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword((prev) => !prev)}
                    style={{ padding: 8 }}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? 'eye-outline' : 'eye-off-outline'
                      }
                      size={18}
                      color="#888"
                    />
                  </TouchableOpacity>
                </View>

                {/* Sign Up Button */}
                <TouchableOpacity
                  style={{ marginTop: 10, marginBottom: 10 }}
                  activeOpacity={0.85}
                  onPress={handleSignup}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={['#A07BB7', '#6C47A6']}
                    style={styles.signupButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <Text style={styles.buttonText}>Sign Up</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.dividerRow}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.divider} />
                </View>

                <TouchableOpacity style={styles.socialButton} disabled>
                  <Ionicons name="logo-google" size={20} color="#EA4335" />
                  <Text style={styles.socialButtonText}>
                    Continue with Google
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push('/(auth)/login')}
                >
                  <Text style={styles.switchText}>
                    Already have an account?{' '}
                    <Text style={styles.link}>Log in</Text>
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </KeyboardAwareScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#A07BB7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#faf7fd',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 8,
    fontSize: 16,
    color: '#333',
    fontFamily: 'JetBrainsMono-Medium',
  },
  signupButton: {
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#A07BB7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 15,
  },
  switchText: {
    textAlign: 'center',
    fontSize: 15,
    marginTop: 10,
  },
  link: {
    color: '#A07BB7',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#aaa',
    fontWeight: 'bold',
    fontSize: 13,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingVertical: 10,
    marginBottom: 10,
    opacity: 0.7,
  },
  socialButtonText: {
    marginLeft: 8,
    color: '#333',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

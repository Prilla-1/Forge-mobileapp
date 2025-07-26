import React, { useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, SafeAreaView,ActivityIndicator,
   KeyboardAvoidingView, Platform, Animated as RNAnimated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';
import COLORS from '../../constants/Colors';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing, withDelay } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../../context/UserContext';

const API_URL = 'http://10.188.233.165:8081/api/auth/login';


export default function LoginScreen() {
  const [fontsLoaded] = useFonts({
    'JetBrainsMono-Medium': require('../../assets/fonts/fonts/ttf/JetBrainsMono-Medium.ttf'),
  });
  const router = useRouter();
  const { setUser } = useUser(); // get setUser from context

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const scale = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(50);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    headerOpacity.value = withTiming(1, { duration: 800 });
    cardTranslateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.ease) });
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
  const isStrongPassword = (password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=-_])[A-Za-z\d@$!%*?&#^+=-_]{8,}$/.test(password);

  const handleLogin = async () => {
  setError('');
  if (!email || !password) {
    setError('Please enter both email and password.');
    return;
  }
  if (!validateEmail(email)) {
    setError('Please enter a valid email address.');
    return;
  }
  if (!isStrongPassword(password)) {
    setError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
    return;
  }

  setLoading(true);
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Login failed:", response.status, errorText);
      setError(`Login failed: ${response.status} - ${errorText}`);
      setLoading(false);
      return;
    }

    const data = await response.json();
    const token = data.token;
    const username = data.name; 

    // ✅ Save user info to context
    setUser({ username });

    // (Optional) Save token to AsyncStorage
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('username', username);

    router.replace('/(drawer)/(tabs)/mirror');
  } catch (err) {
    console.error('Login error:', err);
    setError('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};


  return (
    <LinearGradient colors={["#A07BB7", "#F6F2F7"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled" enableOnAndroid>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
              {/* Logo */}
              <Animated.View style={[{ alignItems: 'center', marginBottom: 24 }, animatedHeaderStyle]}>
                <Image source={require('../../assets/images/homepage (1).png')} style={{ width: 80, height: 80, marginBottom: 12, borderRadius: 40, borderWidth: 2, borderColor: '#fff' }} resizeMode="cover" />
                <Text style={{ fontFamily: 'JetBrainsMono-Medium', fontSize: 28, color: '#fff', fontWeight: 'bold', letterSpacing: 1 }}>Welcome Back</Text>
                <Text style={{ color: '#fff', fontSize: 16, marginTop: 4, opacity: 0.85 }}>Sign in to continue to Forge</Text>
              </Animated.View>
              {/* Card */}
              <Animated.View style={[styles.card, animatedCardStyle]}>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" color="#888" size={18} style={{ marginRight: 10 }} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#aaa"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" color="#888" size={18} style={{ marginRight: 10 }} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#aaa"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)} style={{ padding: 8 }}>
                    <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={18} color="#888" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.forgotPasswordLink} onPress={() => alert('Password recovery coming soon!')}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
                {/* Gradient Button */}
                <TouchableOpacity
                  style={{ marginTop: 10, marginBottom: 10 }}
                  activeOpacity={0.85}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <LinearGradient colors={["#A07BB7", "#6C47A6"]} style={styles.loginButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                   {loading ? (
  <ActivityIndicator size="small" color="#FFFFFF" />
) : (
  <Text style={styles.buttonText}>Log In</Text>
)}

                  </LinearGradient>
                </TouchableOpacity>
                {/* Divider */}
                <View style={styles.dividerRow}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.divider} />
                </View>
                {/* Social login placeholder */}
                <TouchableOpacity style={styles.socialButton} disabled>
                  <Ionicons name="logo-google" size={20} color="#EA4335" />
                  <Text style={styles.socialButtonText}>Continue with Google</Text>
                </TouchableOpacity>
                {/* Switch to signup */}
                <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                  <Text style={styles.switchText}>
                    Don't have an account? <Text style={styles.link}>Sign Up</Text>
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
  loginButton: {
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
  forgotPasswordLink: {
    marginBottom: 8,
    alignItems: 'flex-end',
  },
  forgotPasswordText: {
    color: '#A07BB7',
    textDecorationLine: 'underline',
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

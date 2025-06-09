import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomePage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Top Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/homepage.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.subtitle}>
        Mirror prototypes, browse files, and collaborate on the go
      </Text>

      <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login')}>
        <Text style={styles.loginText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signupButton} onPress={() => router.push('/signup')}>
        <Text style={styles.signupText}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: -40,
  },
  image: {
    width: 220,
    height: 120,
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: '#1e1e2f',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',  // Make sure buttons are full width
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  signupButton: {
    backgroundColor: '#ccc',
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',  // Make sure buttons are full width
  },
  signupText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
});

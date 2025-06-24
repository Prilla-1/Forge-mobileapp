// app/login.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const validateEmail = (email: string) => {
    // Simple email regex
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleLogin = () => {
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Simulate successful login
      router.replace('/(tabs)/recents');
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Log in to Figma</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
          style={styles.showHideButton}
          accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
        >
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={22}
            color="#888"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.loginButton, loading && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Log In'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => alert('Password recovery coming soon!')} style={styles.forgotPasswordLink}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text style={styles.switchText}>
          No account? <Text style={styles.link}>Create one</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#1c1c3c',
    padding: 14,
    borderRadius: 6,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 15,
  },
  switchText: {
    textAlign: 'center',
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    marginBottom: 16,
    paddingRight: 8,
  },
  showHideButton: {
    padding: 8,
  },
  showHideText: {
    color: '#007bff',
    fontSize: 15,
  },
  forgotPasswordLink: {
    marginBottom: 16,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#007bff',
    textDecorationLine: 'underline',
    fontSize: 15,
  },
});

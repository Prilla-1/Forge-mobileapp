// app/signup.tsx
import React ,{useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/Colors'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';




export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

 const handleSignup = async () => {
  setError('');
  if (!name || !email || !password || !confirmPassword) {
    setError('Please fill out all fields.');
    return;
  }

  if (!validateEmail(email)) {
    setError('Please enter a valid email address.');
    return;
  }

  // Strong password: at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 symbol
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!strongPasswordRegex.test(password)) {
    setError('Password must be 8+ characters and include uppercase, lowercase, number, and symbol.');
    return;
  }

  if (password !== confirmPassword) {
    setError('Passwords do not match.');
    return;
  }

  setLoading(true);

  try {
    const response = await fetch('http://10.230.179.165:8081/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      // Optionally store token or user info here
      router.replace('/(drawer)/(tabs)/mirror'); // success route
    } else {
      const errorData = await response.json();
      setError(errorData.message || 'Signup failed. Try again.');
    }
  } catch (err) {
    setError('Network error. Please check your connection.');
  } finally {
    setLoading(false);
  }
};

  return (
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 ,backgroundColor:"#F6F2F7" }}
  enableOnAndroid={true}>
     <KeyboardAvoidingView style={{flex:1}}>

    <View style={styles.container}>
      <View >
      {/*HEADER*/}
      <View style={styles.header}>
      <Text style={styles.title}>On The Go</Text>
      <Text style={styles.subtitle}>Preview designs,explore and access files, and collaborate</Text>  
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={name}
        onChangeText={setName}
      />
      <Ionicons
      name="person-outline"
      size={15}
      color="#888"
      style={{padding:5}}
      />
      </View>
      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Ionicons
      name="mail-outline"
      size={15}
      color="#888"
      style={{padding:5}}
      />
      </View>
      
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
          style={{padding:5}}
          accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          activeOpacity={0.7}
        >
          <Ionicons
            name={showPassword ? 'eye-outline' : 'eye-off'}
            size={15}
            color="#888"
            style={{padding:5}}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword((prev) => !prev)}
          style={{padding:5}}
          accessibilityLabel={showConfirmPassword ? 'Hide password' : 'Show password'}
          activeOpacity={0.7}
        >
          <Ionicons
            name={showConfirmPassword ? 'eye-outline' : 'eye-off'}
            size={15}
            color="#888"
            style={{padding:5}}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.signupButton, loading && { opacity: 0.7 }]}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Signing up...' : 'Sign Up'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
        <Text style={styles.switchText}>
          Already have an account? <Text style={styles.link}>Log in</Text>
        </Text>
      </TouchableOpacity>
      </View>
    </View>
    </KeyboardAvoidingView>
    </KeyboardAwareScrollView>
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
  title: {
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "JetBrainsMono-Medium",
    color: COLORS.primary,
    marginTop:8,
    textAlign:'center'
  },
  subtitle:{
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",

},
inputContainer:{
     flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 24,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: COLORS.border,
  },

  input: {
     flex: 1,
    paddingVertical: 12,
    paddingRight: 8,
    fontSize: 16,
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 8,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 6,
  },
  signupButton: {
    backgroundColor:'#A07BB7',
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 13,
    marginBottom:15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize:16,
    fontWeight:"600",
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
});

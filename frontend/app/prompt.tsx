import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';

const PromptScreen = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) {
      Alert.alert('Missing Prompt', 'Please enter a prompt to generate an image.');
      return;
    }

    setLoading(true);
    setImageUri('');

    try {
      const response = await fetch('http://10.21.192.165:8081/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();

      if (data.image) {
        setImageUri(`data:image/png;base64,${data.image}`);
      } else {
        Alert.alert('No Image', 'Server did not return an image.');
      }
    } catch (error) {
      console.error('Image generation error:', error);
      Alert.alert(
        'Generation Failed',
        'Could not generate image. Make sure your backend and diffusion server are running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>AI Image Generator</Text>

          <TextInput
            placeholder="Describe your image..."
            value={prompt}
            onChangeText={setPrompt}
            style={styles.input}
            multiline
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={generateImage}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Generating...' : 'Generate Image'}
            </Text>
          </TouchableOpacity>

          {loading && <ActivityIndicator size="large" color="#7e22ce" style={{ marginTop: 20 }} />}

          {imageUri !== '' && (
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="contain"
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PromptScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    backgroundColor: '#f9fafb',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#7e22ce',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 999,
  },
  buttonDisabled: {
    backgroundColor: '#a78bfa',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 300,
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
});

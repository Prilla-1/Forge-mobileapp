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
  StatusBar,
} from 'react-native';
import { useCanvas } from '../context/CanvasContext';
import { useRouter } from 'expo-router';
import { generateUUID } from '../utils/generateUUID';

const stylesList = ['None', 'Van Gogh', 'Cyberpunk', 'Anime', 'Watercolor'];

const PromptScreen = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('None');
  const [imageUri, setImageUri] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const { addShape } = useCanvas();
  const router = useRouter();

  const generateImage = async () => {
    if (!prompt.trim()) {
      Alert.alert('Missing Prompt', 'Please enter a prompt to generate an image.');
      return;
    }

    setLoading(true);
    setImageUri('');
    setStatus('Checking Stable Diffusion...');

    try {
      const healthResponse = await fetch('http://10.212.110.165:8081/api/health/stable-diffusion');
      const healthData = await healthResponse.json();

      if (healthData.status !== 'running') {
        Alert.alert(
          'Stable Diffusion Not Running',
          'Please start Stable Diffusion WebUI with API enabled before generating images.'
        );
        setLoading(false);
        setStatus('');
        return;
      }

      setStatus('Generating image...');

      const response = await fetch('http://10.212.110.165:8081/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();

      if (data.image) {
        const base64ImageUri = `data:image/png;base64,${data.image}`;
        setImageUri(base64ImageUri);
        setStatus('Image generated and added to canvas!');

        const newImageShape = {
          id: generateUUID(),
          type: 'image' as const,
          uri: base64ImageUri,
          position: { x: 100, y: 100 },
          style: {
            width: 200,
            height: 200,
            color: 'transparent',
          },
        };

        addShape(newImageShape);

        setTimeout(() => {
          Alert.alert(
            'Image Added to Canvas!',
            'Your AI-generated image has been added to the canvas.',
            [
              {
                text: 'Go to Canvas',
                onPress: () => router.push('/(drawer)/(tabs)/CanvasScreen'),
              },
              { text: 'Stay Here' },
            ]
          );
        }, 1000);
      } else {
        Alert.alert('No Image', 'Server did not return an image.');
        setStatus('');
      }
    } catch (error) {
      console.error('Image generation error:', error);
      let errorMessage =
        'Could not generate image. Make sure your backend and diffusion server are running.';

      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          errorMessage =
            'Cannot connect to backend server. Please check if the backend is running.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Backend server error. Please check if Stable Diffusion is running.';
        }
      }

      Alert.alert('Generation Failed', errorMessage);
      setStatus('');
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
          <View style={styles.headerContainer}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              AI Image Generator
            </Text>
            <TouchableOpacity
              style={styles.canvasButton}
              onPress={() => router.push('/(drawer)/(tabs)/CanvasScreen')}
            >
              <Text style={styles.canvasButtonText}>Canvas</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Describe your image..."
            value={prompt}
            onChangeText={setPrompt}
            style={styles.input}
            multiline
            editable={!loading}
          />

          <View style={styles.styleWrap}>
            {stylesList.map((sname) => (
              <TouchableOpacity
                key={sname}
                onPress={() => setStyle(sname)}
                style={[
                  styles.styleButton,
                  style === sname && styles.selectedStyleButton,
                ]}
              >
                <Text style={style === sname ? styles.selectedStyleText : styles.styleText}>
                  {sname}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

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

          {status && <Text style={styles.statusText}>{status}</Text>}

          {imageUri !== '' && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  Alert.alert(
                    'Image Added to Canvas!',
                    'Your AI-generated image has been added to the canvas. Navigate to the canvas to see it.',
                    [
                      {
                        text: 'Go to Canvas',
                        onPress: () => router.push('/(drawer)/(tabs)/CanvasScreen'),
                      },
                      { text: 'Stay Here' },
                    ]
                  );
                }}
              >
                <Text style={styles.saveButtonText}>Go to Canvas</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PromptScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: {
    padding: 20,
    paddingTop: 20 + (StatusBar.currentHeight || 0),
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#7e22ce',
    textAlign: 'center',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(126,34,206,0.12)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    borderBottomWidth: 3,
    borderBottomColor: '#a78bfa',
    alignSelf: 'center',
    paddingBottom: 6,
    width: '80%',
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
  statusText: {
    marginTop: 10,
    fontSize: 14,
    color: '#7e22ce',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#10b981',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  canvasButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  canvasButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  styleWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    justifyContent: 'center',
    gap: 10,
  },
  styleButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    margin: 4,
  },
  selectedStyleButton: {
    backgroundColor: '#e9d5ff',
    borderColor: '#a855f7',
  },
  styleText: {
    color: '#555',
  },
  selectedStyleText: {
    color: '#7e22ce',
    fontWeight: '600',
  },
});

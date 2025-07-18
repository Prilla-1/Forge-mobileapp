import { View, Text, StyleSheet, TouchableOpacity, Switch, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function HelpScreen() {
  const [shakeEnabled, setShakeEnabled] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help</Text>
        <View style={{ width: 28 }} />
      </View>
      <View style={styles.body}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => Linking.openURL('https://help.figma.com/')}
        >
          <Text style={[styles.label, styles.helpLink]}>Figma Help Center</Text>
        </TouchableOpacity>
        <View style={styles.row}>
          <Text style={styles.label}>Toggle shake to report</Text>
          <Switch
            value={shakeEnabled}
            onValueChange={setShakeEnabled}
            trackColor={{ false: '#ccc', true: '#0091FF' }}
            thumbColor={shakeEnabled ? '#fff' : '#fff'}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  body: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#222',
  },
  helpLink: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
}); 
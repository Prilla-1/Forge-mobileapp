import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Linking, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function HelpScreen() {
  const [shakeEnabled, setShakeEnabled] = useState(false);
  const router = useRouter();
  return (
    <LinearGradient colors={["#A07BB7", "#F6F2F7"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.body}>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => Linking.openURL('https://help.figma.com/')}
            >
              <Text style={[styles.label, styles.helpLink]}>Figma Help Center</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
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
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 72 : 48,
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  body: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    shadowColor: '#A07BB7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
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
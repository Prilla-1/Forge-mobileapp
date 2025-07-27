import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function AboutScreen() {
  const router = useRouter();
  return (
    <LinearGradient colors={["#A07BB7", "#F6F2F7"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About</Text>
          <View style={{ width: 28 }} />
        </View>
        {/* Version and Build cards at the very top */}
        <View style={styles.topCardsContainer}>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Version</Text>
              <Text style={styles.value}>25.19.0</Text>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Build</Text>
              <Text style={styles.value}>895</Text>
            </View>
          </View>
        </View>
        <View style={styles.body}>
          {/* The version and build cards are now moved here */}
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
    justifyContent: 'center',
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
  value: {
    fontSize: 16,
    color: '#888',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6C47A6',
    marginBottom: 18,
    textAlign: 'left',
    marginLeft: 4,
  },
  topCardsContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
  },
}); 
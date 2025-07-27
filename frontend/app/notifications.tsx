import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function NotificationsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [selected, setSelected] = useState('all');
  const router = useRouter();
  return (
    <LinearGradient colors={["#A07BB7", "#F6F2F7"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.body}>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>System notification settings</Text>
              <TouchableOpacity>
                <Ionicons name="open-outline" size={22} color="#222" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Push Notifications</Text>
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ false: '#ccc', true: '#0091FF' }}
                thumbColor={pushEnabled ? '#fff' : '#fff'}
              />
            </View>
          </View>
          <View style={styles.card}>
            <Text style={[styles.label, { marginBottom: 8 }]}>File comments</Text>
            <TouchableOpacity style={styles.selectRow} onPress={() => setSelected('all')}>
              <Text style={styles.selectText}>All comments, mentions, and replies</Text>
              {selected === 'all' && <Ionicons name="checkmark" size={20} color="#222" />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.selectRow} onPress={() => setSelected('mentions')}>
              <Text style={styles.selectText}>Only mentions and replies</Text>
              {selected === 'mentions' && <Ionicons name="checkmark" size={20} color="#222" />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.selectRow} onPress={() => setSelected('none')}>
              <Text style={styles.selectText}>None</Text>
              {selected === 'none' && <Ionicons name="checkmark" size={20} color="#222" />}
            </TouchableOpacity>
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
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  selectText: {
    fontSize: 16,
    color: '#222',
    flex: 1,
  },
}); 
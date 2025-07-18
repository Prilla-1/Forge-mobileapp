import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function NotificationsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [selected, setSelected] = useState('all');
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 28 }} />
      </View>
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.label}>System notification settings</Text>
          <TouchableOpacity>
            <Ionicons name="open-outline" size={22} color="#222" />
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Push Notifications</Text>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ false: '#ccc', true: '#0091FF' }}
            thumbColor={pushEnabled ? '#fff' : '#fff'}
          />
        </View>
        <Text style={[styles.label, { marginTop: 24 }]}>File comments</Text>
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
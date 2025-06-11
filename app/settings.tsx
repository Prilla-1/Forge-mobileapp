import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Blank Profile Section */}
        <View style={styles.profileSection}>
          <Text style={styles.profileLabel}>Name</Text>
        </View>

        {/* Teams and organizations */}
        <Text style={styles.sectionLabel}>Teams and organizations</Text>
        <Text style={styles.subLabel}>Member of</Text>
        <View style={styles.teamRow}>
          <View style={styles.teamAvatar}>
            <Text style={styles.teamInitial}>G</Text>
          </View>
          <Text style={styles.teamName}>Name's team</Text>
          <Ionicons name="checkmark" size={20} color="#222" style={{ marginLeft: 'auto' }} />
        </View>

        {/* General */}
        <Text style={styles.sectionLabel}>General</Text>
        <TouchableOpacity style={styles.optionRow} onPress={() => router.push('/notifications')}>
          <Text style={styles.optionText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionRow} onPress={() => router.push('/about')}>
          <Text style={styles.optionText}>About</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionRow} onPress={() => router.push('/help')}>
          <Text style={styles.optionText}>Help</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionRow}>
          <Text style={[styles.optionText, { color: '#D32F2F' }]}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
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
  profileSection: {
    height: 72,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 12,
    justifyContent: 'center',
    paddingLeft: 24,
  },
  profileLabel: {
    fontSize: 16,
    color: '#888',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginTop: 18,
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  subLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
    paddingHorizontal: 16,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
  },
  teamAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00C853',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  teamInitial: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  teamName: {
    fontSize: 15,
    color: '#222',
    flex: 1,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#222',
    flex: 1,
  },
  placeholder: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 32,
  },
}); 
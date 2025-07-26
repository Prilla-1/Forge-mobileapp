import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';

const DEFAULT_AVATAR = require('../assets/images/icon.png');
const PROFILE_API_URL = 'http://your-api.com/api/users/me';

export default function SettingsScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [dirty, setDirty] = useState(false);
  const nameInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(PROFILE_API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch profile');

        const data = await response.json();
        setName(data.name || 'Unnamed User');
        setAvatar(data.avatarUrl || null);
        setEmail(data.email || '');
      } catch (error) {
        Alert.alert('Error', 'Unable to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => router.replace('/login'),
      },
    ]);
  };

  const pickImage = async () => {
    Alert.alert('Change Avatar', 'Image picker not implemented.');
  };

  const handleSave = async () => {
    try {
      setEditingName(false);
      setDirty(false);

      const response = await fetch(PROFILE_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error('Failed to update name');
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#a07bb7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <Image source={DEFAULT_AVATAR} style={styles.avatar} />
            )}
            <View style={styles.editAvatarIcon}>
              <Ionicons name="camera" size={18} color="#fff" />
            </View>
          </TouchableOpacity>

          <View style={styles.nameRow}>
            {editingName ? (
              <TextInput
                ref={nameInputRef}
                style={styles.nameInput}
                value={name}
                onChangeText={text => {
                  setName(text);
                  setDirty(true);
                }}
                onBlur={() => setEditingName(false)}
                autoFocus
                maxLength={32}
              />
            ) : (
              <TouchableOpacity onPress={() => setEditingName(true)}>
                <Text style={styles.nameText}>{name}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setEditingName(true)}>
              <Ionicons name="pencil" size={16} color="#888" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>

          <Text style={styles.emailText}>{email}</Text>

          {dirty && (
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.sectionLabel}>Teams and organizations</Text>
        <Text style={styles.subLabel}>Member of</Text>

        <View style={styles.teamRow}>
          <View style={styles.teamAvatar}>
            <Text style={styles.teamInitial}>
              {(name?.[0] || 'U').toUpperCase()}
            </Text>
          </View>

          <Text style={styles.teamName}>
            {name ? `${name}'s team` : 'Your team'}
          </Text>

          <Ionicons name="checkmark" size={20} color="#222" style={{ marginLeft: 'auto' }} />
        </View>

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
        <TouchableOpacity style={styles.optionRow} onPress={handleLogout}>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 12,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#eee',
  },
  editAvatarIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#a07bb7',
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 18,
    color: '#222',
    fontWeight: '600',
  },
  nameInput: {
    fontSize: 18,
    color: '#222',
    fontWeight: '600',
    borderBottomWidth: 1,
    borderBottomColor: '#a07bb7',
    minWidth: 120,
    paddingVertical: 2,
  },
  emailText: {
    fontSize: 14,
    color: '#888',
  },
  saveBtn: {
    backgroundColor: '#a07bb7',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 24,
    marginTop: 6,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
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
});

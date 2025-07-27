import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Alert, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { useFonts } from 'expo-font';

const DEFAULT_AVATAR = require('../assets/images/icon.png');
const APP_VERSION = 'v1.0.0';

export default function SettingsScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'JetBrainsMono-Medium': require('../assets/fonts/fonts/ttf/JetBrainsMono-Medium.ttf'),
  });
  const handleLogout = () => {
    Alert.alert(
      "Log out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log out",
          style: "destructive",
          onPress: () => router.replace('/login'),
        },
      ]
    );
  };
  // Profile state
  const [name, setName] = useState('Your Name');
  const [avatar, setAvatar] = useState(null); // uri or null
  const [editingName, setEditingName] = useState(false);
  const [dirty, setDirty] = useState(false);
  const nameInputRef = useRef(null);
  const [email] = useState('user@email.com');
  const [theme, setTheme] = useState('light');

  // Animations
  const cardScale = useSharedValue(0.9);
  const cardOpacity = useSharedValue(0);
  useEffect(() => {
    cardScale.value = withSpring(1);
    cardOpacity.value = withTiming(1, { duration: 600 });
  }, []);
  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  // Mock image picker
  const pickImage = async () => {
    Alert.alert('Change Avatar', 'Image picker not implemented in this mock.');
  };

  const handleSave = () => {
    setEditingName(false);
    setDirty(false);
    Alert.alert('Profile updated', 'Your changes have been saved.');
  };

  return (
    <LinearGradient colors={["#A07BB7", "#F6F2F7"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontFamily: 'JetBrainsMono-Medium', color: '#fff' }]}>Settings</Text>
          <View style={{ width: 28 }} />
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
          {/* Profile Card */}
          <Animated.View style={[styles.profileCard, animatedCardStyle]}>
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
                  onChangeText={text => { setName(text); setDirty(true); }}
                  onBlur={() => setEditingName(false)}
                  autoFocus
                  maxLength={32}
                  placeholderTextColor="#222"
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
            {dirty && (
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          {/* Theme Toggle (mock) */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionRow}>
              <Ionicons name="color-palette-outline" size={22} color="#A07BB7" style={{ marginRight: 12 }} />
              <Text style={styles.sectionLabel}>Theme</Text>
              <TouchableOpacity style={styles.themeToggle} onPress={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
                <Ionicons name={theme === 'light' ? 'sunny' : 'moon'} size={20} color={theme === 'light' ? '#FFD600' : '#6C47A6'} />
                <Text style={{ marginLeft: 6, color: '#6C47A6', fontWeight: 'bold' }}>{theme === 'light' ? 'Light' : 'Dark'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Email Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>Email</Text>
            <View style={styles.emailRow}>
              <Ionicons name="mail-outline" size={20} color="#A07BB7" style={{ marginRight: 12 }} />
              <Text style={styles.emailText}>{email}</Text>
            </View>
          </View>

          {/* General */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>General</Text>
            <TouchableOpacity style={styles.optionRow} onPress={() => router.push('/notifications')}>
              <Ionicons name="notifications-outline" size={20} color="#A07BB7" style={{ marginRight: 12 }} />
              <Text style={styles.optionText}>Notifications</Text>
              <Ionicons name="chevron-forward" size={20} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionRow} onPress={() => router.push('/about')}>
              <Ionicons name="information-circle-outline" size={20} color="#A07BB7" style={{ marginRight: 12 }} />
              <Text style={styles.optionText}>About</Text>
              <Ionicons name="chevron-forward" size={20} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionRow} onPress={() => router.push('/help')}>
              <Ionicons name="help-circle-outline" size={20} color="#A07BB7" style={{ marginRight: 12 }} />
              <Text style={styles.optionText}>Help</Text>
              <Ionicons name="chevron-forward" size={20} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionRow} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#D32F2F" style={{ marginRight: 12 }} />
              <Text style={[styles.optionText, { color: '#D32F2F' }]}>Log out</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>FORGE App {APP_VERSION}</Text>
            <Text style={styles.footerText}>© {new Date().getFullYear()} Forge Team</Text>
          </View>
        </ScrollView>
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
    fontSize: 26,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#fff',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    alignItems: 'center',
    paddingVertical: 28,
    marginHorizontal: 8,
    marginTop: 12,
    marginBottom: 18,
    shadowColor: '#A07BB7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#eee',
    borderWidth: 2,
    borderColor: '#A07BB7',
  },
  editAvatarIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#a07bb7',
    borderRadius: 14,
    padding: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameText: {
    fontSize: 20,
    color: '#222',
    fontWeight: '700',
    fontFamily: 'JetBrainsMono-Medium',
  },
  nameInput: {
    fontSize: 20,
    color: '#222',
    fontWeight: '700',
    borderBottomWidth: 1,
    borderBottomColor: '#a07bb7',
    minWidth: 120,
    paddingVertical: 2,
    fontFamily: 'JetBrainsMono-Medium',
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
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 8,
    marginBottom: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    shadowColor: '#A07BB7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6C47A6',
    marginBottom: 6,
    fontFamily: 'JetBrainsMono-Medium',
  },
  subLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
    marginLeft: 2,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 10,
    backgroundColor: '#f6f2f7',
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 4,
  },
  optionText: {
    fontSize: 16,
    color: '#222',
    flex: 1,
    fontFamily: 'JetBrainsMono-Medium',
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f2f7',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 'auto',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  footerText: {
    color: '#888',
    fontSize: 13,
    fontFamily: 'JetBrainsMono-Medium',
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f2f7',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 2,
  },
  emailText: {
    fontSize: 15,
    color: '#222',
    fontFamily: 'JetBrainsMono-Medium',
  },
}); 
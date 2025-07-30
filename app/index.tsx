import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function IndexRedirect() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      const timeout = setTimeout(() => {
        if (isAuthenticated) {
          router.replace('/(drawer)/(tabs)/mirror');
        } else {
          router.replace('/onboarding');
        }
      }, 100); // Wait for layout to mount

      return () => clearTimeout(timeout);
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#A07BB7" />
      </View>
    );
  }

  return null;
}

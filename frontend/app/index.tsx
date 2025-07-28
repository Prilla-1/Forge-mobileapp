import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function IndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/onboarding');
    }, 50); // Wait 50ms for layout to mount

    return () => clearTimeout(timeout);
  }, []);

  return null;
}

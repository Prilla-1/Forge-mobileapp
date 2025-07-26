import React, { createContext, useContext,useEffect, useState, ReactNode } from 'react';
 import AsyncStorage from '@react-native-async-storage/async-storage'

type User = {
  username: string;
  // You can add more fields like email, id, etc.
};

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

// Create context with correct default value
const UserContext = createContext<UserContextType | undefined>(undefined);


export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
 // Load saved user on app start
  useEffect(() => {
    const loadUser = async () => {
      const savedUsername = await AsyncStorage.getItem('username');
      if (savedUsername) {
        setUser({ username: savedUsername });
      }
    };
    loadUser();
  }, []);
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to use the context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

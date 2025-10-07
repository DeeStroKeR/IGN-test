import { createContext, useState, ReactNode, useContext } from 'react';
import { ProfileForm } from '../pages/profileTypes';

// Types for user context
interface User extends ProfileForm {
}

export interface UserContextType {
  user: User | null;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setUser = (newUser: User) => {
    setUserState(newUser);
  };

  const updateUser = (updates: Partial<User>) => {
    setUserState(prev => prev ? { ...prev, ...updates } : null);
  };

  const clearUser = () => {
    setUserState(null);
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const value: UserContextType = {
    user,
    isLoading,
    setUser,
    updateUser,
    clearUser,
    setLoading
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../services/api';
import apiService from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phoneNumber: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  sendOtp: (phoneNumber: string) => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 Checking authentication status...');
      const currentUser = await apiService.getCurrentUser();
      console.log('✅ User authenticated:', currentUser);
      setUser(currentUser);
    } catch (error) {
      console.log('ℹ️  User not authenticated or token expired');
      console.log('🔍 Error details:', error);
      // Don't throw error here - this is expected for unauthenticated users
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async (phoneNumber: string) => {
    try {
      await apiService.sendOtp(phoneNumber);
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  };

  const login = async (phoneNumber: string, otp: string) => {
    try {
      await apiService.verifyOtp(phoneNumber, otp);
      await checkAuthStatus();
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    sendOtp,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 
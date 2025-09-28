import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType, SignUpRequest, AuthResponse, ApiResponse } from '../types';
import { AuthContext } from './AuthContextCore';
import { apiService } from '../services/api';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const response = (await apiService.getMe()) as ApiResponse<User>;
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Failed to get user:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const response = (await apiService.signin({ email, password })) as AuthResponse;
      if (response.success && response.user && response.token) {
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem('token', response.token);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignUpRequest): Promise<void> => {
    setLoading(true);
    try {
      const response = (await apiService.signup(data)) as AuthResponse;
      if (response.success && response.user && response.token) {
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem('token', response.token);
      } else {
        throw new Error(response.message || 'Signup failed');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
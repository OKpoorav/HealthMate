import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_URL, getHeaders } from '../config/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'PATIENT' | 'DOCTOR';
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  specialization?: string;
  licenseNumber?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,

      login: async (email: string, password: string) => {
        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: getHeaders(),
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Invalid credentials');
          }

          const data = await response.json();
          set({ 
            isAuthenticated: true, 
            user: data.user, 
            token: data.access_token 
          });
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },

      register: async (userData) => {
        try {
          console.log('Registering with data:', userData);
          const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            credentials: 'include',
            headers: getHeaders(),
            body: JSON.stringify({
              ...userData,
              role: userData.role?.toUpperCase(),
            }),
          });

          if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Registration failed' }));
            throw new Error(error.message || 'Registration failed');
          }

          const data = await response.json();
          console.log('Registration response:', data);
          set({ 
            isAuthenticated: true, 
            user: data.user, 
            token: data.access_token 
          });
        } catch (error) {
          console.error('Registration error:', error);
          throw error;
        }
      },

      logout: () => {
        set({ isAuthenticated: false, user: null, token: null });
      },

      updateUser: (updatedUser: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);
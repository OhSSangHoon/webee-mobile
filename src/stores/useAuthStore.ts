import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/lib/api';
import type { User, LoginRequest, RegisterRequest, ApiResponse, SignInResponseData } from '@/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await api.post<ApiResponse<SignInResponseData>>(
            '/api/v1/auth/sign-in',
            credentials
          );

          const { data } = response;

          if (data.code === '200') {
            // 로그인 성공 시 사용자 정보 설정
            const user: User = {
              id: '',
              username: credentials.username,
              email: '',
              fullName: data.data.name,
            };
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            throw new Error(data.message);
          }
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (registerData) => {
        set({ isLoading: true });
        try {
          const response = await api.post<ApiResponse<null>>(
            '/api/v1/auth/sign-up',
            registerData
          );

          const { data } = response;

          if (data.code === '200' || data.code === '201') {
            // 회원가입 성공 후 자동 로그인
            const user: User = {
              id: '',
              username: registerData.username,
              email: '',
              fullName: registerData.name,
            };
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            throw new Error(data.message);
          }
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await api.post('/api/v1/auth/sign-out');
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/lib/api';
import { registerTokenCallbacks } from '@/lib/tokenManager';
import { queryClient } from '@/providers';
import type { User, LoginRequest, RegisterRequest, ApiResponse, SignInResponseData } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setTokens: (accessToken: string, refreshToken: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          console.log('=== 로그인 요청 ===');
          console.log('Body:', JSON.stringify(credentials));

          const response = await api.post<ApiResponse<SignInResponseData>>(
            '/api/v1/auth/sign-in',
            credentials
          );

          console.log('=== 로그인 응답 ===');
          console.log('Status:', response.status);
          console.log('Headers:', JSON.stringify(response.headers, null, 2));
          console.log('Data:', JSON.stringify(response.data, null, 2));

          const { data } = response;

          if (data.code === '200' || data.code === 'OK') {
            // Access Token 추출
            // 1. 먼저 response body에서 확인
            let accessTokenFromBody = data.data?.accessToken || null;

            // 2. Authorization 헤더에서 확인 (대소문자 모두 체크)
            const authHeader =
              response.headers['authorization'] ||
              response.headers['Authorization'] ||
              response.headers['AUTHORIZATION'];
            const headerToken = authHeader?.replace(/^Bearer\s+/i, '') || accessTokenFromBody;

            // Refresh Token 추출
            // 1. 먼저 response body에서 확인 (서버가 body에 포함하는 경우)
            let refreshToken: string | null = data.data?.refreshToken || null;

            // 2. Set-Cookie 헤더에서 확인 (fallback)
            if (!refreshToken) {
              const setCookieHeader = response.headers['set-cookie'];
              console.log('Set-Cookie 헤더:', setCookieHeader);
              if (setCookieHeader) {
                const cookieString = Array.isArray(setCookieHeader) ? setCookieHeader.join('; ') : setCookieHeader;
                const match = cookieString.match(/refreshToken=([^;]+)/);
                if (match) {
                  refreshToken = match[1];
                }
              }
            }

            // 3. 다른 커스텀 헤더에서 확인
            if (!refreshToken) {
              refreshToken = response.headers['x-refresh-token'] || response.headers['refresh-token'] || null;
            }

            console.log('=== 토큰 추출 ===');
            console.log('Authorization 헤더:', authHeader);
            console.log('Access Token:', headerToken ? `있음 (${headerToken.substring(0, 30)}...)` : '없음');
            console.log('Refresh Token:', refreshToken ? `있음 (${refreshToken.substring(0, 30)}...)` : '없음');

            const accessToken = headerToken || null;

            // 로그인 성공 시 사용자 정보 및 토큰 설정
            const user: User = {
              id: '',
              username: credentials.username,
              email: '',
              fullName: data.data.name,
            };

            // API 인스턴스에 토큰 설정
            if (accessToken) {
              api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            }

            set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });
          } else {
            throw new Error(data.message);
          }
        } catch (error: any) {
          console.log('=== 로그인 에러 ===');
          console.log('Error message:', error.message);
          console.log('Status:', error.response?.status);
          console.log('Response:', JSON.stringify(error.response?.data, null, 2));
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

          if (data.code === '200' || data.code === '201' || data.code === 'OK' || data.code === 'CREATED') {
            // 회원가입 성공 - 자동 로그인은 하지 않고 로그인 페이지로 이동하도록
            set({ isLoading: false });
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
          // 토큰 제거
          delete api.defaults.headers.common['Authorization'];
          // React Query 캐시 초기화 (다른 계정 데이터 제거)
          queryClient.clear();
          set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
        }
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      getAccessToken: () => {
        return get().accessToken;
      },

      getRefreshToken: () => {
        return get().refreshToken;
      },

      setTokens: (accessToken, refreshToken) => {
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        set({ accessToken, refreshToken: refreshToken ?? get().refreshToken });
      },

      clearAuth: () => {
        delete api.defaults.headers.common['Authorization'];
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // 앱 시작 시 저장된 토큰을 API 헤더에 설정
        if (state?.accessToken) {
          api.defaults.headers.common['Authorization'] = `Bearer ${state.accessToken}`;
          console.log('=== 토큰 복원됨 ===');
        }
      },
    }
  )
);

// API 인터셉터에서 토큰 변경 시 스토어 동기화
registerTokenCallbacks(
  // 토큰 업데이트 콜백
  (accessToken, refreshToken) => {
    useAuthStore.setState({
      accessToken,
      refreshToken: refreshToken ?? useAuthStore.getState().refreshToken,
    });
    console.log('[AuthStore] 토큰 동기화됨');
  },
  // 인증 초기화 콜백
  () => {
    queryClient.clear();
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
    console.log('[AuthStore] 인증 초기화됨');
  },
  // refreshToken 조회 콜백 (Zustand 메모리에서 직접 읽기)
  () => useAuthStore.getState().refreshToken
);

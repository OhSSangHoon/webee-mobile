import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'https://api.webee.sbs';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - 요청 로깅
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    if (config.headers['Authorization']) {
      console.log('[API Request] Authorization header present');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - 에러 처리
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 재시도하지 않은 경우 토큰 갱신 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('[API] 토큰 갱신 시도...');
        const refreshResponse = await api.post('/api/v1/auth/reissue');

        // 새 토큰 추출 - Authorization 헤더에서
        const authHeader =
          refreshResponse.headers['authorization'] ||
          refreshResponse.headers['Authorization'] ||
          refreshResponse.headers['AUTHORIZATION'];
        const newToken = authHeader?.replace(/^Bearer\s+/i, '');

        if (newToken) {
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          console.log('[API] 토큰 갱신 성공');
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.log('[API] 토큰 갱신 실패 - 재로그인 필요');
        // 토큰 갱신 실패 시 로그아웃 처리는 앱에서 처리
      }
    }

    console.log(`[API Error] ${error.response?.status} ${error.config?.url}`);
    return Promise.reject(error);
  }
);

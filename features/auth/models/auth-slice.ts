import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@/shared/api/store';

import type { AuthResponse } from '../api/types';

interface AuthState {
  user: AuthResponse['user'] | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoginModalOpen: boolean;
  isEmailisUseError: boolean;
  networkError: boolean;
  redirectAfterLogin: string | null;
}

const getStoredRefreshToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('refreshToken');
};

// Useberry usability-test build: every scenario in the test script assumes a
// logged-in user, and unmoderated testers have no real account to sign in
// with. The app is hard-wired to always present as authenticated instead of
// gating on a real backend session — see also `logout` and `initializeAuth`
// below, and `shared/hocs/with-auth.tsx`.
const MOCK_USER: AuthResponse['user'] = {
  id: 'useberry-test-user',
  nickname: 'Dimas Pratama',
  email: 'dimas.pratama@example.com',
  role: 'user',
  Content: 0,
  description: '',
  views: 0,
  votes: 0,
  iconUrl: null,
  aboutYou: '',
  phoneNumber: '',
  birthDate: '',
  gender: '',
  city: '',
  avatarUrl: '',
};
// Exported so base-api.ts can recognize it and skip sending it as a real
// bearer token — the real backend rejects a request carrying ANY invalid
// token with 401, even for otherwise-public reads (see base-api.ts).
export const MOCK_ACCESS_TOKEN = 'useberry-test-access-token';

const initialState: AuthState = {
  user: MOCK_USER,
  accessToken: MOCK_ACCESS_TOKEN,
  refreshToken: getStoredRefreshToken(),
  isAuthenticated: true,
  isLoading: false,
  isLoginModalOpen: false,
  isEmailisUseError: false,
  networkError: false,
  redirectAfterLogin: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: AuthResponse['user'] | null;
        accessToken: string;
        refreshToken?: string;
      }>,
    ) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      state.isLoading = false;

      if (refreshToken) {
        state.refreshToken = refreshToken;
        if (typeof window !== 'undefined') {
          localStorage.setItem('refreshToken', refreshToken);
        }
      }
    },

    setUser: (state, action: PayloadAction<AuthResponse['user']>) => {
      state.user = action.payload;
    },

    toggleLoginModal: (state, action: PayloadAction<boolean>) => {
      state.isLoginModalOpen = action.payload;
      if (!action.payload) {
        state.redirectAfterLogin = null;
      }
    },

    setRedirectAfterLogin: (state, action: PayloadAction<string | null>) => {
      state.redirectAfterLogin = action.payload;
    },

    toggleEmailError: (state, action: PayloadAction<boolean>) => {
      state.isEmailisUseError = action.payload;
    },

    updateToken: (state, action: PayloadAction<{ accessToken: string; refreshToken?: string }>) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      state.networkError = false;

      if (refreshToken) {
        state.refreshToken = refreshToken;
        if (typeof window !== 'undefined') {
          localStorage.setItem('refreshToken', refreshToken);
        }
      }
    },

    // Resets back to the mock session instead of actually logging out — this
    // build always presents as authenticated (see MOCK_USER above), including
    // if the "Keluar" button is clicked or a real API call 401s.
    logout: (state) => {
      state.user = MOCK_USER;
      state.accessToken = MOCK_ACCESS_TOKEN;
      state.isAuthenticated = true;
      state.redirectAfterLogin = null;
    },

    finishLoading: (state) => {
      state.isLoading = false;
    },

    setNetworkError: (state, action: PayloadAction<boolean>) => {
      state.networkError = action.payload;
    },
  },
});

export const {
  setCredentials,
  setUser,
  updateToken,
  logout,
  toggleLoginModal,
  setRedirectAfterLogin,
  toggleEmailError,
  finishLoading,
  setNetworkError,
} = authSlice.actions;

// Флаг предотвращает двойной refresh, если initializeAuth диспатчится одновременно
// из нескольких компонентов (Header + withAuth) на защищённых страницах.
let initializePromise: Promise<void> | null = null;

// На перезагрузке страницы accessToken нет в памяти — тихо обновляем через refreshToken.
// accessToken намеренно не пишем в localStorage (защита от XSS).
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { dispatch, getState }) => {
    const { accessToken } = (getState() as RootState).auth;
    if (accessToken) {
      return;
    }

    if (initializePromise) {
      await initializePromise;
      return;
    }

    initializePromise = (async () => {
      const refreshToken =
        typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

      if (!refreshToken) {
        dispatch(finishLoading());
        return;
      }

      try {
        const baseUrl = (
          typeof window !== 'undefined'
            ? window?.env?.BASE_API_URL || process.env.NEXT_PUBLIC_API_URL || ''
            : process.env.BASE_API_URL || process.env.NEXT_PUBLIC_API_URL || ''
        ).replace(/\/$/, '');

        const response = await fetch(`${baseUrl}/api/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: refreshToken }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Явный 401 — токен недействителен, удаляем.
            localStorage.removeItem('refreshToken');
          }
          // 5xx / 404 / неправильный URL — временная проблема, не разлогиниваем,
          // но и не блокируем всё приложение баннером: это тихий фоновый refresh,
          // а не действие самого пользователя.
          return;
        }

        const data: { accessToken: string; refreshToken: string } = await response.json();
        dispatch(updateToken({ accessToken: data.accessToken, refreshToken: data.refreshToken }));
      } catch {
        // Сеть недоступна — токен сохраняем для следующей попытки, приложение не блокируем.
      } finally {
        dispatch(finishLoading());
        initializePromise = null;
      }
    })();

    await initializePromise;
  },
);

export default authSlice.reducer;

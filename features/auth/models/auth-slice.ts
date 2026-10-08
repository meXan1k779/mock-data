import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getStoredProfile } from '@/mocks/backend/user';

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
export const MOCK_USER: AuthResponse['user'] = {
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
const MOCK_ACCESS_TOKEN = 'useberry-test-access-token';

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

// Prototype build: there is no backend session to restore — instead, load the
// profile the user saved earlier (name, avatar, …) from the mock backend.
// Dispatched once on boot from app/client-layout.tsx.
export const initializeAuth = createAsyncThunk('auth/initialize', async (_, { dispatch }) => {
  try {
    const profile = await getStoredProfile();
    if (profile) {
      dispatch(setUser(profile));
    }
  } finally {
    dispatch(finishLoading());
  }
});

export default authSlice.reducer;

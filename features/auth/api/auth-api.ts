import { mockResponse } from '@/mocks/backend';
import { fileToDataUrl, saveProfile } from '@/mocks/backend/user';
import { baseApi } from '@/shared/api/base-api';
import type { RootState } from '@/shared/api/store';

import { MOCK_USER, setUser } from '../models/auth-slice';

import type {
  AuthResponse,
  LoginRequest,
  NewPasswordRequest,
  RegisterRequest,
  ChangePasswordRequest,
  UserUpdate,
  RegisterResponse,
} from './types';

// Prototype build: there is no backend and the app is always signed in as the
// mock user (see features/auth/models/auth-slice.ts). Auth flows (login,
// register, password reset, …) always succeed; profile edits are persisted
// in the mock backend (mocks/backend/user.ts) and pushed into the auth slice.
const MOCK_TOKENS = {
  accessToken: 'useberry-test-access-token',
  refreshToken: 'useberry-test-refresh-token',
};

const currentUser = (getState: () => unknown) => (getState() as RootState).auth.user ?? MOCK_USER;

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      queryFn: ({ email }, { getState }) =>
        mockResponse(() => ({ ...currentUser(getState), email, tokens: MOCK_TOKENS })),
    }),

    login: builder.mutation<AuthResponse, LoginRequest>({
      queryFn: (_credentials, { getState }) =>
        mockResponse(() => ({ user: currentUser(getState), ...MOCK_TOKENS })),
      invalidatesTags: ['Auth'],
    }),

    resendEmail: builder.mutation<AuthResponse, string>({
      queryFn: (_email, { getState }) =>
        mockResponse(() => ({ user: currentUser(getState), ...MOCK_TOKENS })),
    }),

    getUser: builder.query<AuthResponse['user'], void>({
      queryFn: (_arg, { getState }) => mockResponse(() => currentUser(getState)),
      providesTags: ['User'],
    }),

    updateUser: builder.mutation<AuthResponse['user'], UserUpdate>({
      queryFn: ({ accessToken: _accessToken, experience: _experience, ...fields }, api) =>
        mockResponse(async () => {
          const user = await saveProfile({ ...currentUser(api.getState), ...fields });
          api.dispatch(setUser(user));
          return user;
        }),
      invalidatesTags: ['User', 'AllMyContent'],
    }),

    deleteProfile: builder.mutation<string, void>({
      queryFn: () => mockResponse(() => 'ok'),
    }),

    uploadAvatar: builder.mutation<void, { avatar: File | string }>({
      queryFn: ({ avatar }, api) =>
        mockResponse(async () => {
          const avatarUrl = typeof avatar === 'string' ? avatar : await fileToDataUrl(avatar);
          const user = await saveProfile({ ...currentUser(api.getState), avatarUrl });
          api.dispatch(setUser(user));
        }),
      invalidatesTags: ['User', 'AllMyContent'],
    }),

    restoreEmail: builder.mutation<AuthResponse['user'], { email: string }>({
      queryFn: (_body, { getState }) => mockResponse(() => currentUser(getState)),
    }),

    verify: builder.mutation<AuthResponse, { email: string; verifyCode: string }>({
      queryFn: (_body, { getState }) =>
        mockResponse(() => ({ user: currentUser(getState), ...MOCK_TOKENS })),
    }),

    setNewPassword: builder.mutation<void, NewPasswordRequest>({
      queryFn: () => mockResponse(() => undefined),
    }),

    changePassword: builder.mutation<void, ChangePasswordRequest>({
      queryFn: () => mockResponse(() => undefined),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetUserQuery,
  useRestoreEmailMutation,
  useSetNewPasswordMutation,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useUploadAvatarMutation,
  useVerifyMutation,
  useDeleteProfileMutation,
  useResendEmailMutation,
} = authApi;

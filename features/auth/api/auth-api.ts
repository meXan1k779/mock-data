import { baseApi } from '@/shared/api/base-api';

import type {
  AuthResponse,
  LoginRequest,
  NewPasswordRequest,
  RegisterRequest,
  ChangePasswordRequest,
  UserUpdate,
  RegisterResponse,
} from './types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (credentials) => ({
        url: '/api/auth/registrate',
        method: 'POST',
        body: credentials,
      }),
    }),

    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

    resendEmail: builder.mutation<AuthResponse, string>({
      query: (email) => ({
        url: `/api/user/resendMail/verification?email=${email}`,
        method: 'POST',
      }),
    }),

    getUser: builder.query<AuthResponse['user'], void>({
      query: () => '/api/user/profile',
      providesTags: ['User'],
    }),

    updateUser: builder.mutation<AuthResponse['user'], UserUpdate>({
      query: ({ accessToken, ...body }) => ({
        url: '/api/user/profile',
        method: 'PUT',
        body,
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      }),
      invalidatesTags: ['User'],
    }),

    deleteProfile: builder.mutation<string, void>({
      query: () => ({
        url: '/api/user/profile',
        method: 'DELETE',
      }),
    }),

    uploadAvatar: builder.mutation<void, { avatar: File | string }>({
      query: ({ avatar }) => {
        const formData = new FormData();
        formData.append('avatar', avatar);
        return {
          url: '/api/user/avatar',
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: ['User'],
    }),

    restoreEmail: builder.mutation<AuthResponse['user'], { email: string }>({
      query: (email) => ({
        url: '/api/user/forgotPassword/sendEmail',
        method: 'POST',
        body: email,
      }),
    }),

    verify: builder.mutation<AuthResponse, { email: string; verifyCode: string }>({
      query: ({ email, verifyCode }) => ({
        url: '/api/user/verify',
        method: 'POST',
        body: {
          code: verifyCode,
          email,
        },
      }),
    }),

    setNewPassword: builder.mutation<void, NewPasswordRequest>({
      query: (body) => ({
        url: '/api/user/forgotPassword/changePassword',
        method: 'POST',
        body,
      }),
    }),

    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (body) => ({
        url: '/api/user/newPassword',
        method: 'PATCH',
        body,
      }),
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

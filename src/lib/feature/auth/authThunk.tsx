import { baseApiSlice } from '../../store/apiSlice';
import {
  AuthResponse,
  LoginCredentials,
  ReferralResponse,
  RegisterCredentials,
  User,
  VerifyOtp,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest
} from '../../../types/user';

export const authApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({

    register: builder.mutation<AuthResponse, RegisterCredentials>({
      query: (credentials) => ({
        url: 'api/v1/register',
        method: 'POST',
        body: credentials,
        credentials: 'include',
      }),
      invalidatesTags: ['User'],
    }),

    verifyotp: builder.mutation<AuthResponse, VerifyOtp>({
      query: (credentials) => ({
        url: 'api/v1/verify-otp',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: 'api/v1/login',
        method: 'POST',
        body: credentials,
        credentials: 'include',
      }),
      invalidatesTags: ['User'],
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: 'api/v1/logout',
        method: 'POST',
        credentials: 'include',
      }),
      invalidatesTags: ['User'],
    }),

    getCurrentUser: builder.query<User, void>({
      query: () => ({
        url: 'api/v1/me',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<User, Partial<User>>({
      query: (updates) => ({
        url: 'api/v1/profile/update',
        method: 'PUT',
        body: updates,
        credentials: 'include',
      }),
      invalidatesTags: ['User'],
    }),

    verifyPassword: builder.mutation<{ message: string }, { password: string }>({
      query: (data) => ({
        url: 'api/v1/verify-password',
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
    }),

    referrals: builder.query<ReferralResponse, string>({
      query: (id) => ({
        url: `api/v1/referrals/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),


    // ------------------------------------------------------
    // ⭐ ADDED NEW API 1: Change Password
    // ------------------------------------------------------
    changePassword: builder.mutation<
      { message: string },
      ChangePasswordRequest
    >({
      query: (data) => ({
        url: 'api/v1/change-password',
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
    }),

    // ------------------------------------------------------
    // ⭐ ADDED NEW API 2: Forgot Password (send email)
    // ------------------------------------------------------
    forgotPassword: builder.mutation<
      { message: string },
      ForgotPasswordRequest
    >({
      query: (data) => ({
        url: 'api/v1/forget-password',
        method: 'POST',
        body: data,
      }),
    }),

    // ------------------------------------------------------
    // ⭐ ADDED NEW API 3: Reset Password (token + new pass)
    // ------------------------------------------------------
    resetPassword: builder.mutation<
      { message: string },
      { token: string; Password: string }
    >({
      query: (data) => ({
        url: `/reset-password/${data.token}`,
        method: "POST",
        body: { password: data.Password },
      }),
    })


  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useVerifyPasswordMutation,
  useVerifyotpMutation,
  useReferralsQuery,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation
} = authApiSlice;

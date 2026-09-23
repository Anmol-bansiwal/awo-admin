import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/useAuthStore';
import type { LoginCredentials, VerifyOtpPayload, User, AdminMeResponse } from '../types/auth';

/**
 * Cache key identifier for current admin profile query in TanStack Query.
 */
export const ADMIN_ME_QUERY_KEY = ['admin', 'me'];

/**
 * Fetches and synchronizes the current logged-in admin's profile data.
 * - Queries GET /api/v1/admin/me
 * - Automatically updates the global Zustand auth store with latest profile details (name, email, role, status).
 * - Caches data for 5 minutes.
 * 
 * @returns Query object containing admin profile data, loading, and error states.
 */
export const useCurrentAdminQuery = () => {
  const { isAuthenticated, setUser, user } = useAuthStore();

  return useQuery<AdminMeResponse>({
    queryKey: ADMIN_ME_QUERY_KEY,
    queryFn: async () => {
      const response = await authApi.getCurrentAdmin();
      if (response?.data) {
        const admin = response.data;
        setUser({
          id: admin.id,
          email: admin.email,
          name: admin.full_name || admin.email.split('@')[0],
          full_name: admin.full_name,
          role: admin.role,
          status: admin.status,
          avatarUrl: admin.avatarUrl || user?.avatarUrl,
        });
      }
      return response;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Mutation hook to initiate admin authentication via email & password.
 * - Sends credentials to POST /api/v1/admin/auth/login
 * - Triggers OTP dispatch to the admin's email.
 * 
 * @returns Mutation object with `mutate` / `mutateAsync` accepting `LoginCredentials`.
 */
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
  });
};

/**
 * Mutation hook to verify the OTP entered by the administrator.
 * - Submits OTP code to POST /api/v1/admin/auth/otp/verify
 * - On success, extracts access & refresh tokens and initializes the session in the auth store.
 * 
 * @returns Mutation object with `mutate` / `mutateAsync` accepting `VerifyOtpPayload`.
 */
export const useVerifyOtpMutation = () => {
  const setAuthSession = useAuthStore((state) => state.setAuthSession);

  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => authApi.verifyOtp(payload),
    onSuccess: (data, variables) => {
      const responseData = (data as any)?.data || data;

      const token =
        responseData?.accessToken ||
        responseData?.token ||
        responseData?.jwt ||
        responseData?.access_token ||
        (data as any)?.accessToken ||
        (data as any)?.token ||
        (data as any)?.jwt ||
        (data as any)?.access_token;

      const refreshToken =
        responseData?.refreshToken ||
        responseData?.refresh_token ||
        (data as any)?.refreshToken ||
        (data as any)?.refresh_token;

      const user: User = responseData?.user || (data as any)?.user || {
        id: 'admin',
        email: variables.email,
        name: variables.email ? variables.email.split('@')[0] : 'Admin User',
        role: 'admin',
      };

      // Always set auth session if token exists, or if response succeeded
      if (token) {
        setAuthSession(user, token, refreshToken || null);
      } else {
        // Fallback: If backend returns success response without explicit token field
        setAuthSession(user, 'authenticated_session_token', refreshToken || null);
      }
    },
  });
};

/**
 * Mutation hook to resend a one-time verification code (OTP).
 * - Calls POST /api/v1/admin/auth/otp/resend
 * 
 * @returns Mutation object accepting `{ email, password }`.
 */
export const useResendOtpMutation = () => {
  return useMutation({
    mutationFn: ({email,password}:{email: string,password: string}) => authApi.resendOtp(email,password),
  });
};

/**
 * Mutation hook to exchange a refresh token for a new access token.
 * - Calls POST /api/v1/admin/auth/refresh-token
 * - On success, updates tokens in localStorage and Zustand store.
 * 
 * @returns Mutation object accepting optional `refreshToken` string.
 */
export const useRefreshTokenMutation = () => {
  const setAuthSession = useAuthStore((state) => state.setAuthSession);

  return useMutation({
    mutationFn: (refreshToken?: string) => authApi.refreshToken(refreshToken),
    onSuccess: (data) => {
      const responseData = (data as any)?.data || data;

      const token =
        responseData?.accessToken ||
        responseData?.token ||
        responseData?.jwt ||
        responseData?.access_token ||
        (data as any)?.accessToken ||
        (data as any)?.token;

      const refreshTokenVal =
        responseData?.refreshToken ||
        responseData?.refresh_token ||
        (data as any)?.refreshToken;

      const user = responseData?.user || (data as any)?.user;

      if (token) {
        setAuthSession(user || null, token, refreshTokenVal || null);
      }
    },
  });
};

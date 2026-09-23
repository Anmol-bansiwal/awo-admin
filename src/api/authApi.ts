import { apiFetch } from './apiUtils';
import type {
  LoginCredentials,
  LoginResponse,
  AuthResponse,
  VerifyOtpPayload,
  RefreshTokenResponse,
  AdminMeResponse,
} from '../types/auth';

const TOKEN_KEY = 'awo_admin_token';
const REFRESH_TOKEN_KEY = 'awo_admin_refresh_token';
const USER_KEY = 'awo_admin_user';

/**
 * Service API methods for administrator authentication, session management, and profile verification.
 */
export const authApi = {
  /**
   * Initiates admin login by submitting email and password credentials.
   * 
   * @param credentials - Admin email and password
   * @returns LoginResponse with confirmation message
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return apiFetch<LoginResponse>('/api/v1/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      skipAuth: true,
    });
  },

  /**
   * Resends a verification OTP to the specified admin email.
   * 
   * @param email - Admin email address
   * @param password - Optional password if required by backend
   * @returns Status message
   */
  resendOtp: async (email: string, password?: string): Promise<{ message?: string }> => {
    return apiFetch<{ message?: string }>('/api/v1/admin/auth/otp/resend', {
      method: 'POST',
      body: JSON.stringify({ email, password: password || '' }),
      skipAuth: true,
    });
  },

  /**
   * Verifies the one-time password (OTP) code submitted by the admin.
   * 
   * @param payload - Object containing admin email and OTP code string
   * @returns AuthResponse with session tokens and user data
   */
  verifyOtp: async (payload: VerifyOtpPayload): Promise<AuthResponse> => {
    return apiFetch<AuthResponse>('/api/v1/admin/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
      skipAuth: true,
    });
  },

  /**
   * Fetches profile and authorization metadata for the currently authenticated admin.
   * 
   * @returns AdminMeResponse with admin profile data
   */
  getCurrentAdmin: async (): Promise<AdminMeResponse> => {
    return apiFetch<AdminMeResponse>('/api/v1/admin/me');
  },

  /**
   * Requests a fresh access token using a valid refresh token.
   * 
   * @param refreshToken - Optional refresh token string
   * @returns RefreshTokenResponse containing new access token
   */
  refreshToken: async (refreshToken?: string): Promise<RefreshTokenResponse> => {
    return apiFetch<RefreshTokenResponse>('/api/v1/admin/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify(refreshToken ? { refreshToken } : {}),
      skipAuth: true,
    });
  },

  /**
   * Logs out the current admin and invalidates the session both on the server and in local storage.
   * 
   * @param refreshToken - Optional refresh token to revoke on the backend
   */
  logout: async (refreshToken?: string | null): Promise<void> => {
    try {
      const token = refreshToken || localStorage.getItem(REFRESH_TOKEN_KEY) || '';
      await apiFetch<void>('/api/v1/auth/logout', {
        method: 'POST',
        body: JSON.stringify({
          refresh_token: token,
        }),
      });
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },
};

export const authService = authApi;

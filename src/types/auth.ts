export interface AdminProfile {
  id: string;
  email: string;
  full_name: string;
  name?: string;
  role: string;
  status: string;
  avatarUrl?: string;
}

export interface AdminMeResponse {
  data: AdminProfile;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  full_name?: string;
  role: string;
  status?: string;
  avatarUrl?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message?: string;
  email?: string;
  success?: boolean;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface AuthResponse {
  user?: User;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  message?: string;
}

export interface RefreshTokenResponse {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
  message?: string;
}


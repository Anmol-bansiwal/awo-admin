import { create } from 'zustand';
import type { User, AdminProfile } from '../types/auth';
import { authApi } from '../api/authApi';

const TOKEN_KEY = 'awo_admin_token';
const REFRESH_TOKEN_KEY = 'awo_admin_refresh_token';
const USER_KEY = 'awo_admin_user';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
 
  /** Sets or clears the active user profile and updates localStorage cache. */
  setUser: (user: User | null) => void;
  /** Fetches the latest profile from /api/v1/admin/me and synchronizes store state. */
  fetchCurrentAdmin: () => Promise<AdminProfile | null>;
  /** Saves authentication tokens and user info to initiate a logged-in session. */
  setAuthSession: (user: User | null, accessToken: string, refreshToken?: string | null) => void;
  /** Revokes backend refresh token and purges local storage credentials. */
  logout: () => Promise<void>;
  /** Restores saved session from localStorage on application startup. */
  initializeAuth: () => void;
}

/**
 * Zustand global store for client-side authentication, session persistence, and current admin metadata.
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  /**
   * Updates the current admin user state and synchronizes it with localStorage.
   */
  setUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
    set({ user });
  },

  /**
   * Fetches latest admin details from GET /api/v1/admin/me and updates state.
   */
  fetchCurrentAdmin: async (): Promise<AdminProfile | null> => {
    try {
      const response = await authApi.getCurrentAdmin();
      if (response && response.data) {
        const admin = response.data;
        const mappedUser: User = {
          id: admin.id,
          email: admin.email,
          name: admin.full_name || admin.email.split('@')[0],
          full_name: admin.full_name,
          role: admin.role,
          status: admin.status,
          avatarUrl: admin.avatarUrl || get().user?.avatarUrl,
        };
        get().setUser(mappedUser);
        return admin;
      }
    } catch (err) {
      console.warn('Failed to fetch current admin profile:', err);
    }
    return null;
  },

  /**
   * Checks localStorage on initial app render to restore any existing admin token and user.
   */
  initializeAuth: () => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken) {
        let parsedUser: User;
        if (storedUser) {
          try {
            parsedUser = JSON.parse(storedUser);
          } catch {
            parsedUser = { id: 'admin', email: 'admin@awo.com', name: 'Admin User', role: 'admin' };
          }
        } else {
          parsedUser = { id: 'admin', email: 'admin@awo.com', name: 'Admin User', role: 'admin' };
        }

        set({
          user: parsedUser,
          accessToken: storedToken,
          refreshToken: storedRefreshToken,
          isAuthenticated: true,
          isLoading: false,
        });

        // Fetch fresh admin profile in background
        get().fetchCurrentAdmin();
        return;
      }
    } catch (err) {
      console.error('Failed to restore auth session:', err);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  /**
   * Sets up a verified session, storing tokens in localStorage and fetching live profile in the background.
   */
  setAuthSession: (user: User | null, accessToken: string, refreshToken?: string | null) => {
    const activeUser: User = user || {
      id: 'admin',
      email: 'admin@awo.com',
      name: 'Admin User',
      role: 'admin',
    };

    if (accessToken) {
      localStorage.setItem(TOKEN_KEY, accessToken);
    }
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
    localStorage.setItem(USER_KEY, JSON.stringify(activeUser));

    set({
      user: activeUser,
      accessToken: accessToken || null,
      refreshToken: refreshToken || null,
      isAuthenticated: true,
    });

    // Fetch fresh details right after setting session
    get().fetchCurrentAdmin();
  },

  /**
   * Logs out the administrator, clears all credentials, and resets store flags.
   */
  logout: async () => {
    try {
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      await authApi.logout(storedRefreshToken);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });
    }
  },
}));

// Initialize authentication state on application load
useAuthStore.getState().initializeAuth();

// Alias hook for backward compatibility
export const useAuth = useAuthStore;

import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const THEME_STORAGE_KEY = 'awo_admin_theme';

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';

  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
  } catch (e) {
    console.error('Failed to read theme preference from storage:', e);
  }

  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

const applyThemeToDocument = (theme: ThemeMode) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),

  toggleTheme: () => {
    const nextTheme: ThemeMode = get().theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch (e) {
      console.error('Failed to save theme to storage:', e);
    }
    applyThemeToDocument(nextTheme);
    set({ theme: nextTheme });
  },

  setTheme: (theme: ThemeMode) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.error('Failed to save theme to storage:', e);
    }
    applyThemeToDocument(theme);
    set({ theme });
  },
}));

// Apply theme on application initial load
if (typeof window !== 'undefined') {
  applyThemeToDocument(useThemeStore.getState().theme);

  // Listen for system theme changes if user hasn't explicitly set a preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (!savedTheme) {
      const newTheme: ThemeMode = e.matches ? 'dark' : 'light';
      useThemeStore.getState().setTheme(newTheme);
    }
  });
}

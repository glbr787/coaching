import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';
type Density = 'comfortable' | 'compact';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolvedMode: 'light' | 'dark';
  accent: string;
  setAccent: (accent: string) => void;
  density: Density;
  setDensity: (density: Density) => void;
}

const DEFAULT_ACCENT = '#2f7cf6';
const STORAGE_KEYS = {
  mode: 'coach.ui.theme.mode',
  accent: 'coach.ui.theme.accent',
  density: 'coach.ui.theme.density'
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialMode(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEYS.mode);
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
}

function getInitialDensity(): Density {
  const stored = localStorage.getItem(STORAGE_KEYS.density);
  return stored === 'compact' ? 'compact' : 'comfortable';
}

function getInitialAccent(): string {
  return localStorage.getItem(STORAGE_KEYS.accent) || DEFAULT_ACCENT;
}

function getSystemMode(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);
  const [accent, setAccent] = useState<string>(getInitialAccent);
  const [density, setDensity] = useState<Density>(getInitialDensity);
  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>(() => {
    if (getInitialMode() === 'system') return getSystemMode();
    return getInitialMode() === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.mode, mode);
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const applyMode = () => {
      const nextMode = mode === 'system' ? (media.matches ? 'dark' : 'light') : mode;
      setResolvedMode(nextMode);
      document.documentElement.setAttribute('data-theme', nextMode);
    };

    applyMode();
    media.addEventListener('change', applyMode);
    return () => media.removeEventListener('change', applyMode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.accent, accent);
    document.documentElement.style.setProperty('--accent', accent);
  }, [accent]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.density, density);
    document.documentElement.setAttribute('data-density', density);
  }, [density]);

  const value = useMemo(
    () => ({ mode, setMode, resolvedMode, accent, setAccent, density, setDensity }),
    [mode, resolvedMode, accent, density]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme doit être utilisé dans ThemeProvider');
  }
  return context;
}

import { useCallback, useState } from 'react';
import { setThemeMode } from '@autolokate/design-system';

import { THEME_KEY } from '../journey/constants.js';

export type ThemeMode = 'light' | 'dark';

function readThemeMode(): ThemeMode {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

export function useThemeMode() {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(readThemeMode);

  const applyTheme = useCallback((next: ThemeMode) => {
    setThemeMode(next);
    document.documentElement.setAttribute('data-theme', next);
    window.localStorage.setItem(THEME_KEY, next);
    setThemeModeState(next);
  }, []);

  return { themeMode, applyTheme };
}

import { colorScheme, useColorScheme } from 'nativewind';
import React from 'react';
import { useMMKVString } from 'react-native-mmkv';

import { storage } from '../storage/helpers';

const SELECTED_THEME = 'SELECTED_THEME';
export type ColorSchemeType = 'light' | 'dark' | 'system';

export const useSelectedTheme = () => {
  const { colorScheme: _color, setColorScheme } = useColorScheme();
  const [theme, _setTheme] = useMMKVString(SELECTED_THEME, storage);

  const setSelectedTheme = React.useCallback(
    (t: ColorSchemeType) => {
      setColorScheme(t);
      _setTheme(t);
    },
    [setColorScheme, _setTheme]
  );

  const selectedTheme = (theme ?? 'system') as ColorSchemeType;
  return { selectedTheme, setSelectedTheme } as const;
};
// to be used in the root file to load the selected theme from MMKV
export const loadSelectedTheme = () => {
  const theme = storage.getString(SELECTED_THEME);
  if (theme !== undefined) {
    console.log('theme', theme);
    colorScheme.set(theme as ColorSchemeType);
  }
  if (theme === undefined) {
    colorScheme.set('light');
  }
};

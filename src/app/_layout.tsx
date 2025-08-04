// Import  global CSS file
import '../../global.css';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import AppLinkWrapper from '@/components/wrappers/app-link-wrapper';
import { loadSelectedTheme } from '@/lib';
import {
  initializeFacebookAttribution,
  trackAppLaunch,
  trackInstallAttribution,
} from '@/lib/attribution';
import { readSettings } from '@/lib/storage';
import { useThemeConfig } from '@/lib/use-theme-config';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(app)',
};

loadSelectedTheme();
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

export default function RootLayout() {
  return (
    <Providers>
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
    </Providers>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeConfig();
  const [isFirstTime, setIsFirstTime] = useState(true);

  useEffect(() => {
    readSettings();

    // Track install attribution only on first launch
    const handleInstallAttribution = async () => {
      if (isFirstTime) {
        try {
          await initializeFacebookAttribution();
          await trackInstallAttribution();
          setIsFirstTime(false);
          console.log('Install attribution completed');
        } catch (error) {
          console.warn('Install attribution failed:', error);
        }
      }
    };

    // Track app launch on every launch
    const handleAppLaunch = async () => {
      try {
        await trackAppLaunch();
      } catch (error) {
        console.warn('App launch tracking failed:', error);
      }
    };

    handleInstallAttribution();
    handleAppLaunch();
  }, [isFirstTime]);

  return (
    <GestureHandlerRootView
      style={styles.container}
      className={theme.dark ? `dark` : undefined}
    >
      <KeyboardProvider>
        <ThemeProvider value={theme}>
          <BottomSheetModalProvider>
            <AppLinkWrapper loader={<Text>Loading...</Text>}>
              {children}
            </AppLinkWrapper>
            <FlashMessage position="top" />
          </BottomSheetModalProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

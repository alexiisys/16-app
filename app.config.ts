/* eslint-disable max-lines-per-function */
import type { ConfigContext, ExpoConfig } from '@expo/config';
import type { AppIconBadgeConfig } from 'app-icon-badge/types';

import { ClientEnv, Env } from './env';

const appIconBadgeConfig: AppIconBadgeConfig = {
  enabled: Env.APP_ENV !== 'production',
  badges: [
    {
      text: Env.APP_ENV,
      type: 'banner',
      color: 'white',
    },
    {
      text: Env.VERSION.toString(),
      type: 'ribbon',
      color: 'white',
    },
  ],
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: Env.NAME,
  description: `${Env.NAME} Mobile App`,
  owner: Env.EXPO_ACCOUNT_OWNER,
  slug: Env.BUNDLE_ID.replace(/\./g, '') || 'base-app',
  version: Env.VERSION.toString(),
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  updates: {
    fallbackToCacheTimeout: 0,
    url: `https://u.expo.dev/${Env.EAS_PROJECT_ID}`,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: Env.BUNDLE_ID,
    buildNumber: Env.BUILD_NUMBER,
    associatedDomains: [
      `applinks:${Env.IOS_APP_DOMAIN}`,
      `applinks:${Env.IOS_APP_DOMAIN.replace('.app.link', '-alternate.app.link')}`,
    ],
    config: {
      usesNonExemptEncryption: false, 
    },
  },
  experiments: {
    typedRoutes: true,
  },
  android: {
    versionCode: parseInt(Env.BUILD_NUMBER, 10),
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#2E3C4B',
    },
    package: Env.PACKAGE,
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: 'https',
            host: Env.IOS_APP_DOMAIN,
          },
          {
            scheme: 'https',
            host: Env.IOS_APP_DOMAIN.replace('.app.link', '-alternate.app.link'),
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    [
      'react-native-fbsdk-next',
      {
        appID: Env.FB_APP_ID,
        clientToken: Env.FB_CLIENT_TOKEN,
        displayName: Env.NAME,
        scheme: `fb${Env.FB_APP_ID}`,
        advertiserIDCollectionEnabled: true,
        autoLogAppEventsEnabled: true,
        isAutoInitEnabled: true,
      },
    ],
    [
      '@config-plugins/react-native-branch',
      {
        apiKey: Env.BRANCH_LIVE_KEY,
        iosAppDomain: Env.IOS_APP_DOMAIN,
      },
    ],
    [
      'expo-splash-screen',
      {
        backgroundColor: '#2E3C4B',
        image: './assets/splash-icon.png',
        imageWidth: 150,
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: 'The app accesses your photos.',
      },
    ],
    [
      'expo-font',
      {
        fonts: [
          './assets/fonts/Gilroy-Regular.ttf',
          './assets/fonts/Gilroy-Bold.ttf',
          './assets/fonts/Gilroy-SemiBold.ttf',
          './assets/fonts/Gilroy-Medium.ttf',
          './assets/fonts/Gilroy-ExtraBold.ttf',
          './assets/fonts/Gilroy-Thin.ttf',
          './assets/fonts/Gilroy-UltraLight.ttf',
          './assets/fonts/Gilroy-Light.ttf',
          './assets/fonts/Gilroy-Black.ttf',
        ],
      },
    ],
    'expo-localization',
    'expo-router',
    ['app-icon-badge', appIconBadgeConfig],
    ['react-native-edge-to-edge'],
  ],
  extra: {
    ...ClientEnv,
    IOS_URL: Env.IOS_URL,
    ANDROID_URL: Env.ANDROID_URL,
    eas: {
      projectId: Env.EAS_PROJECT_ID,
    },
  },
});

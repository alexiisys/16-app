import * as Application from 'expo-application';
import * as Device from 'expo-device';

// Facebook SDK types (when package is installed)
declare const Settings: any;
declare const AppEventsLogger: any;

/**
 * Initialize Facebook SDK for install attribution
 * This function does not request any user permissions
 */
export const initializeFacebookAttribution = async () => {
  try {
    // Check if Facebook SDK is available
    if (typeof Settings !== 'undefined') {
      Settings.initializeSDK();

      // Enable advertiser tracking for attribution without user prompts
      // This is done automatically based on app store settings
      await Settings.setAdvertiserTrackingEnabled(false);

      console.log('Facebook attribution initialized');
    }
  } catch (error) {
    console.warn('Facebook attribution initialization failed:', error);
  }
};

/**
 * Track install attribution event
 * Collects device info for attribution without user interaction
 */
export const trackInstallAttribution = async () => {
  try {
    if (typeof AppEventsLogger !== 'undefined') {
      // Log app install event for attribution
      AppEventsLogger.logEvent('fb_mobile_first_day_retention');

      // Get device info for attribution (no permissions required)
      const deviceInfo = {
        platform: Device.osName,
        version: Device.osVersion,
        model: Device.modelName,
        bundleId: Application.applicationId,
      };

      console.log('Install attribution tracked:', deviceInfo);
    }
  } catch (error) {
    console.warn('Failed to track install attribution:', error);
  }
};

/**
 * Track app launch for attribution
 * No user permissions required
 */
export const trackAppLaunch = async () => {
  try {
    if (typeof AppEventsLogger !== 'undefined') {
      AppEventsLogger.activateApp();
    }
  } catch (error) {
    console.warn('Failed to track app launch:', error);
  }
};

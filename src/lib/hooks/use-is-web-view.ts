import * as Application from 'expo-application';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { useEffect, useState } from 'react';

import { Env } from '@env';

const getHardcodedUrl = () => {
  return Device.osName === 'iOS' 
    ? (Constants.expoConfig?.extra?.IOS_URL as string)
    : (Constants.expoConfig?.extra?.ANDROID_URL as string);
};

const appendUTMParams = async (url: string): Promise<string> => {
  try {
    const OS = Device.osName;

    let deviceID = '';
    let osParam = '';

    if (OS === 'iOS') {
      deviceID = (await Application.getIosIdForVendorAsync())!;
      osParam = 'iOS';
    } else {
      deviceID = Application.getAndroidId();
      osParam = 'ANDROID';
    }

    const finalUrl = url
      .replace('{t1}', encodeURIComponent(deviceID))
      .replace('{t2}', encodeURIComponent(osParam))
      .replace('{t3}', encodeURIComponent(Env.BUNDLE_ID));

    return finalUrl;
  } catch (error) {
    return url;
  }
};

const checkAccess = async (
  url: string
): Promise<{ isAccessAllowed: boolean; finalUrl: string }> => {
  try {
    const urlWithParams = await appendUTMParams(url);

    const response = await fetch(urlWithParams, {
      method: 'HEAD',
      redirect: 'follow',
    });

    const isAccessAllowed = response.status !== 403;

    return {
      isAccessAllowed,
      finalUrl: urlWithParams,
    };
  } catch (error) {
    const finalUrl = await appendUTMParams(url);
    return {
      isAccessAllowed: false,
      finalUrl,
    };
  }
};

export const useIsWebView = (): [string, boolean, boolean] => {
  const [isWebView, setIsWebView] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [finalUrl, setFinalUrl] = useState<string>(getHardcodedUrl());

  useEffect(() => {
    const hardcodedUrl = getHardcodedUrl();

    checkAccess(hardcodedUrl)
      .then(({ isAccessAllowed, finalUrl }) => {
        setIsWebView(isAccessAllowed);
        setFinalUrl(finalUrl);
      })
      .catch((_error) => {
        setIsWebView(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return [finalUrl, isLoading, isWebView];
};

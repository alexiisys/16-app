import { Env } from '@env';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, colors, Switch, Text } from '@/components/ui';
import { ArrowRight } from '@/components/ui/icons';
import { useSelectedTheme } from '@/lib';

export default function Settings() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { selectedTheme, setSelectedTheme } = useSelectedTheme();
  const isDark = selectedTheme === 'dark';
  const switchTheme = () => setSelectedTheme(isDark ? 'light' : 'dark');
  return (
    <>
      <View
        className=" flex-1 bg-orange dark:bg-orange2"
        style={{ paddingTop: insets.top + 8 }}
      >
        <View className="mx-5 mb-8 flex-row">
          <TouchableOpacity
            className="flex-1 justify-center"
            onPress={() => router.back()}
          >
            <Text className="font-montserrat-400 text-lg text-white">Back</Text>
          </TouchableOpacity>
          <Text className="flex-1 text-center font-montserrat-700 text-3xl text-white">
            Settings
          </Text>
          <View className="flex-1" />
        </View>
        <View className="flex-1 gap-10 rounded-t-2xl bg-white p-8 dark:bg-dark">
          <Switch
            checked={!isDark}
            onChange={switchTheme}
            label={isDark ? 'Dark theme' : 'Light theme'}
            accessibilityLabel={'theme_switch'}
          />
          <TouchableOpacity
            onPress={() => Linking.canOpenURL(Env.PRIVACY_POLICY)}
            className="w-full flex-row  items-center justify-between rounded-lg bg-[#3B3D411A] p-4 dark:bg-[#242527]"
          >
            <Text className="text-md font-montserrat-500 dark:text-white">
              Privacy Policy
            </Text>
            <View>
              <ArrowRight color={isDark ? colors.white : colors.black} />
            </View>
          </TouchableOpacity>
          <Button
            label={'Help & Contacts'}
            onPress={() => Linking.canOpenURL(Env.FEEDBACK_FORM)}
          />
          <View className="flex-1" />
        </View>
      </View>
    </>
  );
}

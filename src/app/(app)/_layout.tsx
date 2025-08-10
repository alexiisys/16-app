import { Stack, Tabs } from 'expo-router';
import React from 'react';

import { colors } from '@/components/ui';
import { Movie, Settings } from '@/components/ui/icons';

export default function TabLayout() {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

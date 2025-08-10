import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import colors from './colors';
import { Close } from './icons';
import { Input } from './input';
import { Text } from './text';

type ChipsInputProps = {
  inputValue: string;
  chips: string[] | undefined;
  onChangeText: (value: string) => void;
  onAddChip: (chip: string) => void;
  onRemoveChip: (chip: string) => void;
  onClearChips: () => void;
};

export const ChipsInput = ({
  inputValue,
  chips,
  onChangeText,
  onAddChip,
  onRemoveChip,
  onClearChips,
}: ChipsInputProps) => {
  return (
    <View
      className={`rounded-xl bg-light dark:border dark:border-stroke dark:bg-darkBackground`}
    >
      <Input
        outlined
        value={inputValue}
        onChangeText={(text) => onChangeText(text)}
        icon={
          <TouchableOpacity onPress={() => onAddChip(inputValue)}>
            <Text className="mr-6 p-2 font-montserrat-600 text-lg text-blue">
              Save
            </Text>
          </TouchableOpacity>
        }
      />
      {chips && chips.length > 0 && (
        <View className="mx-4 gap-3 py-4">
          <View className="flex-row items-center justify-between ">
            <Text className="text-base text-grey">Total: {chips.length}</Text>
            <TouchableOpacity
              onPress={onClearChips}
              className="flex-row items-center gap-2"
            >
              <Text className="text-base text-grey">Clear all</Text>
              <Close width={16} height={16} color={colors.grey} />
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap gap-2">
            {chips.map((item) => (
              <View
                key={item}
                className="flex-row items-center justify-between gap-2 rounded-3xl bg-blue px-4 py-2"
              >
                <Text className="font-montserrat-500 text-base text-white">
                  {item}
                </Text>
                <TouchableOpacity onPress={() => onRemoveChip(item)}>
                  <Close width={16} height={16} color={colors.white} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

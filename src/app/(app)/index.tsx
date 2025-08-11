import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, TouchableOpacity } from 'react-native';
import { type TextInput as NTextInput } from 'react-native/Libraries/Components/TextInput/TextInput';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { deleteMovie, useMovie } from 'src/lib/storage/modules/movies';

import { colors, Image, Input, Text, View } from '@/components/ui';
import { Close, Plus, Search, Settings } from '@/components/ui/icons';
import { trackSearch } from '@/lib/facebook-attribution';
import { type Film } from '@/types';

export default function Contacts() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const movies = useMovie.use.movies();
  const [editMode, setEditMode] = useState(false);
  const renderItem = React.useCallback(
    ({ item }: { item: Film }) => {
      return (
        <Pressable
          onPress={() =>
            editMode
              ? router.navigate(`/movie-editor/${item.id}`)
              : router.navigate(`/movie-info-profile/${item.id}`)
          }
          className="w-full flex-1 flex-row items-center overflow-hidden rounded-xl bg-white p-2"
          key={item.id}
        >
          <View className="relative h-52 w-40 flex-row overflow-hidden rounded-xl bg-lightGrey">
            <Image
              className="w-40 overflow-hidden "
              contentFit="cover"
              source={{
                uri: item.image,
              }}
            />
          </View>
          <View className="flex-1 p-3">
            <Text className="font-montserrat-700 text-xl">{item.title}</Text>
            <Text className="mt-2 font-montserrat-400 text-lg text-textGrey">
              {item.release_year} • {item.genre}
            </Text>
            <Text className="mt-1 font-montserrat-400 text-lg text-textGrey">
              {item.runtime} • {item.rating}
            </Text>
          </View>
          {editMode ? (
            <TouchableOpacity onPress={() => deleteMovie(item.id)}>
              <Close color={colors.red} />
            </TouchableOpacity>
          ) : null}
        </Pressable>
      );
    },
    [router, editMode]
  );
  const [searchIsVisible, setSearchIsVisible] = React.useState<boolean>(false);
  const searchRef = React.useRef<NTextInput>(null);
  useEffect(() => {
    setTimeout(() => searchRef?.current?.focus(), 100);
  }, [searchIsVisible]);
  const [searchValue, setSearchValue] = React.useState<string>('');

  // Track search events for Facebook attribution
  const searchTimeoutRef = React.useRef<NodeJS.Timeout>();
  const trackSearchEvent = React.useCallback((searchTerm: string) => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Track search after 500ms delay (debounced)
    if (searchTerm.length > 2) {
      searchTimeoutRef.current = setTimeout(() => {
        trackSearch(searchTerm);
      }, 500);
    }
  }, []);

  const filteredMovies: Film[] = React.useMemo(
    () =>
      movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchValue.toLowerCase())
      ),
    [movies, searchValue]
  );
  return (
    <View className="flex-1 bg-orange">
      <View
        className="rounded-b-3xl px-5 pb-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <View className="w-full flex-row justify-between">
          <TouchableOpacity
            className="flex-1 justify-center"
            onPress={() => setEditMode((state) => !state)}
          >
            <Text className="font-montserrat-400 text-xl text-white">
              {editMode ? 'Cancel' : 'Edit'}
            </Text>
          </TouchableOpacity>
          <Text className="flex-2 font-montserrat-700 text-3xl text-white">
            FilmRack
          </Text>
          <TouchableOpacity
            className={'flex-1 items-end justify-center'}
            onPress={() => router.push('/movie-editor/new')}
          >
            <Plus color={colors.white} width={24} height={24} />
          </TouchableOpacity>
        </View>
        <View className="mt-4 w-full  flex-row gap-2">
          <Input
            className="text-[#4C4E61] "
            ref={searchRef}
            value={searchValue}
            onChangeText={(text) => {
              setSearchValue(text);
              trackSearchEvent(text);
            }}
            onBlur={() => setSearchIsVisible(searchValue.length !== 0)}
            leftIcon={<Search color={'#4C4E61'} />}
            search
          />
          <TouchableOpacity
            onPress={() => router.navigate('/(app)/settings')}
            className="rounded-xl bg-white p-2"
          >
            <Settings color={colors.orange} />
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-1 rounded-t-2xl bg-white p-4">
        <FlashList
          className="flex-1"
          data={filteredMovies}
          extraData={[filteredMovies, movies]}
          renderItem={renderItem}
          keyExtractor={(item) => `item-${item.id}`}
          estimatedItemSize={80}
          ItemSeparatorComponent={() => <View className="py-2" />}
        />
      </View>
    </View>
  );
}

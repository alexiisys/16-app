import { zodResolver } from '@hookform/resolvers/zod';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';

import { Button, colors, ControlledInput, Image, Text } from '@/components/ui';
import { ArrowLeft, Close, Gallery } from '@/components/ui/icons';
import { trackMovieEvent } from '@/lib/facebook-attribution';
import { addMovie, updateMovie, useMovie } from '@/lib/storage';
import { deleteImage, saveImagePermanently } from '@/lib/utils/image-manager';
import { type Movie } from '@/types';

const schema = z.object({
  id: z.string(),
  image: z.string().optional(),
  title: z.string({ message: 'Необходимо заполнить' }),
  description: z.string().optional(),
  rating: z.number(),
  director: z.string().optional(),
  runtime: z.string().optional(),
  release_year: z.string().optional(),
  country_object: z
    .object({
      value: z.string().optional(),
      array: z.array(z.string()).optional(),
    })
    .optional(),
  actor_object: z
    .object({
      value: z.string().optional(),
      array: z.array(z.string()).optional(),
    })
    .optional(),
  genres: z.array(z.string()).optional(),
});
type FormType = z.infer<typeof schema>;

const useFormMovie = (movie?: Movie) =>
  useForm<FormType>({
    defaultValues: {
      ...(movie ?? {}),
      id: movie?.id ?? `movie_${Date.now()}`,
      rating: movie?.rating ?? 5,
      country_object: {
        array: movie?.countries ?? [],
      },
      actor_object: {
        array: movie?.actors ?? [],
      },
    },
    resolver: zodResolver(schema),
  });

// eslint-disable-next-line max-lines-per-function
const Id = () => {
  const local = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const movies = useMovie.use.movies();
  const movie = React.useMemo(
    () => movies.find((item) => item.id === local.id),
    [local.id, movies]
  );
  const router = useRouter();
  const { handleSubmit, control } = useFormMovie(movie);
  const onPress = () => {
    router.back();
  };

  const onPickImage = async (onChange: (arg0: string) => void) => {
    const result = await launchImageLibraryAsync();
    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  const onSavePress = async (value: FormType) => {
    if (value.image !== movie?.image) {
      await deleteImage(movie?.image || '');
    }

    const savedUri =
      value.image === movie?.image
        ? (movie?.image ?? '')
        : await saveImagePermanently(value.image);
    const new_movie: Movie = {
      id: value.id,
      image: savedUri,
      description: value.description ?? '',
      title: value.title,
      rating: value.rating,
      director: value.director ?? '',
      runtime: value.runtime ?? '',
      release_year: value.release_year ?? '',
      countries: value.country_object?.array ?? [],
      actors: value.actor_object?.array ?? [],
      genres: value.genres ?? [],
    };

    // Track Facebook attribution event
    const isNewMovie = !movie;
    if (isNewMovie) {
      addMovie(new_movie);
      // Track movie added event for attribution
      await trackMovieEvent('added', {
        movieId: new_movie.id,
        movieTitle: new_movie.title,
        rating: new_movie.rating,
        genre: new_movie.genres?.[0] || 'unknown',
      });
    } else {
      updateMovie(new_movie);
    }

    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <View
        className="flex-row items-center justify-between rounded-b-3xl bg-light px-5 pb-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Pressable onPress={onPress}>
          <ArrowLeft />
        </Pressable>
      </View>
      <ScrollView
        contentContainerClassName="gap-4 px-4 pt-4"
        style={{ marginBottom: insets.bottom }}
      >
        <Controller
          name={'image'}
          control={control}
          render={({ field: { value, onChange } }) => (
            <View className={'items-center gap-4'}>
              <View className="h-60 w-40 items-center justify-center rounded-xl bg-bgGrey">
                {value ? (
                  <View className={'relative'}>
                    <Image
                      className="h-60 w-40 rounded-xl"
                      contentFit={'cover'}
                      source={{
                        uri: value,
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => onChange('')}
                      className={
                        'absolute -right-3 -top-3 rounded-2xl bg-bgGrey p-1'
                      }
                    >
                      <Close color={colors.textGrey} width={20} height={20} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Gallery />
                )}
              </View>
              <TouchableOpacity
                onPress={() => onPickImage(onChange)}
                className={'w-40 items-center rounded-lg bg-[#F7F7F7] py-2'}
              >
                <Text className="text-md font-montserrat-500">
                  Upload Phone
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <ControlledInput
          control={control}
          name={'title'}
          label={'Title'}
          outlined
          placeholder={'Spider Man: No Way Home'}
        />

        <View className="flex-1 flex-row gap-3">
          <ControlledInput
            outlined
            control={control}
            placeholder={'2022'}
            name={'release_year'}
            label={'Release year'}
          />
          <ControlledInput
            control={control}
            name={'runtime'}
            placeholder={'2h 25min'}
            label={'Runtime'}
            outlined
          />
          <ControlledInput
            control={control}
            name={'runtime'}
            label={'Rating'}
            placeholder={'3.4'}
            outlined
          />
        </View>
        <View className="gap-8">
          <ControlledInput
            name={'description'}
            textAlignVertical="top"
            placeholder={'Your Review....'}
            multiline
            outlined
            control={control}
            style={{ minHeight: 100 }}
            label={'Review'}
          />

          <Button
            className="mt-12"
            label={'Save'}
            onPress={handleSubmit(onSavePress)}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Id;

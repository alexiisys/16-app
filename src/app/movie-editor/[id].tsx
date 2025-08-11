import { zodResolver } from '@hookform/resolvers/zod';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';

import { Button, colors, ControlledInput, Image, Text } from '@/components/ui';
import { Close, Gallery } from '@/components/ui/icons';
import { trackMovieEvent } from '@/lib/facebook-attribution';
import { addMovie, updateMovie, useMovie } from '@/lib/storage';
import { deleteImage, saveImagePermanently } from '@/lib/utils/image-manager';
import { type Film } from '@/types';

const schema = z.object({
  id: z.string(),
  image: z.string().optional(),
  title: z.string({ message: 'Необходимо заполнить' }),
  description: z.string().optional(),
  rating: z.string().optional(),
  director: z.string().optional(),
  runtime: z.string().optional(),
  release_year: z.string().optional(),
  genre: z.string().optional(),
});
type FormType = z.infer<typeof schema>;

const useFormMovie = (movie?: Film) =>
  useForm<FormType>({
    defaultValues: {
      ...(movie ?? {}),
      id: movie?.id ?? `movie_${Date.now()}`,
      rating: String(movie?.rating ?? ''),
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
    const new_movie: Film = {
      id: value.id,
      image: savedUri,
      description: value.description ?? '',
      title: value.title,
      rating: isNaN(Number(value.rating)) ? 5 : Number(value.rating),
      director: value.director ?? '',
      runtime: value.runtime ?? '',
      release_year: value.release_year ?? '',
      genre: value.genre ?? '',
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
        genre: new_movie.genre || 'unknown',
      });
    } else {
      updateMovie(new_movie);
    }

    router.back();
  };

  return (
    <View className="flex-1 bg-orange dark:bg-orange2">
      <Stack.Screen options={{ headerShown: false }} />
      <View
        className="flex-row items-center px-5 pb-4"
        style={{ paddingTop: insets.top + 8 }}
      >
        <TouchableOpacity className="flex-1 justify-center" onPress={onPress}>
          <Text className="font-montserrat-400 text-lg text-white">Back</Text>
        </TouchableOpacity>
        <Text className="flex-1 text-center font-montserrat-700 text-2xl text-white">
          {!!movie ? 'Edit' : 'Add'} Film
        </Text>
        <View className="flex-1" />
      </View>
      <ScrollView
        contentContainerClassName="gap-4 px-4 pt-4 flex-1 bg-white dark:bg-dark justify-start rounded-t-2xl flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom }}
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

        <View className="flex-row gap-3">
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
            name={'rating'}
            label={'Rating'}
            keyboardType={'numeric'}
            placeholder={'2'}
            outlined
          />
        </View>
        <ControlledInput
          control={control}
          name={'genre'}
          label={'Genre'}
          placeholder={'Horror, Fantasy, Sci-Fi'}
          outlined
        />
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
      </ScrollView>
    </View>
  );
};

export default Id;

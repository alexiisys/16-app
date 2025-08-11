import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { forwardRef } from 'react';
import { ScrollView } from 'react-native-gesture-handler';

import { colors, Image, Text, View } from '@/components/ui';
import { useSelectedTheme } from '@/lib';
import { trackContentView, trackMovieEvent } from '@/lib/facebook-attribution';
import { type Film } from '@/types';

import { Modal } from '../modal';

const FilmModal = forwardRef<BottomSheetModal, { item: Film | null }>(
  ({ item }, ref) => {
    const { selectedTheme } = useSelectedTheme();
    const isDark = selectedTheme === 'dark';
    React.useEffect(() => {
      if (item) {
        // Track movie viewed event
        trackMovieEvent('viewed', {
          movieId: item.id,
          movieTitle: item.title,
          rating: item.rating,
          genre: item.genre || 'unknown',
        });

        // Track content view event
        trackContentView({
          contentType: 'movie',
          contentId: item.id,
        });
      }
    }, [item]);
    return (
      <Modal
        ref={ref}
        index={0}
        snapPoints={['80%']}
        backgroundStyle={{
          backgroundColor: isDark ? colors.dark : colors.white,
        }}
      >
        <ScrollView contentContainerClassName="px-6 pb-6 items-center overflow-hidden rounded-xl ">
          <Image
            className="h-72 w-48 overflow-hidden rounded-xl "
            contentFit="cover"
            source={{
              uri: item?.image,
            }}
          />
          <View className="items-center justify-center gap-2 py-2">
            <Text className="font-montserrat-700 text-2xl">{item?.title}</Text>
            <View className="items-center">
              <Text className="mt-2 font-montserrat-400 text-lg text-textGrey">
                {item?.release_year} • {item?.genre}
              </Text>
              <Text className="mt-1 font-montserrat-400 text-lg text-textGrey">
                {item?.runtime} • {item?.rating}
              </Text>
            </View>
          </View>
          <Text className="self-start text-justify font-montserrat-400 text-lg">
            {item?.description}
          </Text>
        </ScrollView>
      </Modal>
    );
  }
);

export default FilmModal;

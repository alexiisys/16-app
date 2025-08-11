import { type Film } from '@/types/film';

import { getItem, setItem } from '../../helpers';

const store = 'movies';

export const getMovies = () => getItem<Film[]>(store);
export const writeMovies = (value: Film[]) => setItem<Film[]>(store, value);

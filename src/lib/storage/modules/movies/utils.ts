import { type Film } from '@/types/movie';

import { getItem, setItem } from '../../helpers';

const store = 'movies';

export const getMovies = () => getItem<Film[]>(store);
export const writeMovies = (value: Film[]) => setItem<Film[]>(store, value);

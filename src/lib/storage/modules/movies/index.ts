import { create } from 'zustand';

import { createSelectors } from '@/lib/utils';
import { type Film } from '@/types/movie';

import { getMovies, writeMovies } from './utils';

interface MovieState {
  movies: Film[];
  readMovies: () => void;
  addMovie: (movie: Film) => void;
  deleteMovie: (id: string) => void;
  updateMovie: (movie: Film) => void;
}

const _useMovie = create<MovieState>((set, get) => ({
  movies: [],

  readMovies: () => {
    set((state) => ({
      movies: getMovies() ?? state.movies,
    }));
  },

  addMovie: (movie: Film) => {
    set((state) => ({
      movies: [...state.movies, movie],
    }));
    writeMovies(get().movies);
  },

  deleteMovie: (id: string) => {
    set((state) => ({
      movies: state.movies.filter((movie) => movie.id !== id),
    }));
    writeMovies(get().movies);
  },

  updateMovie: (movie: Film) => {
    set((state) => ({
      movies: state.movies.map((m) => (m.id === movie.id ? movie : m)),
    }));
    writeMovies(get().movies);
  },
}));

export const useMovie = createSelectors(_useMovie);

export const readMovies = _useMovie.getState().readMovies;

export const addMovie = (movie: Film) => _useMovie.getState().addMovie(movie);

export const deleteMovie = _useMovie.getState().deleteMovie;

export const updateMovie = (movie: Film) =>
  _useMovie.getState().updateMovie(movie);

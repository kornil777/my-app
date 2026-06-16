// store/features/trackSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllTracks, addLike, removeLike, getFavoriteTracks } from '@/lib/api';
import { TrackType } from '@/sharedTypes/types';
import { RootState } from '@/store/store';

// Состояние слайса
interface TracksState {
  playlist: TrackType[];           // текущий плейлист (главная страница или подборка)
  currentTrack: TrackType | null;
  currentTrackIndex: number;
  isPlaying: boolean;
  shuffle: boolean;
  loop: boolean;
  isLoading: boolean;              // загрузка основного плейлиста
  error: string | null;
  favoriteTracks: TrackType[];     // избранные треки
  isFavoriteLoading: boolean;      // загрузка избранного
  favoriteError: string | null;
}

const initialState: TracksState = {
  playlist: [],
  currentTrack: null,
  currentTrackIndex: -1,
  isPlaying: false,
  shuffle: false,
  loop: false,
  isLoading: false,
  error: null,
  favoriteTracks: [],
  isFavoriteLoading: false,
  favoriteError: null,
};

// === Асинхронные действия ===

// Загрузка всех треков для главной страницы
export const fetchTracks = createAsyncThunk(
  'tracks/fetchTracks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllTracks();
      // API может возвращать массив напрямую или в поле data
      return response.data || response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка загрузки треков');
    }
  }
);

// Загрузка избранных треков
export const fetchFavoriteTracks = createAsyncThunk(
  'tracks/fetchFavoriteTracks',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const accessToken = state.user.accessToken;
    if (!accessToken) {
      return rejectWithValue('Нет авторизации');
    }
    try {
      const tracks = await getFavoriteTracks(); // уже массив TrackType[]
      return tracks;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка загрузки избранного');
    }
  }
);

// Добавление лайка (используется в хуке, но можно и через thunk)
export const addLikeToTrack = createAsyncThunk(
  'tracks/addLike',
  async (trackId: number, { getState, rejectWithValue, dispatch }) => {
    const state = getState() as RootState;
    const accessToken = state.user.accessToken;
    if (!accessToken) return rejectWithValue('Нет авторизации');
    try {
      await addLike(trackId);
      // После успешного добавления нужно будет найти трек и добавить в favoriteTracks
      // Но лучше это делать через отдельный редьюсер, вызываемый из хука
      return trackId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Удаление лайка
export const removeLikeFromTrack = createAsyncThunk(
  'tracks/removeLike',
  async (trackId: number, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const accessToken = state.user.accessToken;
    if (!accessToken) return rejectWithValue('Нет авторизации');
    try {
      await removeLike(trackId);
      return trackId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Создание slice
const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setPlaylist: (state, action: PayloadAction<TrackType[]>) => {
      state.playlist = action.payload;
      // Если плейлист не пуст и нет текущего трека – устанавливаем первый трек (опционально)
      if (state.playlist.length > 0 && !state.currentTrack) {
        state.currentTrack = state.playlist[0];
        state.currentTrackIndex = 0;
      }
    },
    setCurrentTrack: (state, action: PayloadAction<TrackType>) => {
      // Ищем индекс в текущем плейлисте (если трек есть в плейлисте)
      const index = state.playlist.findIndex(t => t._id === action.payload._id);
      state.currentTrackIndex = index !== -1 ? index : -1;
      state.currentTrack = action.payload;
      state.isPlaying = true;
    },
    setCurrentTrackByIndex: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (state.playlist[index]) {
        state.currentTrackIndex = index;
        state.currentTrack = state.playlist[index];
        state.isPlaying = true;
      }
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setShuffle: (state, action: PayloadAction<boolean>) => {
      state.shuffle = action.payload;
    },
    setLoop: (state, action: PayloadAction<boolean>) => {
      state.loop = action.payload;
    },
    nextTrack: (state) => {
      if (state.playlist.length === 0) return;
      if (state.shuffle) {
        let nextIndex: number;
        do {
          nextIndex = Math.floor(Math.random() * state.playlist.length);
        } while (nextIndex === state.currentTrackIndex && state.playlist.length > 1);
        state.currentTrackIndex = nextIndex;
        state.currentTrack = state.playlist[nextIndex];
        state.isPlaying = true;
      } else {
        const nextIndex = state.currentTrackIndex + 1;
        if (nextIndex < state.playlist.length) {
          state.currentTrackIndex = nextIndex;
          state.currentTrack = state.playlist[nextIndex];
          state.isPlaying = true;
        } else {
          // последний трек – останавливаем
          state.isPlaying = false;
        }
      }
    },
    prevTrack: (state) => {
      if (state.playlist.length === 0) return;
      if (state.shuffle) {
        let prevIndex: number;
        do {
          prevIndex = Math.floor(Math.random() * state.playlist.length);
        } while (prevIndex === state.currentTrackIndex && state.playlist.length > 1);
        state.currentTrackIndex = prevIndex;
        state.currentTrack = state.playlist[prevIndex];
        state.isPlaying = true;
      } else {
        const prevIndex = state.currentTrackIndex - 1;
        if (prevIndex >= 0) {
          state.currentTrackIndex = prevIndex;
          state.currentTrack = state.playlist[prevIndex];
          state.isPlaying = true;
        }
      }
    },
    // Действия для избранных треков (синхронные, вызываются из хука)
    addLikedTracks: (state, action: PayloadAction<TrackType>) => {
      if (!state.favoriteTracks.some(t => t._id === action.payload._id)) {
        state.favoriteTracks.push(action.payload);
      }
    },
    removeLikedTracks: (state, action: PayloadAction<TrackType>) => {
      state.favoriteTracks = state.favoriteTracks.filter(t => t._id !== action.payload._id);
    },
    setFavoriteTracks: (state, action: PayloadAction<TrackType[]>) => {
      state.favoriteTracks = action.payload;
    },
    clearFavoriteTracks: (state) => {
      state.favoriteTracks = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Обработка fetchTracks
      .addCase(fetchTracks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTracks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.playlist = action.payload;
        // Если плейлист не пуст и нет текущего трека – устанавливаем первый трек
        if (state.playlist.length > 0 && !state.currentTrack) {
          state.currentTrack = state.playlist[0];
          state.currentTrackIndex = 0;
        }
      })
      .addCase(fetchTracks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Ошибка загрузки треков';
      })
      // Обработка fetchFavoriteTracks
      .addCase(fetchFavoriteTracks.pending, (state) => {
        state.isFavoriteLoading = true;
        state.favoriteError = null;
      })
      .addCase(fetchFavoriteTracks.fulfilled, (state, action) => {
        state.isFavoriteLoading = false;
        state.favoriteTracks = action.payload;
      })
      .addCase(fetchFavoriteTracks.rejected, (state, action) => {
        state.isFavoriteLoading = false;
        state.favoriteError = action.payload as string || 'Ошибка загрузки избранного';
      })
      // Обработка addLikeToTrack и removeLikeFromTrack (если используются)
      // Мы их не используем напрямую, но можно добавить для полноты
      .addCase(addLikeToTrack.fulfilled, (state, action) => {
        // Здесь не добавляем трек, потому что в хуке уже делаем dispatch(addLikedTracks)
        // Можно оставить пустым или добавить логику поиска трека по id
      })
      .addCase(removeLikeFromTrack.fulfilled, (state, action) => {
        // Аналогично
      });
  },
});

export const {
  setPlaylist,
  setCurrentTrack,
  setCurrentTrackByIndex,
  setIsPlaying,
  setShuffle,
  setLoop,
  nextTrack,
  prevTrack,
  addLikedTracks,
  removeLikedTracks,
  setFavoriteTracks,
  clearFavoriteTracks,
} = trackSlice.actions;

export const trackSliceReducer = trackSlice.reducer;
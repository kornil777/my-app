// store/features/trackSlice.ts
import { createSlice, createAsyncThunk, PayloadAction  } from '@reduxjs/toolkit';
import { getAllTracks } from '@/lib/api';
import { TrackType } from '@/sharedTypes/types';

interface TracksState {
  playlist: TrackType[];
  currentTrack: TrackType | null;
  currentTrackIndex: number;
  isPlaying: boolean;
  shuffle: boolean;
  loop: boolean;
  isLoading: boolean;
  error: string | null;
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
};

export const fetchTracks = createAsyncThunk('tracks/fetchTracks', async () => {
  const response = await getAllTracks();
  // API может возвращать массив треков в поле data или напрямую массив
  return response.data || response;
});

const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setPlaylist: (state, action) => {
      state.playlist = action.payload;
    },
    setCurrentTrack: (state, action: PayloadAction<TrackType>) => {
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTracks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTracks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.playlist = action.payload;
        // если плейлист не пуст и нет текущего трека, можно установить первый трек (по желанию)
        if (state.playlist.length > 0 && !state.currentTrack) {
          state.currentTrack = state.playlist[0];
          state.currentTrackIndex = 0;
        }
      })
      .addCase(fetchTracks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки треков';
      });
  },
});

export const { setPlaylist, setCurrentTrack, nextTrack, prevTrack, setIsPlaying, setShuffle, setLoop } = trackSlice.actions;
export const trackSliceReducer = trackSlice.reducer;
// store/features/trackSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrackType } from '@/sharedTypes/types';

interface TracksState {
  playlist: TrackType[];            // весь плейлист
  currentTrack: TrackType | null;   // текущий трек (дубль)
  currentTrackIndex: number;        // индекс текущего трека
  isPlaying: boolean;
  shuffle: boolean;                 // режим перемешивания
  loop: boolean;                    // зацикливание одного трека
}

const initialState: TracksState = {
  playlist: [],
  currentTrack: null,
  currentTrackIndex: -1,
  isPlaying: false,
  shuffle: false,
  loop: false,
};

const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setPlaylist: (state, action: PayloadAction<TrackType[]>) => {
      state.playlist = action.payload;
    },
    setCurrentTrack: (state, action: PayloadAction<TrackType>) => {
      const index = state.playlist.findIndex(t => t._id === action.payload._id);
      if (index !== -1) {
        state.currentTrackIndex = index;
        state.currentTrack = action.payload;
        state.isPlaying = true;
      }
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
} = trackSlice.actions;
export const trackSliceReducer = trackSlice.reducer;
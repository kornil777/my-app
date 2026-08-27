import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrackType } from '@/sharedTypes/types';

type InitialStateType = {
  currentTrack: TrackType | null;
  isPlaying: boolean;
};

const initialState: InitialStateType = {
  currentTrack: null,
  isPlaying: false,
};

const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<TrackType>) => {
      state.currentTrack = action.payload;
      state.isPlaying = true; // при клике на трек сразу запускаем
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    resetTrack: (state) => {
      state.currentTrack = null;
      state.isPlaying = false;
    },
  },
});

export const { setCurrentTrack, setIsPlaying, resetTrack } = trackSlice.actions;
export const trackSliceReducer = trackSlice.reducer;
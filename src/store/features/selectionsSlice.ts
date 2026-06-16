// store/features/selectionsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSelectionById, getTrackById, getSelections } from '@/lib/api';
import { TrackType } from '@/sharedTypes/types';

export interface Selection {
  _id: number;
  name: string;
  items: number[];
  owner: number[];
  __v: number;
}

interface SelectionsState {
  list: Selection[];
  isLoading: boolean;      // для списка подборок в сайдбаре
  error: string | null;
  currentSelection: {
    id: number | null;
    tracks: TrackType[];
    name: string;
    isLoading: boolean;
    error: string | null;
  };
}

const initialState: SelectionsState = {
  list: [],
  isLoading: false,
  error: null,
  currentSelection: {
    id: null,
    tracks: [],
    name: '',
    isLoading: false,
    error: null,
  },
};

// Загрузка всех подборок
export const fetchSelections = createAsyncThunk('selections/fetchAll', async () => {
  const selections = await getSelections();
  return selections;
});

// Загрузка одной подборки с треками
export const fetchSelectionById = createAsyncThunk(
  'selections/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const selectionData = await getSelectionById(id);
      if (!selectionData || !selectionData.items) {
        return rejectWithValue('Подборка не найдена или не содержит треков');
      }

      // Параллельная загрузка треков
      const trackPromises = selectionData.items.map((trackId: number) =>
  getTrackById(trackId)  // ← этот запрос возвращает полный объект трека
);
const tracks = await Promise.all(trackPromises);


// Не нужно дополнительно нормализовать, если getTrackById уже возвращает нужный формат
return {
  id: selectionData._id,
  name: selectionData.name,
  tracks, // ← здесь уже должны быть полные объекты с _id, name, author и т.д.
};
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка загрузки подборки');
    }
  }
);

const selectionsSlice = createSlice({
  name: 'selections',
  initialState,
  reducers: {
    clearCurrentSelection: (state) => {
      state.currentSelection = initialState.currentSelection;
    },
  },
  extraReducers: (builder) => {
    builder
      // Обработка списка подборок
      .addCase(fetchSelections.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSelections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchSelections.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки подборок';
      })
      // Обработка одной подборки
      .addCase(fetchSelectionById.pending, (state, action) => {
        state.currentSelection.id = action.meta.arg;
        state.currentSelection.isLoading = true;
        state.currentSelection.error = null;
      })
      .addCase(fetchSelectionById.fulfilled, (state, action) => {
        state.currentSelection.id = action.payload.id;
        state.currentSelection.name = action.payload.name;
        state.currentSelection.tracks = action.payload.tracks;
        state.currentSelection.isLoading = false;
      })
      .addCase(fetchSelectionById.rejected, (state, action) => {
        state.currentSelection.isLoading = false;
        state.currentSelection.error = action.payload as string;
        state.currentSelection.tracks = [];
      });
  },
});

export const { clearCurrentSelection } = selectionsSlice.actions;
export const selectionsSliceReducer = selectionsSlice.reducer;
// store/store.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { trackSliceReducer } from './features/trackSlice';
import { userSliceReducer } from './features/userSlice';
import { selectionsSliceReducer } from './features/selectionsSlice';

export const makeStore = () =>
  configureStore({
    reducer: combineReducers({
      tracks: trackSliceReducer,
      user: userSliceReducer,
      selections: selectionsSliceReducer,
    }),
  });

export const store = makeStore();   // ← создаём и экспортируем один экземпляр

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
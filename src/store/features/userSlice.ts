// store/features/userSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { login, signup, getTokens } from '@/lib/api';

interface User {
  email: string;
  username: string;
  _id: number;
}

interface UserState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  accessToken: typeof window !== 'undefined' ? localStorage.getItem('access') : null,
  refreshToken: typeof window !== 'undefined' ? localStorage.getItem('refresh') : null,
  isLoading: false,
  error: null,
};

// Асинхронные действия
export const signUpUser = createAsyncThunk(
  'user/signup',
  async ({ email, password, username }: { email: string; password: string; username: string }) => {
    const response = await signup(email, password, username);
    return response;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: { email: string; password: string }) => {
    const userData = await login(email, password);
    const tokens = await getTokens(email, password);
    return { user: userData, access: tokens.access, refresh: tokens.refresh };
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
    },
    setTokens: (state, action: PayloadAction<{ access: string; refresh: string }>) => {
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      localStorage.setItem('access', action.payload.access);
      localStorage.setItem('refresh', action.payload.refresh);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state) => {
        state.isLoading = false;
        // после регистрации пользователь не авторизован, токенов нет
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        localStorage.setItem('access', action.payload.access);
        localStorage.setItem('refresh', action.payload.refresh);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка входа';
      });
  },
});

export const { logout, setTokens } = userSlice.actions;
export const userSliceReducer = userSlice.reducer;
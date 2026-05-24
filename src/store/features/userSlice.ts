// store/features/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { login, signup, getTokens, refreshAccessToken } from '@/lib/api';

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

const loadUserFromStorage = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

const loadAccessToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access');
};

const loadRefreshToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh');
};

const initialState: UserState = {
  user: loadUserFromStorage(),
  accessToken: loadAccessToken(),
  refreshToken: loadRefreshToken(),
  isLoading: false,
  error: null,
};

export const signUpUser = createAsyncThunk(
  'user/signup',
  async ({ email, password, username }: { email: string; password: string; username: string }) => {
    await signup(email, password, username);
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
      localStorage.removeItem('user');
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
        localStorage.setItem('user', JSON.stringify(action.payload.user));
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
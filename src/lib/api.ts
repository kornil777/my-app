// src/lib/api.ts
import { store } from '@/store/store';
import { setTokens, logout } from '@/store/features/userSlice';
import { TrackType } from '@/sharedTypes/types';

const BASE_URL = 'https://webdev-music-003b5b991590.herokuapp.com';

// Переменные для предотвращения одновременного обновления токена
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Функция для добавления запроса в очередь
const subscribeToRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Функция для обработки всех ожидающих запросов после обновления токена
const onRefreshSuccess = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

// Базовый fetch с авторизацией и автоматическим обновлением токена
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  if (options.headers) {
    const userHeaders = options.headers as Record<string, string>;
    Object.entries(userHeaders).forEach(([key, value]) => headers.set(key, value));
  }

  const state = store.getState();
  const accessToken = state.user.accessToken;
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 && retry) {
    // Если уже идёт обновление – добавляем в очередь и ждём
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeToRefresh(async (newToken) => {
          // Повторяем исходный запрос с новым токеном
          const newHeaders = new Headers(headers);
          newHeaders.set('Authorization', `Bearer ${newToken}`);
          const retryResponse = await fetch(url, { ...options, headers: newHeaders });
          if (retryResponse.ok) {
            resolve(await retryResponse.json());
          } else {
            reject(await retryResponse.json());
          }
        });
      });
    }

    // Начинаем обновление токена
    isRefreshing = true;
    const refreshToken = state.user.refreshToken;

    if (!refreshToken) {
      // Нет refresh токена – разлогиниваем
      store.dispatch(logout());
      throw new Error('Нет refresh токена');
    }

    try {
      const refreshResponse = await fetch(`${BASE_URL}/user/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!refreshResponse.ok) {
        throw new Error('Не удалось обновить токен');
      }

      const { access } = await refreshResponse.json();
      // Сохраняем новый токен в Redux и localStorage
      store.dispatch(setTokens({ access, refresh: refreshToken }));
      // Оповещаем все ожидающие запросы
      onRefreshSuccess(access);

      // Повторяем исходный запрос с новым токеном (уже не retry)
      const newHeaders = new Headers(headers);
      newHeaders.set('Authorization', `Bearer ${access}`);
      const retryResponse = await fetch(url, { ...options, headers: newHeaders });
      if (!retryResponse.ok) {
        throw new Error('Повторный запрос не удался');
      }
      return await retryResponse.json();
    } catch (err) {
      store.dispatch(logout());
      throw err;
    } finally {
      isRefreshing = false;
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.detail || 'Ошибка запроса');
  }

  return response.json();
}

// === Пользователи ===
export const signup = (email: string, password: string, username: string) =>
  request<{ message: string; result: { username: string; email: string; _id: number }; success: boolean }>(
    '/user/signup/',
    { method: 'POST', body: JSON.stringify({ email, password, username }) }
  );

export const login = (email: string, password: string) =>
  request<{ email: string; username: string; _id: number }>('/user/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const getTokens = (email: string, password: string) =>
  request<{ access: string; refresh: string }>('/user/token/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const refreshAccessToken = (refresh: string) =>
  request<{ access: string }>('/user/token/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh }),
  });

// === Треки ===
export const getAllTracks = () => request<any>('/catalog/track/all/');
export const getTrackById = (id: number): Promise<TrackType> =>
  request<{ success: boolean; data: TrackType }>(`/catalog/track/${id}/`).then(res => res.data);

// === Подборки ===
export const getSelections = () => request<any>('/catalog/selection/all/').then(res => res.data);
export const getSelectionById = (id: number) =>
  request<{ success: boolean; data: { _id: number; name: string; items: number[]; owner: number[]; __v: number } | null }>(
    `/catalog/selection/${id}/`
  ).then(res => res.data);
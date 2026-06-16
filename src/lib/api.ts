// src/lib/api.ts
import { TrackType } from '@/sharedTypes/types';
const BASE_URL = 'https://webdev-music-003b5b991590.herokuapp.com';

// Получение access токена из localStorage
const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access');
  }
  return null;
};

// Базовый fetch с авторизацией
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  // Создаём объект Headers
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  // Копируем переданные заголовки
  if (options.headers) {
    const userHeaders = options.headers as Record<string, string>;
    Object.entries(userHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
  }

  // Добавляем токен, если он есть
  const token = getAccessToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  

  const response = await fetch(url, {
    ...options,
    headers,
  });

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



interface SelectionResponse {
  _id: number;
  name: string;
  items: number[];
  owner: number[];
  __v: number;
}

// Тип ответа списка подборок
interface SelectionsListResponse {
  success: boolean;
  data: SelectionResponse[];
}

// Получение одного трека по ID
export const getTrackById = (id: number): Promise<TrackType> =>
  request<{ success: boolean; data: TrackType }>(`/catalog/track/${id}/`)
    .then(res => res.data);

// Получение подборки по ID
export const getSelectionById = (id: number): Promise<SelectionResponse | null> =>
  request<{ success: boolean; data: SelectionResponse | null }>(`/catalog/selection/${id}/`)
    .then(res => res.data);

// Получение всех подборок (для сайдбара)
export const getSelections = (): Promise<SelectionResponse[]> =>
  request<SelectionsListResponse>('/catalog/selection/all/')
    .then(res => res.data);
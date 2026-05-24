// hooks/useLikeTrack.ts
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { addLikedTracks, removeLikedTracks } from '@/store/features/trackSlice';
import { TrackType } from '@/sharedTypes/types';
import { addLike, removeLike } from '@/lib/api';

export const useLikeTrack = (track: TrackType | null) => {
  const dispatch = useAppDispatch();
  const { favoriteTracks } = useAppSelector((state) => state.tracks);
  const { accessToken } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const isLike = track ? favoriteTracks.some((t) => t._id === track._id) : false;

  const toggleLike = async () => {
    if (!accessToken) {
      setErrorMsg('Нет авторизации');
      return;
    }
    if (!track) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      if (isLike) {
        await removeLike(track._id);
        dispatch(removeLikedTracks(track));
      } else {
        await addLike(track._id);
        dispatch(addLikedTracks(track));
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, errorMsg, toggleLike, isLike };
};
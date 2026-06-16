'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchFavoriteTracks } from '@/store/features/trackSlice';
import TrackList from '@/components/Centerblock/TrackList';
import styles from './page.module.css';

export default function PlaylistPage() {
  const dispatch = useAppDispatch();
  const { favoriteTracks, isLoading } = useAppSelector((state) => state.tracks);

  useEffect(() => {
    if (favoriteTracks.length === 0 && !isLoading) {
      dispatch(fetchFavoriteTracks());
    }
  }, [dispatch, favoriteTracks.length, isLoading]);

  if (isLoading) return <div className={styles.loader}>Загрузка...</div>;
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Мой плейлист</h1>
      {favoriteTracks.length === 0 ? (
        <p className={styles.empty}>У вас пока нет избранных треков</p>
      ) : (
        <TrackList tracks={favoriteTracks} />
      )}
    </div>
  );
}
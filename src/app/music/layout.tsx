// app/music/layout.tsx
'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchFavoriteTracks } from '@/store/features/trackSlice';
import Navigation from '@/components/Navigation/Navigation';
import Sidebar from '@/components/Sidebar/Sidebar';
import Bar from '@/components/Bar/Bar';
import styles from './layout.module.css';

export default function MusicLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.user);

  // При монтировании и при появлении accessToken загружаем избранные треки
  useEffect(() => {
    if (accessToken) {
      dispatch(fetchFavoriteTracks());
    }
  }, [accessToken, dispatch]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <Navigation />
          <div className={styles.content}>{children}</div>
          <Sidebar />
        </main>
        <Bar />
      </div>
    </div>
  );
}
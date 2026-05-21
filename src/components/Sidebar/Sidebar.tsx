// components/Sidebar/Sidebar.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchSelections } from '@/store/features/selectionsSlice';
import styles from './Sidebar.module.css';

// Функция для выбора картинки в зависимости от id подборки
const getCoverImage = (id: number): string => {
  switch (id) {
    case 2:
      return '/img/playlist01.png';
    case 3:
      return '/img/playlist02.png';
    case 4:
      return '/img/playlist03.png';
    default:
      return '/img/playlist01.png';
  }
};

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const { list: selections, isLoading, error } = useAppSelector((state) => state.selections);

  useEffect(() => {
    if (selections.length === 0 && !isLoading) {
      dispatch(fetchSelections());
    }
  }, [dispatch, selections.length, isLoading]);

  if (isLoading) return <div className={styles.sidebarBlock}>Загрузка...</div>;
  if (error) return <div className={styles.sidebarBlock}>Ошибка: {error}</div>;

  return (
    <div className={styles.mainSidebar}>
      <div className={styles.sidebarPersonal}>
        <p className={styles.sidebarPersonalName}>Sergey.Ivanov</p>
        <div className={styles.sidebarIcon}>
          <svg><use href="/img/icon/sprite.svg#logout" /></svg>
        </div>
      </div>
      <div className={styles.sidebarBlock}>
        <div className={styles.sidebarList}>
          {selections.map((selection) => (
            <div key={selection._id} className={styles.sidebarItem}>
              <Link href={`/music/selection/${selection._id}`} className={styles.sidebarLink}>
                <img
                  className={styles.sidebarImg}
                  src={getCoverImage(selection._id)}
                  alt={selection.name}
                  width={250}
                  height={170}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
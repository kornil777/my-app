// components/Sidebar/Sidebar.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchSelections } from '@/store/features/selectionsSlice';
import { logout } from '@/store/features/userSlice';
import { useClientOnly } from '@/hooks/useClientOnly';
import styles from './Sidebar.module.css';

const getCoverImage = (id: number): string => {
  switch (id) {
    case 2: return '/img/playlist01.png';
    case 3: return '/img/playlist02.png';
    case 4: return '/img/playlist03.png';
    default: return '/img/playlist01.png';
  }
};

export default function Sidebar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isClient = useClientOnly();
  const { list: selections, isLoading, error } = useAppSelector((state) => state.selections);
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (selections.length === 0 && !isLoading) {
      dispatch(fetchSelections());
    }
  }, [dispatch, selections.length, isLoading]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  if (!isClient) {
    // Сервер рендерит заглушку (пустую или скелетон), чтобы избежать расхождений
    return (
      <div className={styles.mainSidebar}>
        <div className={styles.sidebarPersonal}>
          <p className={styles.sidebarPersonalName}> </p>
          <div className={styles.sidebarIcon} />
        </div>
        <div className={styles.sidebarBlock}>
          <div className={styles.sidebarList}>Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mainSidebar}>
      <div className={styles.sidebarPersonal}>
        <p className={styles.sidebarPersonalName}>
          {user ? user.username : 'Аноним'}
        </p>
        <div className={styles.sidebarIcon} onClick={handleLogout}>
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
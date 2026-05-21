'use client';

import Navigation from '@/components/Navigation/Navigation';
import Sidebar from '@/components/Sidebar/Sidebar';
import Bar from '@/components/Bar/Bar';
import styles from './layout.module.css';

export default function MusicLayout({ children }: { children: React.ReactNode }) {
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
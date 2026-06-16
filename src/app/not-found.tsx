// app/music/not-found.tsx
'use client';

import Link from 'next/link';
import styles from './not-found.module.css';

export default function MusicNotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Страница не найдена</h2>
        <p className={styles.description}>
          Возможно, она была удалена или перенесена на другой адрес
        </p>
        <Link href="/music/main" className={styles.button}>
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
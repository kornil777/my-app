'use client';

import { useParams } from 'next/navigation';
import styles from './page.module.css'; // можно создать пустой модуль

export default function CategoryPage() {
  const { id } = useParams();
  return (
    <div className={styles.container}>
      <h1>Категория: {id}</h1>
      {/* Здесь будет фильтрация треков по жанру/категории */}
    </div>
  );
}
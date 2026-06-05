// components/Skeleton/Skeleton.tsx
import styles from './Skeleton.module.css';

interface SkeletonProps {
  variant?: 'track-row' | 'sidebar-image' | 'text-line' | 'title';
  count?: number;
}

export default function Skeleton({ variant = 'track-row', count = 1 }: SkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <>
      {items.map((i) => (
        <div key={i} className={`${styles.skeleton} ${styles[variant]}`}>
          <div className={styles.pulse}></div>
        </div>
      ))}
    </>
  );
}
import Link from 'next/link';
import styles from './TrackItem.module.css';

interface TrackItemProps {
  title: string;
  author: string;
  album: string;
  duration: string;
  subtitle?: string;
}

export default function TrackItem({ title, author, album, duration, subtitle }: TrackItemProps) {
  return (
    <div className={styles.playlistItem}>
      <div className={styles.playlistTrack}>
        <div className={styles.trackTitle}>
          <div className={styles.trackTitleImage}>
            <svg className={styles.trackTitleSvg}>
              <use href="/img/icon/sprite.svg#icon-note" />
            </svg>
          </div>
          <div>
            <Link href="#" className={styles.trackTitleLink}>
              {title}{' '}
              {subtitle && <span className={styles.trackTitleSpan}>{subtitle}</span>}
            </Link>
          </div>
        </div>
        <div className={styles.trackAuthor}>
          <Link href="#" className={styles.trackAuthorLink}>
            {author}
          </Link>
        </div>
        <div className={styles.trackAlbum}>
          <Link href="#" className={styles.trackAlbumLink}>
            {album}
          </Link>
        </div>
        <div className={styles.trackTime}>
          <svg className={styles.trackTimeSvg}>
            <use href="/img/icon/sprite.svg#icon-like" />
          </svg>
          <span className={styles.trackTimeText}>{duration}</span>
        </div>
      </div>
    </div>
  );
}
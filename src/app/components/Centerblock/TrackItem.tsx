import Link from 'next/link';
import styles from './TrackItem.module.css';

interface TrackItemProps {
  name: string;
  author: string;
  album: string;
  duration_in_seconds: number;
  _id: number;
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function TrackItem({ name, author, album, duration_in_seconds, _id }: TrackItemProps) {
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
              {name}
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
          <span className={styles.trackTimeText}>{formatDuration(duration_in_seconds)}</span>
        </div>
      </div>
    </div>
  );
}
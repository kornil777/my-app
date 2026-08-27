'use client';

import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setCurrentTrack } from '@/store/features/trackSlice';
import { TrackType } from '@/sharedTypes/types';          
import styles from './TrackItem.module.css';


interface TrackItemProps extends TrackType {}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function TrackItem(track: TrackItemProps) {
  const dispatch = useAppDispatch();
  const { currentTrack, isPlaying } = useAppSelector((state) => state.tracks);
  const isActive = currentTrack?._id === track._id && isPlaying;

  const handleClick = () => {
  dispatch(setCurrentTrack(track)); 
};

  return (
    <div className={`${styles.playlistItem} ${isActive ? styles.activeTrack : ''}`} onClick={handleClick}>
      <div className={styles.playlistTrack}>
        <div className={styles.trackTitle}>
          <div className={styles.trackTitleImage}>
            {isActive ? (
              <div className={styles.pulseDot}></div>
            ) : (
              <svg className={styles.trackTitleSvg}>
                <use href="/img/icon/sprite.svg#icon-note" />
              </svg>
            )}
          </div>
          <div>
            <Link href="#" className={styles.trackTitleLink}>
              {track.name}
            </Link>
          </div>
        </div>
        <div className={styles.trackAuthor}>
          <Link href="#" className={styles.trackAuthorLink}>
            {track.author}
          </Link>
        </div>
        <div className={styles.trackAlbum}>
          <Link href="#" className={styles.trackAlbumLink}>
            {track.album}
          </Link>
        </div>
        <div className={styles.trackTime}>
          <svg className={styles.trackTimeSvg}>
            <use href="/img/icon/sprite.svg#icon-like" />
          </svg>
          <span className={styles.trackTimeText}>{formatDuration(track.duration_in_seconds)}</span>
        </div>
      </div>
    </div>
  );
}
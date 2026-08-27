// TrackList.tsx
import TrackItem from './TrackItem';
import styles from './TrackList.module.css';
import { TrackType } from '@/sharedTypes/types';

export default function TrackList({ tracks }: { tracks: TrackType[] }) {
  return (
    <div className={styles.contentPlaylist}>
      {tracks.map((track) => (
        <TrackItem key={track._id} {...track} />
      ))}
    </div>
  );
}
import TrackItem from './TrackItem';
import styles from './TrackList.module.css';

interface Track {
  _id: number;
  name: string;
  author: string;
  album: string;
  duration_in_seconds: number;
}

interface TrackListProps {
  tracks: Track[];
}

export default function TrackList({ tracks }: TrackListProps) {
  if (tracks.length === 0) {
    return <div className={styles.noTracks}>Треки не найдены</div>;
  }

  return (
    <div className={styles.contentPlaylist}>
      {tracks.map((track) => (
        <TrackItem key={track._id} {...track} />
      ))}
    </div>
  );
}
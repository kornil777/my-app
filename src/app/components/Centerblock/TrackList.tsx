import TrackItem from './TrackItem';
import styles from './TrackList.module.css';

interface Track {
  title: string;
  author: string;
  album: string;
  duration: string;
  subtitle?: string;
}

interface TrackListProps {
  tracks: Track[];
}

export default function TrackList({ tracks }: TrackListProps) {
  return (
    <div className={styles.contentPlaylist}>
      {tracks.map((track, idx) => (
        <TrackItem key={idx} {...track} />
      ))}
    </div>
  );
}
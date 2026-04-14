import Link from 'next/link';
import styles from './Centerblock.module.css';

const tracks = [
  {
    title: 'Guilt',
    author: 'Nero',
    album: 'Welcome Reality',
    duration: '4:44',
  },
  {
    title: 'Elektro',
    author: 'Dynoro, Outwork, Mr. Gee',
    album: 'Elektro',
    duration: '2:22',
  },
  {
    title: 'I’m Fire',
    author: 'Ali Bakgor',
    album: 'I’m Fire',
    duration: '2:22',
  },
  {
    title: 'Non Stop',
    author: 'Стоункат, Psychopath',
    album: 'Non Stop',
    duration: '4:12',
    subtitle: '(Remix)',
  },
  {
    title: 'Run Run',
    author: 'Jaded, Will Clarke, AR/CO',
    album: 'Run Run',
    duration: '2:54',
    subtitle: '(feat. AR/CO)',
  },
];

export default function Centerblock() {
  return (
    <div className={styles.centerblock}>
      <div className={styles.centerblockSearch}>
        <svg className={styles.searchSvg}>
          <use href="/img/icon/sprite.svg#icon-search" />
        </svg>
        <input
          className={styles.searchText}
          type="search"
          placeholder="Поиск"
          name="search"
        />
      </div>
      <h2 className={styles.centerblockH2}>Треки</h2>
      <div className={styles.centerblockFilter}>
        <div className={styles.filterTitle}>Искать по:</div>
        <div className={styles.filterButton}>исполнителю</div>
        <div className={styles.filterButton}>году выпуска</div>
        <div className={styles.filterButton}>жанру</div>
      </div>
      <div className={styles.centerblockContent}>
        <div className={styles.contentTitle}>
          <div className={`${styles.playlistTitleCol} ${styles.col01}`}>Трек</div>
          <div className={`${styles.playlistTitleCol} ${styles.col02}`}>Исполнитель</div>
          <div className={`${styles.playlistTitleCol} ${styles.col03}`}>Альбом</div>
          <div className={`${styles.playlistTitleCol} ${styles.col04}`}>
            <svg className={styles.playlistTitleSvg}>
              <use href="/img/icon/sprite.svg#icon-watch" />
            </svg>
          </div>
        </div>
        <div className={styles.contentPlaylist}>
          {tracks.map((track, idx) => (
            <div key={idx} className={styles.playlistItem}>
              <div className={styles.playlistTrack}>
                <div className={styles.trackTitle}>
                  <div className={styles.trackTitleImage}>
                    <svg className={styles.trackTitleSvg}>
                      <use href="/img/icon/sprite.svg#icon-note" />
                    </svg>
                  </div>
                  <div>
                    <Link href="#" className={styles.trackTitleLink}>
                      {track.title}{' '}
                      {track.subtitle && (
                        <span className={styles.trackTitleSpan}>{track.subtitle}</span>
                      )}
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
                  <span className={styles.trackTimeText}>{track.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
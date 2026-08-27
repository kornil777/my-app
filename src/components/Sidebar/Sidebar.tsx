import Link from 'next/link';
import styles from './Sidebar.module.css';

const playlists = [
  { img: '/img/playlist01.png', alt: "day's playlist" },
  { img: '/img/playlist02.png', alt: "day's playlist" },
  { img: '/img/playlist03.png', alt: "day's playlist" },
];

export default function Sidebar() {
  return (
    <div className={styles.mainSidebar}>
      <div className={styles.sidebarPersonal}>
        <p className={styles.sidebarPersonalName}>Sergey.Ivanov</p>
        <div className={styles.sidebarIcon}>
          <svg>
            <use href="/img/icon/sprite.svg#logout" />
          </svg>
        </div>
      </div>
      <div className={styles.sidebarBlock}>
        <div className={styles.sidebarList}>
          {playlists.map((playlist, idx) => (
            <div key={idx} className={styles.sidebarItem}>
              <Link href="#" className={styles.sidebarLink}>
                <img
                  className={styles.sidebarImg}
                  src={playlist.img}
                  alt={playlist.alt}
                  width={250}
                  height={170}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
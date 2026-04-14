import Link from 'next/link';
import styles from './Bar.module.css';

export default function Bar() {
  return (
    <div className={styles.bar}>
      <div className={styles.barContent}>
        <div className={styles.barPlayerProgress}></div>
        <div className={styles.barPlayerBlock}>
          <div className={styles.barPlayer}>
            <div className={styles.playerControls}>
              <div className={styles.playerBtnPrev}>
                <svg className={styles.playerBtnPrevSvg}>
                  <use href="/img/icon/sprite.svg#icon-prev" />
                </svg>
              </div>
              <div className={`${styles.playerBtnPlay} btn`}>
                <svg className={styles.playerBtnPlaySvg}>
                  <use href="/img/icon/sprite.svg#icon-play" />
                </svg>
              </div>
              <div className={styles.playerBtnNext}>
                <svg className={styles.playerBtnNextSvg}>
                  <use href="/img/icon/sprite.svg#icon-next" />
                </svg>
              </div>
              <div className={`${styles.playerBtnRepeat} btnIcon`}>
                <svg className={styles.playerBtnRepeatSvg}>
                  <use href="/img/icon/sprite.svg#icon-repeat" />
                </svg>
              </div>
              <div className={`${styles.playerBtnShuffle} btnIcon`}>
                <svg className={styles.playerBtnShuffleSvg}>
                  <use href="/img/icon/sprite.svg#icon-shuffle" />
                </svg>
              </div>
            </div>

            <div className={styles.playerTrackPlay}>
              <div className={styles.trackPlayContain}>
                <div className={styles.trackPlayImage}>
                  <svg className={styles.trackPlaySvg}>
                    <use href="/img/icon/sprite.svg#icon-note" />
                  </svg>
                </div>
                <div className={styles.trackPlayAuthor}>
                  <Link href="#" className={styles.trackPlayAuthorLink}>
                    Ты та...
                  </Link>
                </div>
                <div className={styles.trackPlayAlbum}>
                  <Link href="#" className={styles.trackPlayAlbumLink}>
                    Баста
                  </Link>
                </div>
              </div>

              <div className={styles.trackPlayDislike}>
                <div className="btnIcon">
                  <svg className={styles.trackPlayLikeSvg}>
                    <use href="/img/icon/sprite.svg#icon-like" />
                  </svg>
                </div>
                <div className="btnIcon">
                  <svg className={styles.trackPlayDislikeSvg}>
                    <use href="/img/icon/sprite.svg#icon-dislike" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.barVolumeBlock}>
            <div className={styles.volumeContent}>
              <div className={styles.volumeImage}>
                <svg className={styles.volumeSvg}>
                  <use href="/img/icon/sprite.svg#icon-volume" />
                </svg>
              </div>
              <div className={`${styles.volumeProgress} btn`}>
                <input
                  className={styles.volumeProgressLine}
                  type="range"
                  name="range"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
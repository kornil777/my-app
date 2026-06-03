'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setIsPlaying, nextTrack, prevTrack, setShuffle, setLoop } from '@/store/features/trackSlice';
import { useLikeTrack } from '@/hooks/useLikeTrack';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import styles from './Bar.module.css';

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function Bar() {
  const dispatch = useAppDispatch();
  const { currentTrack, isPlaying, shuffle, loop, playlist } = useAppSelector(
    (state) => state.tracks
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);

  const { isLike, toggleLike, isLoading: isLikeLoading } = useLikeTrack(currentTrack);

  // Загрузка трека при смене currentTrack
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    let isMounted = true;
    audio.pause();
    audio.src = currentTrack.track_file;
    audio.load();
    audio.volume = volume;

    if (isPlaying && isMounted) {
      audio.play().catch((err) => {
        if (err.name !== 'AbortError') console.error('Play error:', err);
      });
    }

    return () => {
      isMounted = false;
      audio.pause();
    };
  }, [currentTrack]);

  // Синхронизация play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    let isMounted = true;

    const handlePlay = async () => {
      if (isPlaying && isMounted) {
        try {
          await audio.play();
        } catch (err: any) {
          if (err.name !== 'AbortError') {
            console.error('Play error:', err);
          }
        }
      } else if (!isPlaying && isMounted) {
        audio.pause();
      }
    };

    handlePlay();

    return () => {
      isMounted = false;
      audio.pause();
    };
  }, [isPlaying, currentTrack]);

  // Синхронизация громкости
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Обработчики событий аудио
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (loop) {
        audioRef.current!.currentTime = 0;
        audioRef.current!.play();
      } else {
        dispatch(nextTrack());
      }
    };
    const handlePlay = () => {
      if (!isPlaying) dispatch(setIsPlaying(true));
    };
    const handlePause = () => {
      if (isPlaying) dispatch(setIsPlaying(false));
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [dispatch, loop, playlist.length, isPlaying]);

  const handleNext = () => dispatch(nextTrack());
  const handlePrev = () => dispatch(prevTrack());
  const togglePlay = () => dispatch(setIsPlaying(!isPlaying));
  const toggleShuffle = () => dispatch(setShuffle(!shuffle));
  const toggleLoop = () => dispatch(setLoop(!loop));

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) audioRef.current.currentTime = newTime;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentTrack) toggleLike();
  };

  // Скелетон, если нет текущего трека
  if (!currentTrack) {
    return (
      <div className={styles.bar}>
        <div className={styles.barContent}>
          <div className={styles.barPlayerProgress}></div>
          <div className={styles.barPlayerBlock}>
            <div className={styles.skeletonTrack}>
              <div className={styles.skeletonCover}></div>
              <div className={styles.skeletonInfo}>
                <div className={styles.skeletonLine}></div>
                <div className={styles.skeletonLineSmall}></div>
              </div>
            </div>
            <div className={styles.barVolumeBlock}>
              <div className={styles.volumeContent}>
                <div className={styles.volumeImage}>
                  <svg className={styles.volumeSvg}>
                    <use href="/img/icon/sprite.svg#icon-volume" />
                  </svg>
                </div>
                <div className={styles.volumeProgress}>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className={styles.volumeProgressLine}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <audio ref={audioRef} />
      </div>
    );
  }

  return (
    <div className={styles.bar}>
      <div className={styles.barContent}>
        <ProgressBar
          max={duration || 0}
          value={currentTime}
          step={0.01}
          onChange={handleProgressChange}
          readOnly={false}
        />
        <div className={styles.barPlayerBlock}>
          <div className={styles.barPlayer}>
            <div className={styles.playerControls}>
              <div className={styles.playerBtnPrev} onClick={handlePrev}>
                <svg className={styles.playerBtnPrevSvg}>
                  <use href="/img/icon/sprite.svg#icon-prev" />
                </svg>
              </div>
              <div className={`${styles.playerBtnPlay} btn`} onClick={togglePlay}>
                {isPlaying ? (
                  <svg className={styles.playerBtnPlaySvg}>
                    <use href="/img/icon/sprite.svg#icon-pause" />
                  </svg>
                ) : (
                  <svg className={styles.playerBtnPlaySvg}>
                    <use href="/img/icon/sprite.svg#icon-play" />
                  </svg>
                )}
              </div>
              <div className={styles.playerBtnNext} onClick={handleNext}>
                <svg className={styles.playerBtnNextSvg}>
                  <use href="/img/icon/sprite.svg#icon-next" />
                </svg>
              </div>
              <div
                className={`${styles.playerBtnRepeat} btnIcon ${loop ? styles.active : ''}`}
                onClick={toggleLoop}
              >
                <svg className={styles.playerBtnRepeatSvg}>
                  <use href="/img/icon/sprite.svg#icon-repeat" />
                </svg>
              </div>
              <div
                className={`${styles.playerBtnShuffle} btnIcon ${shuffle ? styles.active : ''}`}
                onClick={toggleShuffle}
              >
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
                    {currentTrack.name}
                  </Link>
                </div>
                <div className={styles.trackPlayAlbum}>
                  <Link href="#" className={styles.trackPlayAlbumLink}>
                    {currentTrack.author}
                  </Link>
                </div>
              </div>

              <div className={styles.trackPlayLikeDis}>
                <div
                  className={`${styles.trackPlayLike} btnIcon ${isLike ? styles.liked : ''}`}
                  onClick={handleLikeClick}
                >
                  <svg className={styles.trackPlayLikeSvg}>
                    <use href="/img/icon/sprite.svg#icon-like" />
                  </svg>
                </div>
                <div
                  className={`${styles.trackPlayDislike} btnIcon`}
                  onClick={handleLikeClick}
                >
                  <svg className={styles.trackPlayDislikeSvg}>
                    <use href="/img/icon/sprite.svg#icon-dislike" />
                  </svg>
                </div>
              </div>
            </div>

            <div className={styles.barTime}>
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className={styles.barVolumeBlock}>
            <div className={styles.volumeContent}>
              <div className={styles.volumeImage}>
                <svg className={styles.volumeSvg}>
                  <use href="/img/icon/sprite.svg#icon-volume" />
                </svg>
              </div>
              <div className={styles.volumeProgress}>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className={styles.volumeProgressLine}
                />
              </div>
            </div>
          </div>
        </div>
        <audio ref={audioRef} />
      </div>
    </div>
  );
}
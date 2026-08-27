'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setIsPlaying } from '@/store/features/trackSlice';
import styles from './Bar.module.css';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function Bar() {
  const dispatch = useAppDispatch();
  const { currentTrack, isPlaying } = useAppSelector((state) => state.tracks);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);

  // Загрузка нового трека (сброс и остановка)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const wasPlaying = isPlaying;
    // Останавливаем текущее воспроизведение и сбрасываем время
    audio.pause();
    audio.currentTime = 0;
    audio.src = currentTrack.track_file;
    audio.load();

    // Если до смены трека было воспроизведение – запускаем новый
    if (wasPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          if (error.name !== 'AbortError') console.error(error);
        });
      }
    }
  }, [currentTrack]); 


  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          if (error.name !== 'AbortError') console.error(error);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

 
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      dispatch(setIsPlaying(false));
      setCurrentTime(0);
    };
    
    const handlePlay = () => { if (!isPlaying) dispatch(setIsPlaying(true)); };
    const handlePause = () => { if (isPlaying) dispatch(setIsPlaying(false)); };

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
  }, [dispatch, isPlaying]);

  const togglePlay = () => {
    dispatch(setIsPlaying(!isPlaying));
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) audioRef.current.currentTime = newTime;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
  };

  if (!currentTrack) {
    return <div className={styles.bar}></div>;
  }

  return (
    <div className={styles.bar}>
      <div className={styles.barContent}>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleProgressChange}
          className={styles.barPlayerProgress}
        />
        <div className={styles.barPlayerBlock}>
          <div className={styles.barPlayer}>
            <div className={styles.playerControls}>
              <div className={styles.playerBtnPrev}>
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
                    {currentTrack.name}
                  </Link>
                </div>
                <div className={styles.trackPlayAlbum}>
                  <Link href="#" className={styles.trackPlayAlbumLink}>
                    {currentTrack.author}
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
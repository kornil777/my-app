'use client';

import { useState, useEffect } from 'react';
import { data } from '@/app/data' // путь к вашему data.ts
import TrackList from './TrackList';
import styles from './Centerblock.module.css';

interface Track {
  _id: number;
  name: string;
  author: string;
  release_date: string;
  genre: string[];
  duration_in_seconds: number;
  album: string;
  logo: string | null;
  track_file: string;
  stared_user: string[];
}

// Получаем уникальных авторов
const getUniqueAuthors = (tracks: Track[]) => {
  const authors = tracks.map(track => track.author);
  return [...new Set(authors)];
};

// Получаем уникальные жанры
const getUniqueGenres = (tracks: Track[]) => {
  const genres = tracks.flatMap(track => track.genre);
  return [...new Set(genres)];
};

// Фильтрация треков по автору и жанру
const filterTracks = (tracks: Track[], selectedAuthor: string | null, selectedGenre: string | null) => {
  return tracks.filter(track => {
    if (selectedAuthor && track.author !== selectedAuthor) return false;
    if (selectedGenre && !track.genre.includes(selectedGenre)) return false;
    return true;
  });
};

// Сортировка по году (release_date)
const sortTracksByYear = (tracks: Track[], sortOrder: 'default' | 'newest' | 'oldest') => {
  if (sortOrder === 'default') return tracks;
  const sorted = [...tracks].sort((a, b) => {
    const dateA = new Date(a.release_date).getTime();
    const dateB = new Date(b.release_date).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });
  return sorted;
};

export default function Centerblock() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const [openFilter, setOpenFilter] = useState<'author' | 'year' | 'genre' | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'default' | 'newest' | 'oldest'>('default');

  useEffect(() => {
    // Загружаем данные из моков
    setTracks(data as Track[]);
  }, []);

  useEffect(() => {
    let result = [...tracks];
    result = filterTracks(result, selectedAuthor, selectedGenre);
    result = sortTracksByYear(result, sortOrder);
    setFilteredTracks(result);
  }, [tracks, selectedAuthor, selectedGenre, sortOrder]);

  const toggleFilter = (filter: 'author' | 'year' | 'genre') => {
    setOpenFilter(openFilter === filter ? null : filter);
  };

  const handleSelectAuthor = (author: string) => {
    setSelectedAuthor(selectedAuthor === author ? null : author);
    setOpenFilter(null);
  };

  const handleSelectGenre = (genre: string) => {
    setSelectedGenre(selectedGenre === genre ? null : genre);
    setOpenFilter(null);
  };

  const handleSelectSort = (order: 'newest' | 'oldest') => {
    setSortOrder(order);
    setOpenFilter(null);
  };

  const resetFilters = () => {
    setSelectedAuthor(null);
    setSelectedGenre(null);
    setSortOrder('default');
  };

  const uniqueAuthors = getUniqueAuthors(tracks);
  const uniqueGenres = getUniqueGenres(tracks);

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
        <div className={styles.filterWrapper}>
          <button
            className={`${styles.filterButton} ${selectedAuthor ? styles.filterButtonActive : ''}`}
            onClick={() => toggleFilter('author')}
          >
            исполнителю
          </button>
          {openFilter === 'author' && (
            <div className={styles.dropdown}>
              {uniqueAuthors.map(author => (
                <div
                  key={author}
                  className={`${styles.dropdownItem} ${selectedAuthor === author ? styles.active : ''}`}
                  onClick={() => handleSelectAuthor(author)}
                >
                  {author}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.filterWrapper}>
          <button
            className={`${styles.filterButton} ${sortOrder !== 'default' ? styles.filterButtonActive : ''}`}
            onClick={() => toggleFilter('year')}
          >
            году выпуска
          </button>
          {openFilter === 'year' && (
            <div className={styles.dropdown}>
              <div
                className={`${styles.dropdownItem} ${sortOrder === 'newest' ? styles.active : ''}`}
                onClick={() => handleSelectSort('newest')}
              >
                Сначала новые
              </div>
              <div
                className={`${styles.dropdownItem} ${sortOrder === 'oldest' ? styles.active : ''}`}
                onClick={() => handleSelectSort('oldest')}
              >
                Сначала старые
              </div>
            </div>
          )}
        </div>

        <div className={styles.filterWrapper}>
          <button
            className={`${styles.filterButton} ${selectedGenre ? styles.filterButtonActive : ''}`}
            onClick={() => toggleFilter('genre')}
          >
            жанру
          </button>
          {openFilter === 'genre' && (
            <div className={styles.dropdown}>
              {uniqueGenres.map(genre => (
                <div
                  key={genre}
                  className={`${styles.dropdownItem} ${selectedGenre === genre ? styles.active : ''}`}
                  onClick={() => handleSelectGenre(genre)}
                >
                  {genre}
                </div>
              ))}
            </div>
          )}
        </div>

        {(selectedAuthor || selectedGenre || sortOrder !== 'default') && (
          <button className={styles.resetButton} onClick={resetFilters}>
            Сбросить фильтры
          </button>
        )}
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
        <TrackList tracks={filteredTracks} />
      </div>
    </div>
  );
}
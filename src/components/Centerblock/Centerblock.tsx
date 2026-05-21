'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setPlaylist } from '@/store/features/trackSlice';
import { TrackType } from '@/sharedTypes/types';
import { data } from '@/app/data';
import TrackList from './TrackList';
import styles from './Centerblock.module.css';
import { fetchTracks } from '@/store/features/trackSlice';
import TrackItem from './TrackItem';



// Функции для получения уникальных значений
const getUniqueAuthors = (tracks: TrackType[]) => {
  const authors = tracks.map((track) => track.author);
  return [...new Set(authors)];
};

const getUniqueGenres = (tracks: TrackType[]) => {
  const genres = tracks.flatMap((track) => track.genre);
  return [...new Set(genres)];
};

// Фильтрация треков
const filterTracks = (
  tracks: TrackType[],
  selectedAuthor: string | null,
  selectedGenre: string | null,
  searchQuery: string
) => {
  return tracks.filter((track) => {
    if (selectedAuthor && track.author !== selectedAuthor) return false;
    if (selectedGenre && !track.genre.includes(selectedGenre)) return false;
    if (
      searchQuery &&
      !track.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !track.author.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });
};

// Сортировка по году выпуска
const sortTracksByYear = (
  tracks: TrackType[],
  sortOrder: 'default' | 'newest' | 'oldest'
) => {
  if (sortOrder === 'default') return tracks;
  const sorted = [...tracks].sort((a, b) => {
    const dateA = new Date(a.release_date).getTime();
    const dateB = new Date(b.release_date).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });
  return sorted;
};

export default function Centerblock() {
  const dispatch = useAppDispatch();
  const { playlist, isLoading, error } = useAppSelector((state) => state.tracks);

  const [filteredTracks, setFilteredTracks] = useState<TrackType[]>([]);
  const [openFilter, setOpenFilter] = useState<'author' | 'year' | 'genre' | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'default' | 'newest' | 'oldest'>('default');
  const [searchQuery, setSearchQuery] = useState('');

   useEffect(() => {
    if (playlist.length === 0 && !isLoading) {
      dispatch(fetchTracks());
    }
  }, [dispatch, playlist.length, isLoading]);

  // Применяем фильтры и сортировку при изменении зависимостей
  useEffect(() => {
    let result = [...playlist];
    result = filterTracks(result, selectedAuthor, selectedGenre, searchQuery);
    result = sortTracksByYear(result, sortOrder);
    setFilteredTracks(result);
  }, [playlist, selectedAuthor, selectedGenre, sortOrder, searchQuery]);

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
    setSearchQuery('');
  };

  const uniqueAuthors = getUniqueAuthors(playlist);
  const uniqueGenres = getUniqueGenres(playlist);
    if (isLoading) return <div className={styles.loader}>Загрузка треков...</div>;
  if (error) return <div className={styles.error}>Ошибка: {error}</div>;

  return (
   <div className={styles.centerblock}>
      {/* Поиск */}
      <div className={styles.centerblockSearch}>
        <svg className={styles.searchSvg}>
          <use href="/img/icon/sprite.svg#icon-search" />
        </svg>
        <input
          className={styles.searchText}
          type="search"
          placeholder="Поиск"
          name="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <h2 className={styles.centerblockH2}>Треки</h2>

      {/* Фильтры */}
      <div className={styles.centerblockFilter}>
        <div className={styles.filterTitle}>Искать по:</div>

        {/* Фильтр по исполнителю */}
        <div className={styles.filterWrapper}>
          <button
            className={`${styles.filterButton} ${selectedAuthor ? styles.filterButtonActive : ''}`}
            onClick={() => toggleFilter('author')}
          >
            исполнителю
          </button>
          {openFilter === 'author' && (
            <div className={styles.dropdown}>
              {uniqueAuthors.map((author) => (
                <div
                  key={author}
                  className={`${styles.dropdownItem} ${
                    selectedAuthor === author ? styles.active : ''
                  }`}
                  onClick={() => handleSelectAuthor(author)}
                >
                  {author}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Фильтр по году выпуска */}
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

        {/* Фильтр по жанру */}
        <div className={styles.filterWrapper}>
          <button
            className={`${styles.filterButton} ${selectedGenre ? styles.filterButtonActive : ''}`}
            onClick={() => toggleFilter('genre')}
          >
            жанру
          </button>
          {openFilter === 'genre' && (
            <div className={styles.dropdown}>
              {uniqueGenres.map((genre) => (
                <div
                  key={genre}
                  className={`${styles.dropdownItem} ${
                    selectedGenre === genre ? styles.active : ''
                  }`}
                  onClick={() => handleSelectGenre(genre)}
                >
                  {genre}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Кнопка сброса */}
        {(selectedAuthor || selectedGenre || sortOrder !== 'default' || searchQuery) && (
          <button className={styles.resetButton} onClick={resetFilters}>
            Сбросить фильтры
          </button>
        )}
      </div>

      {/* Заголовки колонок */}
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

        {/* Список треков */}
        <TrackList tracks={filteredTracks} />
      </div>
    </div>
  );
}
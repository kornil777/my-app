// app/music/selection/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchSelectionById } from '@/store/features/selectionsSlice';
import TrackList from '@/components/Centerblock/TrackList';
import styles from './page.module.css';
import { setPlaylist } from '@/store/features/trackSlice';

export default function SelectionPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { currentSelection } = useAppSelector((state) => state.selections);
  const { tracks, name, isLoading, error, id: loadedId } = currentSelection;

  // --- Локальные состояния для фильтрации ---
  const [filteredTracks, setFilteredTracks] = useState(tracks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'default' | 'newest' | 'oldest'>('default');
  const [openFilter, setOpenFilter] = useState<'author' | 'year' | 'genre' | null>(null);

  const selectionId = id ? parseInt(id as string, 10) : null;

  // Загрузка подборки
  useEffect(() => {
    if (selectionId && loadedId !== selectionId) {
      dispatch(fetchSelectionById(selectionId));
    }
  }, [selectionId, loadedId, dispatch]);
  useEffect(() => {
    if (tracks.length) {
      dispatch(setPlaylist(tracks));
    }
  }, [tracks, dispatch]);

  // Применение фильтров и сортировки при изменении зависимостей
  useEffect(() => {
    let result = [...tracks];
    

    // Фильтр по поиску
    if (searchQuery) {
      result = result.filter(
        (track) =>
          track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Фильтр по автору
    if (selectedAuthor) {
      result = result.filter((track) => track.author === selectedAuthor);
    }

    // Фильтр по жанру
    if (selectedGenre) {
      result = result.filter((track) => track.genre.includes(selectedGenre));
    }

    // Сортировка по году
    if (sortOrder !== 'default') {
      result.sort((a, b) => {
        const dateA = new Date(a.release_date).getTime();
        const dateB = new Date(b.release_date).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });
    }

    setFilteredTracks(result);
  }, [tracks, searchQuery, selectedAuthor, selectedGenre, sortOrder]);

  // Получение уникальных авторов и жанров из текущей подборки
  const uniqueAuthors = [...new Set(tracks.map((t) => t.author))];
  const uniqueGenres = [...new Set(tracks.flatMap((t) => t.genre))];

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
    setSearchQuery('');
    setSelectedAuthor(null);
    setSelectedGenre(null);
    setSortOrder('default');
  };

  if (isLoading) return <div className={styles.loader}>Загрузка подборки...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!tracks.length) return <div className={styles.error}>В этой подборке нет треков</div>;

  return (
    <div className={styles.container}>
      {/* Поиск */}
      <div className={styles.search}>
        <input
          type="text"
          placeholder="Поиск по трекам..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      <h1 className={styles.title}>{name}</h1>

      

      {/* Блок фильтров */}
      <div className={styles.filters}>
        <div className={styles.filterTitle}>Искать по:</div>

        {/* Фильтр по исполнителю */}
        <div className={styles.filterWrapper}>
          <button
            className={`${styles.filterButton} ${selectedAuthor ? styles.active : ''}`}
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

        {/* Фильтр по году */}
        <div className={styles.filterWrapper}>
          <button
            className={`${styles.filterButton} ${sortOrder !== 'default' ? styles.active : ''}`}
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
            className={`${styles.filterButton} ${selectedGenre ? styles.active : ''}`}
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

        {/* Кнопка сброса фильтров */}
        {(searchQuery || selectedAuthor || selectedGenre || sortOrder !== 'default') && (
          <button className={styles.resetButton} onClick={resetFilters}>
            Сбросить фильтры
          </button>
        )}
      </div>

      {/* Заголовки колонок */}
      <div className={styles.contentTitle}>
        <div className={`${styles.col} ${styles.col01}`}>Трек</div>
        <div className={`${styles.col} ${styles.col02}`}>Исполнитель</div>
        <div className={`${styles.col} ${styles.col03}`}>Альбом</div>
        <div className={`${styles.col} ${styles.col04}`}>
          <svg className={styles.watchIcon}>
            <use href="/img/icon/sprite.svg#icon-watch" />
          </svg>
        </div>
      </div>

      {/* Список треков */}
      <TrackList tracks={filteredTracks} />
    </div>
  );
}
// components/TrackFilters/TrackFilters.tsx
'use client';

import styles from './TrackFilters.module.css';

interface TrackFiltersProps {
  // Уникальные значения для фильтров
  uniqueAuthors: string[];
  uniqueGenres: string[];
  // Выбранные значения
  selectedAuthors: string[];
  selectedGenres: string[];
  sortOrder: 'default' | 'newest' | 'oldest';
  // Состояние открытого выпадающего списка
  openFilter: 'author' | 'year' | 'genre' | null;
  // Callbacks
  onToggleFilter: (filter: 'author' | 'year' | 'genre') => void;
  onSelectAuthor: (author: string) => void;
  onSelectGenre: (genre: string) => void;
  onSelectSort: (order: 'newest' | 'oldest') => void;
  onResetFilters: () => void;
  // Дополнительно: флаг, показывать ли кнопку сброса (если есть активные фильтры)
  hasActiveFilters: boolean;
}

export default function TrackFilters({
  uniqueAuthors,
  uniqueGenres,
  selectedAuthors,
  selectedGenres,
  sortOrder,
  openFilter,
  onToggleFilter,
  onSelectAuthor,
  onSelectGenre,
  onSelectSort,
  onResetFilters,
  hasActiveFilters,
}: TrackFiltersProps) {
  return (
    <div className={styles.filters}>
      <div className={styles.filterTitle}>Искать по:</div>

      {/* Фильтр по исполнителю */}
      <div className={styles.filterWrapper}>
        <button
          className={`${styles.filterButton} ${selectedAuthors.length ? styles.active : ''}`}
          onClick={() => onToggleFilter('author')}
        >
          исполнителю
          {selectedAuthors.length > 0 && (
            <span className={styles.filterBadge}>{selectedAuthors.length}</span>
          )}
        </button>
        {openFilter === 'author' && (
          <div className={styles.dropdown}>
            {uniqueAuthors.map((author) => (
              <div
                key={author}
                className={`${styles.dropdownItem} ${
                  selectedAuthors.includes(author) ? styles.active : ''
                }`}
                onClick={() => onSelectAuthor(author)}
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
          onClick={() => onToggleFilter('year')}
        >
          году выпуска
        </button>
        {openFilter === 'year' && (
          <div className={styles.dropdown}>
            <div
              className={`${styles.dropdownItem} ${sortOrder === 'newest' ? styles.active : ''}`}
              onClick={() => onSelectSort('newest')}
            >
              Сначала новые
            </div>
            <div
              className={`${styles.dropdownItem} ${sortOrder === 'oldest' ? styles.active : ''}`}
              onClick={() => onSelectSort('oldest')}
            >
              Сначала старые
            </div>
          </div>
        )}
      </div>

      {/* Фильтр по жанру */}
      <div className={styles.filterWrapper}>
        <button
          className={`${styles.filterButton} ${selectedGenres.length ? styles.active : ''}`}
          onClick={() => onToggleFilter('genre')}
        >
          жанру
          {selectedGenres.length > 0 && (
            <span className={styles.filterBadge}>{selectedGenres.length}</span>
          )}
        </button>
        {openFilter === 'genre' && (
          <div className={styles.dropdown}>
            {uniqueGenres.map((genre) => (
              <div
                key={genre}
                className={`${styles.dropdownItem} ${
                  selectedGenres.includes(genre) ? styles.active : ''
                }`}
                onClick={() => onSelectGenre(genre)}
              >
                {genre}
              </div>
            ))}
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <button className={styles.resetButton} onClick={onResetFilters}>
          Сбросить фильтры
        </button>
      )}
    </div>
  );
}
// app/music/selection/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchSelectionById } from '@/store/features/selectionsSlice';
import TrackFilters from '@/components/TrackFilters/TrackFilters';
import TrackList from '@/components/Centerblock/TrackList';
import { TrackType } from '@/sharedTypes/types';
import styles from './page.module.css';
import Skeleton from '@/components/Skeleton/Skeleton';

export default function SelectionPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { currentSelection } = useAppSelector((state) => state.selections);
  const { tracks, name, isLoading, error, id: loadedId } = currentSelection;

  const [filteredTracks, setFilteredTracks] = useState<TrackType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'default' | 'newest' | 'oldest'>('default');
  const [openFilter, setOpenFilter] = useState<'author' | 'year' | 'genre' | null>(null);

  const selectionId = id ? parseInt(id as string, 10) : null;

  useEffect(() => {
    if (selectionId && loadedId !== selectionId) {
      dispatch(fetchSelectionById(selectionId));
    }
  }, [selectionId, loadedId, dispatch]);

  useEffect(() => {
    let result = [...tracks];

    if (searchQuery) {
      result = result.filter(
        (track) =>
          track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedAuthors.length) {
      result = result.filter((track) => selectedAuthors.includes(track.author));
    }

    if (selectedGenres.length) {
      result = result.filter((track) => track.genre.some((g) => selectedGenres.includes(g)));
    }

    if (sortOrder !== 'default') {
      result.sort((a, b) => {
        const dateA = new Date(a.release_date).getTime();
        const dateB = new Date(b.release_date).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });
    }

    setFilteredTracks(result);
  }, [tracks, searchQuery, selectedAuthors, selectedGenres, sortOrder]);

  const uniqueAuthors = [...new Set(tracks.map((t) => t.author))];
  const uniqueGenres = [...new Set(tracks.flatMap((t) => t.genre))];
  const hasActiveFilters = !!(selectedAuthors.length || selectedGenres.length || sortOrder !== 'default' || searchQuery);

  const toggleFilter = (filter: 'author' | 'year' | 'genre') => {
    setOpenFilter(openFilter === filter ? null : filter);
  };

  const handleSelectAuthor = (author: string) => {
    setSelectedAuthors((prev) =>
      prev.includes(author) ? prev.filter((a) => a !== author) : [...prev, author]
    );
  };

  const handleSelectGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSelectSort = (order: 'newest' | 'oldest') => {
    setSortOrder(order);
    setOpenFilter(null);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedAuthors([]);
    setSelectedGenres([]);
    setSortOrder('default');
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.search}>
          <div className={styles.searchInputSkeleton}></div>
        </div>
        <div className={styles.skeletonTitle}></div>
        <Skeleton variant="track-row" count={5} />
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!tracks.length) {
    return <div className={styles.error}>В этой подборке нет треков</div>;
  }

  return (
    <div className={styles.container}>
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

      <TrackFilters
        uniqueAuthors={uniqueAuthors}
        uniqueGenres={uniqueGenres}
        selectedAuthors={selectedAuthors}
        selectedGenres={selectedGenres}
        sortOrder={sortOrder}
        openFilter={openFilter}
        onToggleFilter={toggleFilter}
        onSelectAuthor={handleSelectAuthor}
        onSelectGenre={handleSelectGenre}
        onSelectSort={handleSelectSort}
        onResetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

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

      {filteredTracks.length === 0 ? (
        <div className={styles.noResults}>
          К сожалению, по заданным фильтрам ничего не найдено
        </div>
      ) : (
        <TrackList tracks={filteredTracks} />
      )}
    </div>
  );
}
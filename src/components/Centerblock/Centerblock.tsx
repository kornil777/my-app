// components/Centerblock/Centerblock.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchTracks } from '@/store/features/trackSlice';
import { TrackType } from '@/sharedTypes/types';
import TrackFilters from '@/components/TrackFilters/TrackFilters';
import TrackList from './TrackList';
import styles from './Centerblock.module.css';

const getUniqueAuthors = (tracks: TrackType[]) => [...new Set(tracks.map(t => t.author))];
const getUniqueGenres = (tracks: TrackType[]) => [...new Set(tracks.flatMap(t => t.genre))];

const filterTracks = (
  tracks: TrackType[],
  selectedAuthors: string[],
  selectedGenres: string[],
  searchQuery: string
) => {
  return tracks.filter(track => {
    if (selectedAuthors.length && !selectedAuthors.includes(track.author)) return false;
    if (selectedGenres.length && !track.genre.some(g => selectedGenres.includes(g))) return false;
    if (searchQuery && !track.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !track.author.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });
};

const sortTracksByYear = (tracks: TrackType[], sortOrder: 'default' | 'newest' | 'oldest') => {
  if (sortOrder === 'default') return tracks;
  return [...tracks].sort((a, b) => {
    const dateA = new Date(a.release_date).getTime();
    const dateB = new Date(b.release_date).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });
};

export default function Centerblock() {
  const dispatch = useAppDispatch();
  const { playlist, isLoading } = useAppSelector(state => state.tracks);

  const [filteredTracks, setFilteredTracks] = useState<TrackType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'default' | 'newest' | 'oldest'>('default');
  const [openFilter, setOpenFilter] = useState<'author' | 'year' | 'genre' | null>(null);

  useEffect(() => {
    if (playlist.length === 0 && !isLoading) {
      dispatch(fetchTracks());
    }
  }, [dispatch, playlist.length, isLoading]);

  useEffect(() => {
    let result = filterTracks(playlist, selectedAuthors, selectedGenres, searchQuery);
    result = sortTracksByYear(result, sortOrder);
    setFilteredTracks(result);
  }, [playlist, selectedAuthors, selectedGenres, sortOrder, searchQuery]);

  const toggleFilter = (filter: 'author' | 'year' | 'genre') => {
    setOpenFilter(openFilter === filter ? null : filter);
  };

  const handleSelectAuthor = (author: string) => {
    setSelectedAuthors(prev =>
      prev.includes(author) ? prev.filter(a => a !== author) : [...prev, author]
    );
  };

  const handleSelectGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
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

  const uniqueAuthors = getUniqueAuthors(playlist);
  const uniqueGenres = getUniqueGenres(playlist);
  const hasActiveFilters = !!(selectedAuthors.length || selectedGenres.length || sortOrder !== 'default' || searchQuery);

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
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
    <h2 className={styles.centerblockH2}>Треки</h2>

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
      hasActiveFilters={!!(selectedAuthors.length || selectedGenres.length || sortOrder !== 'default' || searchQuery)}
    />

    <div className={styles.centerblockContent}>
      {filteredTracks.length === 0 ? (
        <div className={styles.noResults}>
          К сожалению, по заданным фильтрам ничего не найдено
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  </div>
);
}
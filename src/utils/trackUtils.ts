// src/utils/trackUtils.ts
import { TrackType } from '@/sharedTypes/types';

export const formatDuration = (seconds?: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const filterTracks = (
  tracks: TrackType[],
  selectedAuthors: string[],
  selectedGenres: string[],
  searchQuery: string
): TrackType[] => {
  return tracks.filter(track => {
    if (selectedAuthors.length && !selectedAuthors.includes(track.author)) return false;
    if (selectedGenres.length && !track.genre.some(g => selectedGenres.includes(g))) return false;
    if (searchQuery && !track.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !track.author.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });
};

export const sortTracksByYear = (
  tracks: TrackType[],
  sortOrder: 'default' | 'newest' | 'oldest'
): TrackType[] => {
  if (sortOrder === 'default') return tracks;
  return [...tracks].sort((a, b) => {
    const dateA = new Date(a.release_date).getTime();
    const dateB = new Date(b.release_date).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });
};
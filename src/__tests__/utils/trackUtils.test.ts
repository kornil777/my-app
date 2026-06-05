// src/__tests__/utils/trackUtils.test.ts
import { formatDuration, filterTracks, sortTracksByYear } from '@/utils/trackUtils';
import { TrackType } from '@/sharedTypes/types';

describe('trackUtils', () => {
  describe('formatDuration', () => {
    it('returns "0:00" for undefined, null, NaN', () => {
      expect(formatDuration()).toBe('0:00');
      expect(formatDuration(NaN)).toBe('0:00');
    });
    it('formats seconds correctly', () => {
      expect(formatDuration(65)).toBe('1:05');
      expect(formatDuration(3600)).toBe('60:00');
      expect(formatDuration(125)).toBe('2:05');
    });
  });

  describe('filterTracks', () => {
    const mockTracks: TrackType[] = [
      { _id: 1, name: 'Song A', author: 'Artist 1', genre: ['Rock'], release_date: '2020-01-01', album: 'A', duration_in_seconds: 200, track_file: '', logo: null, stared_user: [] },
      { _id: 2, name: 'Song B', author: 'Artist 2', genre: ['Pop'], release_date: '2021-01-01', album: 'B', duration_in_seconds: 180, track_file: '', logo: null, stared_user: [] },
      { _id: 3, name: 'Song C', author: 'Artist 1', genre: ['Rock', 'Pop'], release_date: '2019-01-01', album: 'C', duration_in_seconds: 210, track_file: '', logo: null, stared_user: [] },
    ];

    it('filters by author', () => {
      const result = filterTracks(mockTracks, ['Artist 1'], [], '');
      expect(result).toHaveLength(2);
      expect(result.every(t => t.author === 'Artist 1')).toBe(true);
    });

    it('filters by genre', () => {
      const result = filterTracks(mockTracks, [], ['Pop'], '');
      expect(result).toHaveLength(2); // Song B и Song C
      expect(result.some(t => t.name === 'Song B')).toBe(true);
      expect(result.some(t => t.name === 'Song C')).toBe(true);
    });

    it('filters by search query', () => {
      const result = filterTracks(mockTracks, [], [], 'song b');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Song B');
    });

    it('combines filters', () => {
      const result = filterTracks(mockTracks, ['Artist 1'], ['Rock'], '');
      expect(result).toHaveLength(2); // Song A и Song C
    });
  });

  describe('sortTracksByYear', () => {
    const tracks = [
      { _id: 1, release_date: '2020-01-01', name: 'A', author: '', genre: [], album: '', duration_in_seconds: 0, track_file: '', logo: null, stared_user: [] },
      { _id: 2, release_date: '2018-01-01', name: 'B', author: '', genre: [], album: '', duration_in_seconds: 0, track_file: '', logo: null, stared_user: [] },
      { _id: 3, release_date: '2021-01-01', name: 'C', author: '', genre: [], album: '', duration_in_seconds: 0, track_file: '', logo: null, stared_user: [] },
    ] as TrackType[];

    it('returns original array when sortOrder default', () => {
      const result = sortTracksByYear(tracks, 'default');
      expect(result).toEqual(tracks);
    });

    it('sorts newest first', () => {
      const result = sortTracksByYear(tracks, 'newest');
      expect(result[0].release_date).toBe('2021-01-01');
      expect(result[2].release_date).toBe('2018-01-01');
    });

    it('sorts oldest first', () => {
      const result = sortTracksByYear(tracks, 'oldest');
      expect(result[0].release_date).toBe('2018-01-01');
      expect(result[2].release_date).toBe('2021-01-01');
    });
  });
});
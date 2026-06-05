// src/__tests__/components/TrackItem.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TrackItem from '@/components/Centerblock/TrackItem';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { trackSliceReducer } from '@/store/features/trackSlice';

const mockTrack = {
  _id: 1,
  name: 'Test Track',
  author: 'Test Artist',
  album: 'Test Album',
  duration_in_seconds: 215,
  genre: ['Rock'],
  release_date: '2020-01-01',
  track_file: 'http://example.com/test.mp3',
  logo: null,
  stared_user: [],
};

const createMockStore = (currentTrack = null, isPlaying = false) =>
  configureStore({
    reducer: {
      tracks: trackSliceReducer,
    },
    preloadedState: {
      tracks: {
        playlist: [],
        currentTrack,
        currentTrackIndex: -1,
        isPlaying,
        shuffle: false,
        loop: false,
        isLoading: false,
        error: null,
        favoriteTracks: [],
        isFavoriteLoading: false,
        favoriteError: null,
      },
    },
  });

// Мок хука useLikeTrack
const mockToggleLike = jest.fn();
jest.mock('@/hooks/useLikeTrack', () => ({
  useLikeTrack: jest.fn(() => ({
    isLike: false,
    toggleLike: mockToggleLike,
    isLoading: false,
  })),
}));

describe('TrackItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders track info correctly', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <TrackItem {...mockTrack} />
      </Provider>
    );
    expect(screen.getByText('Test Track')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByText('Test Album')).toBeInTheDocument();
    expect(screen.getByText('3:35')).toBeInTheDocument();
  });

  it('calls setCurrentTrack on track click', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <TrackItem {...mockTrack} />
      </Provider>
    );
    const trackDiv = container.querySelector('.playlistItem');
    expect(trackDiv).toBeInTheDocument();
    fireEvent.click(trackDiv!);
    const state = store.getState();
    expect(state.tracks.currentTrack).toEqual(mockTrack);
    expect(state.tracks.isPlaying).toBe(true);
  });

  it('calls toggleLike when like button is clicked', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <TrackItem {...mockTrack} />
      </Provider>
    );
    const likeDiv = container.querySelector('.trackTimeLike');
    expect(likeDiv).toBeInTheDocument();
    await user.click(likeDiv!);
    expect(mockToggleLike).toHaveBeenCalledTimes(1);
  });
});
// src/__tests__/components/TrackList.test.tsx
import { render, screen } from '@testing-library/react';
import TrackList from '@/components/Centerblock/TrackList';


jest.mock('@/components/Centerblock/TrackItem', () => {
  return function MockTrackItem({ name }: { name: string }) {
    return <div data-testid="mock-track-item">{name}</div>;
  };
});

const mockTracks = [
  {
    _id: 1,
    name: 'Track 1',
    author: 'Artist 1',
    album: 'Album 1',
    duration_in_seconds: 100,
    genre: [],
    release_date: '',
    track_file: '',
    logo: null,
    stared_user: [],
  },
  {
    _id: 2,
    name: 'Track 2',
    author: 'Artist 2',
    album: 'Album 2',
    duration_in_seconds: 200,
    genre: [],
    release_date: '',
    track_file: '',
    logo: null,
    stared_user: [],
  },
];

describe('TrackList', () => {
  it('renders list of tracks', () => {
    render(<TrackList tracks={mockTracks} />);
    const items = screen.getAllByTestId('mock-track-item');
    expect(items).toHaveLength(2);
    expect(screen.getByText('Track 1')).toBeInTheDocument();
    expect(screen.getByText('Track 2')).toBeInTheDocument();
  });

  it('renders empty container when no tracks', () => {
    const { container } = render(<TrackList tracks={[]} />);
    expect(container.querySelector('[data-testid="mock-track-item"]')).not.toBeInTheDocument();
  });
});
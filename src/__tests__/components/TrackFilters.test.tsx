// src/__tests__/components/TrackFilters.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TrackFilters from '@/components/TrackFilters/TrackFilters';

const defaultProps = {
  uniqueAuthors: ['Artist A', 'Artist B', 'Artist C'],
  uniqueGenres: ['Rock', 'Pop', 'Jazz'],
  selectedAuthors: [],
  selectedGenres: [],
  sortOrder: 'default' as const,
  openFilter: null,
  onToggleFilter: jest.fn(),
  onSelectAuthor: jest.fn(),
  onSelectGenre: jest.fn(),
  onSelectSort: jest.fn(),
  onResetFilters: jest.fn(),
  hasActiveFilters: false,
};

describe('TrackFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders filter buttons', () => {
    render(<TrackFilters {...defaultProps} />);
    expect(screen.getByText('исполнителю')).toBeInTheDocument();
    expect(screen.getByText('году выпуска')).toBeInTheDocument();
    expect(screen.getByText('жанру')).toBeInTheDocument();
  });

  it('opens author dropdown when clicked', () => {
    render(<TrackFilters {...defaultProps} />);
    const authorBtn = screen.getByText('исполнителю');
    fireEvent.click(authorBtn);
    expect(defaultProps.onToggleFilter).toHaveBeenCalledWith('author');
  });

  it('shows dropdown items when openFilter matches', () => {
    render(<TrackFilters {...defaultProps} openFilter="author" />);
    expect(screen.getByText('Artist A')).toBeInTheDocument();
    expect(screen.getByText('Artist B')).toBeInTheDocument();
    expect(screen.getByText('Artist C')).toBeInTheDocument();
  });

  it('calls onSelectAuthor when dropdown item clicked', () => {
    render(<TrackFilters {...defaultProps} openFilter="author" />);
    const artistA = screen.getByText('Artist A');
    fireEvent.click(artistA);
    expect(defaultProps.onSelectAuthor).toHaveBeenCalledWith('Artist A');
  });

  it('shows badge when authors selected', () => {
    render(<TrackFilters {...defaultProps} selectedAuthors={['Artist A', 'Artist B']} />);
    const badge = screen.getByText('2');
    expect(badge).toBeInTheDocument();
  });

  it('calls reset filters when reset button clicked', () => {
    render(<TrackFilters {...defaultProps} hasActiveFilters={true} />);
    const resetBtn = screen.getByText('Сбросить фильтры');
    fireEvent.click(resetBtn);
    expect(defaultProps.onResetFilters).toHaveBeenCalled();
  });
});
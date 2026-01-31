import { ContentType, ViewMode, ContentItem } from '../types';

export interface ContentStore {
  selectedCountries: string[];
  selectedServices: string[];
  movies: ContentItem[];
  tvShows: ContentItem[];
  contentType: ContentType;
  viewMode: ViewMode;
  activeGenre: string;
  isLoading: boolean;
  isFetchingMore: boolean;
  hasSearched: boolean;
  hasMore: boolean;
  error: string | null;
  currentBatchProgress: number;
  searcher: any | null;
  isGenreFilterActive: boolean;

  toggleCountry: (code: string) => void;
  toggleService: (id: string) => void;
  handleSearch: () => void;
  loadMoreResults: () => void;
  setContentType: (type: ContentType) => void;
  setViewMode: (mode: ViewMode) => void;
  setActiveGenre: (genre: string) => void;
}
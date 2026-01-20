import { ContentItem, ContentType, ViewMode } from '../types';

export interface CacheEntry {
  movies: ContentItem[];
  tvShows: ContentItem[];
  timestamp: number;
  currentPage: { movies: number; tvShows: number };
}

export interface ContentState {
  // Selection State
  selectedCountries: string[];
  selectedServices: string[];

  // Content State
  movies: ContentItem[];
  tvShows: ContentItem[];
  contentType: ContentType;

  // UI State
  viewMode: ViewMode;
  activeGenre: string;

  // Pagination State
  currentPage: { movies: number; tvShows: number };

  // Loading State
  isLoading: boolean;
  isFetchingMore: boolean;
  hasSearched: boolean;
  error: string | null;

  // Cache State (메모리만, persist 사용 안 함)
  cache: Map<string, CacheEntry>;
}

export interface ContentActions {
  // Selection Actions
  toggleCountry: (code: string) => void;
  toggleService: (id: string) => void;

  // Search Actions
  handleSearch: () => Promise<void>;
  loadMore: () => Promise<void>;

  // Content Actions
  setContentType: (type: ContentType) => Promise<void>;
  setViewMode: (mode: ViewMode) => void;
  setActiveGenre: (genre: string) => void;
}

export type ContentStore = ContentState & ContentActions;

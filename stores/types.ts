import { ContentItem, ContentType, ViewMode } from '../types';
import { IntersectionSearcher } from '../services/intersectionService';

export interface ContentState {
  // Selection State
  selectedCountries: string[];
  selectedServices: string[];

  // Content State
  movies: ContentItem[];
  tvShows: ContentItem[];
  contentType: ContentType;
  
  // Searcher instance
  searcher: IntersectionSearcher | null;

  // UI State
  viewMode: ViewMode;
  activeGenre: string;

  // Loading State
  isLoading: boolean; // For initial search
  isFetchingMore: boolean; // For subsequent batches
  hasSearched: boolean;
  hasMore: boolean; // Whether more results can be loaded
  error: string | null;
}

export interface ContentActions {
  // Selection Actions
  toggleCountry: (code: string) => void;
  toggleService: (id: string) => void;

  // Search Actions
  handleSearch: () => void;
  loadMoreResults: () => void;

  // Content Actions
  setContentType: (type: ContentType) => void;
  setViewMode: (mode: ViewMode) => void;
  setActiveGenre: (genre: string) => void;
}

export type ContentStore = ContentState & ContentActions;

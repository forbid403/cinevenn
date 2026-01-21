import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { ContentStore } from './types';
import { ContentItem, ContentType, ViewMode } from '../types';
import { IntersectionSearcher } from '../services/intersectionService';
import { analytics, AnalyticsEvents } from '../services/analyticsService';

export const useContentStore = create<ContentStore>()(
  devtools(
    (set, get) => ({
      // Initial State
      selectedCountries: [],
      selectedServices: [],
      movies: [],
      tvShows: [],
      contentType: ContentType.MOVIE,
      viewMode: 'grid' as ViewMode,
      activeGenre: 'All',
      isLoading: false,
      isFetchingMore: false,
      hasSearched: false,
      hasMore: false,
      error: null,
      searcher: null,

      // Selection Actions
      toggleCountry: (code) => set((state) => ({
        selectedCountries: state.selectedCountries.includes(code)
          ? state.selectedCountries.filter(c => c !== code)
          : [...state.selectedCountries, code]
      })),

      toggleService: (id) => set((state) => ({
        selectedServices: state.selectedServices.includes(id)
          ? state.selectedServices.filter(s => s !== id)
          : [...state.selectedServices, id]
      })),

      handleSearch: () => {
        const state = get();

        if (state.selectedCountries.length === 0 || state.selectedServices.length === 0) {
          set({ error: 'Please select at least one country and one platform.' });
          return;
        }

        set({
          isLoading: true,
          isFetchingMore: false,
          error: null,
          hasSearched: true,
          hasMore: true,
          movies: [],
          tvShows: [],
          activeGenre: 'All'
        });

        const searchStartTime = Date.now();

        analytics.track(AnalyticsEvents.SEARCH_INITIATED, {
          countries: state.selectedCountries,
          services: state.selectedServices,
          content_type: state.contentType
        });

        const newSearcher = new IntersectionSearcher({
          countries: state.selectedCountries,
          services: state.selectedServices,
          contentType: state.contentType,
          onResults: (items: ContentItem[]) => {
            set(currentState => {
              if (currentState.contentType === ContentType.MOVIE) {
                return { movies: [...currentState.movies, ...items] };
              } else {
                return { tvShows: [...currentState.tvShows, ...items] };
              }
            });
          },
          onBatchComplete: () => {
             set({ isLoading: false, isFetchingMore: false });
          },
          onFinish: () => {
            const finalState = get();
            analytics.track(AnalyticsEvents.SEARCH_COMPLETED, {
              content_type: finalState.contentType,
              duration_ms: Date.now() - searchStartTime,
              countries: finalState.selectedCountries,
              services: finalState.selectedServices
            });
            set({ isLoading: false, isFetchingMore: false, hasMore: false });
          },
          onError: (err: string) => {
            analytics.track(AnalyticsEvents.SEARCH_ERROR, { error_message: err });
            set({ error: err, isLoading: false, isFetchingMore: false, hasSearched: true, hasMore: false });
          }
        });

        set({ searcher: newSearcher });
        newSearcher.run();
      },

      loadMoreResults: () => {
        const { searcher, isLoading, isFetchingMore, hasMore } = get();
        if (isLoading || isFetchingMore || !hasMore || !searcher) {
          return;
        }
        set({ isFetchingMore: true });
        searcher.run();
      },

      setContentType: (type) => {
        set({ contentType: type });
      },

      setViewMode: (mode) => set({ viewMode: mode }),
      setActiveGenre: (genre) => set({ activeGenre: genre }),
    }),
    { name: 'ContentStore' }
  )
);

// Selector Hooks (성능 최적화)
export const useDisplayedResults = () =>
  useContentStore(
    useShallow(state => state.contentType === ContentType.MOVIE ? state.movies : state.tvShows)
  );

export const useFilteredResults = () =>
  useContentStore(
    useShallow(state => {
      const displayed = state.contentType === ContentType.MOVIE ? state.movies : state.tvShows;
      if (state.activeGenre === 'All') return displayed;
      return displayed.filter(item => item.genre.includes(state.activeGenre));
    })
  );

export const useGenres = () =>
  useContentStore(
    useShallow(state => {
      const displayed = state.contentType === ContentType.MOVIE ? state.movies : state.tvShows;
      return ['All', ...Array.from(new Set(displayed.flatMap(item => item.genre)))].slice(0, 8);
    })
  );

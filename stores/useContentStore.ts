import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { ContentStore, CacheEntry } from './types';
import { ContentType, ViewMode } from '../types';
import { fetchMoviesAndTVShows } from '../services/tmdbService';
import { analytics, AnalyticsEvents } from '../services/analyticsService';

// 캐시 키 생성 헬퍼
const createCacheKey = (countries: string[], services: string[]) => {
  return `${countries.sort().join(',')}_${services.sort().join(',')}`;
};

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
      currentPage: { movies: 1, tvShows: 1 },
      isLoading: false,
      isFetchingMore: false,
      hasSearched: false,
      error: null,
      cache: new Map<string, CacheEntry>(),

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

      // Search Action
      handleSearch: async () => {
        const state = get();

        // 유효성 검사
        if (state.selectedCountries.length === 0 || state.selectedServices.length === 0) {
          set({ error: 'Please select at least one country and one platform.' });
          return;
        }

        // 캐시 체크
        const cacheKey = createCacheKey(state.selectedCountries, state.selectedServices);
        const cachedData = state.cache.get(cacheKey);
        if (cachedData) {
          set({
            movies: cachedData.movies,
            tvShows: cachedData.tvShows,
            currentPage: cachedData.currentPage,
            hasSearched: true
          });
          return;
        }

        set({ isLoading: true, error: null, activeGenre: 'All' });
        const searchStartTime = Date.now();

        // GA4 추적
        analytics.track(AnalyticsEvents.SEARCH_INITIATED, {
          countries: state.selectedCountries,
          services: state.selectedServices,
          content_type: state.contentType,
          country_count: state.selectedCountries.length,
          service_count: state.selectedServices.length
        });

        try {
          const params = {
            countries: state.selectedCountries,
            services: state.selectedServices
          };

          if (state.contentType === ContentType.MOVIE) {
            const { movies: movieData } = await fetchMoviesAndTVShows(params, 1, 0);

            set((state) => ({
              movies: movieData,
              currentPage: { movies: 1, tvShows: 0 },
              hasSearched: true,
              cache: new Map(state.cache).set(cacheKey, {
                movies: movieData,
                tvShows: [],
                timestamp: Date.now(),
                currentPage: { movies: 1, tvShows: 0 }
              })
            }));

            analytics.track(AnalyticsEvents.SEARCH_COMPLETED, {
              content_type: ContentType.MOVIE,
              results_count: movieData.length,
              duration_ms: Date.now() - searchStartTime,
              countries: state.selectedCountries,
              services: state.selectedServices
            });
          } else {
            const { tvShows: tvData } = await fetchMoviesAndTVShows(params, 0, 1);

            set((state) => ({
              tvShows: tvData,
              currentPage: { movies: 0, tvShows: 1 },
              hasSearched: true,
              cache: new Map(state.cache).set(cacheKey, {
                movies: [],
                tvShows: tvData,
                timestamp: Date.now(),
                currentPage: { movies: 0, tvShows: 1 }
              })
            }));

            analytics.track(AnalyticsEvents.SEARCH_COMPLETED, {
              content_type: ContentType.TV_SHOW,
              results_count: tvData.length,
              duration_ms: Date.now() - searchStartTime,
              countries: state.selectedCountries,
              services: state.selectedServices
            });
          }
        } catch (err) {
          set({
            error: 'Failed to fetch global library data. Please try again.',
            hasSearched: true
          });

          analytics.track(AnalyticsEvents.SEARCH_ERROR, {
            error_message: err instanceof Error ? err.message : 'Unknown error',
            countries: state.selectedCountries,
            services: state.selectedServices,
            content_type: state.contentType
          });
        } finally {
          set({ isLoading: false });
        }
      },

      // Load More Action (통합된 페이지네이션)
      loadMore: async () => {
        const state = get();
        const isMovie = state.contentType === ContentType.MOVIE;
        const nextPage = isMovie
          ? state.currentPage.movies + 1
          : state.currentPage.tvShows + 1;

        set({ isFetchingMore: true });

        analytics.track(AnalyticsEvents.LOAD_MORE_CLICKED, {
          content_type: state.contentType,
          current_page: isMovie ? state.currentPage.movies : state.currentPage.tvShows,
          next_page: nextPage
        });

        try {
          const params = {
            countries: state.selectedCountries,
            services: state.selectedServices
          };

          if (isMovie) {
            const { movies: newMovies } = await fetchMoviesAndTVShows(params, nextPage, 0);

            set((state) => {
              const cacheKey = createCacheKey(state.selectedCountries, state.selectedServices);
              const cached = state.cache.get(cacheKey);
              const updatedMovies = [...state.movies, ...newMovies];

              return {
                movies: updatedMovies,
                currentPage: { ...state.currentPage, movies: nextPage },
                cache: cached
                  ? new Map(state.cache).set(cacheKey, {
                      ...cached,
                      movies: updatedMovies,
                      currentPage: { ...cached.currentPage, movies: nextPage }
                    })
                  : state.cache
              };
            });
          } else {
            const { tvShows: newTVShows } = await fetchMoviesAndTVShows(params, 0, nextPage);

            set((state) => {
              const cacheKey = createCacheKey(state.selectedCountries, state.selectedServices);
              const cached = state.cache.get(cacheKey);
              const updatedTVShows = [...state.tvShows, ...newTVShows];

              return {
                tvShows: updatedTVShows,
                currentPage: { ...state.currentPage, tvShows: nextPage },
                cache: cached
                  ? new Map(state.cache).set(cacheKey, {
                      ...cached,
                      tvShows: updatedTVShows,
                      currentPage: { ...cached.currentPage, tvShows: nextPage }
                    })
                  : state.cache
              };
            });
          }
        } catch (err) {
          console.error('Failed to load more content:', err);
        } finally {
          set({ isFetchingMore: false });
        }
      },

      // Content Type Action (자동 fetch 포함)
      setContentType: async (type) => {
        const state = get();
        set({ contentType: type });

        const cacheKey = createCacheKey(state.selectedCountries, state.selectedServices);
        const cachedData = state.cache.get(cacheKey);

        if (!cachedData || state.selectedCountries.length === 0) return;

        // TV Show로 전환했는데 데이터가 없으면 fetch
        if (type === ContentType.TV_SHOW && state.tvShows.length === 0) {
          set({ isLoading: true });

          try {
            const params = {
              countries: state.selectedCountries,
              services: state.selectedServices
            };

            const { tvShows: tvData } = await fetchMoviesAndTVShows(params, 0, 1);

            set((state) => ({
              tvShows: tvData,
              currentPage: { ...state.currentPage, tvShows: 1 },
              cache: new Map(state.cache).set(cacheKey, {
                ...cachedData,
                tvShows: tvData,
                currentPage: { ...cachedData.currentPage, tvShows: 1 }
              }),
              isLoading: false
            }));
          } catch (err) {
            console.error('Failed to fetch TV shows:', err);
            set({ isLoading: false });
          }
        }

        // Movie로 전환했는데 데이터가 없으면 fetch
        if (type === ContentType.MOVIE && state.movies.length === 0) {
          set({ isLoading: true });

          try {
            const params = {
              countries: state.selectedCountries,
              services: state.selectedServices
            };

            const { movies: movieData } = await fetchMoviesAndTVShows(params, 1, 0);

            set((state) => ({
              movies: movieData,
              currentPage: { ...state.currentPage, movies: 1 },
              cache: new Map(state.cache).set(cacheKey, {
                ...cachedData,
                movies: movieData,
                currentPage: { ...cachedData.currentPage, movies: 1 }
              }),
              isLoading: false
            }));
          } catch (err) {
            console.error('Failed to fetch movies:', err);
            set({ isLoading: false });
          }
        }
      },

      // Simple Setters
      setViewMode: (mode) => set({ viewMode: mode }),
      setActiveGenre: (genre) => set({ activeGenre: genre }),
    }),
    { name: 'ContentStore' }
  )
);

// Selector Hooks (성능 최적화)

// 현재 표시 중인 콘텐츠 (movies 또는 tvShows)
export const useDisplayedResults = () =>
  useContentStore(
    useShallow(state => state.contentType === ContentType.MOVIE ? state.movies : state.tvShows)
  );

// 장르 필터링된 결과
export const useFilteredResults = () =>
  useContentStore(
    useShallow(state => {
      const displayed = state.contentType === ContentType.MOVIE ? state.movies : state.tvShows;
      if (state.activeGenre === 'All') return displayed;
      return displayed.filter(item => item.genre.includes(state.activeGenre));
    })
  );

// 장르 목록 (최대 8개)
export const useGenres = () =>
  useContentStore(
    useShallow(state => {
      const displayed = state.contentType === ContentType.MOVIE ? state.movies : state.tvShows;
      return ['All', ...Array.from(new Set(displayed.flatMap(item => item.genre)))].slice(0, 8);
    })
  );

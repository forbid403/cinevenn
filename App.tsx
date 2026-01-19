import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Loader2, Sparkles, AlertCircle, Clapperboard } from 'lucide-react';
import { ContentItem, ContentType, ViewMode } from './types';
import { fetchMoviesAndTVShows } from './services/tmdbService';
import { analytics, AnalyticsEvents } from './services/analyticsService';
import Header from './components/Header';
import SelectionPanel from './components/SelectionPanel';
import ResultsSection from './components/ResultsSection';
import Footer from './components/Footer';
import { installToast } from './components/Toast';
import { Analytics } from '@vercel/analytics/react';

interface CacheEntry {
  movies: ContentItem[];
  tvShows: ContentItem[];
  timestamp: number;
  currentPage: { movies: number; tvShows: number };
}

const App: React.FC = () => {
  useEffect(() => {
    installToast();
  }, []);

  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [contentType, setContentType] = useState<ContentType>(ContentType.MOVIE);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [cache, setCache] = useState<Map<string, CacheEntry>>(new Map());
  const [movies, setMovies] = useState<ContentItem[]>([]);
  const [tvShows, setTVShows] = useState<ContentItem[]>([]);
  const [filteredResults, setFilteredResults] = useState<ContentItem[]>([]);
  const [activeGenre, setActiveGenre] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState({ movies: 1, tvShows: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  const toggleCountry = (code: string) => {
    setSelectedCountries(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const createCacheKey = (countries: string[], services: string[]) => {
    return `${countries.sort().join(',')}_${services.sort().join(',')}`;
  };

  const displayedResults = useMemo(() => {
    if (contentType === ContentType.MOVIE) {
      return movies;
    } else {
      return tvShows;
    }
  }, [contentType, movies, tvShows]);

  const genres = ['All', ...Array.from(new Set(displayedResults.flatMap(item => item.genre)))].slice(0, 8);

  useEffect(() => {
    let filtered = [...displayedResults];

    if (activeGenre !== 'All') {
      filtered = filtered.filter(item => item.genre.includes(activeGenre));
    }

    setFilteredResults(filtered);
  }, [activeGenre, displayedResults]);

  const handleSearch = async () => {
    if (selectedCountries.length === 0 || selectedServices.length === 0) {
      setError('Please select at least one country and one platform.');
      return;
    }

    const cacheKey = createCacheKey(selectedCountries, selectedServices);

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      setMovies(cachedData.movies);
      setTVShows(cachedData.tvShows);
      setCurrentPage(cachedData.currentPage);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return;
    }

    setIsLoading(true);
    setError(null);
    setActiveGenre('All');

    // Track search initiation
    const searchStartTime = Date.now();
    analytics.track(AnalyticsEvents.SEARCH_INITIATED, {
      countries: selectedCountries,
      services: selectedServices,
      content_type: contentType,
      country_count: selectedCountries.length,
      service_count: selectedServices.length
    });

    try {
      const params = {
        countries: selectedCountries,
        services: selectedServices
      };

      // Only fetch the current content type initially
      if (contentType === ContentType.MOVIE) {
        const { movies: movieData } = await fetchMoviesAndTVShows(params, 1, 0);
        setMovies(movieData);
        setCurrentPage({ movies: 1, tvShows: 0 });

        setCache(prev => new Map(prev).set(cacheKey, {
          movies: movieData,
          tvShows: [],
          timestamp: Date.now(),
          currentPage: { movies: 1, tvShows: 0 }
        }));

        // Track successful search
        analytics.track(AnalyticsEvents.SEARCH_COMPLETED, {
          content_type: ContentType.MOVIE,
          results_count: movieData.length,
          duration_ms: Date.now() - searchStartTime,
          countries: selectedCountries,
          services: selectedServices
        });
      } else {
        const { tvShows: tvData } = await fetchMoviesAndTVShows(params, 0, 1);
        setTVShows(tvData);
        setCurrentPage({ movies: 0, tvShows: 1 });

        setCache(prev => new Map(prev).set(cacheKey, {
          movies: [],
          tvShows: tvData,
          timestamp: Date.now(),
          currentPage: { movies: 0, tvShows: 1 }
        }));

        // Track successful search
        analytics.track(AnalyticsEvents.SEARCH_COMPLETED, {
          content_type: ContentType.TV_SHOW,
          results_count: tvData.length,
          duration_ms: Date.now() - searchStartTime,
          countries: selectedCountries,
          services: selectedServices
        });
      }

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError('Failed to fetch global library data. Please try again.');

      // Track search error
      analytics.track(AnalyticsEvents.SEARCH_ERROR, {
        error_message: err instanceof Error ? err.message : 'Unknown error',
        countries: selectedCountries,
        services: selectedServices,
        content_type: contentType
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreMovies = async () => {
    const nextPage = currentPage.movies + 1;
    setIsFetchingMore(true);

    // Track load more action
    analytics.track(AnalyticsEvents.LOAD_MORE_CLICKED, {
      content_type: ContentType.MOVIE,
      current_page: currentPage.movies,
      next_page: nextPage
    });

    try {
      const params = {
        countries: selectedCountries,
        services: selectedServices
      };

      const { movies: newMovies } = await fetchMoviesAndTVShows(params, nextPage, 0);

      setMovies(prev => [...prev, ...newMovies]);
      setCurrentPage(prev => ({ ...prev, movies: nextPage }));

      const cacheKey = createCacheKey(selectedCountries, selectedServices);
      setCache(prev => {
        const cached = prev.get(cacheKey);
        if (cached) {
          return new Map(prev).set(cacheKey, {
            ...cached,
            movies: [...cached.movies, ...newMovies],
            currentPage: { ...cached.currentPage, movies: nextPage }
          });
        }
        return prev;
      });
    } catch (err) {
      console.error('Failed to load more movies:', err);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const loadMoreTVShows = async () => {
    const nextPage = currentPage.tvShows + 1;
    setIsFetchingMore(true);

    // Track load more action
    analytics.track(AnalyticsEvents.LOAD_MORE_CLICKED, {
      content_type: ContentType.TV_SHOW,
      current_page: currentPage.tvShows,
      next_page: nextPage
    });

    try {
      const params = {
        countries: selectedCountries,
        services: selectedServices
      };

      const { tvShows: newTVShows } = await fetchMoviesAndTVShows(params, 0, nextPage);

      setTVShows(prev => [...prev, ...newTVShows]);
      setCurrentPage(prev => ({ ...prev, tvShows: nextPage }));

      const cacheKey = createCacheKey(selectedCountries, selectedServices);
      setCache(prev => {
        const cached = prev.get(cacheKey);
        if (cached) {
          return new Map(prev).set(cacheKey, {
            ...cached,
            tvShows: [...cached.tvShows, ...newTVShows],
            currentPage: { ...cached.currentPage, tvShows: nextPage }
          });
        }
        return prev;
      });
    } catch (err) {
      console.error('Failed to load more TV shows:', err);
    } finally {
      setIsFetchingMore(false);
    }
  };

  // Fetch missing content type when user switches tabs
  useEffect(() => {
    const cacheKey = createCacheKey(selectedCountries, selectedServices);
    const cachedData = cache.get(cacheKey);

    if (!cachedData) return;

    // If switching to TV shows and we don't have them yet, fetch them
    if (contentType === ContentType.TV_SHOW && tvShows.length === 0 && selectedCountries.length > 0) {
      const fetchTVShows = async () => {
        setIsLoading(true);
        try {
          const params = {
            countries: selectedCountries,
            services: selectedServices
          };

          const { tvShows: tvData } = await fetchMoviesAndTVShows(params, 0, 1);
          setTVShows(tvData);
          setCurrentPage(prev => ({ ...prev, tvShows: 1 }));

          setCache(prev => {
            const cached = prev.get(cacheKey);
            if (cached) {
              return new Map(prev).set(cacheKey, {
                ...cached,
                tvShows: tvData,
                currentPage: { ...cached.currentPage, tvShows: 1 }
              });
            }
            return prev;
          });
        } catch (err) {
          console.error('Failed to fetch TV shows:', err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchTVShows();
    }

    // If switching to movies and we don't have them yet, fetch them
    if (contentType === ContentType.MOVIE && movies.length === 0 && selectedCountries.length > 0) {
      const fetchMovies = async () => {
        setIsLoading(true);
        try {
          const params = {
            countries: selectedCountries,
            services: selectedServices
          };

          const { movies: movieData } = await fetchMoviesAndTVShows(params, 1, 0);
          setMovies(movieData);
          setCurrentPage(prev => ({ ...prev, movies: 1 }));

          setCache(prev => {
            const cached = prev.get(cacheKey);
            if (cached) {
              return new Map(prev).set(cacheKey, {
                ...cached,
                movies: movieData,
                currentPage: { ...cached.currentPage, movies: 1 }
              });
            }
            return prev;
          });
        } catch (err) {
          console.error('Failed to fetch movies:', err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMovies();
    }
  }, [contentType, selectedCountries, selectedServices, cache, movies.length, tvShows.length]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Dynamic Background Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <Header />

      <main className="max-w-7xl mx-auto px-6 py-16 relative">
        <div className="flex flex-col gap-16">
          {/* Hero Section */}
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-[0.3em] mb-4 animate-bounce">
              <Clapperboard size={14} />
              Your Multi-Regional Movie Finder
            </div>
            <h2 className="text-6xl sm:text-8xl font-black text-white tracking-tight leading-[0.85] sm:leading-[0.85]">
              Venn
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Cine.</span>
            </h2>
            <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Find movies available in multiple countries at once.
            </p>
          </div>

          <SelectionPanel
            selectedCountries={selectedCountries}
            toggleCountry={toggleCountry}
            selectedServices={selectedServices}
            toggleService={toggleService}
          />

          <div className="flex flex-col items-center gap-8 -mt-8 relative z-20">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className={`group relative inline-flex items-center gap-5 px-14 py-7 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2.5rem] font-black text-2xl shadow-[0_20px_60px_-15px_rgba(79,70,229,0.5)] transition-all active:scale-95 overflow-hidden border border-white/20
                ${(selectedCountries.length === 0 || selectedServices.length === 0) ? 'opacity-70 cursor-not-allowed' : ''}
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="relative flex items-center gap-4">
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={32} />
                    Loading
                  </>
                ) : (
                  <>
                    <Search size={32} strokeWidth={3} />
                    Search
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            error === 'Please select at least one country and one platform.' ? (
              <p className="text-red-400 text-sm font-medium -mt-4 text-center">
                {error}
              </p>
            ) : (
              <div className="max-w-2xl mx-auto w-full bg-red-500/10 border border-red-500/50 p-6 rounded-3xl flex items-center gap-5 text-red-400 shadow-2xl animate-in fade-in slide-in-from-top-6">
                <AlertCircle size={28} />
                <p className="font-bold text-lg">{error}</p>
              </div>
            )
          )}

          <ResultsSection
            movies={movies}
            tvShows={tvShows}
            filteredResults={filteredResults}
            isLoading={isLoading}
            isFetchingMore={isFetchingMore}
            error={error}
            contentType={contentType}
            onContentTypeChange={setContentType}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            genres={genres}
            activeGenre={activeGenre}
            onGenreChange={setActiveGenre}
            selectedCountriesCount={selectedCountries.length}
            selectedCountries={selectedCountries}
            resultsRef={resultsRef}
            onLoadMoreMovies={loadMoreMovies}
            onLoadMoreTVShows={loadMoreTVShows}
          />
        </div>
      </main>

      <Footer />
      <Analytics />
    </div>
  );
};

export default App;

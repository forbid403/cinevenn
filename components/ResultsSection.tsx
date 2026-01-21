import React, { RefObject, useRef, useEffect } from 'react';
import { Sparkles, Clapperboard, Monitor, LayoutGrid, List, Filter, Loader2 } from 'lucide-react';
import { ContentType } from '../types';
import ContentCard from './ContentCard';
import SkeletonCard from './SkeletonCard';
import { useContentStore, useFilteredResults, useGenres } from '../stores/useContentStore';

interface ResultsSectionProps {
  resultsRef: RefObject<HTMLDivElement>;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ resultsRef }) => {
  const {
    isLoading,
    isFetchingMore,
    hasSearched,
    hasMore,
    error,
    contentType,
    viewMode,
    activeGenre,
    selectedCountries,
    setContentType,
    setViewMode,
    setActiveGenre,
    loadMoreResults,
  } = useContentStore();
  
  const filteredResults = useFilteredResults();
  const genres = useGenres();

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isFetchingMore) {
          loadMoreResults();
        }
      },
      { threshold: 1.0 }
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [observerRef, hasMore, isLoading, isFetchingMore, loadMoreResults]);


  const showInitialSkeletons = isLoading && filteredResults.length === 0;

  const getResultsTitle = () => {
    if (showInitialSkeletons) {
      return 'Searching the Global Library...';
    }
    if (filteredResults.length > 0) {
      return `Results (${filteredResults.length})`;
    }
    return 'Start Your Discovery';
  };

  return (
    <div ref={resultsRef} className="space-y-10 min-h-[500px] pt-12">
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-slate-800/50 pb-10">
          <div className="space-y-6 w-full md:w-auto">
            <div className="space-y-3">
              <h3 className="text-4xl font-black text-white flex items-center gap-4 tracking-tighter">
                <Sparkles className="text-indigo-400" size={36} />
                {getResultsTitle()}
              </h3>
              {!isLoading && !isFetchingMore && hasSearched && filteredResults.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 border text-[10px] font-black rounded-full uppercase tracking-widest ${
                    hasMore ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-green-500/10 border-green-500/30 text-green-400'
                  }`}>
                    {hasMore ? 'Scroll to load more' : 'All results loaded'}
                  </span>
                </div>
              )}
            </div>

            {/* Content Type Selector */}
            <div className="flex bg-slate-900/50 border border-slate-800 p-1.5 rounded-2xl shadow-xl w-fit">
              <button
                onClick={() => setContentType(ContentType.MOVIE)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  contentType === ContentType.MOVIE
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Clapperboard size={16} />
                Movies
              </button>
              <button
                onClick={() => setContentType(ContentType.TV_SHOW)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  contentType === ContentType.TV_SHOW
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Monitor size={16} />
                TV Shows
              </button>
            </div>
          </div>

          <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl shadow-2xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl transition-all duration-300 ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-xl'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <LayoutGrid size={24} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-xl transition-all duration-300 ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white shadow-xl'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <List size={24} />
            </button>
          </div>
        </div>

        {/* Genre Filters */}
        {filteredResults.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre)}
                className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeGenre === genre
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-900/50 border border-slate-800 text-slate-500 hover:text-white hover:border-slate-700'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        )}

        <div className={
          viewMode === 'grid'
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10"
            : "space-y-8"
        }>
          {showInitialSkeletons ? (
            Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={`initial-skeleton-${i}`} viewMode={viewMode} />
            ))
          ) : (
            <>
              {filteredResults.map((item) => (
                <ContentCard key={item.id} item={item} viewMode={viewMode} selectedCountries={selectedCountries} />
              ))}
            </>
          )}
        </div>

        {/* Infinite Scroll Loader */}
        <div ref={observerRef} className="h-10">
          {isFetchingMore && (
            <div className="flex justify-center items-center gap-3 text-slate-500 py-4">
              <Loader2 className="animate-spin" size={20} />
              <span className="font-semibold">Searching for more results...</span>
            </div>
          )}
        </div>
      </div>
      
      {!isLoading && filteredResults.length === 0 && hasSearched && !error && (
        <div className="py-40 text-center space-y-8 bg-slate-900/10 rounded-[4rem] border-2 border-dashed border-slate-800/40 max-w-5xl mx-auto group">
          <div className="w-32 h-32 bg-slate-800/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-slate-700/30 transition-all group-hover:scale-110 group-hover:rotate-12 group-hover:bg-slate-800/40">
            <Filter className="text-slate-700" size={64} />
          </div>
          <div className="space-y-4">
            <h4 className="text-4xl font-black text-slate-400 tracking-tighter">
              No Common Results Found
            </h4>
            <p className="text-slate-500 text-xl max-w-md mx-auto font-medium leading-relaxed">
              Try a different combination of countries and services.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
export default ResultsSection;

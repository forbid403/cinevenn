import React, { RefObject, useRef, useEffect, useState } from 'react';
import { Clapperboard, Monitor, LayoutGrid, List, Filter, Loader2 } from 'lucide-react';
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
    currentBatchProgress,
    setContentType,
    setViewMode,
    setActiveGenre,
    loadMoreResults,
  } = useContentStore();
  
  const filteredResults = useFilteredResults();
  const genres = useGenres();

  const observerRef = useRef<HTMLDivElement>(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const loadingMessages = [
    "The reels are spinning...",
    "Scanning the archives...",
    "Cross-referencing catalogs...",
    "Analyzing regional licenses...",
    "Verifying platform availability...",
    "Loading streaming metadata...",
    "Processing content matches...",
    "Checking service coverage...",
    "Curating your selection...",
    "Almost there..."
  ];

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

  // Rotate loading messages every 2 seconds
  useEffect(() => {
    if (!isFetchingMore) {
      // Reset to first message when loading stops
      setCurrentMessageIndex(0);
      return;
    }

    // Set up rotation timer
    const timer = setTimeout(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    // Cleanup on unmount or when dependencies change
    return () => clearTimeout(timer);
  }, [isFetchingMore, currentMessageIndex, loadingMessages.length]);


  const showInitialSkeletons = isLoading && filteredResults.length === 0;
  const showLoadMoreSkeletons = isFetchingMore;

  const getResultsTitle = () => {
    if (showInitialSkeletons) {
      return 'Searching the Global Library...';
    }
    if (filteredResults.length > 0) {
      return `Results`;
    }
    return 'Start Your Discovery';
  };

  return (
    <div ref={resultsRef} className="space-y-10 min-h-[500px] pt-12">
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-warm-gray-200 pb-10">
          <div className="space-y-6 w-full md:w-auto">
            <div className="space-y-3">
              <h3 className="text-4xl font-playfair font-black text-warm-black flex items-center gap-4 tracking-tight">
                {getResultsTitle()}
              </h3>
              {!isLoading && !isFetchingMore && hasSearched && filteredResults.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 border text-[10px] font-montserrat font-bold uppercase tracking-widest ${
                    hasMore ? 'bg-[#e4a44e]/10 border-[#e4a44e]/30 text-gold-700' : 'bg-green-600/10 border-green-600/30 text-green-700'
                  }`}>
                    {hasMore ? 'Scroll to load more' : 'All results loaded'}
                  </span>
                </div>
              )}
            </div>

            {/* Content Type Selector */}
            <div className="flex bg-cream-100 border border-warm-gray-200 shadow-xl w-fit">
              <button
                onClick={() => setContentType(ContentType.MOVIE)}
                className={`flex items-center gap-2 px-6 py-2.5 text-xs font-montserrat font-bold uppercase tracking-widest transition-all duration-300 ${
                  contentType === ContentType.MOVIE
                    ? 'bg-black text-white shadow-lg shadow-[#e4a44e]/30'
                    : 'text-sepia hover:text-warm-black hover:bg-cream-50'
                }`}
              >
                <Clapperboard size={16} />
                Movies
              </button>
              <button
                onClick={() => setContentType(ContentType.TV_SHOW)}
                className={`flex items-center gap-2 px-6 py-2.5 text-xs font-montserrat font-bold uppercase tracking-widest transition-all duration-300 ${
                  contentType === ContentType.TV_SHOW
                    ? 'bg-black text-white shadow-lg shadow-[#e4a44e]/30'
                    : 'text-sepia hover:text-warm-black hover:bg-cream-50'
                }`}
              >
                <Monitor size={16} />
                TV Shows
              </button>
            </div>
          </div>

          <div className="flex bg-cream-100 border border-warm-gray-200 shadow-2xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 transition-all duration-300 ${
                viewMode === 'grid'
                  ? 'bg-black text-white shadow-xl'
                  : 'text-sepia hover:text-warm-black hover:bg-cream-50'
              }`}
            >
              <LayoutGrid size={24} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 transition-all duration-300 ${
                viewMode === 'list'
                  ? 'bg-black text-white shadow-xl'
                  : 'text-sepia hover:text-warm-black hover:bg-cream-50'
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
                className={`px-5 py-2 text-[10px] font-montserrat font-bold uppercase tracking-widest transition-all ${
                  activeGenre === genre
                    ? 'bg-black text-white border-[#e4a44e] shadow-lg shadow-[#e4a44e]/20'
                    : 'bg-cream-100 border border-warm-gray-200 text-sepia hover:text-warm-black hover:border-[#e4a44e]'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        )}

        <div className={
          viewMode === 'grid'
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-10"
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
              {/* {showLoadMoreSkeletons && (
                Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={`loadmore-skeleton-${i}`} viewMode={viewMode} />
                ))
              )} */}
            </>
          )}
        </div>

        {/* Infinite Scroll Loader */}
        <div ref={observerRef} className="h-10">
          {isFetchingMore && (
            <div className="flex flex-col items-center gap-2 text-sepia py-4">
              <div className="flex items-center gap-3">
                <Loader2 className="animate-spin text-[#e4a44e]" size={20} />
                <span className="font-lora font-semibold">Searching for more results...</span>
                <div className="text-sm font-montserrat font-semibold text-warm-gray-400">
                  {currentBatchProgress}/20
                </div>
              </div>
              <div
                className="text-sm font-lora font-semibold text-sepia transition-opacity duration-300"
                role="status"
                aria-live="polite"
              >
                {loadingMessages[currentMessageIndex]}
              </div>
            </div>
          )}
        </div>
      </div>

      {
        !hasSearched && <div className="py-40 text-center space-y-8 bg-cream-100/50 max-w-5xl mx-auto group">
          <span className="text-4xl font-playfair font-black text-sepia tracking-tight">Click Search to start your discovery</span>
        </div>
      }

      {!isLoading && filteredResults.length === 0 && hasSearched && !error && (
        <div className="py-40 text-center space-y-8 bg-cream-100/50 border-2 border-dashed border-warm-gray-200 max-w-5xl mx-auto group">
          <div className="w-32 h-32 bg-[#e4a44e]/10 flex items-center justify-center mx-auto mb-8 border border-[#e4a44e]/20 transition-all group-hover:scale-110 group-hover:rotate-12 group-hover:bg-[#e4a44e]/20">
            <Filter className="text-[#e4a44e]" size={64} />
          </div>
          <div className="space-y-4">
            <h4 className="text-4xl font-playfair font-black text-sepia tracking-tight">
              Intermission
            </h4>
            <p className="text-warm-gray-400 text-xl max-w-md mx-auto font-lora leading-relaxed">
              No reels found with this selection. Try a different combination of countries and services.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
export default ResultsSection;

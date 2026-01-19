
import React, { useState } from 'react';
import { ContentItem } from '../types';
import { Star, Calendar, Loader2 } from 'lucide-react';
import { OTT_SERVICES } from '../constants';
import { fetchWatchProviders } from '../services/tmdbService';

interface ContentCardListProps {
  item: ContentItem;
  selectedCountries: string[];
}

// Helper function to get service info by ID
const getServiceInfo = (serviceId: string) => {
  return OTT_SERVICES.find(s => s.id === serviceId);
};

const ContentCardList: React.FC<ContentCardListProps> = ({ item, selectedCountries }) => {
  const [actualProviders, setActualProviders] = useState<string[] | null>(null);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);

  const handleShowProviders = async () => {
    if (actualProviders !== null) {
      // Already loaded, toggle off
      setActualProviders(null);
      return;
    }

    setIsLoadingProviders(true);
    try {
      const contentType = item.type === 'Movie' ? 'movie' : 'tv';
      const providers = await fetchWatchProviders(item.tmdbId, contentType, selectedCountries);
      setActualProviders(providers);
    } catch (error) {
      console.error('Failed to fetch providers:', error);
      setActualProviders([]);
    } finally {
      setIsLoadingProviders(false);
    }
  };

  return (
    <div className="group relative bg-slate-900/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-800/60 hover:border-indigo-500/50 transition-all duration-500 flex flex-row h-36 sm:h-48 shadow-2xl hover:shadow-indigo-500/10">
      <div className="w-24 sm:w-36 flex-shrink-0 relative overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent" />
        <div className="absolute top-2 left-2">
          <span className="bg-indigo-600/90 backdrop-blur-md text-white text-[8px] sm:text-[10px] font-black px-2 sm:px-3 py-1 rounded-full border border-white/20 uppercase tracking-widest">
            {item.type}
          </span>
        </div>
      </div>
      <div className="flex-grow p-3 sm:p-6 flex flex-col justify-between overflow-hidden relative">
        <div>
          <div className="flex justify-between items-start gap-2 sm:gap-4 mb-2 sm:mb-3">
            <div className="space-y-1 min-w-0">
              <h4 className="text-sm sm:text-2xl font-black text-white leading-tight group-hover:text-indigo-400 transition-colors line-clamp-2 sm:truncate">
                {item.title}
              </h4>
              <div className="flex items-center gap-2 sm:gap-3 text-slate-500 text-[9px] sm:text-xs font-bold uppercase tracking-widest flex-wrap">
                <div className="flex items-center gap-1">
                  <Calendar size={10} className="sm:w-3.5 sm:h-3.5" />
                  <span>{item.year}</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-slate-800 hidden sm:block" />
                <div className="flex gap-1 flex-wrap">
                  {item.genre.slice(0, 2).map((g, idx) => (
                    <span key={idx} className="text-indigo-400/80">
                      {g}{idx < Math.min(item.genre.length, 2) - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-slate-950/50 rounded-xl sm:rounded-2xl border border-slate-800/50 text-yellow-500 flex-shrink-0">
              <Star size={12} className="sm:w-4 sm:h-4" fill="currentColor" />
              <span className="text-xs sm:text-base font-black">{item.rating}</span>
            </div>
          </div>

          <p className="text-slate-400 text-[10px] sm:text-sm line-clamp-1 sm:line-clamp-2 mb-2 sm:mb-4 leading-relaxed hidden sm:block">
            {item.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {
            actualProviders !== null ?
              null : <button
            onClick={handleShowProviders}
            disabled={isLoadingProviders}
            className="px-2 sm:px-4 py-1 sm:py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] sm:text-xs font-bold rounded-lg sm:rounded-xl transition-all disabled:opacity-50"
          >
            {
               isLoadingProviders ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <Loader2 size={10} className="sm:w-3.5 sm:h-3.5 animate-spin" />
              </div>
            ) : (
              'Providers'
            )}
          </button>}
          {actualProviders?.slice(0, 4).map((serviceId) => {
            const service = getServiceInfo(serviceId);
            return service ? (
              <div
                key={serviceId}
                className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white flex items-center justify-center overflow-hidden p-1.5 transition-all hover:scale-110 shadow-lg"
                title={service.name}
              >
                <img
                  src={service.logo}
                  alt={service.name}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : null;
          })}
          {actualProviders && actualProviders.length > 4 && (
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-950/80 text-slate-300 border border-slate-700 flex items-center justify-center font-black text-[8px] sm:text-[10px]">
              +{actualProviders.length - 4}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentCardList;

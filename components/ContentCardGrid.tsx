
import React, { useState } from 'react';
import { ContentItem } from '../types';
import { Star, Calendar, Loader2 } from 'lucide-react';
import { OTT_SERVICES } from '../constants';
import { fetchWatchProviders } from '../services/tmdbService';

interface ContentCardGridProps {
  item: ContentItem;
  selectedCountries: string[];
}

// Helper function to get service info by ID
const getServiceInfo = (serviceId: string) => {
  return OTT_SERVICES.find(s => s.id === serviceId);
};

const ContentCardGrid: React.FC<ContentCardGridProps> = ({ item, selectedCountries }) => {
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
    <div className="group relative bg-slate-900/40 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-slate-800/60 hover:border-indigo-500/50 transition-all duration-500 flex flex-col sm:flex-row h-auto sm:h-64 shadow-2xl hover:shadow-indigo-500/10">
      <div className="w-full sm:w-48 h-64 sm:h-auto flex-shrink-0 relative overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full border border-white/20 uppercase tracking-widest">
            {item.type}
          </span>
        </div>
      </div>
      <div className="flex-grow p-8 flex flex-col justify-between overflow-hidden relative">
        <div>
          <div className="flex justify-between items-start gap-6 mb-4">
            <div className="space-y-1">
              <h4 className="text-2xl sm:text-3xl font-black text-white leading-tight group-hover:text-indigo-400 transition-colors truncate">
                {item.title}
              </h4>
              <div className="flex items-center gap-3 text-slate-500 text-xs font-bold uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>{item.year}</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-slate-800" />
                <div className="flex gap-2">
                  {item.genre.map((g, idx) => (
                    <span key={idx} className="text-indigo-400/80">
                      {g}{idx < item.genre.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-950/50 rounded-2xl border border-slate-800/50 text-yellow-500 flex-shrink-0">
              <Star size={18} fill="currentColor" />
              <span className="text-lg font-black">{item.rating}</span>
            </div>
          </div>

          <p className="text-slate-400 text-sm sm:text-base line-clamp-2 sm:line-clamp-3 mb-6 max-w-2xl leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleShowProviders}
              disabled={isLoadingProviders}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50"
            >
              {isLoadingProviders ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                </div>
              ) : actualProviders !== null ? (
                null
              ) : (
                'Show Providers'
              )}
            </button>
            {actualProviders?.map((serviceId) => {
              const service = getServiceInfo(serviceId);
              return service ? (
                <div
                  key={serviceId}
                  className="w-10 h-10 rounded-xl bg-white flex items-center justify-center overflow-hidden p-2 transition-all hover:scale-110 shadow-lg"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCardGrid;

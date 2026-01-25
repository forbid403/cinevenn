
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
    <div className="group relative bg-cream-100 backdrop-blur-xl  overflow-hidden border border-warm-gray-200 transition-all duration-500 flex flex-col shadow-md hover:shadow-gold-600/10">
      <div className="w-full h-64 flex-shrink-0 relative overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sepia/60 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="bg-gold-600/90 backdrop-blur-md text-white text-[10px] font-montserrat font-bold px-3 py-1  border border-cream-50/30 uppercase tracking-widest">
            {item.type}
          </span>
        </div>
         <div className="absolute bg-[#f5f1e8] flex flex-row right-4 bottom-4 gap-2 px-4 py-2 bg-warm-black/80 border border-warm-black/50 text-gold-600 flex-shrink-0">
            <Star size={18} fill="#e4a44e" strokeWidth={0} className="self-center" />
            <span className="text-md font-montserrat font-bold">{item.rating}</span>
          </div>
      </div>
      <div className="flex-grow p-4 flex flex-col justify-between overflow-hidden relative">
        <div>
          <div className="flex justify-between items-start gap-6 mb-4">
            <div className="flex flex-col space-y-1 w-full">
              <h4 className="text-xl sm:text-3xl font-baskerville font-bold text-warm-black leading-tight group-hover:text-gold-600 transition-colors">
                {item.title}
              </h4>
              <div className="flex items-center gap-3 text-sepia text-xs font-montserrat font-bold uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>{item.year}</span>
                </div>
                <div className="flex gap-2 items-center">
                  {item.genre.map((label, idx) => (
                    <span key={idx} className="text-gold-700 text-[10px]">
                      {label === 'Sci-Fi' ? 'SF' : label}{idx < item.genre.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="text-warm-gray-400 text-sm sm:text-base line-clamp-2 sm:line-clamp-3 mb-6 max-w-2xl leading-relaxed font-lora">
            {item.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3">
            {
                actualProviders !== null ?
                  null : <button
                onClick={handleShowProviders}
                disabled={isLoadingProviders}
                className="px-2 sm:px-4 py-1 sm:py-2 bg-gold-600 hover:bg-gold-700 text-[9px] border sm:text-s font-montserrat font-boldsm: transition-all disabled:opacity-50"
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
            {actualProviders?.map((serviceId) => {
              const service = getServiceInfo(serviceId);
              return service ? (
                <div
                  key={serviceId}
                  className="w-12 h-12 bg-white border-2 border-warm-gray-200 rounded-lg flex items-center justify-center overflow-hidden p-1 transition-all hover:scale-110 hover:border-gold-600 hover:shadow-xl cursor-pointer active:scale-95"
                  title={service.name}
                >
                  <img
                    src={service.logo}
                    alt={service.name}
                    className="max-w-8 max-h-8 object-contain pointer-events-none"
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

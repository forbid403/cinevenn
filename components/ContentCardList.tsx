
import React, { useState } from 'react';
import { ContentItem } from '../types';
import { Star, Calendar, Loader2 } from 'lucide-react';
import { OTT_SERVICES } from '../constants';
import { fetchWatchProviders } from '../services/intersectionService';
import { getExternalLink } from '../services/tmdbService';
import { analytics, AnalyticsEvents } from '../services/analyticsService';
import { useContentStore } from '../stores/useContentStore';

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
  const contentType = item.type;
  const selectedServices = useContentStore((state) => state.selectedServices);

  const handleShowProviders = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsLoadingProviders(true);
    try {
      const providers = await fetchWatchProviders(item.tmdbId, contentType, selectedCountries);
      setActualProviders(providers);
    } catch (error) {
      console.error('Failed to fetch providers:', error);
      setActualProviders([]);
    } finally {
      setIsLoadingProviders(false);
    }
  };

  const handleClickItem = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    getExternalLink(item.tmdbId, contentType).then(fetchedUrl => {
      // Determine external site from URL
      const externalSite = fetchedUrl.includes('imdb.com') ? 'imdb' : 'tmdb';
      // Track external content click
      analytics.track(AnalyticsEvents.CLICK_EXTERNAL_CONTENT, {
        content_id: item.id,
        content_type: item.type,
        title: item.title,
        external_site: externalSite,
        country_count: selectedCountries.length,
        platform_count: selectedServices.length
      });

      window.open(fetchedUrl, '_blank');
    });
  }

  return (
    <div className="group relative bg-cream-100 backdrop-blur-xl hover:cursor-pointer overflow-hidden border border-warm-gray-200 hover:border-gold-600 transition-all duration-500 flex flex-row h-36 sm:h-48 shadow-xl hover:shadow-gold-600/10" onClick={handleClickItem}>
      <div className="w-24 sm:w-36 flex-shrink-0 relative overflow-hidden">
        <img
          onError={(e) => {
            e.currentTarget.src = '/placeholder.webp';
          }}
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sepia/60 to-transparent" />
        <div className="absolute top-2 left-2">
          <span className="bg-gold-600/90 backdrop-blur-md text-white text-[8px] sm:text-[10px] font-montserrat font-bold px-2 sm:px-3 py-1  border border-cream-50/30 uppercase tracking-widest">
            {item.type}
          </span>
        </div>
      </div>
      <div className="flex-grow p-3 sm:p-6 flex flex-col justify-between overflow-hidden relative">
        <div>
          <div className="flex justify-between items-start gap-2 sm:gap-4 mb-2 sm:mb-3">
            <div className="space-y-1 min-w-0">
              <h4 className="text-sm sm:text-2xl font-baskerville font-bold text-warm-black leading-tight group-hover:text-gold-600 transition-colors line-clamp-2 sm:truncate">
                {item.title}
              </h4>
              <div className="flex items-center gap-2 sm:gap-3 text-sepia text-[9px] sm:text-xs font-montserrat font-bold uppercase tracking-widest flex-wrap">
                <div className="flex items-center gap-1">
                  <Calendar size={10} className="sm:w-3.5 sm:h-3.5" />
                  <span>{item.year}</span>
                </div>
                <span className="w-1 h-1  bg-warm-gray-200 hidden sm:block" />
                <div className="flex gap-1 flex-wrap">
                  {item.genre.slice(0, 2).map((g, idx) => (
                    <span key={idx} className="text-gold-700">
                      {g}{idx < Math.min(item.genre.length, 2) - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-warm-black/80sm: text-gold-600 flex-shrink-0">
              <Star size={12} className="sm:w-4 sm:h-4" fill="#e4a44e" strokeWidth={0} />
              <span className="text-xs sm:text-base font-montserrat font-bold">{item.rating}</span>
            </div>
          </div>

          <p className="text-warm-gray-400 text-[10px] sm:text-sm line-clamp-1 sm:line-clamp-2 mb-2 sm:mb-4 leading-relaxed font-lora hidden block">
            {item.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {
            actualProviders !== null ?
              null : <button
            onClick={handleShowProviders}
            disabled={isLoadingProviders}
            className="px-2 sm:px-4 py-1 sm:py-2 border text-[9px] sm:text-xs font-montserrat font-boldsm: transition-all disabled:opacity-50"
          >
            {
              isLoadingProviders ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <Loader2 size={10} className="sm:w-3.5 sm:h-3.5 animate-spin" />
              </div>
              ) : <div className="hover:cursor-pointer">Providers</div>
            }
          </button>
          }
          {actualProviders?.slice(0, 4).map((serviceId) => {
            const service = getServiceInfo(serviceId);
            return service ? (
              <div
                key={serviceId}
                className="w-7 h-7 sm:w-9 sm:h-9sm: bg-cream-100 border border-warm-gray-200 flex items-center justify-center overflow-hidden p-1.5 transition-all hover:scale-110 shadow-lg"
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
            <div className="w-7 h-7 sm:w-9 sm:h-9sm: bg-warm-black/80 text-cream-50 border border-warm-black/70 flex items-center justify-center font-montserrat font-bold text-[8px] sm:text-[10px]">
              +{actualProviders.length - 4}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentCardList;

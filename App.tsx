import React, { useEffect, useRef } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { useContentStore } from './stores/useContentStore';
import Header from './components/Header';
import VintageHero from './components/VintageHero';
import SelectionPanel from './components/SelectionPanel';
import ResultsSection from './components/ResultsSection';
import Footer from './components/Footer';
import { installToast } from './components/Toast';
import { Analytics } from '@vercel/analytics/react';

const App: React.FC = () => {
  useEffect(() => {
    installToast();
  }, []);

  const resultsRef = useRef<HTMLDivElement>(null);

  // 스토어에서 필요한 상태와 액션 가져오기
  const {
    isLoading,
    error,
    handleSearch,
    hasSearched
  } = useContentStore();

  const handleSearchClick = async () => {
    await handleSearch();

    if (!hasSearched || error) {
      return;
    } else {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 text-warm-black font-lora selection:bg-gold-600/30 overflow-x-hidden">
      <Header />
      <VintageHero />

      <main className="max-w-7xl mx-auto px-4 py-16 relative">
        <div className="flex flex-col gap-16">
          <SelectionPanel />

          <div className="flex flex-col items-center gap-8 -mt-8 relative z-20">
            <div
              className={`
                flex items-center gap-4 relative
                transition-all duration-300 ease-in-out
                hover:scale-110 hover:cursor-pointer
                active:scale-95
                ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:drop-shadow-2xl'}
              `}
              onClick={handleSearchClick}
            >
              <img
                src="/ticket.png"
                alt="Ticket"
                className={`
                  transition-transform duration-300
                  ${!isLoading && 'hover:rotate-2'}
                  w-[300px]
                `}
              />
              <p 
                style={{fontFamily: 'Special Elite'}}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold tracking-wide pointer-events-none text-warm-black drop-shadow-sm"
              >
                {
                  isLoading ? 'Loading...' : 'Search'
                }
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            error === 'Please select at least one country and one platform.' ||
            error === 'You can select a maximum of 2 countries. Please deselect one first.' ? (
              <p className="text-orange text-sm font-lora font-medium -mt-4 text-center">
                {error}
              </p>
            ) : (
              <div className="max-w-2xl mx-auto w-full bg-deep-red/10 border border-deep-red/50 p-6 flex items-center gap-5 text-deep-red shadow-2xl animate-in fade-in slide-in-from-top-6">
                <AlertCircle size={28} />
                <p className="font-baskerville font-bold text-lg">{error}</p>
              </div>
            )
          )}

          <ResultsSection resultsRef={resultsRef} />
        </div>
      </main>

      <Footer />
      <Analytics />
    </div>
  );
};

export default App;

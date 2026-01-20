import React, { useEffect, useRef } from 'react';
import { Search, Loader2, AlertCircle, Clapperboard } from 'lucide-react';
import { useContentStore } from './stores/useContentStore';
import Header from './components/Header';
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
    selectedCountries,
    selectedServices,
    isLoading,
    error,
    handleSearch
  } = useContentStore();

  const handleSearchClick = async () => {
    await handleSearch();
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

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
              Cine
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Venn.</span>
            </h2>
            <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Find movies available in multiple countries at once.
            </p>
          </div>

          <SelectionPanel />

          <div className="flex flex-col items-center gap-8 -mt-8 relative z-20">
            <button
              onClick={handleSearchClick}
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

          <ResultsSection resultsRef={resultsRef} />
        </div>
      </main>

      <Footer />
      <Analytics />
    </div>
  );
};

export default App;

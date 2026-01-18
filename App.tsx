import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { ContentItem, ContentType, SearchParams, ViewMode } from './types';
import { fetchCrossCountryContent } from './services/geminiService';
import Header from './components/Header';
import SelectionPanel from './components/SelectionPanel';
import ResultsSection from './components/ResultsSection';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['KR', 'US']);
  const [selectedServices, setSelectedServices] = useState<string[]>(['netflix', 'disney']);
  const [contentType, setContentType] = useState<ContentType>(ContentType.ALL);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [results, setResults] = useState<ContentItem[]>([]);
  const [filteredResults, setFilteredResults] = useState<ContentItem[]>([]);
  const [activeGenre, setActiveGenre] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(false);
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

  const genres = ['All', ...Array.from(new Set(results.flatMap(item => item.genre)))].slice(0, 8);

  useEffect(() => {
    let filtered = [...results];

    if (activeGenre !== 'All') {
      filtered = filtered.filter(item => item.genre.includes(activeGenre));
    }

    setFilteredResults(filtered);
  }, [activeGenre, results]);

  const handleSearch = async () => {
    if (selectedCountries.length === 0 || selectedServices.length === 0) {
      setError('Please select at least one country and one platform.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);
    setActiveGenre('All');

    try {
      const params: SearchParams = {
        countries: selectedCountries,
        services: selectedServices,
        type: contentType
      };
      const data = await fetchCrossCountryContent(params);
      setResults(data);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError('Failed to fetch global library data. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
              <Sparkles size={14} />
              Unified Content Intelligence
            </div>
            <h2 className="text-6xl sm:text-8xl font-black text-white tracking-tight leading-[0.85] sm:leading-[0.85]">
              Catalog <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Intersection.</span>
            </h2>
            <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Tired of fragmented libraries? Discover movies and TV shows shared across your favorite countries and streaming providers in seconds.
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
              className="group relative inline-flex items-center gap-5 px-14 py-7 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2.5rem] font-black text-2xl shadow-[0_20px_60px_-15px_rgba(79,70,229,0.5)] transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden border border-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="relative flex items-center gap-4">
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={32} />
                    Processing Libraries...
                  </>
                ) : (
                  <>
                    <Search size={32} strokeWidth={3} />
                    Find Global Matches
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="max-w-2xl mx-auto w-full bg-red-500/10 border border-red-500/50 p-6 rounded-3xl flex items-center gap-5 text-red-400 shadow-2xl animate-in fade-in slide-in-from-top-6">
              <AlertCircle size={28} />
              <p className="font-bold text-lg">{error}</p>
            </div>
          )}

          <ResultsSection
            results={results}
            filteredResults={filteredResults}
            isLoading={isLoading}
            error={error}
            contentType={contentType}
            onContentTypeChange={setContentType}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            genres={genres}
            activeGenre={activeGenre}
            onGenreChange={setActiveGenre}
            selectedCountriesCount={selectedCountries.length}
            resultsRef={resultsRef}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;

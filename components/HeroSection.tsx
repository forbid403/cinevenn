import React from 'react';
import { Sparkles } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="text-center space-y-8 max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-3 px-5 py-2 bg-indigo-500/10 border text-xs font-black uppercase tracking-[0.3em] mb-4 animate-bounce">
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
  );
};

export default HeroSection;

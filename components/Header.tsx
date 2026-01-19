import React from 'react';
import { Share2, Info, Clapperboard } from 'lucide-react';
import { openToast } from './Toast';

const Header: React.FC = () => {

  const handleClickShare = () => {
    navigator.clipboard.writeText('https://cinevennsearch.vercel.app');
    openToast('Link Copied!');
  }

  return (
    <header className="sticky top-0 z-[100] bg-slate-950/70 backdrop-blur-2xl border-b border-slate-800/40">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 transition-all group-hover:rotate-12 group-hover:scale-110">
            <Clapperboard className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter leading-none flex items-center gap-1">
              CINE<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">VENN</span>
            </h1>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Cross-Reference Streaming Search</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition-all">
            <Share2 size={20} onClick={handleClickShare} />
          </button>
          {/* <button className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition-all">
            <Info size={20} />
          </button> */}
        </div>
      </div>
    </header>
  );
};

export default Header;

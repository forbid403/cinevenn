import React from 'react';
import { Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900/50 py-32 mt-32 bg-slate-950/80 backdrop-blur-2xl relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="col-span-1 md:col-span-2 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Globe className="text-white" size={28} />
            </div>
            <span className="font-black text-3xl tracking-tighter text-white">GLOBALSTREAM</span>
          </div>
          <p className="text-slate-500 text-xl leading-relaxed max-w-lg">
            The ultimate cross-reference engine for global streaming metadata. We solve the puzzle of regional content availability.
          </p>
        </div>
        <div className="space-y-6">
          <h5 className="text-white font-black uppercase tracking-[0.2em] text-xs">Resources</h5>
          <ul className="space-y-4 text-slate-500 font-bold text-sm">
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Catalog API</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Data Partners</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Licensing Nodes</a></li>
          </ul>
        </div>
        <div className="space-y-6">
          <h5 className="text-white font-black uppercase tracking-[0.2em] text-xs">Platform</h5>
          <ul className="space-y-4 text-slate-500 font-bold text-sm">
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Status</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-20 mt-20 border-t border-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-8 text-slate-600 font-black uppercase tracking-[0.3em] text-[10px]">
        <div className="flex items-center gap-3">
          <span>&copy; 2025 GlobalStream Intel Engine</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-indigo-500/40">Powered by Gemini 3 Flash Hybrid</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

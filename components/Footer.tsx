import React from 'react';
import { Clapperboard } from 'lucide-react';

const PRIVACY_POLICY_LINK = 'https://superb-goose-420.notion.site/Privacy-Policy-2eda16ed7abb801c8895e3353c75e13e';
const TERMS_OF_SERVICE_LINK = 'https://superb-goose-420.notion.site/Terms-of-Services-2eda16ed7abb80d7966fe4599253dd35';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900/50 py-32 mt-32 bg-slate-950/80 backdrop-blur-2xl relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="col-span-1 md:col-span-2 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Clapperboard className="text-white" size={28} />
            </div>
            <span className="font-black text-3xl tracking-tighter text-white">VENNSEARCH</span>
          </div>
          <p className="text-slate-500 text-xl leading-relaxed max-w-lg">
            © 2026 VENN CINE. All rights reserved.
          </p>
        </div>
        <div className="space-y-6">
          <h5 className="text-white font-black uppercase tracking-[0.2em] text-xs">Platform</h5>
          <ul className="space-y-4 text-slate-500 font-bold text-sm">
            <li><a href="mailto:sonia.bae.tech@gmail.com" className="hover:text-indigo-400 transition-colors">Contact Us</a></li>
            <li><a href={PRIVACY_POLICY_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
            <li><a href={TERMS_OF_SERVICE_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

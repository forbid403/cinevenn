import React from 'react';
import { Share2, Clapperboard } from 'lucide-react';
import { openToast } from './Toast';
import { useScrollPosition } from '../hooks/useScrollPosition';

const Header: React.FC = () => {
  const scrollPosition = useScrollPosition();
  const isScrolled = scrollPosition > 300;

  const handleClickShare = () => {
    navigator.clipboard.writeText('https://cinevennsearch.vercel.app');
    openToast('Link Copied!');
  }

  const handleLogoClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
      isScrolled
        ? 'bg-cream-50/95 backdrop-blur-2xl shadow-lg'
        : 'bg-transparent border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div
          className="flex items-center gap-2 group cursor-pointer active:scale-95 transition-transform"
          onClick={handleLogoClick}
          role="button"
          aria-label="Scroll to top"
        >
          <div className="w-12 h-12 flex items-center justify-center transition-all group-hover:rotate-12 group-hover:scale-110">
            <Clapperboard className="text-cream-50" size={28} />
          </div>
          <div>
            <h1 className={`text-xl font-playfair font-black text-warm-black tracking-tighter leading-none flex items-center transition-all duration-300 ${
              isScrolled
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-4 pointer-events-none'
            }`}>
              Cine<span className="text-[#e4a44e]">Venn</span>
            </h1>
          </div>
        </div>
        {
          isScrolled &&
          <div className="flex items-center gap-3">
            <button className="p-3 bg-warm-black/5  text-sepia transition-all duration-300" onClick={handleClickShare}>
              <Share2 size={20} />
            </button>
          </div>
        }
      </div>
    </header>
  );
};

export default Header;

import React, { useState, useEffect } from 'react';
import { Film } from 'lucide-react';

// Vintage cinema image filenames
const HERO_IMAGES = [
  'vintage-01.gif',
  'vintage-02.gif',
  'vintage-03.gif',
  'vintage-04.gif',
  'vintage-05.gif',
  'vintage-06.gif',
  'vintage-07.gif',
  'vintage-08.gif',
  'vintage-09.gif',
];

const VintageHero: React.FC = () => {
  const [currentImage, setCurrentImage] = useState('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Randomize image on mount
    const randomIndex = Math.floor(Math.random() * HERO_IMAGES.length);
    setCurrentImage(`/vintage-hero/${HERO_IMAGES[randomIndex]}`);
  }, []);

  return (
    <div className="relative h-[70vh] overflow-hidden bg-warm-black">
      {/* Ken Burns animated background */}
      {currentImage && !imageError && (
        <div className="absolute inset-0">
          <img
            src={currentImage}
            alt="Vintage cinema scene"
            className="w-full h-full object-cover animate-ken-burns opacity-40"
            onError={() => setImageError(true)}
          />
        </div>
      )}

      {/* Fallback gradient if image fails to load */}
      {imageError && (
        <div className="absolute inset-0 bg-gradient-to-br from-warm-black via-sepia/20 to-warm-black" />
      )}

      {/* Film grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Gradient vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cream-50" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-3 px-5 py-2 text-xs font-montserrat uppercase tracking-[0.3em] mb-6 whitespace-nowrap">
          <Film size={14} strokeWidth={1.5}/>
          Global Streaming Archive
        </div>

        <h1 className="font-playfair font-black text-7xl sm:text-9xl text-warm-black tracking-tight leading-[0.9] mb-6">
          Cine<span className="text-[#e4a44e] font-imperial italic font-bold">V</span>enn
        </h1>

        <p className="font-lora text-xl sm:text-2xl text-sepia max-w-2xl leading-relaxed">
          Discover films available across multiple countries
        </p>
      </div>
    </div>
  );
};

export default VintageHero;

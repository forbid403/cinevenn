
import React, { useMemo } from 'react';
import { COUNTRIES, OTT_SERVICES } from '../constants';
import { Country, OTTService } from '../types';
import { Check } from 'lucide-react';
import { useContentStore } from '../stores/useContentStore';

const SelectionPanel: React.FC = () => {
  // 스토어에서 상태와 액션 가져오기
  const {
    selectedCountries,
    selectedServices,
    toggleCountry,
    toggleService
  } = useContentStore();
  const sortedCountries = useMemo(() => {
    const selected = COUNTRIES.filter(c => selectedCountries.includes(c.code));
    const unselected = COUNTRIES.filter(c => !selectedCountries.includes(c.code));
    return [...selected, ...unselected];
  }, [selectedCountries]);

  const sortedServices = useMemo(() => {
    const selected = OTT_SERVICES.filter(s => selectedServices.includes(s.id));
    const unselected = OTT_SERVICES.filter(s => !selectedServices.includes(s.id));
    return [...selected, ...unselected];
  }, [selectedServices]);

  return (
    <div className="">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#e4a44e]/5 blur-[80px]  -translate-y-1/2 translate-x-1/2" />

      <div className="mb-14 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-playfair font-black text-warm-black flex items-center gap-4 tracking-tight">
              {/* <span className="w-10 h-10 bg-[#e4a44e] flex items-center justify-center text-sm font-montserrat text-white shadow-xl shadow-[#e4a44e]/20">1</span> */}
              Select Target Regions
            </h3>
            <p className="text-sm font-montserrat font-medium">Select multiple countries to find common catalog overlaps.</p>
          </div>
          <div className="flex items-center gap-3 px-6 py-2 bg-cream-100  border border-warm-gray-200">
            <div className={`w-2 h-2  ${selectedCountries.length > 0 ? 'bg-[#e4a44e] animate-pulse' : 'bg-warm-gray-400'}`} />
            <span className="text-[10px] font-montserrat font-bold uppercase tracking-widest">
              {selectedCountries.length} Selected
            </span>
          </div>
        </div>
        <div className="border border-warm-gray-200 bg-warm-gray-200 p-px">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-px bg-warm-gray-200">
            {sortedCountries.map((c: Country) => (
              <button
                key={c.code}
                onClick={() => toggleCountry(c.code)}
                className={`group flex flex-col items-center gap-3 p-5 transition-all duration-500 relative overflow-hidden ${
                  selectedCountries.includes(c.code)
                    ? 'bg-black text-white shadow-2xl shadow-black/30 scale-[1.05] z-10'
                    : 'bg-cream-100 hover:text-white'
                }`}
              >
                <div className="relative">
                  <span className="text-4xl filter drop-shadow-2xl transition-transform group-hover:scale-110 duration-500 block">{c.flag}</span>
                  {selectedCountries.includes(c.code) && (
                     <div className="absolute -top-1 -right-1 bg-[#e4a44e] text-warm-black p-0.5 shadow-lg animate-in zoom-in">
                        <Check size={10} strokeWidth={4} />
                     </div>
                  )}
                </div>
                <span className="text-[10px] font-montserrat font-bold uppercase tracking-[0.15em]">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-playfair font-black text-warm-black flex items-center gap-4 tracking-tight">
              Select Platforms
            </h3>
            <p className="text-sepia text-sm font-lora font-medium">Check availability against specific OTT providers.</p>
          </div>
          <div className="flex items-center gap-3 px-6 py-2 bg-cream-100 border border-warm-gray-200">
            <div className={`w-2 h-2  ${selectedServices.length > 0 ? 'bg-[#e4a44e] animate-pulse' : 'bg-warm-gray-400'}`} />
            <span className="text-[10px] text-sepia font-montserrat font-bold uppercase tracking-widest">
              {selectedServices.length} Selected
            </span>
          </div>
        </div>
        <div className="border border-warm-gray-200 bg-warm-gray-200 p-px">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-px bg-warm-gray-200">
            {sortedServices.map((s: OTTService) => (
              <button
                key={s.id}
                onClick={() => toggleService(s.id)}
                className={`group flex flex-col items-center justify-center p-8 transition-all duration-700 gap-6 min-h-[180px] relative overflow-hidden ${
                  selectedServices.includes(s.id)
                    ? 'bg-black text-white shadow-2xl scale-[1.05] z-10'
                    : 'bg-cream-100 text-sepia hover:bg-black hover:text-white'
                }`}
              >
                {/* Animated selection ring */}
                {selectedServices.includes(s.id) && (
                  <div className="absolute inset-0 animate-pulse" />
                )}

                <div>
                  <img
                    src={s.logo}
                    alt={s.name}
                    className="w-15 h-14 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <span className="text-[11px] font-montserrat font-bold uppercase tracking-[0.2em]">{s.name}</span>

                {selectedServices.includes(s.id) && (
                  <div className="absolute bottom-4 flex justify-center w-full animate-bounce">
                    <div className="w-1.5 h-1.5  bg-[#e4a44e]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-end gap-1 pt-1 text-gray-800">
          <p className="text-xs">Data Powered by 
            <a href="https://justwatch.com/" target="_blank" rel="noopener noreferrer" className="hover:underline"> JustWatch</a>
          </p>
        </div>

      </div>
    </div>
  );
};
export default SelectionPanel;


import React, { useMemo } from 'react';
import { COUNTRIES, OTT_SERVICES } from '../constants';
import { Country, OTTService } from '../types';
import { Check } from 'lucide-react';

interface SelectionPanelProps {
  selectedCountries: string[];
  toggleCountry: (code: string) => void;
  selectedServices: string[];
  toggleService: (id: string) => void;
}

const SelectionPanel: React.FC<SelectionPanelProps> = ({
  selectedCountries,
  toggleCountry,
  selectedServices,
  toggleService
}) => {
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
    <div className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800/60 rounded-[3rem] p-10 sm:p-14 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="mb-14 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white flex items-center gap-4 tracking-tight">
              <span className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-sm shadow-xl shadow-indigo-600/20">1</span>
              Target Regions
            </h3>
            <p className="text-slate-500 text-sm font-medium ml-14">Select multiple countries to find common catalog overlaps.</p>
          </div>
          <div className="flex items-center gap-3 px-6 py-2 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-md">
            <div className={`w-2 h-2 rounded-full ${selectedCountries.length > 0 ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}`} />
            <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">
              {selectedCountries.length} Selected
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
          {sortedCountries.map((c: Country) => (
            <button
              key={c.code}
              onClick={() => toggleCountry(c.code)}
              className={`group flex flex-col items-center gap-3 p-5 rounded-3xl border transition-all duration-500 relative overflow-hidden ${
                selectedCountries.includes(c.code)
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-2xl shadow-indigo-600/30 scale-[1.05] z-10'
                  : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-600 hover:bg-slate-800/80'
              }`}
            >
              <div className="relative">
                <span className="text-4xl filter drop-shadow-2xl transition-transform group-hover:scale-110 duration-500 block">{c.flag}</span>
                {selectedCountries.includes(c.code) && (
                   <div className="absolute -top-1 -right-1 bg-white text-indigo-600 rounded-full p-0.5 shadow-lg animate-in zoom-in">
                      <Check size={10} strokeWidth={4} />
                   </div>
                )}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white flex items-center gap-4 tracking-tight">
              <span className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-sm shadow-xl shadow-indigo-600/20">2</span>
              Streaming Platforms
            </h3>
            <p className="text-slate-500 text-sm font-medium ml-14">Check availability against specific OTT providers.</p>
          </div>
          <div className="flex items-center gap-3 px-6 py-2 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-md">
            <div className={`w-2 h-2 rounded-full ${selectedServices.length > 0 ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}`} />
            <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">
              {selectedServices.length} Selected
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6">
          {sortedServices.map((s: OTTService) => (
            <button
              key={s.id}
              onClick={() => toggleService(s.id)}
              className={`group flex flex-col items-center justify-center p-8 rounded-[2.5rem] border transition-all duration-700 gap-6 min-h-[180px] relative overflow-hidden ${
                selectedServices.includes(s.id)
                  ? `${s.color} border-white/40 text-white shadow-2xl scale-[1.05] z-10`
                  : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-600 hover:bg-slate-800/80'
              }`}
            >
              {/* Animated selection ring */}
              {selectedServices.includes(s.id) && (
                <div className="absolute inset-0 border-4 border-white/20 rounded-[2.5rem] animate-pulse" />
              )}
              
              <div className={`w-20 h-20 rounded-3xl bg-white flex items-center justify-center overflow-hidden p-3 transition-all duration-700 group-hover:scale-110 shadow-2xl relative ${selectedServices.includes(s.id) ? 'ring-8 ring-white/10' : 'grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100'}`}>
                <img 
                  src={s.logo} 
                  alt={s.name} 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">{s.name}</span>
              
              {selectedServices.includes(s.id) && (
                <div className="absolute bottom-4 flex justify-center w-full animate-bounce">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SelectionPanel;


import { Country, OTTService } from './types';

export const COUNTRIES: Country[] = [
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'US', name: 'USA', flag: '🇺🇸' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'GB', name: 'UK', flag: '🇬🇧' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
];

export const OTT_SERVICES: OTTService[] = [
  { 
    id: 'netflix', 
    name: 'Netflix', 
    color: 'bg-red-600',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Netflix-new-icon.png'
  },
  { 
    id: 'disney', 
    name: 'Disney+', 
    color: 'bg-blue-900',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg'
  },
  { 
    id: 'prime', 
    name: 'Prime Video', 
    color: 'bg-cyan-500',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg'
  },
  { 
    id: 'apple', 
    name: 'Apple TV+', 
    color: 'bg-slate-900',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg'
  },
  { 
    id: 'hulu', 
    name: 'Hulu', 
    color: 'bg-green-500',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Hulu_Logo.svg'
  },
  { 
    id: 'wavve', 
    name: 'Wavve', 
    color: 'bg-blue-600',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Wavve_Logo.svg'
  },
  { 
    id: 'tving', 
    name: 'Tving', 
    color: 'bg-red-500',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Tving_Logo.svg'
  },
];

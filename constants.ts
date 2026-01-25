
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Netflix_2016_N_logo.svg'
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Hulu_logo_%282018%29.svg/2560px-Hulu_logo_%282018%29.svg.png'
  }
];

export const PROVIDER_IDS: Record<string, number[]> = {
  'netflix': [8],
  'disney': [337],
  'prime': [9, 119],
  'apple': [350],
  'hulu': [15],
};

export const GENRE_MAP: { [id: number]: string } = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};

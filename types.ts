
export enum ContentType {
  MOVIE = 'Movie',
  TV_SHOW = 'TV Show'
}

export type ViewMode = 'grid' | 'list';

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface OTTService {
  id: string;
  name: string;
  color: string;
  logo: string;
}

export interface ContentItem {
  id: string;
  tmdbId: number; // TMDB ID for fetching additional data
  title: string;
  description: string;
  type: string; // Changed to string to handle 'Movie' or 'TV Show' strings from API
  rating: number;
  year: number;
  imageUrl: string;
  availableOn: string[];
  genre: string[];
}

export interface SearchParams {
  countries: string[];
  services: string[];
  type: ContentType;
}

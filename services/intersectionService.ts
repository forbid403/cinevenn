// services/intersectionService.ts

import { ContentItem, ContentType, TMDBMovie, TMDBTVShow, TMDBResponse } from '../types';
import { PROVIDER_IDS, GENRE_MAP } from '../constants';
import { API_BASE, fetchOptions } from '.';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const BATCH_SIZE = 20;

interface TMDBProvider {
    logo_path: string;
    provider_id: number;
    provider_name: string;
    display_priority: number;
}

interface TMDBCountryProviders {
    link?: string;
    flatrate?: TMDBProvider[];
    buy?: TMDBProvider[];
    rent?: TMDBProvider[];
}

interface TMDBWatchProvidersResponse {
    id: number;
    results: Record<string, TMDBCountryProviders>;
}

export async function fetchWatchProviders(
    tmdbId: number,
    contentType: ContentType,
    selectedCountries: string[]
): Promise<string[]> {
    try {
        const url = `${API_BASE}/${contentType}/${tmdbId}/watch/providers`;
        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`);
        }

        const data: TMDBWatchProvidersResponse = await response.json();
        const uniqueProviders = new Set<string>();

        selectedCountries.forEach(countryCode => {
            const countryData = data.results[countryCode];
            if (!countryData?.flatrate) return;

            countryData.flatrate.forEach(provider => {
                const serviceId = Object.entries(PROVIDER_IDS).find(
                    ([_, ids]) => ids.includes(provider.provider_id)
                )?.[0];

                if (serviceId) {
                    uniqueProviders.add(serviceId);
                }
            });
        });

        return Array.from(uniqueProviders);
    } catch (error) {
        console.error("Error fetching watch providers:", error);
        return [];
    }
}

type DiscoverResult = TMDBResponse<TMDBMovie | TMDBTVShow>;

async function fetchSortedDiscoverPage(
    country: string,
    providers: string,
    page: number,
    contentType: ContentType,
): Promise<DiscoverResult> {
    const sortBy = 'original_title.asc';
    const url = `${API_BASE}/discover/${contentType}?watch_region=${country}&with_watch_providers=${providers}&sort_by=${sortBy}&include_adult=false&language=en-US&page=${page}`;

    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
        throw new Error(`TMDB API error for ${country} page ${page}: ${response.status}`);
    }
    return response.json();
}

interface Stream {
    country: string;
    pointer: number;
    page: number;
    hasMorePages: boolean;
    data: (TMDBMovie | TMDBTVShow)[];
    isLoading: boolean;
}

export interface IntersectionSearcherProps {
    countries: string[];
    services: string[];
    contentType: ContentType;
    onResults: (items: ContentItem[]) => void;
    onFinish: () => void;
    onError: (error: string) => void;
    onBatchComplete: () => void;
    onProgress?: (current: number) => void;
}

export class IntersectionSearcher {
    private streams: Stream[] = [];
    private props: IntersectionSearcherProps;
    private providerIds: string;
    private isRunning = false;
    private isInitialized = false;

    constructor(props: IntersectionSearcherProps) {
        this.props = props;
        this.providerIds = this.props.services.map(s => PROVIDER_IDS[s]).flat().join('|');
    }

    private async initialize() {
        this.streams = this.props.countries.map(country => ({
            country,
            pointer: 0,
            page: 1,
            hasMorePages: true,
            data: [],
            isLoading: true,
        }));

        try {
            await Promise.all(
                this.streams.map(async (stream) => {
                    const result = await fetchSortedDiscoverPage(stream.country, this.providerIds, 1, this.props.contentType);
                    stream.data = result.results || [];
                    stream.page = result.page;
                    stream.hasMorePages = result.page < result.total_pages;
                    stream.isLoading = false;
                })
            );
            this.isInitialized = true;
        } catch (err) {
            this.props.onError(err instanceof Error ? err.message : 'Failed to fetch initial data.');
        }
    }

    public cancel() {
        this.isRunning = false;
    }

    public async run() {
        if (this.isRunning) return;
        this.isRunning = true;

        if (!this.isInitialized) {
            await this.initialize();
        }

        let foundInBatch = 0;
        const batchResults: ContentItem[] = [];

        while (this.isRunning && foundInBatch < BATCH_SIZE) {
            if (this.streams.some(s => !s.hasMorePages && s.pointer >= s.data.length)) {
                if (batchResults.length > 0) {
                    this.props.onResults(batchResults);
                }
                this.props.onFinish();
                this.isRunning = false;
                return;
            }

            const streamsNeedingData = this.streams.filter(s => s.pointer >= s.data.length && s.hasMorePages && !s.isLoading);
            if (streamsNeedingData.length > 0) {
                try {
                    await Promise.all(streamsNeedingData.map(async stream => {
                        stream.isLoading = true;
                        const nextPage = stream.page + 1;
                        const result = await fetchSortedDiscoverPage(stream.country, this.providerIds, nextPage, this.props.contentType);
                        stream.data.push(...(result.results || []));
                        stream.page = result.page;
                        stream.hasMorePages = result.page < result.total_pages;
                        stream.isLoading = false;
                    }));
                    continue;
                } catch (err) {
                    this.props.onError(err instanceof Error ? err.message : 'Failed to load more data.');
                    this.isRunning = false;
                    return;
                }
            }
            
            if (this.streams.some(s => s.isLoading)) {
                await new Promise(resolve => setTimeout(resolve, 100));
                continue;
            }

            let minTitle: string | null = null;
            for (const stream of this.streams) {
                const currentItem = stream.data[stream.pointer];
                if (currentItem) {
                    const title = 'title' in currentItem ? currentItem.title : ('name' in currentItem ? currentItem.name : '');
                    if (minTitle === null || title < minTitle) {
                        minTitle = title;
                    }
                }
            }

            if (minTitle === null) {
                // This implies all streams are done
                continue;
            }

            const intersectingStreams = this.streams.filter(stream => {
                const currentItem = stream.data[stream.pointer];
                if (!currentItem) return false;
                const title = 'title' in currentItem ? currentItem.title : ('name' in currentItem ? currentItem.name : '');
                return title === minTitle;
            });

            if (intersectingStreams.length === this.props.countries.length) {
                const representativeItem = intersectingStreams[0].data[intersectingStreams[0].pointer];
                const resultItem = this.convertToContentItem(representativeItem);
                batchResults.push(resultItem);
                foundInBatch++;
                this.props.onProgress?.(foundInBatch);
                this.streams.forEach(stream => stream.pointer++);
            } else {
                intersectingStreams.forEach(stream => stream.pointer++);
            }
        }

        this.props.onResults(batchResults);
        
        if (foundInBatch > 0) {
          this.props.onBatchComplete();
        }

        this.isRunning = false;
    }

    private convertToContentItem(item: TMDBMovie | TMDBTVShow): ContentItem {
        const isMovie = this.props.contentType === ContentType.MOVIE;
        const movie = item as TMDBMovie;
        const show = item as TMDBTVShow;

        return {
            id: isMovie ? `movie-${item.id}` : `tv-${item.id}`,
            tmdbId: item.id,
            title: isMovie ? movie.title : show.name,
            description: item.overview || 'No description available',
            type: isMovie ? ContentType.MOVIE : ContentType.TV_SHOW,
            rating: Math.round(item.vote_average * 10) / 10,
            year: parseInt((isMovie ? movie.release_date : show.first_air_date)?.split('-')[0] || '0'),
            imageUrl: item.poster_path ? `${IMAGE_BASE}${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image',
            availableOn: this.props.services,
            genre: item.genre_ids.map(id => GENRE_MAP[id] || 'Unknown').filter(g => g !== 'Unknown')
        };
    }
}
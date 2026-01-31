/**
 * Analytics Service for Google Analytics 4 (GA4)
 *
 * This service provides a centralized way to track events and page views
 * across the application using Google Analytics 4.
 */

// Extend Window interface to include gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Analytics tracking service
 */
export const analytics = {
  /**
   * Track a custom event
   * @param eventName - Name of the event (e.g., 'search_initiated')
   * @param params - Event parameters (optional)
   */
  track: (eventName: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
      window.gtag('event', eventName, params);

      // Log in development for debugging
      if (import.meta.env.DEV) {
        console.log('[Analytics]', eventName, params);
      }
    }
  },

  /**
   * Track a page view
   * @param url - Page URL
   */
  pageView: (url: string) => {
    if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
      const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID;

      if (measurementId) {
        window.gtag('config', measurementId, {
          page_path: url
        });

        // Log in development for debugging
        if (import.meta.env.DEV) {
          console.log('[Analytics] Page View:', url);
        }
      }
    }
  }
};

/**
 * Commonly used event names for type safety
 */
export const AnalyticsEvents = {
  // Selection events
  COUNTRY_SELECTED: 'country_selected',
  COUNTRY_DESELECTED: 'country_deselected',
  SERVICE_SELECTED: 'service_selected',
  SERVICE_DESELECTED: 'service_deselected',

  // Search events
  SEARCH_INITIATED: 'search_initiated',
  SEARCH_COMPLETED: 'search_completed',
  SEARCH_ERROR: 'search_error',

  // Content events
  CONTENT_TYPE_CHANGED: 'content_type_changed',
  VIEW_MODE_CHANGED: 'view_mode_changed',
  GENRE_FILTERED: 'genre_filtered',
  LOAD_MORE_CLICKED: 'load_more_clicked',

  // Content interaction events
  PROVIDERS_SHOWN: 'providers_shown',
  CONTENT_PLAYED: 'content_played',
  CONTENT_BOOKMARKED: 'content_bookmarked'
} as const;

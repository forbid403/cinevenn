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

export const AnalyticsEvents = {
  RUN_SEARCH: 'run_search',
  VIEW_SHARED_CONTENT_LIST: 'view_shared_content_list',
  CLICK_EXTERNAL_CONTENT: 'click_external_content'
} as const;

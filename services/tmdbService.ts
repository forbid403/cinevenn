import { ContentItem, ContentType } from "@/types";
import { API_BASE, fetchOptions } from "./index";

export const getExternalLink = async (tmdbId: string, contentType: ContentType): Promise<string> => {
  const url = `${API_BASE}/${contentType}/${tmdbId}/external_ids`;

  try {
    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    if (data.imdb_id) {
      return `https://imdb.com/title/${data.imdb_id}`;
    }
  } catch (error) {
    console.error('Failed to fetch external IDs:', error);
  }

  return `https://www.themoviedb.org/${contentType}/${tmdbId}`;
};
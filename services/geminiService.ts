
import { GoogleGenAI, Type } from "@google/genai";
import { ContentItem, SearchParams, ContentType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchCrossCountryContent = async (params: SearchParams): Promise<ContentItem[]> => {
  const { countries, services, type } = params;
  
  const typeDescriptor = type === ContentType.ALL ? "Movies and TV Shows (a mix of both)" : `${type}s`;

  const prompt = `Task: Act as a high-precision global streaming database.
  Query: Find a list of 10-12 highly popular and critically acclaimed ${typeDescriptor} that are currently available for streaming in ALL of the following countries: ${countries.join(', ')}.
  Platforms: The results must be available on at least ONE of these specific platforms: ${services.join(', ')}.
  
  Requirements:
  1. Use REAL, accurate titles.
  2. Availability metadata must be accurate for 2025.
  3. Image URL: Use high-quality illustrative images. Generate a descriptive URL using https://images.unsplash.com/photo-[ID]?q=80&w=800 that matches the theme or genre of the content.
  4. Ensure a mix of genres (Action, Drama, Sci-Fi, etc.).
  5. Ratings should be realistic (0-10).
  6. If searching for "All", provide a healthy balance of both Movies and TV Shows.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              type: { type: Type.STRING, description: "Must be 'Movie' or 'TV Show'" },
              rating: { type: Type.NUMBER },
              year: { type: Type.NUMBER },
              imageUrl: { type: Type.STRING, description: "Must be a valid high-quality Unsplash image URL" },
              availableOn: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "The exact platform names from the requested services list"
              },
              genre: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["id", "title", "description", "type", "rating", "year", "imageUrl", "availableOn", "genre"]
          }
        }
      }
    });

    const jsonStr = response.text?.trim() || "[]";
    const data = JSON.parse(jsonStr);
    
    return data.map((item: any) => ({
      ...item,
      imageUrl: item.imageUrl.includes('picsum.photos') || item.imageUrl.includes('placeholder')
        ? `https://source.unsplash.com/800x1200/?${encodeURIComponent(item.title + ' movie poster')}`
        : item.imageUrl
    }));
  } catch (error) {
    console.error("Error fetching content from Gemini:", error);
    return [];
  }
};

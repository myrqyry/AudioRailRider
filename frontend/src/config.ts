import { HarmCategory, HarmBlockThreshold } from "@google/genai";

function readApiKey(): string {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (typeof key !== "string" || key.trim() === "") {
    // In a real app, consider a more user-friendly error display
    throw new Error("VITE_GEMINI_API_KEY is not configured in the .env file.");
  }
  return key;
}

export const config = Object.freeze({
  // API key management
  get apiKey(): string {
    return readApiKey();
  },

  // Gemini model and generation settings
  gemini: {
    modelName: 'gemini-2.5-pro', // Or 'gemini-2.5-flash' for faster, less complex tasks
    generationConfig: {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
  },

  // API endpoint configuration
  api: {
    // Use a relative path for same-origin requests, or a full URL for different domains.
    // The Vite proxy in `vite.config.ts` will handle routing this to the backend.
    baseUrl: '/api',
    endpoints: {
      processAudio: '/process-audio',
      generateSkybox: '/generate-skybox',
    }
  }
});

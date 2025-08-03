const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable not set. Please check your .env.local file.");
}

export const config = {
  apiKey: GEMINI_API_KEY,
};

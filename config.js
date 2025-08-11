const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY environment variable not set. Please check your .env.local file.");
}
export const config = {
    apiKey: GEMINI_API_KEY,
};

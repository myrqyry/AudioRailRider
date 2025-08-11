function readApiKey(): string {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (typeof key !== "string" || key.trim() === "") {
    throw new Error("VITE_GEMINI_API_KEY environment variable not set. Please check your .env.local file.");
  }
  return key;
}

export const config = Object.freeze({
  get apiKey(): string {
    return readApiKey();
  },
});

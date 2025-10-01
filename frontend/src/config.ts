function readApiKey(): string {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (typeof key !== "string" || key.trim() === "") {
    throw new Error("API key is not configured. Please contact support.");
  }
  return key;
}

export const config = Object.freeze({
  get apiKey(): string {
    return readApiKey();
  },
});

import { RideBlueprint, AudioFeatures } from 'shared/types';

const BACKEND_URL = 'http://localhost:8000'; // Should be in a config file

/**
 * Generates a ride blueprint by sending the audio file and its features
 * to the backend service.
 * @param audioFile The audio file.
 * @param duration The duration of the audio in seconds.
 * @param bpm The beats per minute of the audio.
 * @param energy The energy of the audio.
 * @param spectralCentroid The spectral centroid of the audio.
 * @param spectralFlux The spectral flux of the audio.
 * @returns A promise that resolves to the generated ride blueprint.
 */
export const generateRideBlueprint = async (
  audioFile: File,
  signal: AbortSignal
): Promise<{ blueprint: RideBlueprint; features: AudioFeatures }> => {
  const formData = new FormData();
  formData.append('audio_file', audioFile);

  try {
    const response = await fetch(`${BACKEND_URL}/api/generate-blueprint`, {
      method: 'POST',
      body: formData,
      signal, // Pass the abort signal to the fetch request
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to generate ride blueprint');
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating ride blueprint:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`The generative muse is unavailable: ${errorMessage}`);
  }
};

/**
 * Generates a skybox image by sending a prompt to the backend service.
 * @param prompt A descriptive prompt for the skybox image.
 * @returns A promise that resolves to a base64-encoded data URL of the image.
 */
export const generateSkyboxImage = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/generate-skybox`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate skybox image');
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error("Error generating skybox image:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`The generative muse for images is unavailable: ${errorMessage}`);
  }
};
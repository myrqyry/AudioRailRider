import { RideBlueprint, AudioFeatures } from 'shared/types';
import { getEndpointUrl, API_ENDPOINTS, buildApiUrl, withRetry, validateApiResponse, getErrorMessage } from '../config/api';

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

  console.log('[GeminiService] Starting blueprint generation request', {
    url: `${BACKEND_URL}/api/generate-blueprint`,
    fileName: audioFile.name,
    fileSize: audioFile.size,
    fileType: audioFile.type,
    signalAborted: signal.aborted
  });

  try {
    const response = await fetch(`${BACKEND_URL}/api/generate-blueprint`, {
      method: 'POST',
      body: formData,
      signal, // Pass the abort signal to the fetch request
    });

    console.log('[GeminiService] Received response', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[GeminiService] Response not ok', {
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      const errorData = await response.json().catch(() => ({ detail: errorText }));
      throw new Error(errorData.detail || 'Failed to generate ride blueprint');
    }

    const result = await response.json();
    console.log('[GeminiService] Successfully parsed response JSON');
    return result;
  } catch (error) {
    console.error("[GeminiService] Error generating ride blueprint:", error);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.log('[GeminiService] Request was aborted');
      } else if (error.message.includes('fetch')) {
        console.error('[GeminiService] Network error - backend may not be running');
      }
    }

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
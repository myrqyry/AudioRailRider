import { Blueprint, AudioFeatures } from 'shared/types';
import { GoogleGenAI } from '@google/genai';
import { config } from '../config';

const MAX_INLINE_BYTES = 20 * 1024 * 1024; // 20 MB
const SUPPORTED_AUDIO_MIME_TYPES = new Set([
  'audio/wav',
  'audio/x-wav',
  'audio/mpeg',
  'audio/mp3',
  'audio/aiff',
  'audio/x-aiff',
  'audio/aac',
  'audio/m4a',
  'audio/ogg',
  'audio/flac',
  'audio/x-flac'
]);

function detectMimeFromName(filename: string) {
  const ext = (filename.split('.').pop() || '').toLowerCase();
  switch (ext) {
    case 'wav': return 'audio/wav';
    case 'mp3':
    case 'mpga': return 'audio/mpeg';
    case 'm4a': return 'audio/m4a';
    case 'aiff':
    case 'aif': return 'audio/aiff';
    case 'aac': return 'audio/aac';
    case 'ogg': return 'audio/ogg';
    case 'flac': return 'audio/flac';
    default: return 'application/octet-stream';
  }
}

/**
 * Prepare an audio part suitable for sending to an AI API. Small files are inlined
 * as base64, large files are uploaded via the provided AI client's files.upload.
 */
export const prepareAudioPart = async (ai: any, file: File) => {
  const rawType = (file.type && file.type.trim() !== '') ? file.type : detectMimeFromName(file.name);
  const mime = typeof rawType === 'string' ? rawType.split(';')[0].trim() : rawType;

  if (!SUPPORTED_AUDIO_MIME_TYPES.has(mime)) {
    throw new Error(`Unsupported audio MIME type: ${mime}. Supported formats: ${Array.from(SUPPORTED_AUDIO_MIME_TYPES).join(', ')}`);
  }

  // Inline small files
  if (typeof file.size === 'number' && file.size <= MAX_INLINE_BYTES) {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // result is like data:<mime>;base64,AAAA
        const comma = result.indexOf(',');
        resolve(result.slice(comma + 1));
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
    return { inlineData: { content: base64, mimeType: mime, name: file.name } };
  }

  // Otherwise upload via AI client's file API (tests mock ai.files.upload)
  try {
    const uploaded = await ai.files.upload({ file });
    return { fileData: { uri: uploaded.uri, name: uploaded.name, mimeType: uploaded.mimeType } };
  } catch (e) {
    console.error('[GeminiService] uploadFile failed:', e);
    throw e;
  }
};

/**
 * Test-friendly generator that uses the GoogleGenAI client to generate a ride blueprint
 * from audio metadata. This mirrors the behavior tests expect (they mock GoogleGenAI).
 */
export const generateRideBlueprintWithAI = async (
  audioFile: File,
  duration: number,
  bpm: number,
  energy: number,
  spectralCentroid: number,
  spectralFlux: number
): Promise<Blueprint> => {
  const ai = new GoogleGenAI({ apiKey: config.apiKey });

  const prompt = `Generate a ride blueprint JSON for an audio track with duration=${duration}, bpm=${bpm}, energy=${energy}, spectralCentroid=${spectralCentroid}, spectralFlux=${spectralFlux}`;

  const response = await (ai.models as any).generateContent({ input: prompt });
  const text = response.text;
  try {
    const parsed = JSON.parse(text);
    return parsed as Blueprint;
  } catch (e) {
    throw new Error('The AI returned malformed data.');
  }
};

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
// Export the AI-backed generator as the primary generateRideBlueprint used in tests.
/**
 * Backend-based generator: upload the audio file to our backend which will
 * perform analysis + blueprint generation and return both the blueprint and
 * extracted audio features. This is the runtime path used by the web app.
 */
export const generateRideBlueprint = async (
  audioFile: File,
  signal?: AbortSignal,
  options?: Record<string, any>
): Promise<{ blueprint: Blueprint; features: any }> => {
  const url = `${config.api.baseUrl}${config.api.endpoints.processAudio}`;

  const fd = new FormData();
  fd.append('audio_file', audioFile);
  if (options && typeof options === 'object') {
    try {
      fd.append('options', JSON.stringify(options));
    } catch (e) {}
  }

  try {
    console.debug('[GeminiService] Posting audio to backend', { url, fileName: audioFile.name, fileSize: audioFile.size });
    const res = await fetch(url, { method: 'POST', body: fd, signal });
    if (!res.ok) {
      let detail = 'Unknown server error';
      try {
        const j = await res.json();
        detail = j.detail || j.error || JSON.stringify(j);
      } catch (e) {}
      throw new Error(`Backend error: ${res.status} ${res.statusText} - ${detail}`);
    }
    const data = await res.json();
    // Expect { blueprint, features }
    if (!data || !data.blueprint) throw new Error('Backend returned invalid payload');
    return { blueprint: data.blueprint as Blueprint, features: data.features };
  } catch (e: any) {
    // Provide clearer diagnostics for network/fetch failures which often surface
    // as "Failed to fetch" in the browser. Include likely causes (CORS, backend
    // not running, network down) and the backend URL to help debugging.
    console.error('[GeminiService] generateRideBlueprint failed:', e);
    const baseMsg = e instanceof Error ? e.message : String(e);
    if (baseMsg.includes('Failed to fetch') || baseMsg.includes('NetworkError') || baseMsg.includes('TypeError')) {
      throw new Error(`Failed to contact backend at ${url}. This may indicate the backend is not running, CORS is blocking the request, or a network problem. Original error: ${baseMsg}`);
    }
    throw e;
  }
};

/**
 * Generates a skybox image using Gemini 2.5 Flash Image Preview model.
 * This model excels at creative, contextual image generation.
 * @param prompt A descriptive prompt for the skybox image.
 * @param blueprint Optional blueprint data for richer context.
 * @returns A promise that resolves to a base64-encoded data URL of the image.
 */
export const generateSkyboxImage = async (prompt: string, blueprint?: any): Promise<string> => {
  try {
    const url = `${config.api.baseUrl}${config.api.endpoints.generateSkybox}`;
    // Extract any generation options embedded in the blueprint and send them
    // explicitly as part of the request body so the backend can respect them.
    const optionsPayload = blueprint && (blueprint as any).generationOptions ? (blueprint as any).generationOptions : null;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, blueprint, options: optionsPayload }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // If it's 501 (Not Implemented), log info and throw
      if (response.status === 501) {
        console.info('[GeminiService] Skybox generation not supported:', errorData.detail);
        throw new Error('Skybox generation not supported by Gemini API');
      }
      throw new Error(errorData.detail || 'Failed to generate skybox image');
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.warn('[GeminiService] Skybox generation failed, continuing without custom skybox:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Skybox generation unavailable: ${errorMessage}`);
  }
};
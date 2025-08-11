import { GoogleGenAI, Type } from "@google/genai";
import { RideBlueprint } from "../types";
import { config } from '../config';
import geminiConfig from '../gemini.config.ts';
import { analyzeAudio } from "../lib/audioProcessor";

const SYSTEM_INSTRUCTION = `
You are a synesthetic architect, a digital-alchemist. Your purpose is to translate a song's audio data directly into a rollercoaster blueprint.

Here are the available track components:
- 'climb': A steady upward ramp. Use for intros, builds, or quiet sections.
  - 'angle': Gentle incline in degrees (e.g., 10 to 30).
  - 'length': The length of the climb (e.g., 100 to 300).
- 'drop': A thrilling downward plunge. Use for song peaks, chorus drops, or intense moments.
  - 'angle': Steep decline in degrees (e.g., -35 to -70).
  - 'length': The length of the drop (e.g., 100 to 300).
- 'turn': A horizontal curve. Use to create sweeping, flowing motions.
  - 'direction': 'left' or 'right'.
  - 'radius': How tight the turn is (e.g., 150 for wide, 80 for sharp).
  - 'angle': The total angle of the turn in degrees (e.g., 90, 180).
- 'loop': A full vertical loop. The ultimate thrill for the most powerful moments.
  - 'radius': The size of the loop (e.g., 40 to 80).
- 'barrelRoll': A corkscrew motion. Perfect for synth solos, complex rhythms, or disorienting moments.
  - 'rotations': How many full 360-degree rolls (e.g., 1, 2). This must be an integer.
  - 'length': The forward distance covered during the roll (e.g., 100 to 200).
`;

const PROMPT_TEXT = (duration: number, bpm: number, energy: number, spectralCentroid: number, spectralFlux: number) => `
You have been given an audio file with the following audio analysis:
- Duration: ${duration.toFixed(0)} seconds
- Tempo: ${bpm.toFixed(0)} BPM
- Overall Energy: ${energy.toFixed(2)} (0 to 1 scale)
- Spectral Centroid (Brightness): ${spectralCentroid.toFixed(2)}. Higher values mean a "brighter" or "sharper" sound.
- Spectral Flux (Rate of Change): ${spectralFlux.toFixed(2)}. Higher values mean the sound's timbre is changing rapidly.

Listen to the entire track and analyze its emotional arc, dynamics, and rhythm. Your task is to translate this audio experience into a thrilling rollercoaster ride blueprint.

- **Ride Name**: Create a creative and evocative name for the rollercoaster that reflects the music.
- **Mood Description**: Describe the overall mood and theme of the ride in a short, evocative sentence.
- **Palette**: First, determine the overall mood. Is it energetic, melancholic, epic, ambient? Based on this, define a 3-color hex code palette: [rail color, glow color, sky color]. Vibrant songs get bright colors (e.g., cyan, magenta), while somber songs get darker tones (e.g., deep blue, purple).
- **Track Design**:
  - Generate a track with 12 to 20 segments.
  - The ride's intensity must mirror the music's dynamics. Use gentle 'climb' segments for quiet intros, builds, and verses.
  - When the music swells or the beat drops (the chorus or other high-energy moments), you MUST use high-excitement components: 'drop', 'loop', or 'barrelRoll'.
  - For each segment, also provide:
    - \`intensity\`: Set 0-100 based on local musical energy, volume, or excitement (0 = intro/break, 100 = drop/peak).
    - \`lightingEffect\`: Sync to musical features—use "strobe" for heavy beats/high BPM, "fade" for sustained notes or dreamy parts, "pulse" for vocals/builds, "none" if nothing stands out.
    - \`environmentChange\`: For major mood, section, or instrumental shifts, set ("tunnel", "space", etc.); otherwise "none".
    - \`audioSyncPoint\`: Timestamp (seconds, relative to this segment) for key event: beat drop, vocal entrance, or effect; use 0 if not applicable.
  - Use 'turn' segments to handle transitions and create a sense of flow, especially during instrumental sections.
  - For complex, textured, or fast-paced sections like solos or breakdowns, a 'barrelRoll' is highly appropriate.
  - To prevent the ride from feeling cramped, use wide, sweeping 'turn' segments (radius > 100) to change the overall direction of the ride between intense sections.
- Create a cohesive and thrilling ride that feels born from the music.
`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        palette: {
            type: Type.ARRAY,
            description: "Array of 3 hex color codes: [rail color, glow color, sky color].",
            items: { type: Type.STRING }
        },
        track: {
            type: Type.ARRAY,
            description: "Array of track segment objects.",
            items: {
                type: Type.OBJECT,
                properties: {
                    component: { type: Type.STRING, enum: ['climb', 'drop', 'turn', 'loop', 'barrelRoll'] },
                    angle: { type: Type.NUMBER },
                    length: { type: Type.NUMBER },
                    direction: { type: Type.STRING, enum: ['left', 'right'] },
                    radius: { type: Type.NUMBER },
                    rotations: { type: Type.INTEGER },
                    intensity: { type: Type.NUMBER, description: "0-100, influences visual effects" },
                    lightingEffect: { type: Type.STRING, description: "e.g., 'strobe', 'fade', 'pulse', 'none'" },
                    environmentChange: { type: Type.STRING, description: "e.g., 'tunnel', 'space', 'underwater', 'none'" },
                    audioSyncPoint: { type: Type.NUMBER, description: "timestamp within the segment for key audio event" },
                },
                required: ['component']
            }
        },
        rideName: {
            type: Type.STRING,
            description: "A creative name for the rollercoaster."
        },
        moodDescription: {
            type: Type.STRING,
            description: "A text description of the overall mood/theme."
        }
    },
    required: ['palette', 'track', 'rideName', 'moodDescription'],
    // Ensure the model returns fields in this human-friendly ordering when possible
    propertyOrdering: ['rideName', 'moodDescription', 'palette', 'track'],
};

/**
 * Converts a File object to a GoogleGenAI.Part object for multimodal prompting.
 * @param file The file to convert.
 * @returns A promise that resolves to a generative part object.
 */
const MAX_INLINE_BYTES = 20 * 1024 * 1024; // 20 MB

const SUPPORTED_AUDIO_MIME_TYPES = new Set([
  'audio/wav',
  'audio/x-wav',
  'audio/mpeg', // canonical MIME for MP3
  'audio/mp3',  // some browsers/clients report this
  'audio/aiff',
  'audio/x-aiff',
  'audio/aac',
  'audio/m4a',
  'audio/ogg',
  'audio/flac',
  'audio/x-flac'
]);

/**
 * Detect MIME type from filename extension as a fallback when file.type is empty.
 */
function detectMimeFromName(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
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
 * Encode a small file as inline base64 part (keeps previous behavior).
 * Kept private to preserve the inline workflow for small files.
 */
const inlineAudioPartFromFile = async (file: File): Promise<{ inlineData: { mimeType: string; data: string } }> => {
  // Detect MIME using same fallback rules as prepareAudioPart
  // Normalize MIME: if file.type is present, strip any parameters (e.g., "audio/mpeg; charset=binary").
  // If file.type is empty, fall back to extension-based detection.
  const rawType = file.type && file.type.trim() !== '' ? file.type : detectMimeFromName(file.name);
  const detectedMime = typeof rawType === 'string' ? rawType.split(';')[0].trim() : rawType;

  // Debug: capture detection results and size for runtime inspection
  try {
    console.debug(`[GeminiService] inlineAudioPartFromFile: fileName=${file.name}, rawType=${rawType}, detectedMime=${detectedMime}, fileSize=${file.size}`);
  } catch (e) {
    console.debug('[GeminiService] inlineAudioPartFromFile: debug log failed', e);
  }

  // Double-check supported formats (prepareAudioPart already checks, but keep parity here)
  if (!SUPPORTED_AUDIO_MIME_TYPES.has(detectedMime)) {
    throw new Error(`Unsupported audio MIME type: ${detectedMime}. Supported formats: ${Array.from(SUPPORTED_AUDIO_MIME_TYPES).join(', ')}`);
  }

  // Log size info and warn if close to inline limit
  if (typeof file.size === 'number') {
    const mb = (file.size / (1024 * 1024));
    console.log(`[GeminiService] Inline audio selected: ${file.name} — ${file.size} bytes (${mb.toFixed(2)} MB)`);
    const closeToLimitBytes = 18 * 1024 * 1024; // 18 MB warning threshold
    if (file.size > closeToLimitBytes) {
      console.warn(`[GeminiService] Warning: ${file.name} is close to the inline size limit (${mb.toFixed(2)} MB). Consider uploading or downsampling to reduce token cost.`);
    }
  }

  // Read file as base64 (preserve backwards-compatible inline payload)
  const base64EncodedData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (err) => {
      console.error('[GeminiService] FileReader failed to read inline audio file:', err);
      reject(new Error("Failed to read file: " + err));
    };
    reader.readAsDataURL(file);
  });

  // Best-effort: attempt to estimate duration and a rough token cost using audio processor.
  // This is optional and non-fatal; failures only result in debug logs, not thrown errors.
  try {
    const features = await analyzeAudio(file);
    const durationSeconds = typeof features.duration === 'number' && isFinite(features.duration) ? features.duration : NaN;

    if (!isNaN(durationSeconds)) {
      // Simple heuristic: estimate tokens from duration.
      // NOTE: This is a coarse heuristic for planning purposes (tokens/sec chosen conservatively).
      const TOKENS_PER_SECOND = 15; // conservative heuristic
      const estimatedTokens = Math.ceil(durationSeconds * TOKENS_PER_SECOND);
      console.log(`[GeminiService] Audio duration estimate for '${file.name}': ${durationSeconds.toFixed(2)}s. Estimated tokens: ${estimatedTokens}`);
    } else {
      console.debug(`[GeminiService] Could not determine duration for '${file.name}'.`);
    }
  } catch (err) {
    console.debug('[GeminiService] Duration/token estimation for inline audio failed (non-fatal):', err);
  }

  // Return inline payload (keeps previous shape for compatibility)
  return {
    inlineData: {
      mimeType: detectedMime,
      data: base64EncodedData,
    },
  };
};

// Add centralized Files API helpers to normalize SDK behavior and provide list/get/delete/download utilities.
// These helpers wrap (ai as any).files.* calls and normalize returned shapes for the rest of the service.
// Note: We intentionally use loose typing (any) for SDK calls because runtime SDK shapes may vary across versions.
export const uploadFile = async (ai: GoogleGenAI, file: File, mimeType?: string) => {
  try {
    const payload = { file, config: { mimeType } };
    // Prefer the SDK method if available
    const raw = await (ai as any).files.upload(payload);
    // Normalize common shapes
    const uri = raw?.uri || raw?.fileUri || raw?.id || raw?.name && `file://${raw.name}` || null;
    const normalized = {
      uri,
      mimeType: raw?.mimeType || raw?.contentType || mimeType || (file && (file as any).type) || 'application/octet-stream',
      name: raw?.name || file.name,
      size: raw?.size || (file && (file as any).size) || null,
      raw,
    };
    if (!normalized.uri) {
      console.error('[GeminiService] uploadFile: upload did not return a URI', raw);
      throw new Error('Files API upload did not return a URI.');
    }
    return normalized;
  } catch (err: any) {
    console.error('[GeminiService] uploadFile failed:', err);
    throw err;
  }
};

export const listFiles = async (ai: GoogleGenAI, opts?: { pageSize?: number; pageToken?: string }) => {
  try {
    const args: any = opts ? { ...opts } : {};
    const res = await (ai as any).files.list(args);
    // Normalize to { files: [], nextPageToken }
    const files = res?.files || res?.items || res?.results || [];
    const nextPageToken = res?.nextPageToken || res?.next_page_token || null;
    return { files, nextPageToken, raw: res };
  } catch (err: any) {
    console.error('[GeminiService] listFiles failed:', err);
    throw err;
  }
};

export const getFileMetadata = async (ai: GoogleGenAI, fileUri: string) => {
  try {
    const res = await (ai as any).files.get({ uri: fileUri });
    // Some SDKs return the file object directly; others wrap it.
    return res?.file || res || null;
  } catch (err: any) {
    console.error('[GeminiService] getFileMetadata failed:', err);
    throw err;
  }
};

export const deleteFile = async (ai: GoogleGenAI, fileUri: string) => {
  try {
    // Some SDKs expect { uri } others { fileUri } - try both shapes
    const res = await (ai as any).files.delete?.({ uri: fileUri }) ?? await (ai as any).files.delete?.({ fileUri }) ?? null;
    return res ?? { success: true };
  } catch (err: any) {
    console.error('[GeminiService] deleteFile failed:', err);
    throw err;
  }
};

export const downloadFile = async (ai: GoogleGenAI, fileUri: string) => {
  try {
    // Attempt SDK download helper
    const res = await (ai as any).files.download?.({ uri: fileUri }) ?? await (ai as any).files.download?.({ fileUri }) ?? null;
    if (!res) {
      // If SDK doesn't provide download, attempt to GET the fileUri if it's an HTTP URL
      if (typeof fileUri === 'string' && (fileUri.startsWith('http://') || fileUri.startsWith('https://'))) {
        const fetchRes = await fetch(fileUri);
        const arrayBuffer = await fetchRes.arrayBuffer();
        return { arrayBuffer, size: arrayBuffer.byteLength, raw: fetchRes };
      }
      return res;
    }
    // If SDK returns an object with base64 'data' field, convert to Uint8Array
    if (typeof res.data === 'string') {
      try {
        const b64 = res.data.replace(/^data:.*;base64,/, '');
        // Use a safe runtime check for Buffer to avoid TS errors when targeting both node and browser.
        const binary = (typeof Buffer !== 'undefined') ? Buffer.from(b64, 'base64') : Uint8Array.from(atob(b64), c => c.charCodeAt(0));
        return { buffer: binary, size: (binary as any).length ?? (binary as any).byteLength ?? null, raw: res };
      } catch (e) {
        // Fallback: return raw
        return { raw: res };
      }
    }
    // If SDK exposes arrayBuffer() or stream, return raw
    return res;
  } catch (err: any) {
    console.error('[GeminiService] downloadFile failed:', err);
    throw err;
  }
};

/**
 * Prepares an audio part for Gemini generateContent.
 * - If file.size <= maxInlineBytes -> returns inlineData part (base64 inline).
 * - If file.size > maxInlineBytes -> uploads via Files API and returns a file URI part.
 *
 * @param ai Instance of GoogleGenAI client (used for files.upload)
 * @param file File/Blob to prepare
 * @param maxInlineBytes Threshold for inline vs upload (default 20 MB)
 */
export const prepareAudioPart = async (ai: GoogleGenAI, file: File, maxInlineBytes = MAX_INLINE_BYTES) => {
  // Normalize MIME: if file.type is present, strip any parameters (e.g., "audio/mpeg; charset=binary").
  // If file.type is empty, fall back to extension-based detection.
  const rawType = file.type && file.type.trim() !== '' ? file.type : detectMimeFromName(file.name);
  const detectedMime = typeof rawType === 'string' ? rawType.split(';')[0].trim() : rawType;

  // Diagnostic: log prepared mime and path for targeted MP3 processing
console.debug('[GeminiService] prepareAudioPart diagnostic: fileName=' + file.name + ', detectedMime=' + detectedMime + ', size=' + (typeof file.size === 'number' ? file.size : 'unknown'));
  try {
    console.debug(`[GeminiService] prepareAudioPart: fileName=${file.name}, rawType=${rawType}, detectedMime=${detectedMime}, fileSize=${file.size}`);
  } catch (e) {
    console.debug('[GeminiService] prepareAudioPart: debug log failed', e);
  }

  // Enforce supported formats
  if (!SUPPORTED_AUDIO_MIME_TYPES.has(detectedMime)) {
    throw new Error(`Unsupported audio MIME type: ${detectedMime}. Supported formats: ${Array.from(SUPPORTED_AUDIO_MIME_TYPES).join(', ')}`);
  }

  // If file is small enough, keep using inline base64 (backwards compatible)
  if (typeof file.size === 'number' && file.size <= maxInlineBytes) {
    console.log(`[GeminiService] Using inline audio part for ${file.name} (${file.size} bytes)`);
    return await inlineAudioPartFromFile(file);
  }

  // Large file -> upload via Files API and return a URI part
  try {
    console.log(`[GeminiService] Uploading large audio file ${file.name} (${file.size} bytes) via Files API...`);
    // Use centralized upload helper which normalizes SDK differences
    const uploadResult = await uploadFile(ai, file, detectedMime);

    // Instrumentation: log the full uploadResult to inspect shape returned by Gemini
    try {
      console.debug('[GeminiService] Files.upload returned (normalized):', uploadResult);
    } catch (e) {
      console.debug('[GeminiService] Failed to debug-log uploadResult', e);
    }

    if (!uploadResult || !uploadResult.uri) {
      console.error('[GeminiService] Files API upload missing uri (after normalization):', uploadResult);
      throw new Error('Files API did not return a uri for the uploaded file.');
    }

    // Return a file-URI based part that Gemini can reference in generateContent.
    // Shape chosen to be consistent with SDK/documentation guidance: { fileData: { mimeType, fileUri } }
    return {
      fileData: {
        mimeType: uploadResult.mimeType || detectedMime,
        fileUri: uploadResult.uri,
      },
    };
  } catch (err: any) {
    console.error('[GeminiService] Files upload failed:', err);
    // Re-throw a user-friendly, classified error
    throw new Error('Failed to upload audio file to the Gemini Files API. Please check your network connection and API key, and try again.');
  }
};

export const generateRideBlueprint = async (audioFile: File, duration: number, bpm: number, energy: number, spectralCentroid: number, spectralFlux: number): Promise<RideBlueprint> => {
  // Add a new function to validate the API key before making the API call
  const validateApiKey = () => {
    if (!config.apiKey || config.apiKey.trim() === '') {
      throw new Error("Gemini API key is missing. Please set it in your .env.local file.");
    }
  };

  // Call the validation function before making the API call
  validateApiKey();

  const ai = new GoogleGenAI({ apiKey: config.apiKey });
  const model = geminiConfig.modelName; // Use modelName from gemini.config.ts
  
  try {
    const audioPart = await prepareAudioPart(ai, audioFile);
    const textPart = { text: PROMPT_TEXT(duration, bpm, energy, spectralCentroid, spectralFlux) };

    const response = await ai.models.generateContent({
        model: model,
        contents: { parts: [textPart, audioPart] },
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        }
    });

    const jsonText = response.text;
    console.log("Raw Gemini API response:", jsonText); // Log raw response before parsing
    if (!jsonText) {
        throw new Error("The AI returned an empty response. Please try a different song.");
    }

    try {
      const blueprint = JSON.parse(jsonText);
      
      if (!blueprint.palette || !Array.isArray(blueprint.palette) || blueprint.palette.length < 3 || !blueprint.track || !Array.isArray(blueprint.track)) {
          throw new Error("The AI returned an invalid blueprint structure. This can happen with very unusual songs. Please try another one.");
      }

      console.time("[GeminiService] Total track sanitization time");
      blueprint.track.forEach((segment: any, idx: number) => {
        const segmentStartTime = performance.now();
        const originalSegment = JSON.parse(JSON.stringify(segment)); // Deep copy for before state
        
        // Log original segment details for all types
        console.log(`[GeminiService Debug] Segment #${idx} (component: ${segment.component}) before sanitization:`, originalSegment);

        // Apply specific sanitization rules
        if (segment.component === 'barrelRoll') {
          let rawRotations = segment.rotations;
          let sanitized = Number(rawRotations);
          if (isNaN(sanitized)) sanitized = 1; // fallback default
          sanitized = Math.max(1, Math.round(sanitized)); // barrelRoll should be 1 or greater, integer
          segment.rotations = sanitized;
        }
        // Ensure intensity is a number between 0 and 100
        if (typeof segment.intensity !== 'number' || isNaN(segment.intensity)) {
          segment.intensity = 50; // Default to 50 if not provided or invalid
        }
        segment.intensity = Math.max(0, Math.min(100, Math.round(segment.intensity)));

        // Ensure lightingEffect is a string, default to "none"
        if (typeof segment.lightingEffect !== 'string') {
          segment.lightingEffect = "none";
        }

        // Ensure environmentChange is a string, default to "none"
        if (typeof segment.environmentChange !== 'string') {
          segment.environmentChange = "none";
        }

        // Ensure audioSyncPoint is a number, default to 0
        if (typeof segment.audioSyncPoint !== 'number' || isNaN(segment.audioSyncPoint)) {
          segment.audioSyncPoint = 0;
        }

        // Log sanitized segment details for all types
        console.log(`[GeminiService Debug] Segment #${idx} (component: ${segment.component}) after sanitization:`, segment);
        console.log(`[GeminiService Debug] Segment #${idx} processing time: ${(performance.now() - segmentStartTime).toFixed(2)}ms`);
      });
      console.timeEnd("[GeminiService] Total track sanitization time");
      
      return blueprint as RideBlueprint;
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error("Syntax error in JSON response:", jsonText);
        throw new Error("The AI returned malformed data. This is a rare issue, please try again. The raw response from the AI was: " + jsonText);
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error("Error generating ride blueprint:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('API key not valid')) {
        throw new Error("Your Gemini API key is not valid. Please ensure it is correctly set in your .env.local file.");
    }
    if (errorMessage.includes('500') || errorMessage.includes('Internal error') || errorMessage.includes('request failed')) {
        throw new Error("The AI had a temporary issue, possibly due to the song's complexity. Please try again in a moment or with a different track.");
    }
    throw new Error(`The generative muse is unavailable: ${errorMessage}`);
  }

};

// Transcribe an audio file (optionally limited to a timestamp range).
// Accepts File | Blob for convenience; if a Blob is provided we create a File wrapper.
// timestamps: optional object with start/end in "MM:SS" format.
export const transcribeAudioFile = async (
  file: File | Blob,
  timestamps?: { start?: string; end?: string }
): Promise<string> => {
  // Validate API key (same policy as generateRideBlueprint)
  const validateApiKey = () => {
    if (!config.apiKey || config.apiKey.trim() === '') {
      throw new Error("Gemini API key is missing. Please set it in your .env.local file.");
    }
  };
  validateApiKey();

  const ai = new GoogleGenAI({ apiKey: config.apiKey });
  const model = geminiConfig.modelName;

  // Ensure we have a File instance (some callers may pass a Blob)
  // Assumption: If a Blob lacks a filename, default to audio.<ext> (ext derived from mimeType or 'wav').
  let audioFile: File;
  if (file instanceof File) {
    audioFile = file;
  } else {
    const mime = (file as Blob).type || 'audio/wav';
    const ext = mime.split('/').pop() || 'wav';
    audioFile = new File([file as Blob], `audio.${ext}`, { type: mime });
  }

  // Dev logging: requested transcription + file size + whether timestamps are applied
  try {
    const sizeInfo = typeof audioFile.size === 'number' ? `${audioFile.size} bytes` : 'unknown size';
    const rangeInfo = timestamps && (timestamps.start || timestamps.end)
      ? `${timestamps.start ?? 'start'} -> ${timestamps.end ?? 'end'}`
      : 'none';
    console.log(`[GeminiService] Transcription requested for '${audioFile.name}' (${sizeInfo}). Timestamp range: ${rangeInfo}`);
  } catch (e) {
    console.debug('[GeminiService] Failed to log transcription request details:', e);
  }

  // Build prompt text based on provided timestamps (handle start-only / end-only / both)
  let promptText = 'Generate a transcript of the speech.';
  if (timestamps && (timestamps.start || timestamps.end)) {
    if (timestamps.start && timestamps.end) {
      promptText = `Provide a transcript of the speech from ${timestamps.start} to ${timestamps.end}.`;
    } else if (timestamps.start && !timestamps.end) {
      promptText = `Provide a transcript of the speech from ${timestamps.start} to the end.`;
    } else if (!timestamps.start && timestamps.end) {
      promptText = `Provide a transcript of the speech from the start to ${timestamps.end}.`;
    }
  }

  try {
    // Reuse prepareAudioPart to handle inline vs upload logic and MIME validation.
    const audioPart = await prepareAudioPart(ai, audioFile);

    const textPart = { text: promptText };

    // Call Gemini generateContent. Reuse the system instruction pattern where reasonable.
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [textPart, audioPart] },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        // Transcription expected as plain text
        responseMimeType: "text/plain",
      },
    });

    const transcript = response.text;
    if (!transcript || transcript.trim() === '') {
      throw new Error("The AI returned an empty transcript. Try again or provide a different audio file.");
    }

    // Optionally log short preview in dev
    if (transcript.length > 0) {
      const preview = transcript.length > 200 ? transcript.slice(0, 200) + '...' : transcript;
      console.log(`[GeminiService] Transcript preview: ${preview}`);
    }

    return transcript;
  } catch (err: any) {
    console.error('[GeminiService] Transcription failed:', err);
    const raw = err instanceof Error ? err.message : String(err);
    // Provide a friendly, actionable message while preserving original detail.
    if (raw.includes('Files API') || raw.includes('upload')) {
      throw new Error('Failed to upload or reference the audio file for transcription. Check your network and API credentials, then try again.');
    }
    if (raw.includes('API key not valid')) {
      throw new Error('Your Gemini API key is not valid. Please ensure it is correctly set in your .env.local file.');
    }
    throw new Error(`Failed to transcribe audio: ${raw}`);
  }
};

export const countAudioTokens = async (file: File | Blob): Promise<{ totalTokens: number }> => {
  // Validate API key (same policy as other Gemini helpers)
  const validateApiKey = () => {
    if (!config.apiKey || config.apiKey.trim() === '') {
      throw new Error("Gemini API key is missing. Please set it in your .env.local file.");
    }
  };
  validateApiKey();

  const ai = new GoogleGenAI({ apiKey: config.apiKey });
  const model = geminiConfig.modelName;

  // Ensure we have a File instance (some callers may pass a Blob)
  // Assuming default extension 'wav' if mime is absent.
  let audioFile: File;
  if (file instanceof File) {
    audioFile = file;
  } else {
    const mime = (file as Blob).type || 'audio/wav';
    const ext = mime.split('/').pop() || 'wav';
    audioFile = new File([file as Blob], `audio.${ext}`, { type: mime });
  }

  try {
    // Reuse prepareAudioPart to handle inline vs upload logic and MIME validation.
    const audioPart = await prepareAudioPart(ai, audioFile);

    // Dev logging: file size + whether inline or upload mode was used
    try {
      const sizeInfo = typeof audioFile.size === 'number' ? `${audioFile.size} bytes` : 'unknown size';
      const mode = (audioPart as any).inlineData ? 'inline' : (audioPart as any).fileData ? 'upload' : 'unknown';
      console.log(`[GeminiService] countAudioTokens requested for '${audioFile.name}' (${sizeInfo}). Mode: ${mode}`);
    } catch (e) {
      console.debug('[GeminiService] Failed to log countAudioTokens request details:', e);
    }

    // Call the minimal token-counting API with only the audio part
    const response = await ai.models.countTokens({
      model: model,
      contents: { parts: [audioPart] },
    });

    // Normalize response (common possible shapes)
    let totalTokens: number | null = null;
    if (response && typeof (response as any).totalTokens === 'number') {
      totalTokens = (response as any).totalTokens;
    } else if (response && typeof (response as any).total_tokens === 'number') {
      totalTokens = (response as any).total_tokens;
    } else if (response && typeof (response as any).tokens === 'number') {
      totalTokens = (response as any).tokens;
    }

    if (typeof totalTokens !== 'number' || isNaN(totalTokens)) {
      console.debug('[GeminiService] countTokens returned unexpected shape:', response);
      throw new Error('Token counting returned an unexpected response from the Gemini API.');
    }

    // Dev logging: token result
    console.log(`[GeminiService] countAudioTokens result for '${audioFile.name}': totalTokens=${totalTokens}`);

    return { totalTokens };
  } catch (err: any) {
    console.error('[GeminiService] countAudioTokens failed:', err);
    const raw = err instanceof Error ? err.message : String(err);
    if (raw.includes('API key not valid') || raw.toLowerCase().includes('missing')) {
      throw new Error('Your Gemini API key is not valid or missing. Please ensure it is set in your .env.local file.');
    }
    // Friendly wrapper preserving debug logs
    throw new Error(`Failed to count audio tokens: ${raw}`);
  }
};

/**
 * Generate structured JSON data from Gemini using the provided prompt.
 * Returns both the parsed RideBlueprint (typed) and the raw text returned by the model.
 *
 * Note: Reuses the project's RideBlueprint Type declared in ../types.
 */
export const generateStructuredData = async (prompt: string): Promise<{ data: RideBlueprint; raw: string }> => {
  // Validate API key is present and avoid hardcoding secrets
  if (!config.apiKey || config.apiKey.trim() === '') {
    throw new Error("Gemini API key is missing. Please set GEMINI_API_KEY in your environment (e.g., .env.local).");
  }

  const ai = new GoogleGenAI({ apiKey: config.apiKey });
  const model = geminiConfig.modelName;

  try {
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [textPart] },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const raw = response && typeof response.text === 'string' ? response.text : '';

    console.log('[GeminiService] generateStructuredData raw response preview:', raw ? (raw.length > 200 ? raw.slice(0,200) + '...' : raw) : '<empty>');

    if (!raw || raw.trim() === '') {
      throw new Error('Gemini returned an empty response for structured JSON output.');
    }

    // Parse JSON and validate minimal shape
    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error('[GeminiService] Failed to parse JSON from Gemini response:', raw);
      throw new Error('Failed to parse JSON from Gemini response. Raw response: ' + raw);
    }

    // Basic runtime validation to give helpful errors to integrators
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Parsed Gemini response is not an object. Raw response: ' + raw);
    }
    if (!Array.isArray(parsed.palette) || parsed.palette.length < 3) {
      throw new Error('Parsed Gemini response has an invalid or missing "palette". Raw response: ' + raw);
    }
    if (!Array.isArray(parsed.track)) {
      throw new Error('Parsed Gemini response has an invalid or missing "track". Raw response: ' + raw);
    }
    if (typeof parsed.rideName !== 'string' || parsed.rideName.trim() === '') {
      throw new Error('Parsed Gemini response has an invalid or missing "rideName". Raw response: ' + raw);
    }
    if (typeof parsed.moodDescription !== 'string') {
      parsed.moodDescription = ''; // degrade gracefully if absent
    }

    // Cast is safe after runtime checks above
    const data = parsed as RideBlueprint;

    return { data, raw };
  } catch (err: any) {
    console.error('[GeminiService] generateStructuredData error:', err);
    const msg = err instanceof Error ? err.message : String(err);

    if (msg.includes('API key not valid') || msg.toLowerCase().includes('unauthorized')) {
      throw new Error('Gemini API key invalid or unauthorized. Ensure GEMINI_API_KEY is correct and has access to the chosen model.');
    }

    // Bubble up schema/validation related messages verbatim to aid debugging
    if (msg.includes('missing') || msg.includes('invalid') || msg.includes('parse')) {
      throw new Error(`Structured output validation error: ${msg}`);
    }

    throw new Error(`Failed to generate structured data from Gemini: ${msg}`);
  }
};

// Quick manual test for node-based invocations (does not run during normal imports)
if (typeof require !== 'undefined' && require.main === module) {
  (async () => {
    try {
      // Small example prompt using the existing PROMPT_TEXT helper with dummy audio analysis values.
      const samplePrompt = PROMPT_TEXT(120, 120, 0.75, 2500, 0.12);
      const result = await generateStructuredData(samplePrompt);
      console.log('[GeminiService] Manual test — parsed rideName:', result.data.rideName);
      console.log('[GeminiService] Manual test — palette:', result.data.palette);
      console.log('[GeminiService] Manual test — track segments count:', result.data.track.length);
    } catch (err) {
      console.error('[GeminiService] Manual test failed:', err);
    }
  })();
}

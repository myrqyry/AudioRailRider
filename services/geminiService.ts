import { GoogleGenAI, Type } from "@google/genai";
import { RideBlueprint } from "../types";
import { config } from '../config';
import geminiConfig from '../gemini.config.ts';

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
    required: ['palette', 'track', 'rideName', 'moodDescription']
};

/**
 * Converts a File object to a GoogleGenAI.Part object for multimodal prompting.
 * @param file The file to convert.
 * @returns A promise that resolves to a generative part object.
 */
const fileToGenerativePart = async (file: File) => {
  const base64EncodedData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (err) => reject(new Error("Failed to read file: " + err));
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      mimeType: file.type,
      data: base64EncodedData,
    },
  };
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
    const audioPart = await fileToGenerativePart(audioFile);
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

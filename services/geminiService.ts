import { GoogleGenAI, Type } from "@google/genai";
import { RideBlueprint } from "../types";

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
  - 'rotations': How many full 360-degree rolls (e.g., 1, 2).
  - 'length': The forward distance covered during the roll (e.g., 100 to 200).
`;

const PROMPT_TEXT = (duration: number) => `
You have been given an audio file of a song that is ${duration.toFixed(0)} seconds long.

Listen to the entire track and analyze its emotional arc, dynamics, and rhythm. Your task is to translate this audio experience into a thrilling rollercoaster ride blueprint.

- **Palette**: First, determine the overall mood. Is it energetic, melancholic, epic, ambient? Based on this, define a 3-color hex code palette: [rail color, glow color, sky color]. Vibrant songs get bright colors (e.g., cyan, magenta), while somber songs get darker tones (e.g., deep blue, purple).
- **Track Design**:
  - Generate a track with 12 to 20 segments.
  - The ride's intensity must mirror the music's dynamics. Use gentle 'climb' segments for quiet intros, builds, and verses.
  - When the music swells or the beat drops (the chorus or other high-energy moments), you MUST use high-excitement components: 'drop', 'loop', or 'barrelRoll'.
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
                    rotations: { type: Type.NUMBER },
                },
                required: ['component']
            }
        }
    },
    required: ['palette', 'track']
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

export const generateRideBlueprint = async (audioFile: File, duration: number): Promise<RideBlueprint> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    throw new Error("API_KEY environment variable not set. This app requires a configured Gemini API key to function.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash";
  
  try {
    const audioPart = await fileToGenerativePart(audioFile);
    const textPart = { text: PROMPT_TEXT(duration) };

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

    const blueprint = JSON.parse(jsonText);
    
    if (!blueprint.palette || !Array.isArray(blueprint.palette) || blueprint.palette.length < 3 || !blueprint.track || !Array.isArray(blueprint.track)) {
        throw new Error("The AI returned an invalid blueprint structure. This can happen with very unusual songs. Please try another one.");
    }
    
    return blueprint as RideBlueprint;
  } catch (error) {
    console.error("Error generating ride blueprint:", error);
    if (error instanceof SyntaxError) {
        throw new Error("The AI returned malformed data. This is a rare issue, please try again.");
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('API key not valid')) {
        throw new Error("Your Gemini API key is not valid. Please check your configuration.");
    }
    if (errorMessage.includes('500') || errorMessage.includes('Internal error') || errorMessage.includes('request failed')) {
        throw new Error("The generative muse had a temporary hiccup, likely due to the song's complexity. Please try again in a moment.");
    }
    throw new Error(`The generative muse is unavailable: ${errorMessage}`);
  }
};

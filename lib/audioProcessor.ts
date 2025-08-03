
import { AudioFeatures } from '../types';

if (typeof window === 'undefined') {
  // This avoids errors during server-side rendering or in non-browser environments.
  (globalThis as any).AudioContext = class AudioContext {} as any;
}

/**
 * This function is simplified to only extract audio duration using the Web Audio API.
 * The full, deep analysis of the audio is now performed by the Gemini API.
 * @param audioFile The audio file to analyze.
 * @returns A promise that resolves to an object containing the audio's duration in seconds.
 */
export const analyzeAudio = async (audioFile: File): Promise<AudioFeatures> => {
  const audioContext = new AudioContext();
  const arrayBuffer = await audioFile.arrayBuffer();
  let audioBuffer: AudioBuffer;
  try {
      audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  } catch (error) {
      console.error("Error decoding audio data:", error);
      throw new Error(
          "Could not decode the audio file. It might be corrupted or in an unsupported format. Please try a different MP3 or WAV file."
      );
  }
  await audioContext.close();

  // Gemini now handles the deep analysis. We only need the duration for the prompt context.
  return {
    duration: audioBuffer.duration,
  };
};

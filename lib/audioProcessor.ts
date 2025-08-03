
import { AudioFeatures } from '../types';
import Meyda from 'meyda';
import { analyzeFullBuffer } from 'realtime-bpm-analyzer';

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

  // BPM Analysis
  const bpmCandidates = await analyzeFullBuffer(audioBuffer);
  const bpm = bpmCandidates.length > 0 ? bpmCandidates[0].tempo : 120;

  // Energy Analysis
  const channelData = audioBuffer.getChannelData(0);
  Meyda.bufferSize = 512;
  let energy = 0;
  let count = 0;
  for (let i = 0; i < channelData.length; i += Meyda.bufferSize) {
      const frame = channelData.slice(i, i + Meyda.bufferSize);
      if (frame.length === Meyda.bufferSize) {
          const features = Meyda.extract('energy', frame);
          energy += features.energy;
          count++;
      }
  }
  const averageEnergy = count > 0 ? energy / count : 0;
  // Normalize energy to a 0-1 scale (this is a rough approximation)
  const normalizedEnergy = Math.min(averageEnergy / 10, 1);


  await audioContext.close();

  // Gemini now handles the deep analysis. We only need the duration for the prompt context.
  return {
    duration: audioBuffer.duration,
    bpm: bpm,
    energy: normalizedEnergy
  };
};

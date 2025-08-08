
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

  // Detailed audio analysis using Meyda
  const channelData = audioBuffer.getChannelData(0);
  Meyda.bufferSize = 1024; // A larger buffer size can give more stable results for spectral features

  let energy = 0;
  let spectralCentroid = 0;
  let spectralFlux = 0;
  let frameCount = 0;

  const featuresToExtract = ['energy', 'spectralCentroid', 'spectralFlux'];

  for (let i = 0; i < channelData.length; i += Meyda.bufferSize) {
      const frame = channelData.slice(i, i + Meyda.bufferSize);
      if (frame.length === Meyda.bufferSize) {
          const features = Meyda.extract(featuresToExtract, frame);
          energy += features.energy;
          spectralCentroid += features.spectralCentroid;
          spectralFlux += features.spectralFlux;
          frameCount++;
      }
  }

  const avgEnergy = frameCount > 0 ? energy / frameCount : 0;
  const avgSpectralCentroid = frameCount > 0 ? spectralCentroid / frameCount : 0;
  const avgSpectralFlux = frameCount > 0 ? spectralFlux / frameCount : 0;

  // Normalize energy to a 0-1 scale (this is a rough approximation)
  const normalizedEnergy = Math.min(avgEnergy / 10, 1);

  await audioContext.close();

  return {
    duration: audioBuffer.duration,
    bpm: bpm,
    energy: normalizedEnergy,
    spectralCentroid: avgSpectralCentroid,
    spectralFlux: avgSpectralFlux,
  };
};

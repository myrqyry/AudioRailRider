
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
  let audioBuffer: AudioBuffer | null = null;

  // Primary attempt: Web Audio API decoding (preferred, allows full analysis)
  try {
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  } catch (primaryError) {
    console.error("[audioProcessor] Primary decodeAudioData failed:", primaryError);

    // Fallback attempt: Use HTMLAudioElement to at least obtain duration metadata.
    // This avoids adding new dependencies and keeps downstream processing moving.
    try {
      const url = URL.createObjectURL(audioFile);
      const audioEl = new Audio();
      audioEl.preload = 'metadata';
      audioEl.src = url;

      const duration = await new Promise<number>((resolve, reject) => {
        const onLoaded = () => {
          cleanup();
          // audioEl.duration can be NaN/Infinity in some edge cases; coerce to number
          const d = typeof audioEl.duration === 'number' && isFinite(audioEl.duration) ? audioEl.duration : NaN;
          if (isNaN(d)) {
            reject(new Error('HTMLAudioElement provided an invalid duration'));
          } else {
            resolve(d);
          }
        };
        const onError = (ev: any) => {
          cleanup();
          reject(new Error('HTMLAudioElement failed to load metadata'));
        };
        const cleanup = () => {
          audioEl.removeEventListener('loadedmetadata', onLoaded);
          audioEl.removeEventListener('error', onError);
          // Revoke object URL after we are done to free memory
          try { URL.revokeObjectURL(url); } catch (e) { /* ignore */ }
        };
        audioEl.addEventListener('loadedmetadata', onLoaded);
        audioEl.addEventListener('error', onError);
      });

      console.warn(`[audioProcessor] decodeAudioData failed; used HTMLAudioElement metadata fallback for duration (${audioFile.name}). Duration:${duration}s`);

      // Close AudioContext since we won't use it for further analysis in fallback path.
      try {
        await audioContext.close();
      } catch (e) {
        console.debug('[audioProcessor] audioContext.close() during fallback failed:', e);
      }

      // Return partial AudioFeatures with valid duration and conservative defaults so downstream logic can proceed.
      return {
        duration,
        bpm: 120, // conservative default tempo
        energy: 0,
        spectralCentroid: 0,
        spectralFlux: 0,
      };
    } catch (fallbackError) {
      console.error("[audioProcessor] Fallback metadata extraction failed:", fallbackError);
      // Ensure AudioContext is closed before propagating error
      try {
        await audioContext.close();
      } catch (e) {
        console.debug('[audioProcessor] audioContext.close() after both failures failed:', e);
      }

      // Combine errors to aid debugging
      const primaryMsg = primaryError instanceof Error ? primaryError.message : String(primaryError);
      const fallbackMsg = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
      throw new Error(
        `Could not decode the audio file. Primary decode error: ${primaryMsg}. Fallback metadata extraction error: ${fallbackMsg}. ` +
        `The file may be corrupted or in an unsupported format. Please try a different MP3 or WAV file.`
      );
    }
  }

  // If we reach here, primary decode succeeded and audioBuffer is available.
  if (!audioBuffer) {
    // Defensive check (shouldn't happen, but guard anyway)
    try {
      await audioContext.close();
    } catch (e) {
      console.debug('[audioProcessor] audioContext.close() defensive path failed:', e);
    }
    throw new Error('Decoded audio buffer was not produced by decodeAudioData.');
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
      // Meyda typings are sometimes strict; cast to any to safely access expected feature fields.
      const features = (Meyda as any).extract(featuresToExtract, frame) as any;
      energy += (typeof features.energy === 'number' ? features.energy : 0);
      spectralCentroid += (typeof features.spectralCentroid === 'number' ? features.spectralCentroid : 0);
      spectralFlux += (typeof features.spectralFlux === 'number' ? features.spectralFlux : 0);
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

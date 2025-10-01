import { AudioFeatures, FrameAnalysis } from "shared/types";

// Fallback values in case analysis fails
const FALLBACK_ENERGY = 0.5;
const FALLBACK_SPECTRAL_CENTROID = 1000;
const FALLBACK_SPECTRAL_FLUX = 0.1;

// Meyda is loaded from CDN and attached to window
declare global {
  interface Window {
    Meyda?: unknown;
  }
}

/**
 * Simple BPM analysis function.
 * This is a placeholder implementation. For production use, consider using a more robust BPM detection library.
 */
const analyzeFullBuffer = async (audioBuffer: AudioBuffer): Promise<{ tempo: number }[]> => {
  const channelData = audioBuffer.getChannelData(0);
  const sampleRate = audioBuffer.sampleRate;
  const bufferLength = channelData.length;

  // Simple BPM detection algorithm (placeholder)
  const bpm = 120; // Placeholder BPM value
  return [{ tempo: bpm }];
};

/**
 * Analyzes an audio file to extract features like duration, BPM, and energy.
 * It first attempts to use the Web Audio API for a full analysis. If that fails,
 * it falls back to using an HTMLAudioElement to at least get the duration.
 * @param audioFile The audio file to analyze.
 * @returns A promise that resolves to an AudioFeatures object.
 * @throws An error if the audio file cannot be decoded.
 */
export const analyzeAudio = async (audioFile: File): Promise<AudioFeatures> => {
  const audioContext = new AudioContext();
  let audioBuffer: AudioBuffer | null = null;

  // Primary attempt: Web Audio API decoding (preferred, allows full analysis)
  try {
    const arrayBuffer = await audioFile.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  } catch (primaryError) {
    console.error("[audioProcessor] Primary decodeAudioData failed:", primaryError);

    // Fallback attempt: Use HTMLAudioElement to at least obtain duration metadata.
    // This avoids adding new dependencies and keeps downstream processing moving.
    try {
      const url = URL.createObjectURL(audioFile);
      const audioEl = new Audio();
      audioEl.preload = 'metadata';
      const duration = await new Promise<number>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          cleanup();
          reject(new Error('Audio metadata loading timeout after 30s'));
        }, 30000);

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
          clearTimeout(timeoutId);
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
        frameAnalyses: [],
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
  const MeydaBufferSize = 1024;
  const frameAnalyses: FrameAnalysis[] = [];
  let totalEnergy = 0;
  let totalSpectralCentroid = 0;
  let totalSpectralFlux = 0;

  if (window.Meyda && (window.Meyda as any).extract) {
    try {
      console.log('Meyda global object:', window.Meyda);
      (window.Meyda as any).bufferSize = MeydaBufferSize;
      let prevCentroid: number | null = null;

      for (let i = 0; i < channelData.length; i += MeydaBufferSize) {
        const frame = channelData.slice(i, i + MeydaBufferSize);
        if (frame.length !== MeydaBufferSize) continue;

        try {
          const features = (window.Meyda as any).extract(['energy', 'spectralCentroid', 'loudness'], frame);

          const fEnergy = features.energy ?? 0;
          const fCentroid = features.spectralCentroid ?? 0;
          const fLoudness = features.loudness?.specific ?? new Float32Array(24).fill(0);

          const flux = prevCentroid !== null ? Math.abs(fCentroid - prevCentroid) : 0;

          totalEnergy += fEnergy;
          totalSpectralCentroid += fCentroid;
          totalSpectralFlux += flux;

          frameAnalyses.push({
            timestamp: (i / audioBuffer.sampleRate),
            energy: fEnergy,
            spectralCentroid: fCentroid,
            spectralFlux: flux,
            bass: fLoudness.slice(0, 8).reduce((s, v) => s + v, 0) / 8,
            mid: fLoudness.slice(8, 16).reduce((s, v) => s + v, 0) / 8,
            high: fLoudness.slice(16, 24).reduce((s, v) => s + v, 0) / 8,
          });

          prevCentroid = fCentroid;
        } catch (frameErr) {
          console.warn('[audioProcessor] Meyda.extract failed for a frame, skipping frame:', frameErr);
        }
      }
    } catch (initErr) {
      console.error('Error initializing Meyda analysis loop:', initErr);
    }
  } else {
    console.warn('[audioProcessor] Meyda not available; using fallback audio feature values.');
  }

  const frameCount = frameAnalyses.length;
  const avgEnergy = frameCount > 0 ? totalEnergy / frameCount : 0;
  const avgSpectralCentroid = frameCount > 0 ? totalSpectralCentroid / frameCount : 0;
  const avgSpectralFlux = frameCount > 0 ? totalSpectralFlux / frameCount : 0;
  const normalizedEnergy = Math.min(avgEnergy / 10, 1);

  await audioContext.close();

  return {
    duration: audioBuffer.duration,
    bpm: bpm,
    energy: normalizedEnergy,
    spectralCentroid: avgSpectralCentroid,
    spectralFlux: avgSpectralFlux,
    frameAnalyses: frameAnalyses,
  };
};

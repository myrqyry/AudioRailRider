import { AudioFeatures, EnhancedAudioFeatures, FrameAnalysis, seconds } from "shared/types";
import {
  averageSlice,
  smoothCurve,
  detectBeats,
  detectStructuralBoundaries,
  createFrameForDispatch,
} from './audioFeatureUtils';
import * as audioWorklet from './audioWorklet';

// Fallback values in case analysis fails
const FALLBACK_ENERGY = 0;
const FALLBACK_SPECTRAL_CENTROID = 1000;
const FALLBACK_SPECTRAL_FLUX = 0.1;

const WINDOW_SIZE = 1024;
const HOP_SIZE = WINDOW_SIZE / 2;
const DEFAULT_BPM = 120;
const ENERGY_SMOOTHING_WINDOW = 4;
const DEFAULT_CHROMA_BINS = 12;
const DEFAULT_MFCC_BINS = 13;

// Meyda is loaded from CDN and attached to window
declare global {
  interface Window {
    Meyda?: unknown;
  }
}

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
  // Try registering and using the AudioWorklet (best-effort). In test env this will be a no-op.
  if (audioWorklet.isWorkletSupported()) {
    try {
      await audioWorklet.registerWorklet(audioContext);
    } catch (e) {
      // non-fatal
      console.debug('[audioProcessor] worklet registration failed', e);
    }
  }
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
        duration: seconds(duration),
        bpm: DEFAULT_BPM,
        energy: 0,
        spectralCentroid: 0,
        spectralFlux: 0,
        frameAnalyses: [],
        enhanced: null,
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

  const meyda = (window.Meyda as any) ?? null;
  const canExtract = !!(meyda && typeof meyda.extract === 'function');

  if (!canExtract) {
    console.warn('[audioProcessor] Meyda.extract unavailable; returning fallback audio features.');
    await audioContext.close();
    return {
      duration: seconds(audioBuffer.duration),
      bpm: DEFAULT_BPM,
      energy: FALLBACK_ENERGY,
      spectralCentroid: FALLBACK_SPECTRAL_CENTROID,
      spectralFlux: FALLBACK_SPECTRAL_FLUX,
      frameAnalyses: [],
      enhanced: null,
    };
  }

  // Detailed audio analysis using Meyda with sliding windows
  const channelData = audioBuffer.getChannelData(0);
  const totalSamples = channelData.length;
  const windowSize = WINDOW_SIZE;
  const hopSize = totalSamples < windowSize ? windowSize : HOP_SIZE;
  let frameCount = 0;
  if (totalSamples < windowSize) {
    frameCount = 1;
  } else {
    frameCount = Math.floor((totalSamples - windowSize) / hopSize) + 1;
  }
  if (frameCount <= 0) frameCount = 1;

  const hopSeconds = hopSize / audioBuffer.sampleRate;
  const timestamps = new Float32Array(frameCount);
  const energyCurve = new Float32Array(frameCount);
  const spectralCentroidCurve = new Float32Array(frameCount);
  const spectralFluxCurve = new Float32Array(frameCount);
  const perceptualSharpnessCurve = new Float32Array(frameCount);
  const spectralRolloffCurve = new Float32Array(frameCount);
  const zeroCrossingRateCurve = new Float32Array(frameCount);
  const bassCurve = new Float32Array(frameCount);
  const midCurve = new Float32Array(frameCount);
  const highCurve = new Float32Array(frameCount);
  const chromaFrames: number[][] = [];
  const mfccFrames: number[][] = [];

  let energySum = 0;
  let energyMax = 0;
  let spectralCentroidSum = 0;
  let spectralFluxSum = 0;

  for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
  const frameStart = frameIndex * hopSize;
  const latestSampleIndex = totalSamples > 0 ? totalSamples - 1 : 0;
  const timestampSeconds = Math.min(frameStart, latestSampleIndex) / audioBuffer.sampleRate;
    timestamps[frameIndex] = timestampSeconds;

    let frameSlice: Float32Array;
    if (totalSamples < windowSize) {
      frameSlice = new Float32Array(windowSize);
      frameSlice.set(channelData, 0);
    } else if (frameStart + windowSize <= totalSamples) {
      frameSlice = channelData.subarray(frameStart, frameStart + windowSize);
    } else {
      frameSlice = new Float32Array(windowSize);
      frameSlice.set(channelData.subarray(frameStart));
    }

    let features: any = null;
    try {
      features = meyda.extract(
        ['energy', 'rms', 'spectralCentroid', 'spectralFlux', 'loudness', 'perceptualSharpness', 'spectralRolloff', 'zcr', 'chroma', 'mfcc'],
        frameSlice,
        { sampleRate: audioBuffer.sampleRate, bufferSize: windowSize }
      );
    } catch (err) {
      console.warn('[audioProcessor] Meyda extract failed for frame', frameIndex, err);
    }

    const rawEnergy = features && typeof features.energy === 'number'
      ? features.energy
      : features && typeof features.rms === 'number'
        ? features.rms
        : 0;
    const logEnergy = Math.log10(1 + Math.max(rawEnergy, 0));
    energyCurve[frameIndex] = logEnergy;
    energySum += logEnergy;
    if (logEnergy > energyMax) energyMax = logEnergy;

    const centroid = features && typeof features.spectralCentroid === 'number' ? features.spectralCentroid : FALLBACK_SPECTRAL_CENTROID;
    spectralCentroidCurve[frameIndex] = centroid;
    spectralCentroidSum += centroid;

    const flux = features && typeof features.spectralFlux === 'number' ? features.spectralFlux : FALLBACK_SPECTRAL_FLUX;
    spectralFluxCurve[frameIndex] = flux;
    spectralFluxSum += flux;

    const sharpness = features && typeof features.perceptualSharpness === 'number' ? features.perceptualSharpness : 0;
    perceptualSharpnessCurve[frameIndex] = sharpness;

    const rolloff = features && typeof features.spectralRolloff === 'number' ? features.spectralRolloff : 0;
    spectralRolloffCurve[frameIndex] = rolloff;

    const zcr = features && typeof features.zcr === 'number' ? features.zcr : 0;
    zeroCrossingRateCurve[frameIndex] = zcr;

    const loudnessSpecific: number[] | undefined = features?.loudness?.specific;
    if (Array.isArray(loudnessSpecific) && loudnessSpecific.length >= 24) {
      bassCurve[frameIndex] = averageSlice(loudnessSpecific, 0, 8);
      midCurve[frameIndex] = averageSlice(loudnessSpecific, 8, 16);
      highCurve[frameIndex] = averageSlice(loudnessSpecific, 16, 24);
    } else {
      bassCurve[frameIndex] = 0;
      midCurve[frameIndex] = 0;
      highCurve[frameIndex] = 0;
    }

    const chromaVals: number[] | undefined = features?.chroma;
    if (Array.isArray(chromaVals)) {
      chromaFrames.push(chromaVals.slice());
    } else {
      chromaFrames.push(new Array(DEFAULT_CHROMA_BINS).fill(0));
    }

    const mfccVals: number[] | undefined = features?.mfcc;
    if (Array.isArray(mfccVals)) {
      mfccFrames.push(mfccVals.slice());
    } else {
      mfccFrames.push(new Array(DEFAULT_MFCC_BINS).fill(0));
    }
  }

  const frameAnalyses: FrameAnalysis[] = [];
  const energyNormalizer = energyMax > 0 ? 1 / energyMax : 1;
  for (let i = 0; i < frameCount; i++) {
    frameAnalyses.push({
      timestamp: seconds(timestamps[i] ?? 0),
      energy: Math.min(Math.max(energyCurve[i] * energyNormalizer, 0), 1),
      spectralCentroid: spectralCentroidCurve[i] ?? 0,
      spectralFlux: spectralFluxCurve[i] ?? 0,
      bass: bassCurve[i] ?? 0,
      mid: midCurve[i] ?? 0,
      high: highCurve[i] ?? 0,
    });
  }

  const avgEnergy = frameCount > 0 ? energySum / frameCount : 0;
  const avgSpectralCentroid = frameCount > 0 ? spectralCentroidSum / frameCount : FALLBACK_SPECTRAL_CENTROID;
  const avgSpectralFlux = frameCount > 0 ? spectralFluxSum / frameCount : FALLBACK_SPECTRAL_FLUX;
  const normalizedEnergy = energyMax > 0 ? Math.min(avgEnergy / energyMax, 1) : 0;

  const smoothedEnergy = smoothCurve(energyCurve, ENERGY_SMOOTHING_WINDOW);
  const { beats, tempo } = detectBeats(smoothedEnergy, spectralCentroidCurve, perceptualSharpnessCurve, hopSeconds);
  const structuralBoundaries = detectStructuralBoundaries(energyCurve, spectralRolloffCurve, zeroCrossingRateCurve, hopSeconds);

  const chromaMatrix = flattenFrameMatrix(chromaFrames, DEFAULT_CHROMA_BINS);
  const mfccMatrix = flattenFrameMatrix(mfccFrames, DEFAULT_MFCC_BINS);

  const enhanced: EnhancedAudioFeatures = {
    duration: seconds(audioBuffer.duration),
    tempo,
    windowSize,
    hopSize,
    sampleRate: audioBuffer.sampleRate,
    energy: energyCurve,
    spectralCentroid: spectralCentroidCurve,
    spectralFlux: spectralFluxCurve,
    perceptualSharpness: perceptualSharpnessCurve,
    spectralRolloff: spectralRolloffCurve,
    zeroCrossingRate: zeroCrossingRateCurve,
    chroma: chromaMatrix.flatArray,
    chromaBins: chromaMatrix.binCount,
    mfcc: mfccMatrix.flatArray,
    mfccCoefficients: mfccMatrix.binCount,
    beats,
    structuralBoundaries,
  };

  await audioContext.close();

  return {
    duration: seconds(audioBuffer.duration),
    bpm: Math.round(tempo || DEFAULT_BPM),
    energy: normalizedEnergy,
    spectralCentroid: avgSpectralCentroid,
    spectralFlux: avgSpectralFlux,
    frameAnalyses,
    enhanced,
  };
};

// Create a live worklet-based analyzer attached to the provided AudioContext.
// The onFrame callback receives FrameAnalysis objects created from worklet messages.
export const createWorkletAnalyzerForContext = async (
  audioContext: AudioContext,
  onFrame: (frame: FrameAnalysis) => void
): Promise<AudioWorkletNode | null> => {
  if (!audioWorklet.isWorkletSupported()) return null;
  try {
    await audioWorklet.registerWorklet(audioContext);
    const node = audioWorklet.createAnalyzerNode(audioContext, (a) => {
      const frame = createFrameForDispatch(a.timestamp, {
        energy: a.energy,
        spectralCentroid: a.spectralCentroid,
        spectralFlux: a.spectralFlux,
        bass: a.bass,
        mid: a.mid,
        high: a.high,
        sampleRate: a.sampleRate,
        channelCount: a.channelCount,
        frame: a.frame,
      });
      onFrame(frame);
    });
    return node;
  } catch (e) {
    console.warn('[audioProcessor] createWorkletAnalyzerForContext failed', e);
    return null;
  }
};

const flattenFrameMatrix = (frames: number[][], defaultBins: number): { flatArray: Float32Array; binCount: number } => {
  const binCount = frames.length > 0 && frames[0]?.length ? frames[0].length : defaultBins;
  const flat = new Float32Array(frames.length * binCount);
  for (let frameIndex = 0; frameIndex < frames.length; frameIndex++) {
    const frame = frames[frameIndex] || [];
    for (let bin = 0; bin < binCount; bin++) {
      const value = frame[bin];
      flat[frameIndex * binCount + bin] = typeof value === 'number' ? value : 0;
    }
  }
  return { flatArray: flat, binCount };
};

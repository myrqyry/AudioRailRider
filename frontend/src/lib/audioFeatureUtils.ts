import { FrameAnalysis, Seconds, seconds } from 'shared/types';

/**
 * Calculates the average of a slice of a number array.
 * @param {ArrayLike<number>} arr - The input array.
 * @param {number} start - The starting index of the slice.
 * @param {number} end - The ending index of the slice.
 * @returns {number} The average of the slice.
 */
export const averageSlice = (arr: ArrayLike<number>, start: number, end: number): number => {
  const boundedStart = Math.max(0, Math.min(start, arr.length));
  const boundedEnd = Math.max(boundedStart, Math.min(end, arr.length));
  let sum = 0;
  let count = 0;
  for (let i = boundedStart; i < boundedEnd; i++) {
    const value = arr[i];
    if (typeof value === 'number' && !Number.isNaN(value)) {
      sum += value;
    }
    count++;
  }
  return count > 0 ? sum / count : 0;
};

/**
 * Smoothes a curve using a moving average window.
 * @param {Float32Array} input - The input curve data.
 * @param {number} window - The size of the moving average window.
 * @returns {Float32Array} The smoothed curve.
 */
export const smoothCurve = (input: Float32Array, window: number): Float32Array => {
  if (window <= 1) {
    return input.slice() as Float32Array;
  }
  const output = new Float32Array(input.length);
  const halfWindow = Math.floor(window / 2);
  for (let i = 0; i < input.length; i++) {
    let sum = 0;
    let count = 0;
    for (let offset = -halfWindow; offset <= halfWindow; offset++) {
      const idx = i + offset;
      if (idx >= 0 && idx < input.length) {
        sum += input[idx];
        count++;
      }
    }
    output[i] = count > 0 ? sum / count : input[i];
  }
  return output;
};

/**
 * Finds the maximum value in a Float32Array.
 * @param {Float32Array} arr - The input array.
 * @returns {number} The maximum value in the array.
 */
export const getMax = (arr: Float32Array): number => {
  let max = 0;
  for (let i = 0; i < arr.length; i++) {
    const val = arr[i];
    if (val > max) max = val;
  }
  return max;
};

export interface BeatDetectionConfig {
  minSpacingSeconds: number;
  maxIntervalSeconds: number;
  defaultBpm: number;
}

export const DEFAULT_BEAT_CONFIG: BeatDetectionConfig = {
  minSpacingSeconds: 60 / 220,
  maxIntervalSeconds: 60 / 40,
  defaultBpm: 120,
};

/**
 * Detects beats in an audio signal based on energy and spectral features.
 * @param {Float32Array} energyCurve - The curve representing the energy of the audio.
 * @param {Float32Array} spectralCentroidCurve - The curve representing the spectral centroid.
 * @param {Float32Array} perceptualSharpnessCurve - The curve representing perceptual sharpness.
 * @param {number} hopSeconds - The time in seconds between each frame of the curves.
 * @param {BeatDetectionConfig} [config=DEFAULT_BEAT_CONFIG] - Configuration for beat detection.
 * @returns {{ beats: number[]; tempo: number }} An object containing the detected beat timestamps and the estimated tempo.
 */
export const detectBeats = (
  energyCurve: Float32Array,
  spectralCentroidCurve: Float32Array,
  perceptualSharpnessCurve: Float32Array,
  hopSeconds: number,
  config: BeatDetectionConfig = DEFAULT_BEAT_CONFIG
): { beats: number[]; tempo: number } => {
  if (energyCurve.length === 0) {
    return { beats: [], tempo: config.defaultBpm };
  }

  const beats: number[] = [];
  const intervals: number[] = [];

  let energySum = 0;
  for (let i = 0; i < energyCurve.length; i++) {
    energySum += energyCurve[i];
  }
  const energyMean = energyCurve.length > 0 ? energySum / energyCurve.length : 0;

  let variance = 0;
  for (let i = 0; i < energyCurve.length; i++) {
    const deviation = energyCurve[i] - energyMean;
    variance += deviation * deviation;
  }
  const energyStd = energyCurve.length > 1 ? Math.sqrt(variance / (energyCurve.length - 1)) : 0;

  const centroidMax = getMax(spectralCentroidCurve);
  const sharpnessMax = getMax(perceptualSharpnessCurve);

  let lastBeatTime = -Infinity;
  for (let i = 1; i < energyCurve.length - 1; i++) {
    const energy = energyCurve[i];
    const prev = energyCurve[i - 1];
    const next = energyCurve[i + 1];

    const localRadius = 4;
    let localSum = 0;
    let localCount = 0;
    for (let offset = -localRadius; offset <= localRadius; offset++) {
      const idx = i + offset;
      if (idx >= 0 && idx < energyCurve.length) {
        localSum += energyCurve[idx];
        localCount++;
      }
    }
    const localAvg = localCount > 0 ? localSum / localCount : energyMean;
    const centroidNorm = centroidMax > 0 ? spectralCentroidCurve[i] / centroidMax : 0;
    const sharpnessNorm = sharpnessMax > 0 ? perceptualSharpnessCurve[i] / sharpnessMax : 0;

    const adaptiveThreshold = (localAvg + energyMean) * 0.5 + energyStd * 0.6 + (centroidNorm + sharpnessNorm) * 0.1;

    if (energy > adaptiveThreshold && energy > prev && energy > next) {
      const currentTime = i * hopSeconds;
      if (currentTime - lastBeatTime >= config.minSpacingSeconds) {
        if (lastBeatTime >= 0) {
          const interval = currentTime - lastBeatTime;
          if (interval > 0 && interval <= config.maxIntervalSeconds) {
            intervals.push(interval);
          }
        }
        beats.push(currentTime);
        lastBeatTime = currentTime;
      }
    }
  }

  if (intervals.length === 0) {
    return { beats, tempo: config.defaultBpm };
  }

  const totalInterval = intervals.reduce((acc, val) => acc + val, 0);
  const avgInterval = totalInterval / intervals.length;
  const sortedIntervals = intervals.slice().sort((a, b) => a - b);
  const medianInterval = sortedIntervals[Math.floor(sortedIntervals.length / 2)];
  const medianTempo = medianInterval > 0 ? 60 / medianInterval : config.defaultBpm;
  const averageTempo = avgInterval > 0 ? 60 / avgInterval : config.defaultBpm;
  const smoothedTempo = 0.6 * medianTempo + 0.4 * averageTempo;

  return { beats, tempo: smoothedTempo || config.defaultBpm };
};

export interface StructuralBoundaryConfig {
  changeThreshold: number;
  minSpacingSeconds: number;
}

export const DEFAULT_STRUCTURE_CONFIG: StructuralBoundaryConfig = {
  changeThreshold: 0.55,
  minSpacingSeconds: 4,
};

/**
 * Detects structural boundaries in an audio signal, such as the start of a chorus or verse.
 * @param {Float32Array} energyCurve - The curve representing the energy of the audio.
 * @param {Float32Array} spectralRolloffCurve - The curve representing the spectral rolloff.
 * @param {Float32Array} zeroCrossingRateCurve - The curve representing the zero-crossing rate.
 * @param {number} hopSeconds - The time in seconds between each frame of the curves.
 * @param {StructuralBoundaryConfig} [config=DEFAULT_STRUCTURE_CONFIG] - Configuration for boundary detection.
 * @returns {number[]} An array of timestamps for the detected boundaries.
 */
export const detectStructuralBoundaries = (
  energyCurve: Float32Array,
  spectralRolloffCurve: Float32Array,
  zeroCrossingRateCurve: Float32Array,
  hopSeconds: number,
  config: StructuralBoundaryConfig = DEFAULT_STRUCTURE_CONFIG
): number[] => {
  if (energyCurve.length === 0) return [];

  const boundaries: number[] = [];
  const energyMax = getMax(energyCurve) || 1;
  const rolloffMax = getMax(spectralRolloffCurve) || 1;
  const zcrMax = getMax(zeroCrossingRateCurve) || 1;
  let lastBoundaryTime = -Infinity;

  for (let i = 1; i < energyCurve.length; i++) {
    const energyDelta = Math.abs(energyCurve[i] - energyCurve[i - 1]) / energyMax;
    const rolloffDelta = Math.abs(spectralRolloffCurve[i] - spectralRolloffCurve[i - 1]) / rolloffMax;
    const zcrDelta = Math.abs(zeroCrossingRateCurve[i] - zeroCrossingRateCurve[i - 1]) / zcrMax;

    const changeScore = rolloffDelta * 0.45 + zcrDelta * 0.3 + energyDelta * 0.25;
    if (changeScore > config.changeThreshold) {
      const time = i * hopSeconds;
      if (time - lastBoundaryTime >= config.minSpacingSeconds) {
        boundaries.push(time);
        lastBoundaryTime = time;
      }
    }
  }

  return boundaries;
};

/**
 * Creates a `FrameAnalysis` object suitable for dispatching in a custom event.
 * @param {number} timestampSeconds - The timestamp of the frame in seconds.
 * @param {Omit<FrameAnalysis, 'timestamp'>} values - An object containing all frame analysis values except the timestamp.
 * @returns {FrameAnalysis} The complete frame analysis object.
 */
export const createFrameForDispatch = (
  timestampSeconds: number,
  values: Omit<FrameAnalysis, 'timestamp'>
): FrameAnalysis => ({
  timestamp: seconds(timestampSeconds),
  energy: values.energy,
  spectralCentroid: values.spectralCentroid,
  spectralFlux: values.spectralFlux,
  bass: values.bass,
  mid: values.mid,
  high: values.high,
  sampleRate: values.sampleRate,
  channelCount: values.channelCount,
  frame: values.frame,
});

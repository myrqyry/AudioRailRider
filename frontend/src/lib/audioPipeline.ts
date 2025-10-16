import { AudioFeatures, FrameAnalysis, seconds } from 'shared/types';

/**
 * A function that processes a single frame of audio data and returns a partial analysis.
 * @param {Float32Array} frame - The raw audio data for the frame.
 * @param {number} sampleRate - The sample rate of the audio.
 * @param {*} [prev] - The state from the previous frame's execution of this plugin.
 * @returns {Partial<FrameAnalysis> | null} A partial frame analysis object, or null if no analysis is produced.
 */
export type FramePlugin = (frame: Float32Array, sampleRate: number, prev?: any) => Partial<FrameAnalysis> | null;

/**
 * Configuration for the audio processing pipeline.
 */
export interface PipelineConfig {
  /** The size of each audio frame buffer to be processed. */
  bufferSize: number;
  /** An array of plugins to be run on each frame. */
  plugins: FramePlugin[];
}

/**
 * Runs a synchronous, frame-based audio processing pipeline over the provided channel data.
 * It processes the audio in chunks and applies a series of plugins to each chunk.
 * @param {Float32Array} channelData - The raw audio data for a single channel.
 * @param {number} sampleRate - The sample rate of the audio data.
 * @param {PipelineConfig} config - The configuration for the pipeline.
 * @returns {FrameAnalysis[]} An array of frame analysis objects, one for each processed frame.
 */
export const runPipeline = (
  channelData: Float32Array,
  sampleRate: number,
  config: PipelineConfig
): FrameAnalysis[] => {
  const { bufferSize, plugins } = config;
  const analyses: FrameAnalysis[] = [];
  let prevStates: any[] = plugins.map(() => undefined);

  for (let i = 0; i + bufferSize <= channelData.length; i += bufferSize) {
    const slice = channelData.slice(i, i + bufferSize);
    const timestamp = seconds(i / sampleRate);
    const aggregate: Partial<FrameAnalysis> = { timestamp };

    for (let p = 0; p < plugins.length; p++) {
      try {
        const out = plugins[p](slice, sampleRate, prevStates[p]);
        if (out) {
          Object.assign(aggregate, out);
        }
      } catch (e) {
        // plugin error shouldn't break pipeline
        console.warn('[audioPipeline] plugin error', e);
      }
    }

    // Fill missing fields with defaults to match prior FrameAnalysis shape
    analyses.push({
      timestamp: aggregate.timestamp || seconds(0),
      energy: aggregate.energy ?? 0,
      spectralCentroid: aggregate.spectralCentroid ?? 0,
      spectralFlux: aggregate.spectralFlux ?? 0,
      bass: aggregate.bass ?? 0,
      mid: aggregate.mid ?? 0,
      high: aggregate.high ?? 0,
    });
  }

  return analyses;
};

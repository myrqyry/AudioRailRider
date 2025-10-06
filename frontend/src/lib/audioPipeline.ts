import { AudioFeatures, FrameAnalysis, seconds } from 'shared/types';

// Plugin interface: each plugin accepts a raw Float32Array frame and returns partial frame analysis
export type FramePlugin = (frame: Float32Array, sampleRate: number, prev?: any) => Partial<FrameAnalysis> | null;

// Pipeline config
export interface PipelineConfig {
  bufferSize: number;
  plugins: FramePlugin[];
}

// Runs a simple synchronous frame-based pipeline over channel data
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

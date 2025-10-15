// AudioWorklet helper + skeleton for migration. This file provides a thin
// wrapper that tries to install an AudioWorkletProcessor and exposes a
// friendly interface to the main thread. It's intentionally minimal — the
// main goal is to provide a stable migration surface and a graceful
// fallback to the existing AudioContext + pipeline.
import { setLatestFrame } from './audioWorkletState';

export interface WorkletAnalysisResult {
  timestamp: number; // seconds
  energy: number;
  spectralCentroid: number;
  spectralFlux: number;
  bass: number;
  mid: number;
  high: number;
  frame?: Float32Array;
  sampleRate?: number;
  channelCount?: number;
}

export type WorkletAvailable = boolean;

export const isWorkletSupported = (): boolean => {
  try {
    return typeof (globalThis as any).AudioWorkletNode !== 'undefined';
  } catch (e) {
    return false;
  }
};

// Helper that returns the inline processor source string used for the blob
// fallback. Keeping it in a function keeps the main flow readable and makes
// it easier to test or modify later.
const getInlineProcessorSourceString = (): string => {
  return `
  class SimpleAnalyzerProcessor extends AudioWorkletProcessor {
    constructor() {
      super();
      this._prevMagnitudes = null;
      this.port.onmessage = (ev) => {};
    }

    _fft(re, im) {
      const n = re.length;
      const levels = Math.floor(Math.log2(n));
      for (let i = 0; i < n; i++) {
        let j = 0;
        for (let k = 0; k < levels; k++) j = (j << 1) | ((i >> k) & 1);
        if (j > i) { const tr = re[i]; re[i] = re[j]; re[j] = tr; const ti = im[i]; im[i] = im[j]; im[j] = ti; }
      }
      for (let size = 2; size <= n; size <<= 1) {
        const half = size >> 1;
        const theta = -2 * Math.PI / size;
        const wMulRe = Math.cos(theta);
        const wMulIm = Math.sin(theta);
        for (let i = 0; i < n; i += size) {
          let wr = 1.0, wi = 0.0;
          for (let j = 0; j < half; j++) {
            const idx1 = i + j; const idx2 = i + j + half;
            const tr = wr * re[idx2] - wi * im[idx2];
            const ti = wr * im[idx2] + wi * re[idx2];
            re[idx2] = re[idx1] - tr; im[idx2] = im[idx1] - ti;
            re[idx1] = re[idx1] + tr; im[idx1] = im[idx1] + ti;
            const newWr = wr * wMulRe - wi * wMulIm;
            const newWi = wr * wMulIm + wi * wMulRe;
            wr = newWr; wi = newWi;
          }
        }
      }
    }

    process(inputs, outputs) {
      try {
        const input = inputs[0];
        const output = outputs[0];
        if (!input || !input[0]) return true;
  const frame = input[0]; const N = frame.length;
        let energy = 0; for (let i = 0; i < N; i++) energy += frame[i]*frame[i]; energy = energy / N;
        const re = new Float32Array(N); const im = new Float32Array(N);
        for (let i = 0; i < N; i++) { re[i] = frame[i]; im[i] = 0.0; }
        this._fft(re, im);
        const half = N >> 1; const mags = new Float32Array(half);
        for (let k = 0; k < half; k++) { const r = re[k]; const i2 = im[k]; mags[k] = Math.hypot(r, i2); }
        let num = 0, den = 0; for (let k = 0; k < mags.length; k++) { num += k * mags[k]; den += mags[k]; }
        const spectralCentroid = den > 0 ? num / den : 0;
        let flux = 0; if (this._prevMagnitudes) { const L = Math.min(this._prevMagnitudes.length, mags.length); for (let k = 0; k < L; k++) { const d = mags[k] - this._prevMagnitudes[k]; flux += d > 0 ? d : 0; } }
        const bassRange = Math.floor(mags.length * 0.15); const midRange = Math.floor(mags.length * 0.6);
        let bass = 0, mid = 0, high = 0; for (let k = 0; k < mags.length; k++) { if (k < bassRange) bass += mags[k]; else if (k < midRange) mid += mags[k]; else high += mags[k]; }
        const total = bass + mid + high || 1; bass /= total; mid /= total; high /= total;
        this._prevMagnitudes = mags;
        const frameCopy = frame.slice();
        this.port.postMessage(
          {
            type: 'analysis',
            timestamp: currentTime,
            energy: energy,
            spectralCentroid: spectralCentroid,
            spectralFlux: flux,
            bass: bass,
            mid: mid,
            high: high,
            frame: frameCopy,
            sampleRate: sampleRate,
            channelCount: input.length,
          },
          [frameCopy.buffer]
        );
        if (output) {
          const channelCount = Math.min(output.length, input.length);
          for (let ch = 0; ch < channelCount; ch++) {
            output[ch].set(input[ch]);
          }
        }
      } catch (e) {}
      return true;
    }
  }
  registerProcessor('simple-analyzer-processor', SimpleAnalyzerProcessor);
`;
};

// Registers a simple processor if possible. The processor below is a
// placeholder that forwards raw PCM frames (as Float32 arrays) to the
// main thread via port messages. A production implementation would
// perform the heavy lifting in the processor for lower latency.
export const registerWorklet = async (audioContext: AudioContext): Promise<void> => {
  if (!isWorkletSupported()) return Promise.resolve();
  // Prefer loading a static worklet module from the dev server / production
  // public path. This lets bundlers serve the worklet as a separate file
  // which is the recommended production approach. If that fails (for
  // very old setups or during tests), fall back to an inline blob.
  const staticPath = '/worklets/analyzer-processor.js';
  try {
    await audioContext.audioWorklet.addModule(staticPath);
    return;
  } catch (e) {
    // Fall through to blob fallback — keep the inline processor as a
    // compatibility measure for environments that can't load the static
    // module URL (tests, older servers).
    // eslint-disable-next-line no-console
    console.info('[audioWorklet] static module load failed, falling back to inline blob', e && e.message ? e.message : e);
  }

  // Inline blob fallback (keeps previous behavior for tests/devs).
  const inlineSource = `
  ${getInlineProcessorSourceString()}
  `;
  const blob = new Blob([inlineSource], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  try {
    await audioContext.audioWorklet.addModule(url);
  } finally {
    try { URL.revokeObjectURL(url); } catch (e) { /* ignore */ }
  }
};

// Create an AudioWorkletNode wired to the given context and return its port
// for messages. The caller should connect a source to this node.
export const createWorkletNode = (audioContext: AudioContext): AudioWorkletNode | null => {
  try {
    if (!isWorkletSupported()) return null;
    const node = new AudioWorkletNode(audioContext, 'simple-analyzer-processor');
    return node;
  } catch (e) {
    console.warn('[audioWorklet] createWorkletNode failed', e);
    return null;
  }
};

// Create an analyzer node that pushes analysis results into a shared state buffer.
export const createAnalyzerNode = (audioContext: AudioContext): AudioWorkletNode | null => {
  if (!isWorkletSupported()) return null;
  try {
    const node = new AudioWorkletNode(audioContext, 'simple-analyzer-processor');
    node.port.onmessage = (ev) => {
      const data = ev.data;
      if (!data || data.type !== 'analysis') return;
      try {
        const frame = data.frame instanceof Float32Array
          ? data.frame
          : (data.frame ? new Float32Array(data.frame) : undefined);

        // Write the latest frame to the shared state.
        // This decouples the worklet's output from the main thread's consumption.
        setLatestFrame({
          timestamp: data.timestamp,
          energy: data.energy,
          spectralCentroid: data.spectralCentroid,
          spectralFlux: data.spectralFlux,
          bass: data.bass,
          mid: data.mid,
          high: data.high,
          frame,
          sampleRate: typeof data.sampleRate === 'number' ? data.sampleRate : audioContext.sampleRate,
          channelCount: typeof data.channelCount === 'number' ? data.channelCount : 1,
        });
      } catch (e) {
        console.warn('[audioWorklet] Failed to process and set latest frame', e);
      }
    };
    return node;
  } catch (e) {
    console.warn('[audioWorklet] createAnalyzerNode failed', e);
    return null;
  }
};
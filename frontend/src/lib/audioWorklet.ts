// AudioWorklet helper + skeleton for migration. This file provides a thin
// wrapper that tries to install an AudioWorkletProcessor and exposes a
// friendly interface to the main thread. It's intentionally minimal — the
// main goal is to provide a stable migration surface and a graceful
// fallback to the existing AudioContext + pipeline.
import { setLatestFrame } from './audioWorkletState';
import { useRef, useEffect, useState } from 'react';

export interface WorkletAnalysisResult {
  timestamp: number; // seconds
  energy: number;
  spectralCentroid: number;
  spectralFlux: number;
  bass: number;
  mid: number;
  high: number;
  isBeat?: boolean;
  bpm?: number;
  frame?: Float32Array;
  sampleRate?: number;
  channelCount?: number;
}

export type WorkletAvailable = boolean;

/**
 * Checks if the current browser environment supports `AudioWorklet`.
 * @returns {boolean} `true` if supported, `false` otherwise.
 */
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
      // Beat detection state
      this._lastBeatTime = 0;
      this._beatHistory = [];
      this._bpm = 0;
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

        // Beat detection
        const beatThreshold = 0.15 + bass * 0.1;
        let isBeat = false;
        if (bass > beatThreshold && (currentTime - this._lastBeatTime) > 0.3) {
          isBeat = true;
          this._lastBeatTime = currentTime;

          // BPM calculation
          if (this._beatHistory.length >= 20) {
            this._beatHistory.shift();
          }
          this._beatHistory.push(currentTime);
          if (this._beatHistory.length > 1) {
            const intervals = [];
            for (let i = 1; i < this._beatHistory.length; i++) {
              intervals.push(this._beatHistory[i] - this._beatHistory[i-1]);
            }
            const averageInterval = intervals.reduce((a, b) => a + b) / intervals.length;
            const calculatedBpm = 60 / averageInterval;
            if (calculatedBpm > 60 && calculatedBpm < 200) {
              this._bpm = calculatedBpm;
            }
          }
        }

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
            isBeat: isBeat,
            bpm: this._bpm,
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
/**
 * Registers the audio analyzer worklet processor with the given `AudioContext`.
 * It first tries to load the processor from a static path, falling back to an
 * inline blob if the static load fails.
 * @param {AudioContext} audioContext - The audio context to register the worklet with.
 * @returns {Promise<void>} A promise that resolves when the worklet is registered.
 */
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
/**
 * Creates an `AudioWorkletNode` using the registered processor.
 * @param {AudioContext} audioContext - The audio context to create the node in.
 * @returns {AudioWorkletNode | null} The created node, or `null` if worklets are not supported or creation fails.
 */
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

export class AudioWorkletManager {
    private workletNode?: AudioWorkletNode;
    private audioContext?: AudioContext;
    private resources: Set<any> = new Set();
    private isDisposed = false;

    async initialize(audioContext: AudioContext): Promise<void> {
        if (this.isDisposed) {
            throw new Error('AudioWorkletManager has been disposed');
        }

        this.audioContext = audioContext;

        try {
            // Register for cleanup
            this.resources.add(audioContext);

            await audioContext.audioWorklet.addModule('/audio-worklet-processor.js');

            this.workletNode = new AudioWorkletNode(audioContext, 'audio-processor');
            this.resources.add(this.workletNode);

            // Setup error handling
            this.workletNode.onprocessorerror = (event) => {
                console.error('Audio worklet processor error:', event);
                this.handleWorkletError();
            };

        } catch (error) {
            await this.dispose();
            throw error;
        }
    }

    private handleWorkletError(): void {
        // Graceful error recovery
        this.dispose().catch(console.error);
    }

    async dispose(): Promise<void> {
        if (this.isDisposed) return;

        this.isDisposed = true;

        // Disconnect worklet node
        if (this.workletNode) {
            try {
                this.workletNode.disconnect();
                this.workletNode.port.close();
            } catch (error) {
                console.warn('Error disconnecting worklet node:', error);
            }
        }

        // Clear resources
        this.resources.clear();
        this.workletNode = undefined;
        this.audioContext = undefined;
    }

    // Implement finalizer for garbage collection
    private finalizationRegistry = new FinalizationRegistry((cleanup: () => void) => {
        cleanup();
    });

    constructor() {
        // Register cleanup for GC
        this.finalizationRegistry.register(this, () => this.dispose());
    }
}

// Usage with automatic cleanup
export function useAudioWorklet(audioContext: AudioContext | undefined) {
    const managerRef = useRef<AudioWorkletManager | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!audioContext) {
            return;
        }

        const manager = new AudioWorkletManager();
        manager.initialize(audioContext).then(() => {
            managerRef.current = manager;
            setIsReady(true);
        }).catch(error => {
            console.error("Failed to initialize AudioWorkletManager:", error);
            setIsReady(false);
        });

        return () => {
            manager.dispose().catch(console.error);
            managerRef.current = null;
            setIsReady(false);
        };
    }, [audioContext]);

    return { manager: managerRef.current, isReady };
}
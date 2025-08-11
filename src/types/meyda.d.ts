// Custom Meyda type definitions for Meyda v5

// Define the MeydaAnalyzer type
type MeydaAnalyzer = {
  get: (features?: string | string[]) => any;
  start: () => void;
  stop: () => void;
  connect: (destination?: AudioNode) => void;
  disconnect: () => void;
};

declare global {
  interface Window {
    // This is the global Meyda object loaded from CDN
    Meyda: {
      createMeydaAnalyzer: (options: {
        audioContext: AudioContext;
        source?: AudioNode | null;
        bufferSize?: number;
        featureExtractors?: string[];
        callback?: (features: any) => void;
        windowingFunction?: string;
        fftSize?: number;
      }) => MeydaAnalyzer;
      extract: (feature: string | string[], signal: Float32Array, previousSignal?: Float32Array) => any;
      bufferSize: number;
      sampleRate: number;
      windowingFunction: (name: string, length: number, alpha?: number) => Float32Array;
      melToHz: (mel: number) => number;
      hzToMel: (hz: number) => number;
      hzToBark: (hz: number) => number;
      barkToHz: (bark: number) => number;
      chromaToMidi: (chroma: string) => number;
      midiToChroma: (midi: number) => string;
      midiToNoteName: (midi: number, useSharps?: boolean) => string;
      noteNameToMidi: (note: string) => number | null;
      noteNameToFrequency: (note: string) => number | null;
      frequencyToNoteName: (frequency: number) => string;
      frequencyToMidi: (frequency: number) => number;
      midiToFrequency: (midi: number) => number;
      // Add other Meyda v5 exports if known, e.g., getFeatures
    };
    // Promise that resolves when Meyda is loaded
    meydaLoaded: Promise<boolean>;
  }
}

// Declare the global Meyda constant
declare const Meyda: Window['Meyda'];

export type { MeydaAnalyzer };

export {};

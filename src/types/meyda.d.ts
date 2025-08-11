// Custom Meyda type definitions for Meyda v5
declare module 'meyda' {
  /**
   * Creates a Meyda analyzer instance.
   * @param options - Configuration options for the analyzer.
   * @returns A Meyda analyzer instance.
   */
  export function createMeydaAnalyzer(options: {
    audioContext: AudioContext;
    source?: MediaElementAudioSourceNode | null; // Can be null if data is provided directly
    bufferSize?: number;
    featureExtractors: string[];
    callback?: (features: any) => void;
    windowingFunction?: 'boxcar' | 'hann' | 'triangle' | 'hamming';
    fftSize?: number;
  }): {
    get: (data?: Float32Array) => any;
    stop: () => void;
    connect: () => void;
    disconnect: () => void;
  };

  const Meyda: {
    createMeydaAnalyzer: (options: any) => any;
    // Add other Meyda v5 exports if known, e.g., Meyda.getFeatures
  };
  export default Meyda;
}

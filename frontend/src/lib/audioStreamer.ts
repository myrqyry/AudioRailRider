import { FrameAnalysis, seconds } from 'shared/types';

// Progressive streamer that creates an HTMLAudioElement, plays it muted,
// and uses AnalyserNode to sample audio for quick UI feedback. This is a
// pragmatic approach for long files where full decode via decodeAudioData
// can be slow.

export interface StreamerOptions {
  fftSize?: number;
  smoothingTimeConstant?: number;
  sampleIntervalMs?: number; // how often to sample for UI
}

export const defaultOptions: StreamerOptions = {
  fftSize: 2048,
  smoothingTimeConstant: 0.8,
  sampleIntervalMs: 100,
};

export const createStreamer = (file: File, opts?: Partial<StreamerOptions>) => {
  const options = { ...defaultOptions, ...(opts || {}) };
  const audioEl = new Audio();
  audioEl.preload = 'auto';
  audioEl.muted = true; // silent playback for sampling
  audioEl.src = URL.createObjectURL(file);

  let audioCtx: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let timer: number | null = null;

  const start = async (onFrame: (f: FrameAnalysis) => void) => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // Create source and analyser
    const src = audioCtx.createMediaElementSource(audioEl);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = options.fftSize!;
    analyser.smoothingTimeConstant = options.smoothingTimeConstant!;
    src.connect(analyser);
    analyser.connect(audioCtx.destination);

    const bufferLength = analyser.frequencyBinCount;
    const freqData = new Float32Array(bufferLength);

    audioEl.play().catch((e) => {
      console.warn('[audioStreamer] audio play failed', e);
    });

    timer = window.setInterval(() => {
      if (!analyser || !audioCtx) return;
      analyser.getFloatFrequencyData(freqData);

      // Compute simple metrics from frequency bins
      let energy = 0;
      let centroidNum = 0;
      let centroidDen = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = Math.max(0, freqData[i]);
        energy += v * v;
        centroidNum += i * v;
        centroidDen += v;
      }
      const spectralCentroid = centroidDen > 0 ? centroidNum / centroidDen : 0;

      // Map frequency bands heuristically
      const bassEnd = Math.floor(bufferLength * 0.15);
      const midEnd = Math.floor(bufferLength * 0.6);
      let bass = 0, mid = 0, high = 0;
      for (let i = 0; i < bufferLength; i++) {
        const mag = Math.max(0, freqData[i]);
        if (i < bassEnd) bass += mag;
        else if (i < midEnd) mid += mag;
        else high += mag;
      }
      const total = bass + mid + high || 1;
      bass /= total; mid /= total; high /= total;

      const frame: FrameAnalysis = {
        timestamp: seconds(audioEl.currentTime),
        energy: energy,
        spectralCentroid: spectralCentroid,
        spectralFlux: 0, // streamer doesn't compute flux yet
        bass: bass,
        mid: mid,
        high: high,
      };

      try { onFrame(frame); } catch (e) { console.warn('[audioStreamer] onFrame crashed', e); }
    }, options.sampleIntervalMs);
  };

  const stop = async () => {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
    try {
      audioEl.pause();
    } catch {}
    try { URL.revokeObjectURL(audioEl.src); } catch {}
    if (analyser) {
      try { analyser.disconnect(); } catch {}
      analyser = null;
    }
    if (audioCtx) {
      try { await audioCtx.close(); } catch {}
      audioCtx = null;
    }
  };

  return { audioEl, start, stop };
};

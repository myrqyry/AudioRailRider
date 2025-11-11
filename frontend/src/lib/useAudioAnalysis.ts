import { useRef, useEffect } from 'react';
import { AppStatus, FrameAnalysis, secondsToNumber } from 'shared/types';
import { LiveAudioProcessor, createWorkletAnalyzerForContext } from './audioProcessor';
import { getLatestFrame } from './audioWorkletState';
import { createFrameForDispatch } from './audioFeatureUtils';

/**
 * Props for the `useAudioAnalysis` hook.
 */
interface UseAudioAnalysisProps {
  /** The current status of the application, which controls the hook's behavior. */
  status: string;
  /** The audio file to be analyzed and played. */
  audioFile?: File | null;
  /** A direct audio source node (e.g., from a microphone). */
  audioSource?: AudioNode | null;
  /** The AudioContext to use. Required if audioSource is provided. */
  audioContext?: AudioContext | null;
}

/**
 * A React hook that manages the real-time analysis of an audio file during playback.
 * It sets up an `AudioContext` and an `AudioWorklet` to process audio frames,
 * and dispatches custom events for beats, tempo changes, and structural changes.
 *
 * @param {UseAudioAnalysisProps} props - The properties for the hook.
 * @returns {{ audioRef: React.RefObject<HTMLAudioElement | null> }} An object containing a ref to the `HTMLAudioElement`.
 */
export const useAudioAnalysis = ({ status, audioFile, audioSource, audioContext }: UseAudioAnalysisProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const liveProcessorRef = useRef<LiveAudioProcessor | null>(null);

  useEffect(() => {
    console.log('[useAudioAnalysis] Effect triggered', `status=${status}, hasAudioFile=${!!audioFile}, hasAudioSource=${!!audioSource}`);

    const dispose = () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      if (audioRef.current) {
        console.log('[useAudioAnalysis] Cleaning up audio element');
        audioRef.current.pause();
        if (audioRef.current.src.startsWith('blob:')) {
          URL.revokeObjectURL(audioRef.current.src);
        }
        audioRef.current = null;
      }
      if (liveProcessorRef.current) {
        console.log('[useAudioAnalysis] Disposing LiveAudioProcessor');
        liveProcessorRef.current.dispose();
        liveProcessorRef.current = null;
      }
    };

    if (status !== AppStatus.Riding || (!audioFile && !audioSource)) {
      dispose();
      return;
    }

    if (audioSource && !audioContext) {
      console.error('[useAudioAnalysis] audioSource provided without audioContext. This is not supported.');
      dispose();
      return;
    }

    let audio: HTMLAudioElement | null = null;
    if (audioFile) {
      console.log('[useAudioAnalysis] Setting up audio for riding from file');
      audio = new Audio(URL.createObjectURL(audioFile));
      audio.loop = false;
      audio.preload = 'auto';

      audio.addEventListener('loadeddata', () => console.log('[useAudioAnalysis] Audio loaded', { duration: audio?.duration }));
      audio.addEventListener('playing', () => console.log('[useAudioAnalysis] Audio is playing'));
      audio.addEventListener('pause', () => console.log('[useAudioAnalysis] Audio paused'));
      audio.addEventListener('error', (e) => console.error('[useAudioAnalysis] Audio error', e));

      audioRef.current = audio;
    }

    const energyHistory: number[] = [];
    const centroidHistory: number[] = [];
    const fluxHistory: number[] = [];
    const beatIntervals: number[] = [];
    const HISTORY_SIZE = 64;
    const MIN_BEAT_SPACING = 0.2;
    const STRUCTURE_SCORE_THRESHOLD = 2.5;
    const STRUCTURE_MIN_SPACING = 3;
    let lastBeatTimestamp = -Infinity;
    let lastStructureTimestamp = -Infinity;
    let smoothedTempo = 0;

    const pushWithLimit = (arr: number[], value: number) => {
      arr.push(value);
      if (arr.length > HISTORY_SIZE) {
        arr.shift();
      }
    };

    const handleFrame = (frame: FrameAnalysis) => {
      const timestamp = secondsToNumber(frame.timestamp);
      const energy = Math.max(0, Math.min(1, frame.energy));

      if (frame.isBeat) {
        try {
          window.dispatchEvent(new CustomEvent('audiorailrider:beat', { detail: { timestamp, energy } }));
        } catch {}
      }

      if (frame.bpm && frame.bpm !== smoothedTempo) {
        smoothedTempo = frame.bpm;
        try {
          window.dispatchEvent(new CustomEvent('audiorailrider:tempo', { detail: { tempo: smoothedTempo } }));
        } catch {}
      }

      if (fluxHistory.length >= 4 && centroidHistory.length >= 4) {
        const fluxChange = Math.abs(frame.spectralFlux - fluxHistory[fluxHistory.length - 2]);
        const centroidChange = Math.abs(frame.spectralCentroid - centroidHistory[centroidHistory.length - 2]);

        const fluxMean = fluxHistory.reduce((acc, val) => acc + val, 0) / fluxHistory.length;
        const centroidMean = centroidHistory.reduce((acc, val) => acc + val, 0) / centroidHistory.length;
        const fluxStd = Math.sqrt(
          fluxHistory.reduce((acc, val) => {
            const diff = val - fluxMean;
            return acc + diff * diff;
          }, 0) / Math.max(1, fluxHistory.length - 1)
        );
        const centroidStd = Math.sqrt(
          centroidHistory.reduce((acc, val) => {
            const diff = val - centroidMean;
            return acc + diff * diff;
          }, 0) / Math.max(1, centroidHistory.length - 1)
        );

        const normalizedFluxChange = fluxStd > 0 ? fluxChange / fluxStd : 0;
        const normalizedCentroidChange = centroidStd > 0 ? centroidChange / centroidStd : 0;
        const structuralScore = normalizedFluxChange * 0.6 + normalizedCentroidChange * 0.4;

        if (structuralScore > STRUCTURE_SCORE_THRESHOLD && (timestamp - lastStructureTimestamp) > STRUCTURE_MIN_SPACING) {
          lastStructureTimestamp = timestamp;
          try {
            window.dispatchEvent(new CustomEvent('audiorailrider:structure', { detail: { timestamp, structuralScore } }));
          } catch {}
        }
      }
    };

    const setupAudioProcessing = async () => {
      try {
        let sourceNode: AudioNode | null = null;

        if (audioSource && audioContext) {
          sourceNode = audioSource;
        } else if (audio) {
          const processor = new LiveAudioProcessor();
          liveProcessorRef.current = processor;
          await processor.initialize(audio);
          // In this case, the LiveAudioProcessor handles the connection internally.
        }

        if (sourceNode && audioContext) {
            const workletNode = await createWorkletAnalyzerForContext(audioContext);
            if (workletNode) {
                sourceNode.connect(workletNode);
                workletNode.connect(audioContext.destination);
            } else {
                sourceNode.connect(audioContext.destination);
            }
        }

        const processFrames = () => {
          const latestFrameData = getLatestFrame();
          if (latestFrameData) {
            const frame = createFrameForDispatch(latestFrameData.timestamp, latestFrameData);
            handleFrame(frame);
            try {
              const ev = new CustomEvent('audiorailrider:frame', { detail: frame });
              window.dispatchEvent(ev);
            } catch {}
          }
          animationFrameId.current = requestAnimationFrame(processFrames);
        };
        processFrames();

      } catch (e) {
        console.warn('[useAudioAnalysis] Audio processing setup failed, playing audio directly.', e);
      }

      if (audio) {
        console.log('[useAudioAnalysis] Starting audio playback');
        audio.play()
          .then(() => console.log('[useAudioAnalysis] Audio playing successfully'))
          .catch(e => console.error("[useAudioAnalysis] Audio playback failed:", e));
      }
    };

    setupAudioProcessing();

    return dispose;
  }, [status, audioFile, audioSource, audioContext]);

  return { audioRef };
};
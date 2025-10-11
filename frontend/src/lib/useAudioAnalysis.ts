import { useRef, useEffect } from 'react';
import { AppStatus, FrameAnalysis, secondsToNumber } from 'shared/types';
import { createWorkletAnalyzerForContext } from './audioProcessor';

interface UseAudioAnalysisProps {
  audioFile: File | null;
  status: string;
}

export const useAudioAnalysis = ({ audioFile, status }: UseAudioAnalysisProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    console.log('[useAudioAnalysis] Effect triggered', { status, hasAudioFile: !!audioFile });
    
    if (status !== AppStatus.Riding || !audioFile) {
      if (audioRef.current) {
        console.log('[useAudioAnalysis] Cleaning up audio');
        audioRef.current.pause();
        if (audioRef.current.src.startsWith('blob:')) {
            URL.revokeObjectURL(audioRef.current.src);
        }
        audioRef.current = null;
      }
      return;
    }

    console.log('[useAudioAnalysis] Setting up audio for riding');
    const audio = new Audio(URL.createObjectURL(audioFile));
    audio.loop = false;
    audio.preload = 'auto';
    
    // Add event listeners for debugging
    audio.addEventListener('loadeddata', () => {
      console.log('[useAudioAnalysis] Audio loaded', { duration: audio.duration });
    });
    audio.addEventListener('playing', () => {
      console.log('[useAudioAnalysis] Audio is playing');
    });
    audio.addEventListener('pause', () => {
      console.log('[useAudioAnalysis] Audio paused');
    });
    audio.addEventListener('error', (e) => {
      console.error('[useAudioAnalysis] Audio error', e);
    });
    
    audioRef.current = audio;

    // Setup AudioContext and worklet analyzer for low-latency frames
    let audioCtx: AudioContext | null = null;
    let workletNode: AudioWorkletNode | null = null;
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

      pushWithLimit(energyHistory, energy);
      pushWithLimit(centroidHistory, frame.spectralCentroid);
      pushWithLimit(fluxHistory, frame.spectralFlux);

      const energyMean = energyHistory.reduce((acc, val) => acc + val, 0) / energyHistory.length;
      const energyVariance = energyHistory.reduce((acc, val) => {
        const diff = val - energyMean;
        return acc + diff * diff;
      }, 0) / Math.max(1, energyHistory.length - 1);
      const energyStd = Math.sqrt(Math.max(energyVariance, 0));
      const beatThreshold = energyMean + energyStd * 0.75;

      if (energy > beatThreshold && (timestamp - lastBeatTimestamp) >= MIN_BEAT_SPACING) {
        try {
          window.dispatchEvent(new CustomEvent('audiorailrider:beat', { detail: { timestamp, energy } }));
        } catch {}

        if (lastBeatTimestamp > -Infinity) {
          const interval = timestamp - lastBeatTimestamp;
          if (interval > 0.1 && interval < 3) {
            pushWithLimit(beatIntervals, interval);
            const avgInterval = beatIntervals.reduce((acc, val) => acc + val, 0) / beatIntervals.length;
            if (avgInterval > 0) {
              const newTempo = 60 / avgInterval;
              smoothedTempo = smoothedTempo > 0 ? smoothedTempo * 0.6 + newTempo * 0.4 : newTempo;
              try {
                window.dispatchEvent(new CustomEvent('audiorailrider:tempo', { detail: { tempo: smoothedTempo } }));
              } catch {}
            }
          }
        }
        lastBeatTimestamp = timestamp;
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

    (async () => {
      try {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        try {
          await audioCtx.resume();
        } catch (resumeError) {
          console.warn('[useAudioAnalysis] AudioContext.resume failed', resumeError);
        }
        const src = audioCtx.createMediaElementSource(audio);
        workletNode = await createWorkletAnalyzerForContext(audioCtx, (frame: FrameAnalysis) => {
          handleFrame(frame);
          try {
            const ev = new CustomEvent('audiorailrider:frame', { detail: frame });
            window.dispatchEvent(ev);
          } catch {}
        });
        if (workletNode) {
          src.connect(workletNode);
          workletNode.connect(audioCtx.destination);
        } else {
          // Fallback: connect source to destination
          src.connect(audioCtx.destination);
        }
      } catch (e) {
        console.warn('[useAudioAnalysis] worklet setup failed', e);
        try { audio.play(); } catch {}
      }
    })();

    console.log('[useAudioAnalysis] Starting audio playback');
    audio.play()
      .then(() => console.log('[useAudioAnalysis] Audio playing successfully'))
      .catch(e => console.error("[useAudioAnalysis] Audio playback failed:", e));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        if (audioRef.current.src.startsWith('blob:')) {
          URL.revokeObjectURL(audioRef.current.src);
        }
      }
      try {
        if (workletNode) {
          try { workletNode.disconnect(); } catch {}
        }
        if (audioCtx) {
          audioCtx.close().catch(() => {});
        }
      } catch {}
    };
  }, [audioFile, status]);

  return { audioRef };
};
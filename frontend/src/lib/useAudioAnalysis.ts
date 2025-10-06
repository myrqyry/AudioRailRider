import { useRef, useEffect } from 'react';
import { AppStatus, FrameAnalysis, seconds } from 'shared/types';
import { createWorkletAnalyzerForContext } from './audioProcessor';

interface UseAudioAnalysisProps {
  audioFile: File | null;
  status: string;
}

export const useAudioAnalysis = ({ audioFile, status }: UseAudioAnalysisProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (status !== AppStatus.Riding || !audioFile) {
      if (audioRef.current) {
        audioRef.current.pause();
        if (audioRef.current.src.startsWith('blob:')) {
            URL.revokeObjectURL(audioRef.current.src);
        }
        audioRef.current = null;
      }
      return;
    }

    const audio = new Audio(URL.createObjectURL(audioFile));
    audioRef.current = audio;

    // Setup AudioContext and worklet analyzer for low-latency frames
    let audioCtx: AudioContext | null = null;
    let workletNode: AudioWorkletNode | null = null;

    (async () => {
      try {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const src = audioCtx.createMediaElementSource(audio);
        workletNode = await createWorkletAnalyzerForContext(audioCtx, (frame: FrameAnalysis) => {
          // Dispatch a custom event so visualizers can listen globally
          try {
            const ev = new CustomEvent('audiorailrider:frame', { detail: frame });
            window.dispatchEvent(ev);
          } catch (e) {
            // fallback: no-op
          }
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

    audio.play().catch(e => console.error("Audio playback failed:", e));

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
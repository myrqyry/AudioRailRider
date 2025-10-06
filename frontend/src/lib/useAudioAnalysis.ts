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
import { useRef, useEffect } from 'react';
import { AppStatus } from 'shared/types';

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

    audio.play().catch(e => console.error("Audio playback failed:", e));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        if (audioRef.current.src.startsWith('blob:')) {
          URL.revokeObjectURL(audioRef.current.src);
        }
      }
    };
  }, [audioFile, status]);

  return { audioRef };
};
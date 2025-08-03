import { useRef, useEffect } from 'react';
import Meyda from 'meyda';

interface UseAudioAnalysisProps {
  audioFile: File | null;
  status: string; // Assuming AppStatus.Riding or similar
}

export const useAudioAnalysis = ({ audioFile, status }: UseAudioAnalysisProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const meydaAnalyzer = useRef<ReturnType<typeof Meyda.createMeydaAnalyzer> | null>(null);
  const featuresRef = useRef<any>(null);

  useEffect(() => {
    if (!audioFile || status !== 'Riding') {
      if (meydaAnalyzer.current) {
        meydaAnalyzer.current.stop();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        // Check if src exists before revoking
        if (audioRef.current.src) {
            URL.revokeObjectURL(audioRef.current.src);
        }
      }
      return;
    }

    audioRef.current = new Audio();
    audioRef.current.src = URL.createObjectURL(audioFile);
    
    const audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(audioRef.current);
    source.connect(audioContext.destination);

    meydaAnalyzer.current = Meyda.createMeydaAnalyzer({
      audioContext: audioContext,
      source: source,
      bufferSize: 512,
      featureExtractors: ['loudness', 'mfcc', 'spectralCentroid', 'rms'],
      callback: (features) => {
        featuresRef.current = features;
      },
    });

    if (audioRef.current) {
      audioRef.current.play();
    }
    meydaAnalyzer.current.start();

    return () => {
      if (meydaAnalyzer.current) {
        meydaAnalyzer.current.stop();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        if (audioRef.current.src) {
            URL.revokeObjectURL(audioRef.current.src);
        }
      }
    };
  }, [audioFile, status]);

  return { audioRef, featuresRef };
};

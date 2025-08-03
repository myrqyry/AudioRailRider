import { useRef, useEffect } from 'react';
import Meyda from 'meyda';
import * as THREE from 'three';

interface UseAudioAnalysisProps {
  audioFile: File | null;
  onFeatureExtract: (features: any) => void;
  status: string; // Assuming AppStatus.Riding or similar
}

export const useAudioAnalysis = ({ audioFile, onFeatureExtract, status }: UseAudioAnalysisProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const meydaAnalyzer = useRef<ReturnType<typeof Meyda.createMeydaAnalyzer> | null>(null);

  useEffect(() => {
    if (!audioFile || status !== 'Riding') {
      if (meydaAnalyzer.current) {
        meydaAnalyzer.current.stop();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
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
      featureExtractors: ['loudness'],
      callback: (features) => {
        onFeatureExtract(features);
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
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, [audioFile, onFeatureExtract, status]);

  return { audioRef };
};
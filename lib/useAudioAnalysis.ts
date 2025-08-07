import { useRef, useEffect } from 'react';
import Meyda from 'meyda';

interface UseAudioAnalysisProps {
  audioFile: File | null;
  status: string;
}

export const useAudioAnalysis = ({ audioFile, status }: UseAudioAnalysisProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const meydaAnalyzer = useRef<ReturnType<typeof Meyda.createMeydaAnalyzer> | null>(null);
  const featuresRef = useRef<any>(null);

  useEffect(() => {
    if (status !== 'Riding' || !audioFile) {
      // Cleanup logic
      if (audioRef.current) {
        audioRef.current.pause();
        if (audioRef.current.src) {
          URL.revokeObjectURL(audioRef.current.src);
        }
        audioRef.current = null;
      }
      if (meydaAnalyzer.current) {
        meydaAnalyzer.current.stop();
        meydaAnalyzer.current = null;
      }
      return;
    }

    // Setup logic
    const audio = new Audio(URL.createObjectURL(audioFile));
    audioRef.current = audio;

    const audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(audio);
    source.connect(audioContext.destination);

    meydaAnalyzer.current = Meyda.createMeydaAnalyzer({
      audioContext,
      source,
      bufferSize: 512,
      featureExtractors: ['loudness', 'mfcc', 'spectralCentroid', 'rms'],
      callback: (features) => {
        featuresRef.current = features;
      },
    });

    audio.play()
      .then(() => {
        console.log("Audio playback started successfully.");
        meydaAnalyzer.current?.start();
      })
      .catch(e => console.error("Audio playback failed:", e));

    return () => {
      // This cleanup runs when the component unmounts or dependencies change
      audio.pause();
      URL.revokeObjectURL(audio.src);
      meydaAnalyzer.current?.stop();
      audioContext.close();
    };
  }, [audioFile, status]);

  return { audioRef, featuresRef };
};

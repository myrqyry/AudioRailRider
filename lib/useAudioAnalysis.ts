import { useRef, useEffect } from 'react';
import Meyda from 'meyda';

interface UseAudioAnalysisProps {
  audioFile: File | null;
  status: string;
}

export const useAudioAnalysis = ({ audioFile, status }: UseAudioAnalysisProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null); // Ref for context
  const meydaAnalyzer = useRef<ReturnType<typeof Meyda.createMeydaAnalyzer> | null>(null);
  const featuresRef = useRef<any>(null);

  useEffect(() => {
    console.log(`[useAudioAnalysis] useEffect triggered. Status: ${status}, AudioFile: ${audioFile ? audioFile.name : 'null'}`);
    if (status !== 'Riding' || !audioFile) {
      console.log("[useAudioAnalysis] Cleaning up audio analysis resources.");
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
      // Ensure context is closed when not riding
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      return;
    }

    console.log("[useAudioAnalysis] Setting up audio analysis resources for 'Riding' status.");
    // Setup logic
    const audio = new Audio(URL.createObjectURL(audioFile));
    audioRef.current = audio;

    const audioContext = new AudioContext();
    audioContextRef.current = audioContext; // Store it
    const source = audioContext.createMediaElementSource(audio);
    source.connect(audioContext.destination);
    console.log("[useAudioAnalysis] AudioContext created and source connected.");

    meydaAnalyzer.current = Meyda.createMeydaAnalyzer({
      audioContext,
      source,
      bufferSize: 512,
      featureExtractors: ['loudness', 'mfcc', 'spectralCentroid', 'rms'],
      callback: (features) => {
        featuresRef.current = features;
        // console.log("[useAudioAnalysis] Meyda features extracted:", features); // Too verbose, uncomment if detailed feature logs needed
      },
    });
    console.log("[useAudioAnalysis] Meyda Analyzer created.");

    audio.play()
      .then(() => {
        console.log("[useAudioAnalysis] Audio playback started successfully.");
        meydaAnalyzer.current?.start();
        console.log("[useAudioAnalysis] Meyda Analyzer started.");
      })
      .catch(e => console.error("[useAudioAnalysis] Audio playback failed:", e));

    return () => {
      console.log("[useAudioAnalysis] Running cleanup on unmount/dependency change.");
      // This cleanup runs when the component unmounts or dependencies change
      if (audioRef.current) {
        audioRef.current.pause();
        if (audioRef.current.src) {
          URL.revokeObjectURL(audioRef.current.src);
        }
        audioRef.current = null;
      }
      meydaAnalyzer.current?.stop();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        console.log("[useAudioAnalysis] AudioContext closed during cleanup.");
      }
    };
  }, [audioFile, status]);

  return { audioRef, featuresRef };
};

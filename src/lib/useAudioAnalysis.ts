import { useRef, useEffect, useState } from 'react';
import { AppStatus } from '../../types';

// Import the Meyda types from our declaration file
import type { MeydaAnalyzer } from '../types/meyda';


interface UseAudioAnalysisProps {
  audioFile: File | null;
  status: string;
}

export const useAudioAnalysis = ({ audioFile, status }: UseAudioAnalysisProps) => {
  const [meydaReady, setMeydaReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const meydaAnalyzer = useRef<MeydaAnalyzer | null>(null);
  const featuresRef = useRef<Record<string, any> | null>(null);

  // Wait for Meyda to be loaded
  useEffect(() => {
    const checkMeyda = async () => {
      try {
        const loaded = await window.meydaLoaded;
        if (loaded && window.Meyda) {
          console.log('Meyda is ready to use');
          setMeydaReady(true);
        } else {
          console.error('Meyda failed to load');
        }
      } catch (error) {
        console.error('Error loading Meyda:', error);
      }
    };

    checkMeyda();
  }, []);

  useEffect(() => {
    if (!meydaReady) return;
    
    console.log(`[useAudioAnalysis] useEffect triggered. Status: ${status}, AudioFile: ${audioFile ? audioFile.name : 'null'}`);
    if (status !== AppStatus.Riding || !audioFile) {
      console.log("[useAudioAnalysis] Cleaning up audio analysis resources.");
      // Cleanup logic
      if (audioRef.current) {
        audioRef.current.pause();
        if (audioRef.current.src) {
          URL.revokeObjectURL(audioRef.current.src);
        }
        audioRef.current = null;
      }
      if (meydaAnalyzer.current && typeof meydaAnalyzer.current.stop === 'function') {
        meydaAnalyzer.current.stop();
      }
      meydaAnalyzer.current = null;
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

    // Setup Meyda analyzer
    if (window.Meyda) {
      try {
        // Use type assertion to tell TypeScript we know what we're doing
        const meyda = window.Meyda as any;
        meydaAnalyzer.current = meyda.createMeydaAnalyzer({
          audioContext,
          source: source,
          bufferSize: 512,
          featureExtractors: ['rms', 'spectralCentroid', 'spectralRolloff', 'spectralFlatness'],
          callback: (features: any) => {
            featuresRef.current = features;
          },
        });
      } catch (error) {
        console.error('Error creating Meyda analyzer:', error);
      }
    }

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

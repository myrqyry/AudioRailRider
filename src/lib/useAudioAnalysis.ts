import { useRef, useEffect, useState } from 'react';
import { AppStatus } from '../../types';
import { useAppStore } from './store';

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

  const { setErrorMessage } = useAppStore((state) => state.actions);

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
          setErrorMessage('Meyda audio analysis library failed to load. Please check your internet connection and try again.');
        }
      } catch (error) {
        console.error('Error loading Meyda:', error);
        setErrorMessage('An error occurred while loading the audio analysis library.');
      }
    };

    checkMeyda();
  }, [setErrorMessage]);

  useEffect(() => {
    if (!meydaReady || status !== AppStatus.Riding || !audioFile) {
      if (audioRef.current) {
        audioRef.current.pause();
        if (audioRef.current.src.startsWith('blob:')) {
            URL.revokeObjectURL(audioRef.current.src);
        }
        audioRef.current = null;
      }
      if (meydaAnalyzer.current) {
        meydaAnalyzer.current.stop();
        meydaAnalyzer.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().then(() => {
            audioContextRef.current = null;
        });
      }
      return;
    }

    const audio = new Audio(URL.createObjectURL(audioFile));
    audioRef.current = audio;

    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const audioContext = audioContextRef.current;

    if (audioContext.state === 'suspended') {
      audioContext.resume().catch(e => console.error('Failed to resume AudioContext:', e));
    }

    const source = audioContext.createMediaElementSource(audio);
    source.connect(audioContext.destination);

    if (window.Meyda) {
      meydaAnalyzer.current = window.Meyda.createMeydaAnalyzer({
        audioContext: audioContext,
        source: source,
        bufferSize: 512,
        featureExtractors: ['loudness'],
        callback: (features: any) => {
          featuresRef.current = features;
        },
      });
    }

    audio.play()
      .then(() => {
        meydaAnalyzer.current?.start();
      })
      .catch(e => console.error("Audio playback failed:", e));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        if (audioRef.current.src.startsWith('blob:')) {
          URL.revokeObjectURL(audioRef.current.src);
        }
      }
      if (meydaAnalyzer.current) {
        meydaAnalyzer.current.stop();
      }
    };
  }, [audioFile, status, meydaReady]);

  return { audioRef, featuresRef };
};

import { useEffect } from 'react';
import { useAppStore } from '../lib/store';
import { runAudioProcessingWorkflow } from '../lib/workflow';

export const useAudioProcessor = () => {
  const audioFile = useAppStore((state) => state.audioFile);
  const generationOptions = useAppStore((state) => state.generationOptions);

  useEffect(() => {
    if (!audioFile) {
      return;
    }

    const controller = new AbortController();

    runAudioProcessingWorkflow(audioFile, {
      generationOptions,
      signal: controller.signal,
    });

    return () => {
      console.log("Cancelling previous audio processing workflow.");
      controller.abort();
    };
  }, [audioFile, generationOptions]);
};
import { useEffect } from 'react';
import { useAppStore } from '../lib/store';
import { runAudioProcessingWorkflow } from '../lib/workflow';

/**
 * A React hook that triggers the audio processing workflow whenever a new audio file
 * or new generation options are provided. It manages the lifecycle of the workflow,
 * including aborting a previous run if a new one is initiated.
 */
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
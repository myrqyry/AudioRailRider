import { useAppStore } from './store';
// analyzeAudio is no longer needed here
import { generateRideBlueprint } from '../services/geminiService';
import { validateAndRefineBlueprint } from './trackValidator';
import { buildTrackData } from './trackBuilder';
import { AppStatus } from 'shared/types';

export const runAudioProcessingWorkflow = async (
  file: File,
  options?: { signal?: AbortSignal }
): Promise<void> => {
  const { setStatus, setTrackData, setError } = useAppStore.getState().actions;
  const signal = options?.signal;
  const checkAbort = () => {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  };

  try {
    checkAbort();
    // Go straight to generating, as analysis is now a backend process.
    setStatus(AppStatus.Generating, 'Translating sound into structure...');
    checkAbort();

    // The backend now returns both the blueprint and the audio features needed for rendering.
    const { blueprint: rawBlueprint, features: audioFeatures } = await generateRideBlueprint(file);

    checkAbort();
    setStatus(AppStatus.Generating, 'Refining for physical plausibility...');
    checkAbort();
    const refinedBlueprint = validateAndRefineBlueprint(rawBlueprint);

    checkAbort();
    setStatus(AppStatus.Generating, 'Constructing ephemeral cathedral...');
    checkAbort();
    // Use the audioFeatures returned from the backend.
    const newTrackData = buildTrackData(refinedBlueprint, audioFeatures);

    checkAbort();
    setTrackData(newTrackData);
    setStatus(AppStatus.Ready);
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.log('Audio processing was aborted.');
      return;
    }

    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
        ? error
        : 'An unknown error occurred during processing.';

    console.error("Error in audio processing workflow:", message);

    setError({
        title: "Could Not Process Audio",
        message: `An error occurred while processing '${file.name}'. ${message}`
    });
  }
};
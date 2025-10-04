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

  // --- Timeout Controller ---
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    setError({
      title: "Processing Timeout",
      message: "The audio analysis is taking longer than expected. Please try a different file or check the server status."
    });
  }, 60000); // 60-second timeout

  try {
    checkAbort();
    setStatus(AppStatus.Generating, 'Translating sound into structure...');
    checkAbort();

    // Pass the abort signal to the fetch call
    const { blueprint: rawBlueprint, features: audioFeatures } = await generateRideBlueprint(file, controller.signal);

    clearTimeout(timeoutId); // Clear the timeout if the request succeeds

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
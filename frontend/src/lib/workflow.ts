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

  // Enhanced logging for debugging
  console.log('[Workflow] Starting audio processing workflow', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    hasExternalSignal: !!signal,
    externalSignalAborted: signal?.aborted
  });

  const checkAbort = () => {
    if (signal?.aborted) {
      console.log('[Workflow] External signal aborted, throwing AbortError');
      throw new DOMException('Aborted', 'AbortError');
    }
  };

  // --- Timeout Controller ---
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.log('[Workflow] Timeout fired, aborting controller');
    controller.abort();
    setError({
      title: "Processing Timeout",
      message: "The audio analysis is taking longer than expected. Please try a different file or check the server status."
    });
  }, 60000); // 60-second timeout

  // Enhanced cleanup for external signal abortion
  const externalAbortHandler = () => {
    console.log('[Workflow] External signal aborted, cleaning up');
    clearTimeout(timeoutId);
    // Only abort our controller if it's not already aborted
    if (!controller.signal.aborted) {
      controller.abort();
    }
  };

  // Add cleanup for our controller abortion
  const internalAbortHandler = () => {
    console.log('[Workflow] Internal controller aborted, cleaning up');
    clearTimeout(timeoutId);
  };

  signal?.addEventListener('abort', externalAbortHandler);
  controller.signal.addEventListener('abort', internalAbortHandler);

  try {
    checkAbort();
    const { setWorkflowProgress } = useAppStore.getState().actions;
    
    setWorkflowProgress(10);
    setStatus(AppStatus.Generating, 'Translating sound into structure...');
    checkAbort();

    console.log('[Workflow] Calling generateRideBlueprint with file:', file.name);
    try {
      // Log effective backend URL (if available) to help diagnose "Failed to fetch"
      const backendUrl = (globalThis as any)?.BACKEND_URL || (require('../config/environment').env?.VITE_BACKEND_URL as string) || 'unknown';
      console.debug('[Workflow] Backend URL (effective):', backendUrl);
    } catch (e) {}
    // Pass the abort signal to the fetch call
    const { blueprint: rawBlueprint, features: audioFeatures } = await generateRideBlueprint(file, controller.signal);
    console.log('[Workflow] Successfully received blueprint and audio features');

    clearTimeout(timeoutId); // Clear the timeout if the request succeeds
    console.log('[Workflow] Timeout cleared successfully');

    checkAbort();
    setWorkflowProgress(60);
    setStatus(AppStatus.Generating, 'Refining for physical plausibility...');
    checkAbort();
    console.log('[Workflow] Refining blueprint...');
    const refinedBlueprint = validateAndRefineBlueprint(rawBlueprint);
    try {
      console.log('[Workflow] Refined segment components', refinedBlueprint.track.map((segment, index) => ({ index, component: segment.component })));
    } catch (e) {}

    checkAbort();
    setWorkflowProgress(85);
    setStatus(AppStatus.Generating, 'Constructing ephemeral cathedral...');
    checkAbort();
    console.log('[Workflow] Building track data...');
    // Use the audioFeatures returned from the backend.
    const newTrackData = buildTrackData(refinedBlueprint, audioFeatures);

    checkAbort();
    setWorkflowProgress(100);
    console.log('[Workflow] Setting track data and status to ready');
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
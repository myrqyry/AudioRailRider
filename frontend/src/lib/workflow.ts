import { useAppStore } from './store';
// analyzeAudio is no longer needed here
import { generateRideBlueprint, generateSkyboxImage } from '../services/geminiService';
import { validateAndRefineBlueprint } from './trackValidator';
import { buildTrackData } from './trackBuilder';
import { AppStatus } from 'shared/types';

/**
 * Orchestrates the end-to-end workflow for processing an audio file and generating a ride.
 * This includes sending the audio to the backend, receiving a blueprint, refining it,
 * building the 3D track data, and updating the application state at each step.
 *
 * @param {File} file - The audio file to process.
 * @param {object} [options] - Optional parameters for the workflow.
 * @param {AbortSignal} [options.signal] - An external AbortSignal to cancel the workflow.
 * @param {Record<string, any>} [options.generationOptions] - User-selected options to influence generation.
 * @returns {Promise<void>} A promise that resolves when the workflow is complete or aborted.
 */
export const runAudioProcessingWorkflow = async (
  file: File,
  options?: { signal?: AbortSignal; generationOptions?: Record<string, any> }
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
    const { setWorkflowProgress, setGenerationProgress } = useAppStore.getState().actions;
    
    setWorkflowProgress(10);
    setGenerationProgress(0);
    setStatus(AppStatus.Generating, 'Translating sound into structure...');
    checkAbort();

    console.log('[Workflow] Calling generateRideBlueprint with file:', file.name);
    try {
      // Log effective backend URL (if available) to help diagnose "Failed to fetch"
      const backendUrl = (globalThis as any)?.BACKEND_URL || (require('../config/environment').env?.VITE_BACKEND_URL as string) || 'unknown';
      console.debug('[Workflow] Backend URL (effective):', backendUrl);
    } catch (e) {}
  // Pass the abort signal and any user-selected generation options to the backend
  const { blueprint, features: audioFeatures } = await generateRideBlueprint(file, controller.signal, options?.generationOptions);
    console.log('[Workflow] Successfully received blueprint and audio features');
    console.log('[Workflow] Blueprint data:', {
        hasBlueprintProp: !!blueprint,
        blueprintType: typeof blueprint,
        hasTrack: !!(blueprint as any)?.track,
        trackLength: (blueprint as any)?.track?.length,
        blueprintKeys: blueprint ? Object.keys(blueprint) : []
    });

    clearTimeout(timeoutId); // Clear the timeout if the request succeeds
    console.log('[Workflow] Timeout cleared successfully');

    checkAbort();
    setWorkflowProgress(60);
    setGenerationProgress(50);
    setStatus(AppStatus.Generating, 'Refining for physical plausibility...');
    checkAbort();
    console.log('[Workflow] Refining blueprint...');
    const refinedBlueprint = validateAndRefineBlueprint(blueprint);

    // --- Start skybox generation early so the image can be ready by the time
    // the UI marks the ride as Ready. We start the async request here and
    // continue building the track data in parallel. We give it a short
    // fast-path to finish quickly, but also wait a bounded time later
    // before transitioning to Ready so the skybox is available in most cases.
    let skyboxPromise: Promise<string | null> | null = null;
    const SKYBOX_FAST_PATH_MS = 2500; // give the skybox a short head-start to complete
    const SKYBOX_MAX_WAIT_MS = 8000; // maximum wait before marking Ready
    try {
      const { setSkyboxUrl } = useAppStore.getState().actions;
      // Clear any previous skybox for this new run
      try { setSkyboxUrl(null); } catch (e) {}

      const prompt = refinedBlueprint.moodDescription || refinedBlueprint.rideName || 'A surreal and cinematic sky';
      const blueprintWithOptions = { ...refinedBlueprint, generationOptions: options?.generationOptions ?? useAppStore.getState().generationOptions };

      try {
        skyboxPromise = generateSkyboxImage(prompt, blueprintWithOptions)
          .then((imageUrl) => {
            try { setSkyboxUrl(imageUrl); } catch (e) {}
            return imageUrl;
          })
          .catch((err) => {
            console.info('[Workflow] Early skybox generation failed, continuing without custom skybox:', err instanceof Error ? err.message : String(err));
            return null;
          });
      } catch (e) {
        console.info('[Workflow] Failed to start early skybox generation', e);
        skyboxPromise = null;
      }

      // Fast-path: give the skybox a short time to finish while we build the track
      if (skyboxPromise) {
        try {
          const early = await Promise.race([
            skyboxPromise,
            new Promise<string | null>((res) => setTimeout(() => res(null), SKYBOX_FAST_PATH_MS)),
          ]);
          if (early) console.log('[Workflow] Skybox finished during build fast-path');
        } catch (e) {
          /* ignore fast-path errors */
        }
      }
    } catch (e) {
      console.info('[Workflow] Skybox pre-generation step encountered an error, continuing', e);
      skyboxPromise = null;
    }
    try {
      console.log('[Workflow] Refined segment components', refinedBlueprint.track.map((segment, index) => ({ index, component: segment.component })));
    } catch (e) {}

    checkAbort();
    setWorkflowProgress(85);
    setGenerationProgress(75);
    setStatus(AppStatus.Generating, 'Constructing ephemeral cathedral...');
    checkAbort();
    console.log('[Workflow] Building track data...');
    // Pass the blueprint and audio features to the store
    const { setBlueprint, setAudioFeatures } = useAppStore.getState().actions;
    setBlueprint(refinedBlueprint);
    setAudioFeatures(audioFeatures);

    checkAbort();
    setWorkflowProgress(100);
    console.log('[Workflow] Building track data object and storing in app state');
    try {
      // Build the render-ready TrackData from the refined blueprint and audio features
      const trackData = buildTrackData(refinedBlueprint, audioFeatures);
      // Ensure we haven't been aborted before writing heavy state
      checkAbort();
      const { setTrackData } = useAppStore.getState().actions;
      setTrackData(trackData);
      console.log('[Workflow] Track data set in store (points:', trackData.path.length, 'segments:', trackData.segmentDetails.length, ')');
    } catch (e) {
      console.warn('[Workflow] Failed to build track data, aborting Ready transition', e);
      setError({ title: 'Track Build Failed', message: 'Could not construct track geometry from blueprint.' });
      return;
    }

    // If we started skybox generation, wait up to SKYBOX_MAX_WAIT_MS for it to finish
    try {
      if (skyboxPromise) {
        console.log('[Workflow] Waiting up to', SKYBOX_MAX_WAIT_MS, 'ms for skybox to finish before Ready');
        const { setSkyboxUrl } = useAppStore.getState().actions;
        try {
          const result = await Promise.race([
            skyboxPromise,
            new Promise<string | null>((res) => setTimeout(() => res(null), SKYBOX_MAX_WAIT_MS)),
          ]);
          if (result) {
            console.log('[Workflow] Skybox generation completed before Ready');
            try { setSkyboxUrl(result); } catch (e) {}
          } else {
            console.log('[Workflow] Skybox did not finish within max wait, continuing without it');
          }
        } catch (e) {
          console.info('[Workflow] Error while awaiting skybox result, continuing', e);
        }
      }
    } catch (e) {
      console.info('[Workflow] Skybox wait logic failed, continuing', e);
    }

    console.log('[Workflow] Setting status to Ready');
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
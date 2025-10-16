import { WorkletAnalysisResult } from './audioWorklet';

/**
 * Defines the shared state structure for communication between the audio worklet and the main thread.
 */
interface SharedState {
  /** The most recent analysis result from the worklet. */
  latestFrame: WorkletAnalysisResult | null;
  /** A flag indicating if the latestFrame is new and has not been processed yet. */
  isNew: boolean;
}

/**
 * The global shared state object that holds the latest frame analysis from the audio worklet.
 * This is a simple, low-overhead way to pass data from the real-time audio thread
 * to the main thread's animation loop without complex eventing.
 */
export const workletState: SharedState = {
  latestFrame: null,
  isNew: false,
};

/**
 * Updates the shared state with the latest analysis frame from the audio worklet.
 * This function is called by the worklet's `onmessage` handler.
 * @param {WorkletAnalysisResult} frame - The new analysis result to store.
 */
export const setLatestFrame = (frame: WorkletAnalysisResult) => {
  workletState.latestFrame = frame;
  workletState.isNew = true;
};

/**
 * Retrieves the latest analysis frame if it's new.
 * This function is called by the main thread's animation loop to get the most recent data.
 * It uses a flag to ensure that each frame is processed only once.
 * @returns {WorkletAnalysisResult | null} The latest frame if it's new, otherwise `null`.
 */
export const getLatestFrame = (): WorkletAnalysisResult | null => {
  if (workletState.isNew) {
    workletState.isNew = false;
    return workletState.latestFrame;
  }
  return null;
};

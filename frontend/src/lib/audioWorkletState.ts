import { WorkletAnalysisResult } from './audioWorklet';

interface SharedState {
  latestFrame: WorkletAnalysisResult | null;
  isNew: boolean;
}

export const workletState: SharedState = {
  latestFrame: null,
  isNew: false,
};

export const setLatestFrame = (frame: WorkletAnalysisResult) => {
  workletState.latestFrame = frame;
  workletState.isNew = true;
};

export const getLatestFrame = (): WorkletAnalysisResult | null => {
  if (workletState.isNew) {
    workletState.isNew = false;
    return workletState.latestFrame;
  }
  return null;
};

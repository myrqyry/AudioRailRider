import { useAppStore } from './store';
import { analyzeAudio } from './audioProcessor';
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
    setStatus(AppStatus.Analyzing, 'Reading audio essence...');
    checkAbort();
    const audioFeatures = await analyzeAudio(file);
    const { duration, bpm, energy, spectralCentroid, spectralFlux } = audioFeatures;

    checkAbort();
    setStatus(AppStatus.Generating, 'Translating sound into structure...');
    checkAbort();
    const rawBlueprint = await generateRideBlueprint(
      file,
      duration,
      bpm,
      energy,
      spectralCentroid,
      spectralFlux
    );

    checkAbort();
    setStatus(AppStatus.Generating, 'Refining for physical plausibility...');
    checkAbort();
    const refinedBlueprint = validateAndRefineBlueprint(rawBlueprint);

    checkAbort();
    setStatus(AppStatus.Generating, 'Constructing ephemeral cathedral...');
    checkAbort();
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
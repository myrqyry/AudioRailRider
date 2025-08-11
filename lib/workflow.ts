import { useAppStore } from './store';
import { analyzeAudio } from './audioProcessor';
import { generateRideBlueprint } from '../services/geminiService';
import { validateAndRefineBlueprint } from './trackValidator';
import { buildTrackData } from './trackBuilder';
import { AppStatus } from '../types';

export const runAudioProcessingWorkflow = async (file: File) => {
  const { setStatus, setTrackData, setErrorMessage } = useAppStore.getState().actions;

  try {
    setStatus(AppStatus.Analyzing, 'Reading audio essence...');
    const { duration, bpm, energy, spectralCentroid, spectralFlux } = await analyzeAudio(file);
 
    setStatus(AppStatus.Generating, 'Translating sound into structure...');
    // Pass only the essential data to Gemini service.
    const rawBlueprint = await generateRideBlueprint(file, duration, bpm, energy, spectralCentroid, spectralFlux);
 
    setStatus(AppStatus.Generating, 'Refining for physical plausibility...');
    const refinedBlueprint = validateAndRefineBlueprint(rawBlueprint);

    setStatus(AppStatus.Generating, 'Constructing ephemeral cathedral...');
    const newTrackData = buildTrackData(refinedBlueprint);

    setTrackData(newTrackData);
    setStatus(AppStatus.Ready);
  } catch (error: any) {
    setErrorMessage(`Failed to process '${file.name}': ${error.message}`);
  }
};

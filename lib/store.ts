import { create } from 'zustand';
import { AppStatus, RideBlueprint, TrackData } from '../types';
import { analyzeAudio } from './audioProcessor';
import { generateRideBlueprint } from '../services/geminiService';
import { buildTrackData } from './trackBuilder';
import { validateAndRefineBlueprint } from './trackValidator';

interface AppState {
    status: AppStatus;
    errorMessage: string;
    statusMessage: string;
    audioFile: File | null;
    trackData: TrackData | null;
    actions: {
        resetApp: () => void;
        startRide: () => void;
        handleRideFinish: () => void;
        processAudioFile: (file: File) => Promise<void>;
        setAudioFile: (file: File) => void;
    };
}

export const useAppStore = create<AppState>((set, get) => ({
    status: AppStatus.Idle,
    errorMessage: '',
    statusMessage: '',
    audioFile: null,
    trackData: null,
    actions: {
        setAudioFile: (file: File) => {
            set({ audioFile: file });
            get().actions.processAudioFile(file);
        },
        processAudioFile: async (file: File) => {
            try {
                set({ status: AppStatus.Analyzing, statusMessage: 'Reading audio essence...' });
                const { duration, bpm, energy, spectralCentroid, spectralFlux } = await analyzeAudio(file);

                set({ status: AppStatus.Generating, statusMessage: 'Translating sound into structure...' });
                const rawBlueprint: RideBlueprint = await generateRideBlueprint(file, duration, bpm, energy, spectralCentroid, spectralFlux);

                set({ statusMessage: 'Refining for physical plausibility...' });
                const refinedBlueprint = validateAndRefineBlueprint(rawBlueprint);

                set({ statusMessage: 'Constructing ephemeral cathedral...' });
                const newTrackData = buildTrackData(refinedBlueprint);
                set({ trackData: newTrackData, status: AppStatus.Ready });
            } catch (error) {
                console.error(error);
                const message = error instanceof Error ? error.message : 'An unknown error occurred.';
                set({ errorMessage: `Failed to process '${file.name}': ${message}`, status: AppStatus.Error });
            }
        },
        startRide: () => {
            if (get().status === AppStatus.Ready && get().trackData && get().audioFile) {
                set({ status: AppStatus.Riding });
            }
        },
        resetApp: () => {
            set({
                status: AppStatus.Idle,
                errorMessage: '',
                statusMessage: '',
                audioFile: null,
                trackData: null,
            });
        },
        handleRideFinish: () => {
            get().actions.resetApp();
        },
    }
}));

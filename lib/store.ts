import { create } from 'zustand';
import { AppStatus, RideBlueprint, TrackData } from '../types';
import { analyzeAudio } from './audioProcessor';
import { generateRideBlueprint } from '../services/geminiService';
import { buildTrackData } from './trackBuilder';
import { validateAndRefineBlueprint } from './trackValidator';
import { runAudioProcessingWorkflow } from './workflow';

interface AppState {
    status: AppStatus;
    errorMessage: string;
    statusMessage: string;
    audioFile: File | null;
    trackData: TrackData | null;
    actions: {
        setStatus: (status: AppStatus, message?: string) => void;
        setTrackData: (data: TrackData | null) => void;
        setErrorMessage: (error: string) => void;
        setAudioFile: (file: File) => void;
        resetApp: () => void;
        startRide: () => void;
        handleRideFinish: () => void;
    };
}

export const useAppStore = create<AppState>((set, get) => ({
    status: AppStatus.Idle,
    errorMessage: '',
    statusMessage: '',
    audioFile: null,
    trackData: null,
    actions: {
        setStatus: (status: AppStatus, message?: string) => set({ status, statusMessage: message || '' }),
        setTrackData: (data: TrackData | null) => set({ trackData: data }),
        setErrorMessage: (error: string) => set({ errorMessage: error, status: AppStatus.Error }),
        setAudioFile: (file: File) => {
            set({ audioFile: file });
            runAudioProcessingWorkflow(file); // Trigger the workflow
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

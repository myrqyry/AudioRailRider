import { create } from 'zustand';
import { AppStatus, Blueprint, TrackData } from 'shared/types';

interface ErrorState {
    title: string;
    message: string;
}

interface AppState {
    status: AppStatus;
    error: ErrorState | null;
    statusMessage: string;
    audioFile: File | null;
    trackData: TrackData | null;
    /** URL of the generated skybox image (if available) */
    skyboxUrl: string | null;
    // User-selected generation options used to influence AI generation
    generationOptions?: import('shared/types').GenerationOptions | null;
    workflowProgress: number;
    actions: {
    setGenerationOptions: (opts: import('shared/types').GenerationOptions | null) => void;
        setStatus: (status: AppStatus, message?: string) => void;
        setTrackData: (data: TrackData | null) => void;
        setError: (error: ErrorState | null) => void;
        setAudioFile: (file: File) => void;
        setWorkflowProgress: (progress: number) => void;
    setSkyboxUrl: (url: string | null) => void;
        resetApp: () => void;
        startRide: () => void;
        handleRideFinish: () => void;
        startRideAgain: () => void;
    };
}

export const useAppStore = create<AppState>((set, get) => ({
    status: AppStatus.Idle,
    error: null,
    statusMessage: '',
    audioFile: null,
    trackData: null,
    workflowProgress: 0,
    skyboxUrl: null,
    generationOptions: null,
    actions: {
    setGenerationOptions: (opts: import('shared/types').GenerationOptions | null) => set({ generationOptions: opts }),
        setStatus: (status: AppStatus, message?: string) => set({ status, statusMessage: message || '', error: null }),
        setTrackData: (data: TrackData | null) => set({ trackData: data }),
        setError: (error: ErrorState | null) => set({ error, status: error ? AppStatus.Error : get().status }),
        setAudioFile: (file: File) => {
            // Clear any previously-generated skybox when starting a new audio file
            set({ audioFile: file, status: AppStatus.Idle, error: null, workflowProgress: 0, skyboxUrl: null });
        },
    setWorkflowProgress: (progress: number) => set({ workflowProgress: progress }),
    setSkyboxUrl: (url: string | null) => set({ skyboxUrl: url }),
        startRide: () => {
            const currentState = get();
            console.log('[Store] startRide called', { 
                status: currentState.status, 
                hasTrackData: !!currentState.trackData, 
                hasAudioFile: !!currentState.audioFile 
            });
            if (currentState.status === AppStatus.Ready && currentState.trackData && currentState.audioFile) {
                console.log('[Store] Transitioning to Riding state');
                set({ status: AppStatus.Riding });
            } else {
                console.warn('[Store] Cannot start ride - conditions not met');
            }
        },
        resetApp: () => {
            set({
                status: AppStatus.Idle,
                error: null,
                statusMessage: '',
                audioFile: null,
                trackData: null,
                workflowProgress: 0,
                skyboxUrl: null,
            });
        },
        handleRideFinish: () => {
            if (get().status === AppStatus.Riding) {
                set({ status: AppStatus.Finished, statusMessage: "Your journey is complete." });
            }
        },
        startRideAgain: () => {
            if (get().status === AppStatus.Finished && get().trackData && get().audioFile) {
                set({ status: AppStatus.Riding });
            }
        },
    }
}));
import { create } from 'zustand';
import { AppStatus, Blueprint, TrackData } from 'shared/types';

/**
 * Defines the structure for representing an error state in the application.
 */
interface ErrorState {
    /** The title of the error. */
    title: string;
    /** A descriptive message for the error. */
    message: string;
}

/**
 * Defines the complete state of the application, including status, data, and actions.
 */
interface AppState {
        /** Global breathing intensity for geometry deformation. */
        breathingIntensity: number;
    /** The current status of the application. */
    status: AppStatus;
    /** The current error state, or null if there is no error. */
    error: ErrorState | null;
    /** A message describing the current status. */
    statusMessage: string;
    /** The user-uploaded audio file. */
    audioFile: File | null;
    /** The generated blueprint for the ride. */
    blueprint: Blueprint | null;
    /** The extracted audio features. */
    audioFeatures: AudioFeatures | null;
    /** The generated track data for the visualization. */
    trackData: TrackData | null;
    /** URL of the generated skybox image (if available) */
    skyboxUrl: string | null;
    /** User-selected options that influence the generation process. */
    generationOptions?: import('shared/types').GenerationOptions | null;
    /** The progress of the current workflow (e.g., audio analysis, generation). */
    workflowProgress: number;
    /** The progress of the generation process. */
    generationProgress: number;
    /** A collection of actions to modify the application state. */
    actions: {
        /** Sets the global breathing intensity. */
        setBreathingIntensity: (intensity: number) => void;
        /** Sets the user-defined generation options. */
        setGenerationOptions: (opts: import('shared/types').GenerationOptions | null) => void;
        /** Sets the application's status and an optional message. */
        setStatus: (status: AppStatus, message?: string) => void;
        /** Sets the blueprint for the ride. */
        setBlueprint: (blueprint: Blueprint | null) => void;
        /** Sets the extracted audio features. */
        setAudioFeatures: (features: AudioFeatures | null) => void;
        /** Sets the track data for the visualization. */
        setTrackData: (data: TrackData | null) => void;
        /** Sets or clears the application's error state. */
        setError: (error: ErrorState | null) => void;
        /** Sets the audio file to be processed. */
        setAudioFile: (file: File) => void;
        /** Sets the progress of the current workflow. */
        setWorkflowProgress: (progress: number) => void;
        /** Sets the progress of the generation process. */
        setGenerationProgress: (progress: number) => void;
        /** Sets the URL for the generated skybox image. */
        setSkyboxUrl: (url: string | null) => void;
        /** Resets the application to its initial idle state. */
        resetApp: () => void;
        /** Starts the ride visualization. */
        startRide: () => void;
        /** Handles the completion of the ride. */
        handleRideFinish: () => void;
        /** Starts the ride again with the same track. */
        startRideAgain: () => void;
    };
}

/**
 * The Zustand store for managing the application's global state.
 */
export const useAppStore = create<AppState>((set, get) => ({
    status: AppStatus.Idle,
    error: null,
    statusMessage: '',
    audioFile: null,
    blueprint: null,
    audioFeatures: null,
    trackData: null,
    workflowProgress: 0,
    generationProgress: 0,
    skyboxUrl: null,
    generationOptions: null,
    breathingIntensity: 1.0,
    actions: {
    setGenerationOptions: (opts: import('shared/types').GenerationOptions | null) => set({ generationOptions: opts }),
    setBreathingIntensity: (intensity: number) => set({ breathingIntensity: intensity }),
        setStatus: (status: AppStatus, message?: string) => set({ status, statusMessage: message || '', error: null }),
        setBlueprint: (blueprint: Blueprint | null) => set({ blueprint }),
        setAudioFeatures: (features: AudioFeatures | null) => set({ audioFeatures: features }),
        setTrackData: (data: TrackData | null) => {
            const currentStatus = get().status;
            if (data === null && (currentStatus === AppStatus.Riding || currentStatus === AppStatus.Ready)) {
                set({ trackData: null, status: AppStatus.Idle, statusMessage: 'Track data was cleared, returning to start.' });
            } else {
                set({ trackData: data });
            }
        },
        setError: (error: ErrorState | null) => set({ error, status: error ? AppStatus.Error : get().status }),
        setAudioFile: (file: File) => {
            // Clear any previously-generated skybox when starting a new audio file
            set({ audioFile: file, status: AppStatus.Idle, error: null, workflowProgress: 0, skyboxUrl: null });
        },
    setWorkflowProgress: (progress: number) => set({ workflowProgress: progress }),
    setGenerationProgress: (progress: number) => set({ generationProgress: progress }),
    setSkyboxUrl: (url: string | null) => set({ skyboxUrl: url }),
        startRide: () => {
            const currentState = get();
            if (currentState.status === AppStatus.Ready && currentState.trackData && currentState.audioFile) {
                set({ status: AppStatus.Riding });
            }
        },
        resetApp: () => {
            set({
                status: AppStatus.Idle,
                error: null,
                statusMessage: '',
                audioFile: null,
                blueprint: null,
                audioFeatures: null,
                trackData: null,
                workflowProgress: 0,
                skyboxUrl: null,
                generationOptions: null,
                breathingIntensity: 1.0,
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
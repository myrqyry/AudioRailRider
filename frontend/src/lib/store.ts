import { create } from 'zustand';
import { AppStatus, RideBlueprint, TrackData } from 'shared/types';

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
    actions: {
        setStatus: (status: AppStatus, message?: string) => void;
        setTrackData: (data: TrackData | null) => void;
        setError: (error: ErrorState | null) => void;
        setAudioFile: (file: File) => void;
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
    actions: {
        setStatus: (status: AppStatus, message?: string) => set({ status, statusMessage: message || '', error: null }),
        setTrackData: (data: TrackData | null) => set({ trackData: data }),
        setError: (error: ErrorState | null) => set({ error, status: error ? AppStatus.Error : get().status }),
        setAudioFile: (file: File) => {
            set({ audioFile: file, status: AppStatus.Idle, error: null });
        },
        startRide: () => {
            if (get().status === AppStatus.Ready && get().trackData && get().audioFile) {
                set({ status: AppStatus.Riding });
            }
        },
        resetApp: () => {
            set({
                status: AppStatus.Idle,
                error: null,
                statusMessage: '',
                audioFile: null,
                trackData: null,
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
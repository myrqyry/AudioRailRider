import { create } from 'zustand';
import { AppStatus } from '../types';
export const useAppStore = create((set, get) => ({
    status: AppStatus.Idle,
    errorMessage: '',
    statusMessage: '',
    audioFile: null,
    trackData: null,
    actions: {
        setStatus: (status, message) => set({ status, statusMessage: message || '' }),
        setTrackData: (data) => set({ trackData: data }),
        setErrorMessage: (error) => set({ errorMessage: error, status: AppStatus.Error }),
        setAudioFile: (file) => {
            // Only update the state. Do not trigger the workflow here.
            set({ audioFile: file, status: AppStatus.Idle });
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

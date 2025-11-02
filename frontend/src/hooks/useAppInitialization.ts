import { useEffect } from 'react';
import { useAudioProcessor } from './useAudioProcessor';
import { startPreload } from '../lib/preloader';

export const useAppInitialization = () => {
    useEffect(() => {
        startPreload();
    }, []);

    useAudioProcessor();
};

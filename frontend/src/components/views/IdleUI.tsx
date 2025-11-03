import React, { useRef, useCallback, useEffect } from 'react';
import { useAppStore } from '../../lib/store';
import { UploadIcon } from '../Icon';
import GenerationOptionsForm from '../GenerationOptionsForm';
import MicrophoneControls from '../MicrophoneControls';

interface IdleUIProps {
  audioContext: AudioContext | null;
}

/**
 * The initial user interface component when the application is idle.
 * It provides a file input for uploading an audio file and displays the main title.
 * @returns {React.ReactElement} The rendered idle UI.
 */
const IdleUI: React.FC<IdleUIProps> = ({ audioContext }) => {
    const { setAudioFile, setError } = useAppStore((state) => state.actions);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // When the component mounts, clear the file input to allow re-uploading the same file
    useEffect(() => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    /**
     * Handles the file input change event.
     * It validates the selected file's type and size before updating the application state.
     * @param {React.ChangeEvent<HTMLInputElement>} event - The file input change event.
     */
    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const allowedTypes = new Set(['audio/mpeg', 'audio/wav', 'audio/x-wav']);
        const maxBytes = 20 * 1024 * 1024; // 20 MB

        if (!allowedTypes.has(file.type)) {
            setError({ title: "Unsupported File Type", message: `Please select a valid audio file (MP3, WAV). You selected a file of type: ${file.type}` });
            return;
        }
        if (file.size > maxBytes) {
            setError({ title: "File Too Large", message: `The selected file is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please select a file smaller than 20MB.` });
            return;
        }

        setAudioFile(file);
    }, [setAudioFile, setError]);

    return (
        <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-thin tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400">AudioRail Rider</h1>
            <p className="mt-4 max-w-2xl mx-auto text-gray-400">Translate music into a navigable space. Inhabit the soul of a song.</p>
            <label htmlFor="audio-upload" className="mt-8 inline-flex items-center gap-3 px-8 py-4 bg-gray-800/50 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700/70 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105">
                <UploadIcon className="w-6 h-6" />
                <span>Offer a ghost... (MP3, WAV)</span>
            </label>
            <input ref={fileInputRef} id="audio-upload" type="file" accept="audio/mp3, audio/wav, audio/mpeg" className="hidden" onChange={handleFileChange} />

            <div className="my-6 flex items-center justify-center">
                <div className="w-1/4 border-t border-gray-600"></div>
                <p className="mx-4 text-gray-500">OR</p>
                <div className="w-1/4 border-t border-gray-600"></div>
            </div>

            <MicrophoneControls audioContext={audioContext} />

            <p className="text-xs text-gray-600 mt-4">For the best experience, use a track with dynamic range.</p>

import BreathingIntensitySlider from '../BreathingIntensitySlider';
            <GenerationOptionsForm />
            <BreathingIntensitySlider />

            <div className="mt-8 text-sm text-gray-500">
                Powered by <span className="font-semibold text-gray-400">Gemini</span> & <span className="font-semibold text-gray-400">Three.js</span>
            </div>
        </div>
    );
};

export default IdleUI;
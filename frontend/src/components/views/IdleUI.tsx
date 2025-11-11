import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useAppStore } from '../../lib/store';
import { UploadIcon } from '../Icon';
import BreathingIntensitySlider from '../BreathingIntensitySlider';
import GenerationOptionsForm from '../GenerationOptionsForm';
import MicrophoneControls from '../MicrophoneControls';

interface IdleUIProps {
  audioContext: AudioContext | null;
}

const IdleUI: React.FC<IdleUIProps> = ({ audioContext }) => {
    const actions = useAppStore((state) => state.actions);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isValidating, setIsValidating] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    const validateAndSetFile = useCallback(async (file: File) => {
        setIsValidating(true);

        const allowedTypes = new Set(['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp3']);
        const maxBytes = 20 * 1024 * 1024;

        // Check file type
        if (!allowedTypes.has(file.type) && !file.name.match(/\.(mp3|wav)$/i)) {
            actions.setError({
                title: 'Unsupported file type',
                message: `File type: ${file.type}. Please upload an MP3 or WAV file.`,
            });
            setIsValidating(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        // Check file size
        if (file.size > maxBytes) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
            actions.setError({
                title: 'File too large',
                message: `File size: ${sizeMB}MB. Please upload a file smaller than 20MB.`,
            });
            setIsValidating(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        // Optional: Verify it's actually audio by checking the header.
        // IMPORTANT: Do not hard-reject valid files that start with ID3 or other metadata.
        try {
            const buffer = await file.slice(0, 12).arrayBuffer();
            const header = new Uint8Array(buffer);

            const isMP3Header = header[0] === 0xFF && (header[1] & 0xE0) === 0xE0; // MPEG frame sync
            const isWAVHeader = String.fromCharCode(...header.slice(0, 4)) === 'RIFF';
            const hasID3Tag = String.fromCharCode(...header.slice(0, 3)) === 'ID3';

            // If none of the lightweight audio indicators are present AND the browser type hint
            // isn't clearly audio, treat it as invalid. Otherwise, allow it and let decoding fail later if needed.
            const mime = (file.type || '').toLowerCase();
            const looksLikeAudioType =
                mime.startsWith('audio/') || file.name.toLowerCase().endsWith('.mp3') || file.name.toLowerCase().endsWith('.wav');

            if (!isMP3Header && !isWAVHeader && !hasID3Tag && !looksLikeAudioType) {
                actions.setError({
                    title: 'Invalid audio file',
                    message: 'The file does not appear to be a valid audio file.',
                });
                setIsValidating(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }
        } catch (error) {
            console.warn('Could not verify file header:', error);
            // Continue anyway if header check fails
        }

        // All checks passed
        await actions.setAudioFileAsync(file);
        setIsValidating(false);
    }, [actions]);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) validateAndSetFile(file);
    }, [validateAndSetFile]);

    // Drag and drop handlers
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file) validateAndSetFile(file);
    }, [validateAndSetFile]);

    return (
        <div
            className="text-center animate-fade-in"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <h1 className="text-5xl md:text-7xl font-thin tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400">
                AudioRail Rider
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-gray-400">
                Translate music into a navigable space. Inhabit the soul of a song.
            </p>

            <div className={`mt-8 relative transition-all duration-200 ${dragActive ? 'scale-105' : ''}`}>
                <label
                    htmlFor="audio-upload"
                    className={`inline-flex items-center gap-3 px-8 py-4 bg-gray-800/50 border rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                        dragActive
                            ? 'border-cyan-400 bg-cyan-900/30 shadow-lg shadow-cyan-500/50'
                            : isValidating
                            ? 'border-yellow-400 bg-yellow-900/20'
                            : 'border-gray-600 hover:bg-gray-700/70 hover:border-cyan-400'
                    }`}
                >
                    {isValidating ? (
                        <>
                            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                            <span>Validating...</span>
                        </>
                    ) : dragActive ? (
                        <>
                            <UploadIcon className="w-6 h-6 text-cyan-400" />
                            <span className="text-cyan-400">Drop your audio file here</span>
                        </>
                    ) : (
                        <>
                            <UploadIcon className="w-6 h-6" />
                            <span>Offer a ghost... (MP3, WAV, max 20MB)</span>
                        </>
                    )}
                </label>

                <input
                    ref={fileInputRef}
                    id="audio-upload"
                    type="file"
                    accept="audio/mp3,audio/wav,audio/mpeg,audio/x-wav,.mp3,.wav"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isValidating}
                />
            </div>

            <div className="my-6 flex items-center justify-center">
                <div className="w-1/4 border-t border-gray-600" />
                <p className="mx-4 text-gray-500">OR</p>
                <div className="w-1/4 border-t border-gray-600" />
            </div>

            <MicrophoneControls audioContext={audioContext} />

            <p className="text-xs text-gray-600 mt-4">
                For the best experience, use a track with dynamic range.
            </p>

            {/* Compact "Customize" toggle: hidden by default so Gemini can drive everything out-of-the-box */}
            <details className="mt-4 w-full max-w-xl mx-auto text-left text-xs text-gray-400">
                <summary className="cursor-pointer select-none px-2 py-1 rounded border border-gray-700/70 hover:border-gray-500/90 inline-flex items-center gap-1">
                    <span>Customize (advanced)</span>
                    <span className="text-[9px] uppercase tracking-wide text-gray-500">optional</span>
                </summary>
                <div className="mt-3 space-y-3 bg-black/40 border border-gray-800/80 rounded-md p-2">
                    <p className="text-[10px] text-gray-500">
                        Leave everything untouched to let Gemini choose track style, world, visuals, and skybox dynamics.
                        Open this panel only if you want to override defaults.
                    </p>
                    <GenerationOptionsForm />
                    <BreathingIntensitySlider />
                </div>
            </details>

            <div className="mt-8 text-sm text-gray-500">
                Powered by <span className="font-semibold text-gray-400">Gemini</span> & <span className="font-semibold text-gray-400">Three.js</span>
            </div>
        </div>
    );
};

export default IdleUI;
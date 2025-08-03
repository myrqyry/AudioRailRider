
import React, { useState, useCallback, useRef } from 'react';
import { AppStatus, RideBlueprint, TrackData } from './types';
import { analyzeAudio } from './lib/audioProcessor';
import { generateRideBlueprint } from './services/geminiService';
import { buildTrackData } from './lib/trackBuilder';
import { Loader } from './components/Loader';
import { UploadIcon, PlayIcon, SparkleIcon } from './components/Icon';
import ThreeCanvas from './components/ThreeCanvas';

const App: React.FC = () => {
    const [status, setStatus] = useState<AppStatus>(AppStatus.Idle);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [statusMessage, setStatusMessage] = useState<string>('');
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [trackData, setTrackData] = useState<TrackData | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAudioFile(file);
            processAudioFile(file);
        }
    };

    const processAudioFile = useCallback(async (file: File) => {
        try {
            setStatus(AppStatus.Analyzing);
            setStatusMessage('Reading audio essence...');
            const { duration, bpm, energy } = await analyzeAudio(file);

            setStatus(AppStatus.Generating);
            setStatusMessage('Translating sound into structure...');
            const blueprint: RideBlueprint = await generateRideBlueprint(file, duration, bpm, energy);
            
            setStatusMessage('Constructing ephemeral cathedral...');
            const newTrackData = buildTrackData(blueprint);
            setTrackData(newTrackData);
            
            setStatus(AppStatus.Ready);
        } catch (error) {
            console.error(error);
            const message = error instanceof Error ? error.message : 'An unknown error occurred.';
            setErrorMessage(`Failed to process '${file.name}': ${message}`);
            setStatus(AppStatus.Error);
        }
    }, []);

    const startRide = () => {
        if (status === AppStatus.Ready && trackData && audioFile) {
            setStatus(AppStatus.Riding);
        }
    };
    
    const resetApp = useCallback(() => {
        setStatus(AppStatus.Idle);
        setErrorMessage('');
        setStatusMessage('');
        setAudioFile(null);
        setTrackData(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);
    
    const handleRideFinish = useCallback(() => {
        resetApp();
    }, [resetApp]);
    
    const renderContent = () => {
        switch (status) {
            case AppStatus.Error:
                return (
                    <div className="text-center animate-fade-in">
                        <h2 className="text-2xl font-bold text-red-400">An Error Occurred</h2>
                        <p className="mt-2 text-red-200 max-w-lg">{errorMessage}</p>
                        <button onClick={resetApp} className="mt-6 px-6 py-2 bg-red-500 hover:bg-red-600 rounded-md transition-colors">Try Again</button>
                    </div>
                );
            case AppStatus.Idle:
                return (
                    <div className="text-center animate-fade-in">
                        <h1 className="text-5xl md:text-7xl font-thin tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400">AudioRail Rider</h1>
                        <p className="mt-4 max-w-2xl mx-auto text-gray-400">Translate music into a navigable space. Inhabit the soul of a song.</p>
                        <label htmlFor="audio-upload" className="mt-8 inline-flex items-center gap-3 px-8 py-4 bg-gray-800/50 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700/70 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105">
                            <UploadIcon className="w-6 h-6" />
                            <span>Offer a ghost... (MP3, WAV)</span>
                        </label>
                        <input ref={fileInputRef} id="audio-upload" type="file" accept="audio/mp3, audio/wav, audio/mpeg" className="hidden" onChange={handleFileChange} />
                        <p className="text-xs text-gray-600 mt-4">For the best experience, use a track with dynamic range.</p>
                         <div className="mt-8 text-sm text-gray-500">
                             Powered by <span className="font-semibold text-gray-400">Gemini</span> & <span className="font-semibold text-gray-400">Three.js</span>
                         </div>
                    </div>
                );
            case AppStatus.Ready:
                 return (
                    <div className="text-center flex flex-col items-center animate-fade-in">
                        <SparkleIcon className="w-16 h-16 text-cyan-300" />
                        <h2 className="text-4xl font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400">The Dreamscape is Ready</h2>
                        <p className="mt-2 text-gray-300">Your ride through "{audioFile?.name}" has been constructed.</p>
                        <button onClick={startRide} className="mt-8 inline-flex items-center gap-3 px-12 py-5 bg-cyan-500/80 text-white font-bold rounded-full shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all duration-300 transform hover:scale-110">
                            <PlayIcon className="w-8 h-8" />
                            <span>Begin the Ride</span>
                        </button>
                    </div>
                );
            default:
                return null; // Riding state is handled by ThreeCanvas, Loader handles others
        }
    };

    return (
        <main className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
            {(status === AppStatus.Analyzing || status === AppStatus.Generating) && <Loader message={statusMessage} />}
            
            <div className="relative z-10 p-4">
                {renderContent()}
            </div>
            
            {(status === AppStatus.Riding || status === AppStatus.Ready) && trackData && (
                <ThreeCanvas
                    status={status}
                    trackData={trackData}
                    audioFile={audioFile}
                    onRideFinish={handleRideFinish}
                />
            )}
        </main>
    );
};

export default App;

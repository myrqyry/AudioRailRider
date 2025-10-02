import React, { useRef, useEffect, useCallback } from 'react';
import { AppStatus } from 'shared/types';
import { useAppStore } from './lib/store';
import { runAudioProcessingWorkflow } from './lib/workflow';
import { Loader } from './components/Loader';
import { UploadIcon, PlayIcon, SparkleIcon, AlertTriangleIcon } from './components/Icon';
import ThreeCanvas from './components/ThreeCanvas';

const App: React.FC = () => {
    const status = useAppStore((state) => state.status);
    const error = useAppStore((state) => state.error);
    const statusMessage = useAppStore((state) => state.statusMessage);
    const audioFile = useAppStore((state) => state.audioFile);
    const trackData = useAppStore((state) => state.trackData);
    const { setAudioFile, startRide, resetApp, startRideAgain, setError } = useAppStore((state) => state.actions);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
    
    useEffect(() => {
        if (status === AppStatus.Idle && fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [status]);

    useEffect(() => {
        if (audioFile) {
            runAudioProcessingWorkflow(audioFile);
        }
    }, [audioFile]);

    const renderContent = () => {
        switch (status) {
            case AppStatus.Error:
                if (!error) return null;
                return (
                    <div className="text-center animate-fade-in bg-red-900/20 border border-red-500/50 rounded-lg p-8 max-w-lg shadow-xl">
                        <AlertTriangleIcon className="w-16 h-16 text-red-400 mx-auto" />
                        <h2 className="mt-4 text-3xl font-bold text-red-300">{error.title}</h2>
                        <p className="mt-2 text-red-200">{error.message}</p>
                        <button onClick={resetApp} className="mt-6 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md transition-colors transform hover:scale-105">Try Again</button>
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
            case AppStatus.Finished:
                return (
                   <div className="text-center animate-fade-in">
                       <h2 className="text-4xl font-bold">Ride Complete</h2>
                       <p className="mt-2 text-gray-300">
                         You have journeyed through "{audioFile?.name || 'your audio'}".
                       </p>
                       <div className="mt-8 flex justify-center gap-4">
                           <button
                             onClick={startRideAgain}
                             className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-md transition-colors"
                           >
                               Ride Again
                           </button>
                           <button
                             onClick={resetApp}
                             className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-md transition-colors"
                           >
                               Upload New Song
                           </button>
                       </div>
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
                <ThreeCanvas />
            )}
        </main>
    );
};

export default App;

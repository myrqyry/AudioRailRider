import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect } from 'react';
import { AppStatus } from './types';
import { useAppStore } from './lib/store';
import { runAudioProcessingWorkflow } from './lib/workflow';
import { Loader } from './components/Loader';
import { UploadIcon, PlayIcon, SparkleIcon } from './components/Icon';
import ThreeCanvas from './components/ThreeCanvas';
const App = () => {
    const status = useAppStore((state) => state.status);
    const errorMessage = useAppStore((state) => state.errorMessage);
    const statusMessage = useAppStore((state) => state.statusMessage);
    const audioFile = useAppStore((state) => state.audioFile);
    const trackData = useAppStore((state) => state.trackData);
    const { setAudioFile, startRide, resetApp, startRideAgain } = useAppStore((state) => state.actions);
    const fileInputRef = useRef(null);
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setAudioFile(file);
        }
    };
    useEffect(() => {
        if (status === AppStatus.Idle && fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [status]);
    useEffect(() => {
        if (audioFile) {
            // Trigger the workflow when the audio file is set
            runAudioProcessingWorkflow(audioFile);
        }
    }, [audioFile]);
    const renderContent = () => {
        switch (status) {
            case AppStatus.Error:
                return (_jsxs("div", { className: "text-center animate-fade-in", children: [_jsx("h2", { className: "text-2xl font-bold text-red-400", children: "An Error Occurred" }), _jsx("p", { className: "mt-2 text-red-200 max-w-lg", children: errorMessage }), _jsx("button", { onClick: resetApp, className: "mt-6 px-6 py-2 bg-red-500 hover:bg-red-600 rounded-md transition-colors", children: "Try Again" })] }));
            case AppStatus.Idle:
                return (_jsxs("div", { className: "text-center animate-fade-in", children: [_jsx("h1", { className: "text-5xl md:text-7xl font-thin tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400", children: "AudioRail Rider" }), _jsx("p", { className: "mt-4 max-w-2xl mx-auto text-gray-400", children: "Translate music into a navigable space. Inhabit the soul of a song." }), _jsxs("label", { htmlFor: "audio-upload", className: "mt-8 inline-flex items-center gap-3 px-8 py-4 bg-gray-800/50 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700/70 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105", children: [_jsx(UploadIcon, { className: "w-6 h-6" }), _jsx("span", { children: "Offer a ghost... (MP3, WAV)" })] }), _jsx("input", { ref: fileInputRef, id: "audio-upload", type: "file", accept: "audio/mp3, audio/wav, audio/mpeg", className: "hidden", onChange: handleFileChange }), _jsx("p", { className: "text-xs text-gray-600 mt-4", children: "For the best experience, use a track with dynamic range." }), _jsxs("div", { className: "mt-8 text-sm text-gray-500", children: ["Powered by ", _jsx("span", { className: "font-semibold text-gray-400", children: "Gemini" }), " & ", _jsx("span", { className: "font-semibold text-gray-400", children: "Three.js" })] })] }));
            case AppStatus.Ready:
                return (_jsxs("div", { className: "text-center flex flex-col items-center animate-fade-in", children: [_jsx(SparkleIcon, { className: "w-16 h-16 text-cyan-300" }), _jsx("h2", { className: "text-4xl font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400", children: "The Dreamscape is Ready" }), _jsxs("p", { className: "mt-2 text-gray-300", children: ["Your ride through \"", audioFile?.name, "\" has been constructed."] }), _jsxs("button", { onClick: startRide, className: "mt-8 inline-flex items-center gap-3 px-12 py-5 bg-cyan-500/80 text-white font-bold rounded-full shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all duration-300 transform hover:scale-110", children: [_jsx(PlayIcon, { className: "w-8 h-8" }), _jsx("span", { children: "Begin the Ride" })] })] }));
            case AppStatus.Finished:
                return (_jsxs("div", { className: "text-center animate-fade-in", children: [_jsx("h2", { className: "text-4xl font-bold", children: "Ride Complete" }), _jsxs("p", { className: "mt-2 text-gray-300", children: ["You have journeyed through \"", audioFile?.name || 'your audio', "\"."] }), _jsxs("div", { className: "mt-8 flex justify-center gap-4", children: [_jsx("button", { onClick: startRideAgain, className: "px-6 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-md transition-colors", children: "Ride Again" }), _jsx("button", { onClick: resetApp, className: "px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-md transition-colors", children: "Upload New Song" })] })] }));
            default:
                return null; // Riding state is handled by ThreeCanvas, Loader handles others
        }
    };
    return (_jsxs("main", { className: "relative w-full h-screen bg-black overflow-hidden flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" }), (status === AppStatus.Analyzing || status === AppStatus.Generating) && _jsx(Loader, { message: statusMessage }), _jsx("div", { className: "relative z-10 p-4", children: renderContent() }), (status === AppStatus.Riding || status === AppStatus.Ready) && trackData && (_jsx(ThreeCanvas, {}))] }));
};
export default App;

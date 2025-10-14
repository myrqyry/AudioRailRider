import React from 'react';
import { useAppStore } from '../../lib/store';

const FinishedUI: React.FC = () => {
    const audioFile = useAppStore((state) => state.audioFile);
    const { startRideAgain, resetApp } = useAppStore((state) => state.actions);

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
};

export default FinishedUI;
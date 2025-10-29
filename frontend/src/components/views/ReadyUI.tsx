import React from 'react';
import { useAppStore } from '../../lib/store';
import { PlayIcon, SparkleIcon } from '../Icon';

/**
 * A user interface component displayed when the application is ready to start the ride.
 * It shows a confirmation message and a button to begin the visualization.
 * @returns {React.ReactElement} The rendered ready UI.
 */
const ReadyUI: React.FC = () => {
    const { audioFile } = useAppStore((state) => state);
    const { startRide } = useAppStore((state) => state.actions);

    return (
        <div className="text-center flex flex-col items-center animate-fade-in">
            <SparkleIcon className="w-16 h-16 text-cyan-300" />
            <h2 className="text-4xl font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400">The Dreamscape is Ready</h2>
            <p className="mt-2 text-gray-300">Your ride through "{audioFile?.name}" has been constructed.</p>
            <button
                onClick={() => {
                    console.log('[App] Begin the Ride button clicked');
                    startRide();
                }}
                className="mt-8 inline-flex items-center gap-3 px-12 py-5 bg-cyan-500/80 text-white font-bold rounded-full shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all duration-300 transform hover:scale-110"
            >
                <PlayIcon className="w-8 h-8" />
import BreathingIntensitySlider from '../BreathingIntensitySlider';
                <span>Begin the Ride</span>
            </button>
            <div className="mt-8">
                <BreathingIntensitySlider />
            </div>
        </div>
    );
};

export default ReadyUI;
import React from 'react';
import { useAppStore } from '../lib/store';

const BreathingIntensitySlider: React.FC = () => {
    const breathingIntensity = useAppStore((state) => state.breathingIntensity);
    const setBreathingIntensity = useAppStore((state) => state.actions.setBreathingIntensity);
    const status = useAppStore((state) => state.status);

    if (status === 'riding' || status === 'ready' || status === 'analyzing' || status === 'generating') {
        return null;
    }

    return (
        <div className="mt-6 flex flex-col items-center">
            <label htmlFor="breathing-intensity-slider" className="text-xs text-white mb-1">Breathing Intensity</label>
            <input
                id="breathing-intensity-slider"
                type="range"
                min={0}
                max={2}
                step={0.01}
                value={breathingIntensity}
                onChange={e => setBreathingIntensity(Number(e.target.value))}
                className="w-48 accent-pink-500"
            />
            <span className="text-xs text-white mt-1">{breathingIntensity.toFixed(2)}</span>
        </div>
    );
};

export default BreathingIntensitySlider;

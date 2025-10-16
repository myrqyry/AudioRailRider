import React from 'react';
import { useAppStore } from '../lib/store';
import { GenerationOptions, TrackStyle, WorldTheme, VisualStyle, DetailLevel, EventPreset } from '../../../shared/types';

// Preset options are now self-contained in this component
const TRACK_STYLES: TrackStyle[] = ['classic', 'extreme', 'flowing', 'technical', 'experimental'];
const WORLD_THEMES: WorldTheme[] = ['fantasy', 'cyberpunk', 'aurora', 'desert', 'space', 'underwater', 'noir'];
const VISUAL_STYLES: VisualStyle[] = ['photorealistic', 'stylized', 'painterly', 'lowpoly', 'retro'];
const DETAIL_LEVELS: DetailLevel[] = ['low', 'medium', 'high'];
const EVENT_PRESETS: EventPreset[] = ['fog', 'fireworks', 'starshow', 'lightBurst', 'sparkRing', 'confetti'];


/**
 * A form component for configuring the generation options for the visualization.
 * It allows users to select track style, world theme, visual style, detail level,
 * and preferred event presets.
 * @returns {React.ReactElement} The rendered form component.
 */
const GenerationOptionsForm: React.FC = () => {
    const generationOptions = useAppStore(state => state.generationOptions);
    const setGenerationOptions = useAppStore(state => state.actions.setGenerationOptions);

    /**
     * Handles changes to select input elements in a type-safe manner.
     * @template T
     * @param {T} key - The key of the generation option to update.
     * @param {GenerationOptions[T] | undefined} value - The new value for the option.
     */
    const handleSelectChange = <T extends keyof GenerationOptions>(key: T, value: GenerationOptions[T] | undefined) => {
        setGenerationOptions({
            ...generationOptions,
            [key]: value,
        });
    };

    /**
     * Handles changes to checkbox input elements for event presets.
     * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the checkbox.
     * @param {EventPreset} preset - The event preset associated with the checkbox.
     */
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, preset: EventPreset) => {
        const currentPresets = generationOptions?.preferredEventPresets || [];
        const newPresets = event.target.checked
            ? Array.from(new Set([...currentPresets, preset]))
            : currentPresets.filter((p) => p !== preset);

        setGenerationOptions({
            ...generationOptions,
            preferredEventPresets: newPresets,
        });
    };

    return (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto text-left">
            <div>
                <label className="block text-xs text-gray-400">Track Style</label>
                <select
                    value={generationOptions?.trackStyle || ''}
                    onChange={(e) => handleSelectChange('trackStyle', e.target.value as TrackStyle || undefined)}
                    className="mt-1 w-full bg-gray-800/60 border border-gray-700 rounded-md p-2 text-sm text-gray-200"
                >
                    <option value="">(auto)</option>
                    {TRACK_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-xs text-gray-400">World Theme</label>
                <select
                    value={generationOptions?.worldTheme || ''}
                    onChange={(e) => handleSelectChange('worldTheme', e.target.value as WorldTheme || undefined)}
                    className="mt-1 w-full bg-gray-800/60 border border-gray-700 rounded-md p-2 text-sm text-gray-200"
                >
                    <option value="">(auto)</option>
                    {WORLD_THEMES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-xs text-gray-400">Visual Style</label>
                <select
                    value={generationOptions?.visualStyle || ''}
                    onChange={(e) => handleSelectChange('visualStyle', e.target.value as VisualStyle || undefined)}
                    className="mt-1 w-full bg-gray-800/60 border border-gray-700 rounded-md p-2 text-sm text-gray-200"
                >
                    <option value="">(auto)</option>
                    {VISUAL_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-xs text-gray-400">Detail Level</label>
                <select
                    value={generationOptions?.detailLevel || ''}
                    onChange={(e) => handleSelectChange('detailLevel', e.target.value as DetailLevel || undefined)}
                    className="mt-1 w-full bg-gray-800/60 border border-gray-700 rounded-md p-2 text-sm text-gray-200"
                >
                    <option value="">(auto)</option>
                    {DETAIL_LEVELS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div className="md:col-span-2">
                <label className="block text-xs text-gray-400">Event Presets</label>
                <div className="mt-2 flex flex-wrap gap-2">
                    {EVENT_PRESETS.map((ev) => {
                        const checked = (generationOptions?.preferredEventPresets || []).includes(ev);
                        return (
                            <label key={ev} className="inline-flex items-center gap-2 text-sm text-gray-300 bg-gray-800/40 px-3 py-1 rounded-md cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(e) => handleCheckboxChange(e, ev)}
                                />
                                <span className="capitalize">{ev}</span>
                            </label>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default GenerationOptionsForm;
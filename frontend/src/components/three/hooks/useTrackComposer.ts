import { useEffect } from 'react';
import { useAppStore } from '../../../lib/store';
import { TrackComposer } from '../../../lib/procedural/TrackComposer';
import { Blueprint, AudioFeatures } from 'shared/types';

/**
 * A custom hook that listens for changes in the blueprint or audio features
 * and uses the TrackComposer to generate and set the final track data in the global store.
 *
 * @param {Blueprint | null} blueprint - The ride blueprint from the global store.
 * @param {AudioFeatures | null} audioFeatures - The audio features from the global store.
 */
export const useTrackComposer = (blueprint: Blueprint | null, audioFeatures: AudioFeatures | null) => {
  const setTrackData = useAppStore((state) => state.actions.setTrackData);

  useEffect(() => {
    if (!blueprint || !audioFeatures) return;

    console.log('[useTrackComposer] Blueprint and audio features are available. Composing track...');
    const composer = new TrackComposer();
    const newTrackData = composer.compose(blueprint, audioFeatures);
    setTrackData(newTrackData);
    console.log('[useTrackComposer] Track data composed and set in store.');
  }, [blueprint, audioFeatures, setTrackData]);
};
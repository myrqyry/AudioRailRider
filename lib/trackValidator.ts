import { RideBlueprint, TrackSegment } from '../types';

const isIntense = (segment: TrackSegment): boolean => {
    switch (segment.component) {
        case 'drop':
        case 'loop':
        case 'barrelRoll':
            return true;
        case 'turn':
            // A turn is intense if it's sharp (small radius)
            return segment.radius !== undefined && segment.radius < 100;
        default:
            return false;
    }
};

const createEasingSegment = (): TrackSegment => ({
    component: 'climb', // A straight segment is a climb with 0 angle
    angle: 0,
    length: 30, // A short segment to provide a breather
    intensity: 10, // Low intensity
    lightingEffect: 'none',
    environmentChange: 'none',
    audioSyncPoint: 0,
});

/**
 * Validates and refines an AI-generated ride blueprint to make it more physically plausible.
 * It identifies consecutive intense segments and inserts short, straight "easing" segments
 * between them to allow for smoother transitions.
 * @param blueprint The original RideBlueprint from the AI.
 * @returns A new, refined RideBlueprint with easing segments added where necessary.
 */
export const validateAndRefineBlueprint = (blueprint: RideBlueprint): RideBlueprint => {
    console.log("Starting blueprint validation and refinement...");
    const originalTrack = blueprint.track;
    if (originalTrack.length < 2) {
        return blueprint; // Not enough segments to need refinement
    }

    const refinedTrack: TrackSegment[] = [originalTrack[0]];

    for (let i = 1; i < originalTrack.length; i++) {
        const prevSegment = originalTrack[i - 1];
        const currentSegment = originalTrack[i];

        // Rule: Don't place two intense segments back-to-back without a breather.
        if (isIntense(prevSegment) && isIntense(currentSegment)) {
            console.log(`[Validator] Intense transition found between segment ${i-1} (${prevSegment.component}) and ${i} (${currentSegment.component}). Inserting easing segment.`);
            refinedTrack.push(createEasingSegment());
        }

        // Add more rules here in the future, e.g., checking for angle compatibility.

        refinedTrack.push(currentSegment);
    }

    console.log(`Blueprint refined. Original segments: ${originalTrack.length}, Refined segments: ${refinedTrack.length}`);

    return {
        ...blueprint,
        track: refinedTrack,
    };
};

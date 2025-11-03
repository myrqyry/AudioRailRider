import { buildTrackData } from './trackBuilder';
import { Blueprint } from 'shared/types';
import { RIDE_CONFIG } from './constants';

describe('buildTrackData', () => {
  const mockBlueprint: Blueprint = {
    rideName: 'Test Ride',
    moodDescription: 'A test ride',
    palette: ['#ff0000', '#00ff00', '#0000ff'],
    track: [
      { component: 'climb', angle: 10, length: 100 },
  { component: 'turn', direction: 'left', radius: 50, angle: 90, length: 60 },
      { component: 'drop', angle: -20, length: 100 },
      { component: 'loop', radius: 40, length: 120 },
      { component: 'barrelRoll', rotations: 2, length: 100 },
    ],
  };

  it('should build track data from a valid blueprint', () => {
    const trackData = buildTrackData(mockBlueprint);

    expect(trackData).toBeDefined();
    expect(trackData.rideName).toBe('Test Ride');
    expect(trackData.moodDescription).toBe('A test ride');
    expect(trackData.railColor).toBe('#ff0000');
    expect(trackData.glowColor).toBe('#00ff00');
    expect(trackData.skyColor1).toBe('#0000ff');
    expect(trackData.skyColor2).toBe(RIDE_CONFIG.DEFAULT_SKY_COLOR_2);
    expect(trackData.path.length).toBeGreaterThan(0);
  });

  it('should handle an empty track blueprint', () => {
    const emptyBlueprint: Blueprint = {
      ...mockBlueprint,
      track: [],
    };
    const trackData = buildTrackData(emptyBlueprint);
    expect(trackData.path.length).toBe(RIDE_CONFIG.INITIAL_TRACK_SEGMENT_LENGTH);
  });

  it('should handle missing optional parameters', () => {
    const partialBlueprint: any = {
        ...mockBlueprint,
        track: [
            { component: 'climb', length: 100 }, // No angle
            { component: 'turn', direction: 'right', angle: 45 }, // No radius
        ],
    };
    const trackData = buildTrackData(partialBlueprint);
    expect(trackData.path.length).toBeGreaterThan(0);
  });
});

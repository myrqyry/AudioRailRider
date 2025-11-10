import { describe, it, expect } from 'vitest';
import { KeyframeScheduler, KeyframeTrack } from './keyframeScheduler';

describe('KeyframeScheduler', () => {
  it('returns default for unknown track', () => {
    const scheduler = new KeyframeScheduler();
    // @ts-expect-no-error runtime null
    expect(scheduler.evaluate('missing')).toBeNull();
  });

  it('interpolates numeric keyframes', () => {
    const scheduler = new KeyframeScheduler();
    const track: KeyframeTrack<number> = {
      name: 'intensity',
      defaultValue: 0,
      keyframes: [
        { time: 0, value: 0 },
        { time: 10, value: 1 }
      ]
    };
    scheduler.addTrack(track);

    scheduler.setCurrentTime(0);
    expect(scheduler.evaluate<number>('intensity')).toBe(0);

    scheduler.setCurrentTime(5);
    const mid = scheduler.evaluate<number>('intensity');
    expect(mid).toBeGreaterThan(0.49);
    expect(mid).toBeLessThan(0.51);

    scheduler.setCurrentTime(10);
    expect(scheduler.evaluate<number>('intensity')).toBe(1);
  });

  it('handles object keyframes', () => {
    const scheduler = new KeyframeScheduler();
    const track: KeyframeTrack<{ x: number; y: number }> = {
      name: 'vec',
      defaultValue: { x: 0, y: 0 },
      keyframes: [
        { time: 0, value: { x: 0, y: 0 } },
        { time: 1, value: { x: 1, y: 1 } }
      ]
    };
    scheduler.addTrack(track);
    scheduler.setCurrentTime(0.5);
    const v = scheduler.evaluate<{ x: number; y: number }>('vec');
    expect(v).toBeTruthy();
    expect(v!.x).toBeGreaterThan(0.49);
    expect(v!.x).toBeLessThan(0.51);
  });
});

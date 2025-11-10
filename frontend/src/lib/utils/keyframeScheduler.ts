export type Easing = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';

const clamp = (value: number, min: number, max: number): number => {
  return value < min ? min : value > max ? max : value;
};

export interface Keyframe<T extends number | Record<string, number> = number | Record<string, number>> {
  time: number; // seconds
  value: T;
  easing?: Easing;
}

export interface KeyframeTrack<T extends number | Record<string, number> = number | Record<string, number>> {
  name: string;
  keyframes: Keyframe<T>[];
  defaultValue: T;
}

// Lightweight runtime scheduler for evaluating keyframed values over time.
// Used to drive deterministic, audio-synced ride parameters.
export class KeyframeScheduler {
  private tracks = new Map<string, KeyframeTrack>();
  private currentTime = 0;

  addTrack<T extends number | Record<string, number>>(track: KeyframeTrack<T>): void {
    const sorted = [...track.keyframes].sort((a, b) => a.time - b.time);
    this.tracks.set(track.name, { ...track, keyframes: sorted });
  }

  getTrack<T extends number | Record<string, number>>(name: string): KeyframeTrack<T> | undefined {
    return this.tracks.get(name) as KeyframeTrack<T> | undefined;
  }

  setCurrentTime(time: number): void {
    this.currentTime = Math.max(0, time);
  }

  evaluate<T extends number | Record<string, number>>(trackName: string): T | null {
    const track = this.tracks.get(trackName) as KeyframeTrack<T> | undefined;
    if (!track) return null;
    const { keyframes } = track;
    if (!keyframes.length) return track.defaultValue;

    const t = this.currentTime;

    if (t <= keyframes[0].time) return keyframes[0].value;
    const last = keyframes[keyframes.length - 1];
    if (t >= last.time) return last.value;

    let hi = keyframes.findIndex(kf => kf.time > t);
    let lo = hi - 1;
    const a = keyframes[lo];
    const b = keyframes[hi];
    const span = b.time - a.time || 1;
    const raw = (t - a.time) / span;
    const eased = this.applyEasing(clamp(raw, 0, 1), b.easing ?? 'linear');

    return this.interpolate(a.value, b.value, eased) as T;
  }

  private interpolate(a: number | Record<string, number>, b: number | Record<string, number>, t: number) {
    if (typeof a === 'number' && typeof b === 'number') {
      return a + (b - a) * t;
    }
    const out: Record<string, number> = {};
    const aObj = a as Record<string, number>;
    const bObj = b as Record<string, number>;
    for (const key of Object.keys(aObj)) {
      if (key in bObj) {
        out[key] = aObj[key] + (bObj[key] - aObj[key]) * t;
      }
    }
    return out;
  }

  private applyEasing(t: number, easing: Easing): number {
    switch (easing) {
      case 'easeIn':
        return t * t;
      case 'easeOut':
        return t * (2 - t);
      case 'easeInOut':
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      default:
        return t;
    }
  }
}

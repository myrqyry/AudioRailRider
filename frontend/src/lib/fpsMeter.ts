/**
 * A simple utility class for measuring frames per second (FPS).
 */
export class FPSMeter {
  private frames = 0;
  private lastTime = performance.now();
  private lastFps = 60;
  private sampleInterval: number;

  /**
   * Creates an instance of FPSMeter.
   * @param {number} [sampleInterval=1000] - The interval in milliseconds over which to sample and calculate FPS.
   */
  constructor(sampleInterval = 1000) {
    this.sampleInterval = sampleInterval;
  }

  /**
   * Records a frame tick. When the sample interval has elapsed, it calculates
   * and returns the new FPS value.
   * @returns {number | null} The calculated FPS, or null if the sample interval has not yet passed.
   */
  tick(): number | null {
    this.frames++;
    const now = performance.now();
    const elapsed = now - this.lastTime;
    if (elapsed >= this.sampleInterval) {
      const fps = (this.frames * 1000) / elapsed;
      this.lastFps = fps;
      this.frames = 0;
      this.lastTime = now;
      return fps;
    }
    return null;
  }

  /**
   * Gets the last calculated FPS value.
   * @returns {number} The last known FPS.
   */
  getLastFps(): number {
    return this.lastFps;
  }
}

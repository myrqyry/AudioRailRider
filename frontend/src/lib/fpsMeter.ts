export class FPSMeter {
  private frames = 0;
  private lastTime = performance.now();
  private lastFps = 60;
  private sampleInterval: number;

  constructor(sampleInterval = 1000) {
    this.sampleInterval = sampleInterval;
  }

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

  getLastFps(): number {
    return this.lastFps;
  }
}

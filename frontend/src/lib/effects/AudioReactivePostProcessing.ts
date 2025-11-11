// Optional postprocessing: disabled in this build to avoid runtime issues.
// This stub keeps the API surface for SceneManager without importing heavy deps.

export interface AudioData {
  bass: number;
  mid: number;
  treble: number;
  energy: number;
}

export class AudioReactivePostProcessing {
  constructor(_renderer: unknown, _scene: unknown, _camera: unknown) {}
  public update(_audioData: AudioData, _intensity = 1.0): void {}
  public render(_deltaTime: number): void {}
  public setSize(_width: number, _height: number): void {}
}

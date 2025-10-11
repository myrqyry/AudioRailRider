import { analyzeAudio } from './audioProcessor';
import { secondsToNumber } from 'shared/types';

// Mock AudioContext
const mockDecodeAudioData = jest.fn();
const mockClose = jest.fn();
global.AudioContext = jest.fn(() => ({
  decodeAudioData: mockDecodeAudioData,
  close: mockClose,
})) as any;

// Mock Meyda
(global.window as any).Meyda = {
  // tests intentionally mock Meyda; treat as `any` to avoid narrowing the type
  extract: (jest.fn() as unknown) as any,
} as any;

// Mock File.prototype.arrayBuffer
if (!File.prototype.arrayBuffer) {
  (File.prototype as any).arrayBuffer = function() {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as ArrayBuffer);
      };
      reader.readAsArrayBuffer(this);
    });
  };
}

describe('analyzeAudio', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.URL.createObjectURL = jest.fn(() => 'blob:url');
  });

  it('should analyze audio successfully', async () => {
    const mockAudioBuffer = {
      getChannelData: () => new Float32Array(1024),
      sampleRate: 44100,
      duration: 1.0,
    };
    mockDecodeAudioData.mockResolvedValue(mockAudioBuffer);
    ((global.window as any).Meyda.extract as jest.Mock).mockReturnValue({
      energy: 1,
      spectralCentroid: 1000,
      spectralFlux: 0.1,
      perceptualSharpness: 0.2,
      spectralRolloff: 4800,
      zcr: 0.05,
      loudness: { specific: new Array(24).fill(0.5) },
      chroma: new Array(12).fill(0.3),
      mfcc: new Array(13).fill(0.1),
    });

    const file = new File([''], 'test.mp3', { type: 'audio/mpeg' });
    const features = await analyzeAudio(file);

    expect(features).toBeDefined();
    expect(secondsToNumber(features.duration)).toBe(1.0);
    expect(features.bpm).toBeGreaterThan(0);
    expect(features.energy).toBeGreaterThan(0);
    expect(features.spectralCentroid).toBeGreaterThan(0);
    expect(features.spectralFlux).toBeGreaterThan(0);
    expect(features.frameAnalyses.length).toBeGreaterThan(0);
    expect(features.enhanced).toBeTruthy();
    expect(features.enhanced?.energy).toBeInstanceOf(Float32Array);
    expect(features.enhanced?.beats).toBeInstanceOf(Array);
    expect(features.enhanced?.structuralBoundaries).toBeInstanceOf(Array);

    expect(mockDecodeAudioData).toHaveBeenCalledTimes(1);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('should handle decoding errors and use fallback', async () => {
    mockDecodeAudioData.mockRejectedValue(new Error('decoding error'));

    const mockAudioElement = {
        addEventListener: jest.fn((event, cb) => {
            if (event === 'loadedmetadata') {
                setTimeout(() => {
                    (mockAudioElement as any).duration = 2.0;
                    cb();
                }, 100);
            }
        }),
        removeEventListener: jest.fn(),
        duration: NaN,
        src: '',
    };
    global.Audio = jest.fn(() => mockAudioElement) as any;

    const file = new File([''], 'test.mp3', { type: 'audio/mpeg' });
    const features = await analyzeAudio(file);

    expect(features).toBeDefined();
    expect(secondsToNumber(features.duration)).toBe(2.0);
    expect(features.bpm).toBe(120);
    expect(features.energy).toBe(0);
    expect(features.spectralCentroid).toBe(0);
    expect(features.spectralFlux).toBe(0);
    expect(features.enhanced).toBeNull();

    expect(mockDecodeAudioData).toHaveBeenCalledTimes(1);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if both decoding and fallback fail', async () => {
    mockDecodeAudioData.mockRejectedValue(new Error('decoding error'));

    const mockAudioElement = {
        addEventListener: jest.fn((event, cb) => {
            if (event === 'error') {
                setTimeout(() => {
                    cb(new Error('audio element error'));
                }, 100)
            }
        }),
        removeEventListener: jest.fn(),
        duration: NaN,
        src: '',
    };

    global.Audio = jest.fn(() => mockAudioElement) as any;

    const file = new File([''], 'test.mp3', { type: 'audio/mpeg' });
    await expect(analyzeAudio(file)).rejects.toThrow('Could not decode the audio file.');
  });
});

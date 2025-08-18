import { analyzeAudio } from './audioProcessor';

// Mock AudioContext
const mockDecodeAudioData = jest.fn();
const mockClose = jest.fn();
global.AudioContext = jest.fn(() => ({
  decodeAudioData: mockDecodeAudioData,
  close: mockClose,
})) as any;

// Mock Meyda
global.window.Meyda = {
  extract: jest.fn(),
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
    (global.window.Meyda.extract as jest.Mock).mockReturnValue({
      energy: 1,
      spectralCentroid: 1000,
      spectralFlux: 0.1,
    });

    const file = new File([''], 'test.mp3', { type: 'audio/mpeg' });
    const features = await analyzeAudio(file);

    expect(features).toBeDefined();
    expect(features.duration).toBe(1.0);
    expect(features.bpm).toBe(120); // The mock BPM is 120
    expect(features.energy).toBeCloseTo(0.1); // 1 / 10
    expect(features.spectralCentroid).toBe(1000);
    expect(features.spectralFlux).toBe(0.1);

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
    expect(features.duration).toBe(2.0);
    expect(features.bpm).toBe(120);
    expect(features.energy).toBe(0);
    expect(features.spectralCentroid).toBe(0);
    expect(features.spectralFlux).toBe(0);

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

import { useAppStore } from './store';
import { AppStatus } from 'shared/types';

describe('useAppStore', () => {
  it('should reset all relevant state on resetApp', () => {
    // Set some initial state
    useAppStore.setState({
      status: AppStatus.Error,
      error: { title: 'Test Error', message: 'An error occurred' },
      statusMessage: 'Error state',
      audioFile: new File([''], 'test.mp3'),
      blueprint: { rideName: 'Test Ride', moodDescription: 'A test ride', palette: ['#fff', '#fff', '#fff'], track: [] },
      audioFeatures: { duration: 120, bpm: 120, energy: 0.5, spectralCentroid: 1500, spectralFlux: 0.2, frameAnalyses: [] },
      trackData: { path: [], upVectors: [], railColor: '', glowColor: '', skyColor1: '', skyColor2: '', segmentDetails: [], rideName: '', moodDescription: '', frameAnalyses: [], audioFeatures: { duration: 0, bpm: 0, energy: 0, spectralCentroid: 0, spectralFlux: 0, frameAnalyses: [] } },
      workflowProgress: 50,
      skyboxUrl: 'http://example.com/skybox.jpg',
    });

    // Call the resetApp action
    useAppStore.getState().actions.resetApp();

    // Assert that all relevant state is reset
    const state = useAppStore.getState();
    expect(state.status).toBe(AppStatus.Idle);
    expect(state.error).toBeNull();
    expect(state.statusMessage).toBe('');
    expect(state.audioFile).toBeNull();
    expect(state.blueprint).toBeNull();
    expect(state.audioFeatures).toBeNull();
    expect(state.trackData).toBeNull();
    expect(state.workflowProgress).toBe(0);
    expect(state.skyboxUrl).toBeNull();
  });
});
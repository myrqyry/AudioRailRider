import React from 'react';
import { render } from '@testing-library/react';
import { act } from 'react';
import * as THREE from 'three';
import { useAppStore } from '../src/lib/store';
import ThreeCanvas from '../src/components/ThreeCanvas';
import { AppStatus, TrackData } from 'shared/types';

// Mock all the hooks used by ThreeCanvasCore to isolate it and test its orchestration role.
jest.mock('../src/components/three/hooks/useWebGLContextRecovery', () => ({ useWebGLContextRecovery: jest.fn(() => 0) }));
jest.mock('../src/components/three/hooks/useSceneManager', () => ({ useSceneManager: jest.fn(() => ({ current: { scene: {}, camera: {}, renderer: {} } })) }));
jest.mock('../src/components/three/hooks/useTrackComposer', () => ({ useTrackComposer: jest.fn() }));
jest.mock('../src/lib/useAudioAnalysis', () => ({ useAudioAnalysis: jest.fn(() => ({ audioRef: { current: null } })) }));
jest.mock('../src/components/three/hooks/useRide', () => ({ useRide: jest.fn(() => ({ rideCameraRef: { current: {} }, visualEffectsRef: { current: {} } })) }));
jest.mock('../src/components/three/hooks/useGlobalEventListeners', () => ({ useGlobalEventListeners: jest.fn() }));
jest.mock('../src/components/three/hooks/useAnimationLoop', () => ({ useAnimationLoop: jest.fn() }));

const mockOnRideFinish = jest.fn();
const mockSetTrackData = jest.fn();

describe('ThreeCanvas Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the store to a clean state before each test
    act(() => {
      useAppStore.setState({
        status: AppStatus.Idle,
        trackData: null,
        audioFile: null,
        blueprint: null,
        audioFeatures: null,
        skyboxUrl: null,
        actions: {
          handleRideFinish: mockOnRideFinish,
          setTrackData: mockSetTrackData,
        },
      }, true); // `true` replaces the entire state, ensuring no leakage between tests
    });
  });

  it('should render the container div', () => {
    const { container } = render(<ThreeCanvas />);
    const div = container.querySelector('.fixed.inset-0');
    expect(div).toBeInTheDocument();
  });

  it('should call useAnimationLoop with the correct state from the store', () => {
    const { useAnimationLoop } = require('../src/components/three/hooks/useAnimationLoop');
    const mockedUseAnimationLoop = useAnimationLoop as jest.Mock;

    const mockTrackData: TrackData = {
      path: [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -10)],
      frameAnalyses: [],
      metrics: { totalApproxLength: 10, perSegment: [], bounds: { span: [0, 0, 0], x: [0, 0], y: [0, 0], z: [0, 0] } },
    };

    // Simulate the app being in the "Riding" state with track data
    act(() => {
      useAppStore.setState({ status: AppStatus.Riding, trackData: mockTrackData });
    });

    render(<ThreeCanvas />);

    // Verify that the animation hook was called
    expect(mockedUseAnimationLoop).toHaveBeenCalled();

    // Verify that it was called with the correct state from the store
    const lastCallArgs = mockedUseAnimationLoop.mock.calls[mockedUseAnimationLoop.mock.calls.length - 1];
    expect(lastCallArgs[0]).toBe(AppStatus.Riding); // status
    expect(lastCallArgs[1]).toBe(mockTrackData); // trackData
  });

  it('should trigger onRideFinish action when the animation loop signals completion', () => {
    const { useAnimationLoop } = require('../src/components/three/hooks/useAnimationLoop');
    const mockedUseAnimationLoop = useAnimationLoop as jest.Mock;

    // Set up the store so the ride is in progress with necessary data
    act(() => {
      useAppStore.setState({
        status: AppStatus.Riding,
        trackData: {
          path: [new THREE.Vector3(0, 0, 0)],
          frameAnalyses: [],
          metrics: {} as any,
        },
      });
    });

    render(<ThreeCanvas />);

    // Verify that our mock hook was called
    expect(mockedUseAnimationLoop).toHaveBeenCalled();

    // Get the `onRideFinish` callback that ThreeCanvasCore passed to our mock hook
    const onRideFinishCallback = mockedUseAnimationLoop.mock.calls[mockedUseAnimationLoop.mock.calls.length - 1][6];

    // Simulate the animation loop calling this callback to signal the ride is over
    act(() => {
      onRideFinishCallback();
    });

    // The action in the store should have been called by the callback
    expect(mockOnRideFinish).toHaveBeenCalledTimes(1);
  });
});
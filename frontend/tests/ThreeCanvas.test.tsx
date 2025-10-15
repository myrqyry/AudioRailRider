import React from 'react';
import { render, act } from '@testing-library/react';
import ThreeCanvas from '../src/components/ThreeCanvas';
import { useAppStore } from '../src/lib/store';
import { AppStatus, TrackData } from 'shared/types';
import * as THREE from 'three';
import * as useAudioAnalysis from '../src/lib/useAudioAnalysis';

// Mock Three.js
jest.mock('three', () => {
    const originalThree = jest.requireActual('three');
    return {
        ...originalThree,
        WebGLRenderer: jest.fn().mockImplementation(() => ({
            domElement: document.createElement('div'),
            setSize: jest.fn(),
            setPixelRatio: jest.fn(),
            render: jest.fn(),
            dispose: jest.fn(),
            getContext: () => ({
                getExtension: jest.fn(),
            }),
        })),
        Scene: jest.fn().mockImplementation(() => ({
            add: jest.fn(),
            remove: jest.fn(),
            clear: jest.fn(),
        })),
        PerspectiveCamera: jest.fn().mockImplementation(() => ({
            position: { set: jest.fn() },
            add: jest.fn(),
            getObjectByName: jest.fn(),
        })),
        Clock: jest.fn().mockImplementation(() => ({
            getElapsedTime: jest.fn(() => 0),
        })),
    };
});


// Mock the store
const originalState = useAppStore.getState();
const mockOnRideFinish = jest.fn();

beforeEach(() => {
    // Reset the store before each test
    useAppStore.setState(originalState, true);
    // Mock the onRideFinish action
    useAppStore.setState({ actions: { ...originalState.actions, handleRideFinish: mockOnRideFinish } });
    mockOnRideFinish.mockClear();
});

afterEach(() => {
    jest.restoreAllMocks();
});


describe('ThreeCanvas', () => {
    it('calls onRideFinish when ride progress reaches 100%', () => {
        // 1. Set up the store for the riding state
        const mockTrackData: TrackData = {
            path: {
                points: [
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(0, 0, 100),
                ],
                getPoint: (t: number) => new THREE.Vector3(0, 0, t * 100),
                getPointAt: (t: number) => new THREE.Vector3(0, 0, t * 100),
                getLengths: () => [0, 100],
                getUtoTmapping: (u: number) => u,
            } as any,
            rideName: 'Test Ride',
            moodDescription: 'A test mood.',
            palette: ['#ff0000', '#00ff00', '#0000ff'],
            frameAnalyses: [],
        };

        act(() => {
            useAppStore.setState({
                status: AppStatus.Riding,
                trackData: mockTrackData,
                audioFile: new File([''], 'test.mp3'),
            });
        });

        // 2. Mock requestAnimationFrame to control the animation loop
        let frameCallback: FrameRequestCallback | null = null;
        jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
            frameCallback = cb;
            return 0;
        });

        // 3. Mock the useAudioAnalysis hook to provide a controlled audioRef
        const audioRef = { current: { currentTime: 0, duration: 100, ended: false } as HTMLAudioElement };
        jest.spyOn(useAudioAnalysis, 'useAudioAnalysis').mockReturnValue({ audioRef });


        // 4. Render the component
        render(<ThreeCanvas />);

        // 5. Simulate the ride progressing
        act(() => {
            if (frameCallback) {
                audioRef.current.currentTime = 100;
                frameCallback(0);
            }
        });

        // 6. Verify onRideFinish was called
        expect(mockOnRideFinish).toHaveBeenCalled();
    });
});
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


import { TrackComposer } from '../src/lib/procedural/TrackComposer';

jest.mock('../src/lib/procedural/TrackComposer');

describe('ThreeCanvas', () => {
    it('calls onRideFinish when ride progress reaches 100%', () => {
        const mockBlueprint = {
            rideName: 'Test Ride',
            moodDescription: 'A test mood.',
            palette: ['#ff0000', '#00ff00', '#0000ff'],
            track: [],
        };
        const mockAudioFeatures = {
            duration: 100,
            bpm: 120,
            energy: 0.5,
            spectralCentroid: 1500,
            spectralFlux: 0.5,
            frameAnalyses: [],
        };

        (TrackComposer.prototype.compose as jest.Mock).mockReturnValue({
            path: [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -100)],
            upVectors: [new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1, 0)],
            segmentDetails: [],
            segmentProgress: [],
            rideName: 'Test Ride',
            moodDescription: 'A test mood.',
            palette: ['#ff0000', '#00ff00', '#0000ff'],
            frameAnalyses: [],
            audioFeatures: mockAudioFeatures,
        });

        act(() => {
            useAppStore.setState({
                status: AppStatus.Riding,
                blueprint: mockBlueprint as any,
                audioFeatures: mockAudioFeatures as any,
                audioFile: new File([''], 'test.mp3'),
            });
        });

        let frameCallback: FrameRequestCallback | null = null;
        jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
            frameCallback = cb;
            return 0;
        });

        const audioRef = { current: { currentTime: 0, duration: 100, ended: false } as HTMLAudioElement };
        jest.spyOn(useAudioAnalysis, 'useAudioAnalysis').mockReturnValue({ audioRef });

        render(<ThreeCanvas />);

        act(() => {
            if (frameCallback) {
                audioRef.current.currentTime = 100;
                frameCallback(0);
            }
        });

        expect(mockOnRideFinish).toHaveBeenCalled();
    });
});
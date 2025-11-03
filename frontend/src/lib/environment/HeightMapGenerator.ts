import * as THREE from 'three';
import { FrameAnalysis } from 'shared/types';

export enum TerrainTheme {
    ComancheDesert,
    CyberpunkCanyon,
    OceanWaves,
    MountainPeaks,
}

interface TerrainThemeParams {
    baseFreqX: number;
    baseFreqY: number;
    baseAmplitude: number;
    highFreqMultiplier: number;
    bassFreqMultiplier: number;
    colorHue: number | 'energy';
    colorSaturation: number;
    colorLightnessFactor: number;
    timeMultiplier?: number;
}

const themes: Record<TerrainTheme, TerrainThemeParams> = {
    [TerrainTheme.ComancheDesert]: {
        baseFreqX: 0.05,
        baseFreqY: 0.05,
        baseAmplitude: 100,
        highFreqMultiplier: 60,
        bassFreqMultiplier: -40,
        colorHue: 0.1,
        colorSaturation: 0.5,
        colorLightnessFactor: 512,
    },
    [TerrainTheme.CyberpunkCanyon]: {
        baseFreqX: 0.1,
        baseFreqY: 0.1,
        baseAmplitude: 50,
        highFreqMultiplier: 120,
        bassFreqMultiplier: -80,
        colorHue: 'energy',
        colorSaturation: 0.8,
        colorLightnessFactor: 512,
    },
    [TerrainTheme.OceanWaves]: {
        baseFreqX: 0.02,
        baseFreqY: 0.02,
        baseAmplitude: 50,
        highFreqMultiplier: 0,
        bassFreqMultiplier: 100,
        colorHue: 0.6,
        colorSaturation: 0.9,
        colorLightnessFactor: 512,
        timeMultiplier: 5,
    },
    [TerrainTheme.MountainPeaks]: {
        baseFreqX: 0.01,
        baseFreqY: 0.01,
        baseAmplitude: 150,
        highFreqMultiplier: 200,
        bassFreqMultiplier: -20,
        colorHue: 0.7,
        colorSaturation: 0.3,
        colorLightnessFactor: 512,
    },
};

export class HeightMapGenerator {
    private heightMap: THREE.DataTexture;
    private colorMap: THREE.DataTexture;
    private readonly size: number;
    private readonly workingColor = new THREE.Color();
    private theme: TerrainTheme = TerrainTheme.ComancheDesert;

    constructor(size: number) {
        this.size = size;
        this.createMaps();
    }

    private createMaps() {
        const data = new Uint8Array(this.size * this.size * 4);
        this.heightMap = new THREE.DataTexture(data, this.size, this.size, THREE.RGBAFormat);
        this.colorMap = new THREE.DataTexture(data.slice(), this.size, this.size, THREE.RGBAFormat);
    }

    public setTheme(theme: TerrainTheme) {
        this.theme = theme;
    }

    public update(frame: FrameAnalysis | null, audioFeatures: Record<string, number>) {
        if (!frame) return;

        const heightData = this.heightMap.image.data;
        const colorData = this.colorMap.image.data;
        const bass = audioFeatures.bass ?? 0;
        const high = audioFeatures.high ?? 0;
        const energy = frame.energy;

        const themeParams = themes[this.theme];
        const time = Date.now() * 0.0001 * (themeParams.timeMultiplier || 1);

        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const offset = (y * this.size + x) * 4;

                const baseHeight = (Math.sin(x * themeParams.baseFreqX + time + bass) + Math.cos(y * themeParams.baseFreqY + time + bass)) * 0.5 + 0.5;
                const terrainVariation = (high * themeParams.highFreqMultiplier + bass * themeParams.bassFreqMultiplier);
                const finalHeight = THREE.MathUtils.clamp(baseHeight * themeParams.baseAmplitude + terrainVariation, 0, 255);

                const hue = themeParams.colorHue === 'energy' ? energy : themeParams.colorHue;
                this.workingColor.setHSL(hue, themeParams.colorSaturation, finalHeight / themeParams.colorLightnessFactor);

                heightData[offset] = finalHeight;
                heightData[offset + 1] = finalHeight;
                heightData[offset + 2] = finalHeight;
                heightData[offset + 3] = 255;

                colorData[offset] = this.workingColor.r * 255;
                colorData[offset + 1] = this.workingColor.g * 255;
                colorData[offset + 2] = this.workingColor.b * 255;
                colorData[offset + 3] = 255;
            }
        }

        this.heightMap.needsUpdate = true;
        this.colorMap.needsUpdate = true;
    }

    public getHeightMap(): THREE.DataTexture {
        return this.heightMap;
    }

    public getColorMap(): THREE.DataTexture {
        return this.colorMap;
    }

    public getSize(): number {
        return this.size;
    }

    public dispose() {
        this.heightMap.dispose();
        this.colorMap.dispose();
    }
}

import * as THREE from 'three';
import { FrameAnalysis } from 'shared/types';

export enum TerrainTheme {
    ComancheDesert,
    CyberpunkCanyon,
    OceanWaves,
    MountainPeaks,
}

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

        const time = Date.now() * 0.0001;

        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const offset = (y * this.size + x) * 4;

                let finalHeight = 0;

                switch (this.theme) {
                    case TerrainTheme.ComancheDesert:
                        const baseHeightDesert = (Math.sin(x * 0.05 + time) + Math.cos(y * 0.05 + time)) * 0.5 + 0.5;
                        const terrainVariationDesert = (high * 60 - bass * 40);
                        finalHeight = THREE.MathUtils.clamp(baseHeightDesert * 100 + terrainVariationDesert, 0, 255);

                        this.workingColor.setHSL(0.1, 0.5, finalHeight / 512);
                        break;

                    case TerrainTheme.CyberpunkCanyon:
                        const baseHeightCyberpunk = (Math.sin(x * 0.1 + time) + Math.cos(y * 0.1 + time)) * 0.5 + 0.5;
                        const terrainVariationCyberpunk = (high * 120 - bass * 80);
                        finalHeight = THREE.MathUtils.clamp(baseHeightCyberpunk * 50 + terrainVariationCyberpunk, 0, 255);

                        this.workingColor.setHSL(energy, 0.8, finalHeight / 512);
                        break;

                    case TerrainTheme.OceanWaves:
                        const baseHeightOcean = (Math.sin(x * 0.02 + time * 5 + bass) + Math.cos(y * 0.02 + time * 5 + bass)) * 0.5 + 0.5;
                        finalHeight = THREE.MathUtils.clamp(baseHeightOcean * 50 + bass * 100, 0, 255);

                        this.workingColor.setHSL(0.6, 0.9, finalHeight / 512);
                        break;

                    case TerrainTheme.MountainPeaks:
                        const baseHeightMountain = (Math.sin(x * 0.01 + time) + Math.cos(y * 0.01 + time)) * 0.5 + 0.5;
                        const terrainVariationMountain = (high * 200 - bass * 20);
                        finalHeight = THREE.MathUtils.clamp(baseHeightMountain * 150 + terrainVariationMountain, 0, 255);

                        this.workingColor.setHSL(0.7, 0.3, finalHeight / 512);
                        break;
                }

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

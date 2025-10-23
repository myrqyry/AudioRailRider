import * as THREE from 'three';
import { Blueprint, TrackSegment, TrackData, AudioFeatures } from 'shared/types';
import { TrackValidator } from './TrackValidator';

interface SegmentGenerator {
    generate(segment: TrackSegment, startPos: THREE.Vector3, startDir: THREE.Vector3, startUp: THREE.Vector3): { points: THREE.Vector3[], upVectors: THREE.Vector3[] };
}

class StraightGenerator implements SegmentGenerator {
    generate(segment: TrackSegment, startPos: THREE.Vector3, startDir: THREE.Vector3, startUp: THREE.Vector3) {
        const points: THREE.Vector3[] = [];
        const upVectors: THREE.Vector3[] = [];
        const resolution = 100;

        const length = Math.max(10, segment.length);
        const endPos = startPos.clone().add(startDir.clone().multiplyScalar(length));

        for (let i = 1; i <= resolution; i++) {
            const alpha = i / resolution;
            points.push(new THREE.Vector3().lerpVectors(startPos, endPos, alpha));
            upVectors.push(startUp.clone());
        }
        return { points, upVectors };
    }
}

class ClimbGenerator implements SegmentGenerator {
    generate(segment: TrackSegment, startPos: THREE.Vector3, startDir: THREE.Vector3, startUp: THREE.Vector3) {
        const points: THREE.Vector3[] = [];
        const upVectors: THREE.Vector3[] = [];
        const resolution = 100; // TODO: make this configurable

        const angle = THREE.MathUtils.degToRad(THREE.MathUtils.clamp(segment.angle ?? 15, -90, 90));
        const length = Math.max(10, typed.length) * 1.25;

        const dir_horizontal = startDir.clone();
        dir_horizontal.y = 0;
        dir_horizontal.normalize();

        const endPos = startPos.clone()
            .add(dir_horizontal.multiplyScalar(Math.cos(angle) * length))
            .add(new THREE.Vector3(0, Math.sin(angle) * length, 0));

        for(let i = 1; i <= resolution; i++) {
            const alpha = i / resolution;
            points.push(new THREE.Vector3().lerpVectors(startPos, endPos, alpha));
            upVectors.push(startUp.clone());
        }
        return { points, upVectors };
    }
}

class DropGenerator implements SegmentGenerator {
    generate(segment: TrackSegment, startPos: THREE.Vector3, startDir: THREE.Vector3, startUp: THREE.Vector3) {
        const points: THREE.Vector3[] = [];
        const upVectors: THREE.Vector3[] = [];
        const resolution = 100;

        const height = segment.height ?? -50;
        const length = Math.max(10, segment.length);

        const controlPoint = startPos.clone().add(startDir.clone().multiplyScalar(length * 0.5)).add(new THREE.Vector3(0, height * 0.25, 0));
        const endPos = startPos.clone().add(startDir.clone().multiplyScalar(length)).add(new THREE.Vector3(0, height, 0));

        const curve = new THREE.QuadraticBezierCurve3(startPos, controlPoint, endPos);
        const curvePoints = curve.getPoints(resolution);
        points.push(...curvePoints);
        for (let i = 0; i < curvePoints.length; i++) {
            upVectors.push(startUp.clone());
        }

        return { points, upVectors };
    }
}

class TurnGenerator implements SegmentGenerator {
    generate(segment: TrackSegment, startPos: THREE.Vector3, startDir: THREE.Vector3, startUp: THREE.Vector3) {
        const points: THREE.Vector3[] = [];
        const upVectors: THREE.Vector3[] = [];
        const resolution = 100;

        const radius = Math.max(10, segment.radius ?? 80);
        const angle = THREE.MathUtils.degToRad(THREE.MathUtils.clamp(segment.angle ?? 90, -360, 360));
        const direction = segment.direction === 'left' ? 1 : -1;
        const banking = THREE.MathUtils.degToRad(segment.banking ?? 0);

        const turnAxis = new THREE.Vector3(0, 1, 0);
        const centerOffset = startDir.clone().cross(turnAxis).multiplyScalar(radius * direction);
        const center = startPos.clone().add(centerOffset);
        const startVec = startPos.clone().sub(center);

        for (let i = 1; i <= resolution; i++) {
            const alpha = i / resolution;
            const newVec = startVec.clone().applyAxisAngle(turnAxis, angle * alpha * -direction);
            points.push(center.clone().add(newVec));
            upVectors.push(startUp.clone());
        }
        return { points, upVectors };
    }
}

class LoopGenerator implements SegmentGenerator {
    generate(segment: TrackSegment, startPos: THREE.Vector3, startDir: THREE.Vector3, startUp: THREE.Vector3) {
        const points: THREE.Vector3[] = [];
        const upVectors: THREE.Vector3[] = [];
        const resolution = 100;

        const radius = Math.max(10, segment.radius ?? 50);
        const forwardStretch = Math.max(radius * 1.5, (segment as any).length ? Math.max(20, Number((segment as any).length)) : radius * Math.PI * 0.75);

        const center = startPos.clone().add(startDir.clone().multiplyScalar(radius));

        for (let i = 1; i <= resolution; i++) {
            const alpha = i / resolution;
            const loopAngle = alpha * Math.PI * 2;
            const upOffset = startUp.clone().multiplyScalar(Math.sin(loopAngle) * radius);
            const forwardBase = startDir.clone().multiplyScalar(-Math.cos(loopAngle) * radius + alpha * forwardStretch);
            const point = center.clone().add(upOffset).add(forwardBase);
            points.push(point);
            upVectors.push(startUp.clone());
        }
        return { points, upVectors };
    }
}

class BarrelRollGenerator implements SegmentGenerator {
    generate(segment: TrackSegment, startPos: THREE.Vector3, startDir: THREE.Vector3, startUp: THREE.Vector3) {
        const points: THREE.Vector3[] = [];
        const upVectors: THREE.Vector3[] = [];
        const resolution = 100;

        const rotations = Math.max(1, Math.round(segment.rotations ?? 1));
        const length = Math.max(10, segment.length ?? 150);
        const endPos = startPos.clone().add(startDir.clone().multiplyScalar(length));

        for (let i = 1; i <= resolution; i++) {
            const alpha = i / resolution;
            const rollAngle = alpha * Math.PI * 2 * rotations;
            points.push(new THREE.Vector3().lerpVectors(startPos, endPos, alpha));
            upVectors.push(startUp.clone().applyAxisAngle(startDir, rollAngle));
        }
        return { points, upVectors };
    }
}


export class TrackComposer {
    private segmentGenerators: Map<string, SegmentGenerator>;
    private validator: TrackValidator;

    // TODO: Implement geometry caching for repeated segment types
    // private geometryCache: Map<string, THREE.BufferGeometry>;

    constructor() {
        this.segmentGenerators = new Map();
        this.validator = new TrackValidator();
        this.segmentGenerators.set('straight', new StraightGenerator());
        this.segmentGenerators.set('gentle_curve', new TurnGenerator());
        this.segmentGenerators.set('banking_turn', new TurnGenerator());
        this.segmentGenerators.set('gentle_hill', new ClimbGenerator());
        this.segmentGenerators.set('steep_climb', new ClimbGenerator());
        this.segmentGenerators.set('launch_hill', new ClimbGenerator());
        this.segmentGenerators.set('airtime_hill', new ClimbGenerator());
        this.segmentGenerators.set('bunny_hop', new ClimbGenerator());
        this.segmentGenerators.set('gentle_drop', new DropGenerator());
        this.segmentGenerators.set('steep_drop', new DropGenerator());
        this.segmentGenerators.set('vertical_drop', new DropGenerator());
        this.segmentGenerators.set('spiral_drop', new DropGenerator());
        this.segmentGenerators.set('curved_drop', new DropGenerator());
        this.segmentGenerators.set('vertical_loop', new LoopGenerator());
        this.segmentGenerators.set('horizontal_loop', new LoopGenerator());
        this.segmentGenerators.set('corkscrew', new BarrelRollGenerator());
        this.segmentGenerators.set('cobra_roll', new BarrelRollGenerator());
        this.segmentGenerators.set('barrel_roll', new BarrelRollGenerator());
        this.segmentGenerators.set('heartline_roll', new BarrelRollGenerator());
        this.segmentGenerators.set('double_down', new DropGenerator());
        this.segmentGenerators.set('double_up', new ClimbGenerator());
        this.segmentGenerators.set('s_curve', new TurnGenerator());
        this.segmentGenerators.set('helix', new TurnGenerator());
        this.segmentGenerators.set('twisted_element', new BarrelRollGenerator());
        this.segmentGenerators.set('launch_section', new StraightGenerator());
        this.segmentGenerators.set('brake_run', new StraightGenerator());
        this.segmentGenerators.set('speed_boost', new StraightGenerator());
        this.segmentGenerators.set('zero_g_roll', new BarrelRollGenerator());
        this.segmentGenerators.set('pretzel_knot', new LoopGenerator());
        this.segmentGenerators.set('flying_element', new StraightGenerator());
    }

    public compose(blueprint: Blueprint, audioFeatures: AudioFeatures): TrackData {
        const points: THREE.Vector3[] = [];
        const upVectors: THREE.Vector3[] = [];

        let currentPos = new THREE.Vector3(0, 5, 0);
        let currentDir = new THREE.Vector3(0, 0, -1);
        let currentUp = new THREE.Vector3(0, 1, 0);

        // Add an initial flat segment
        for (let i = 0; i < 10; i++) {
            points.push(currentPos.clone());
            upVectors.push(currentUp.clone());
            currentPos.add(currentDir);
        }

        let previousSegmentPoints: THREE.Vector3[] = [];
        const segmentSpans: Array<{ start: number; end: number }> = [];

        for (const segment of blueprint.track) {
            const generator = this.segmentGenerators.get(segment.component);
            if (generator) {
                const startPointIndex = points.length;
                let { points: newPoints, upVectors: newUpVectors } = generator.generate(segment, currentPos, currentDir, currentUp);

                if (previousSegmentPoints.length > 0) {
                    newPoints = this.blendSegments(previousSegmentPoints, newPoints);
                }

                points.push(...newPoints);
                upVectors.push(...newUpVectors);

                if (newPoints.length > 0) {
                    currentPos = newPoints[newPoints.length - 1];
                    if (newPoints.length > 1) {
                        currentDir.subVectors(newPoints[newPoints.length - 1], newPoints[newPoints.length - 2]).normalize();
                    }
                    currentUp = newUpVectors[newUpVectors.length - 1];
                    previousSegmentPoints = newPoints;
                }
                segmentSpans.push({ start: startPointIndex, end: points.length - 1 });
            }
        }

        this.validator.validate(points);

        const totalSpanDenominator = Math.max(points.length - 1, 1);
        const segmentProgress = segmentSpans.map((span) => {
            const progress = span.end / totalSpanDenominator;
            return Number.isFinite(progress) ? THREE.MathUtils.clamp(progress, 0, 1) : 0;
        });

        // This is a placeholder and will be expanded in subsequent steps
        // TODO: Implement Level of Detail (LOD) for complex track segments
        return {
            path: points,
            upVectors: upVectors,
            railColor: blueprint.palette[0] || '#ffffff',
            glowColor: blueprint.palette[1] || '#00ffff',
            skyColor1: blueprint.palette[2] || '#0d0a1f',
            skyColor2: '#000000',
            segmentDetails: blueprint.track,
            segmentProgress: segmentProgress,
            rideName: blueprint.rideName,
            moodDescription: blueprint.moodDescription,
            frameAnalyses: audioFeatures.frameAnalyses,
            audioFeatures: audioFeatures,
            events: [],
            synesthetic: null,
        };
    }

    private blendSegments(prevPoints: THREE.Vector3[], nextPoints: THREE.Vector3[]): THREE.Vector3[] {
        if (prevPoints.length === 0 || nextPoints.length === 0) {
            return nextPoints;
        }

        const blend_distance = 5;
        const last_point_prev = prevPoints[prevPoints.length - 1];
        const first_point_next = nextPoints[0];

        for (let i = 1; i <= blend_distance; i++) {
            if (i >= nextPoints.length) break;
            const t = i / (blend_distance + 1);
            nextPoints[i].lerpVectors(last_point_prev, nextPoints[i], t);
        }

        return nextPoints;
    }
}
export * from "./types";
export { HEX_DIRECTIONS, DEFAULT_HEX_SIZE, addAxial, neighbors, hexDistance, axialToPixel, hexPolygonPoints, makeBoard, withinBoard, axialKey, equalAxial, bounds, } from "./board";
export { DEFAULT_SYNERGY_THRESHOLDS, createSynergyCounts, tallySynergies, computeSynergies, effective, } from "./synergies";
export { step } from "./combat";
export type DemoVec2 = {
    x: number;
    y: number;
};
export interface DemoUnit {
    id: string;
    pos: DemoVec2;
    vel: DemoVec2;
    radius: number;
}
export interface DemoBounds {
    width: number;
    height: number;
}
export interface DemoWorld {
    t: number;
    units: DemoUnit[];
    bounds: DemoBounds;
}
export declare function makeDemoWorld(bounds: DemoBounds): DemoWorld;
export declare function stepDemoWorld(world: DemoWorld, dt: number): void;

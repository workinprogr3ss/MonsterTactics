import type { Axial, Cell, Point2D } from "./types";
export declare const HEX_DIRECTIONS: readonly Axial[];
export declare const DEFAULT_HEX_SIZE = 28;
export declare function addAxial(a: Axial, b: Axial): Axial;
export declare function neighbors(origin: Axial): Axial[];
export declare function hexDistance(a: Axial, b: Axial): number;
export declare function axialToPixel(a: Axial, size?: number): Point2D;
export declare function hexPolygonPoints(cx: number, cy: number, size: number): string;
export declare function makeBoard(radius: number): Cell[];
export declare function withinBoard(p: Axial, radius: number): boolean;
export declare function axialKey(p: Axial): string;
export declare function equalAxial(a: Axial, b: Axial): boolean;
export declare function bounds(points: Point2D[]): {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
};

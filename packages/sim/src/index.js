export * from "./types";
export { HEX_DIRECTIONS, DEFAULT_HEX_SIZE, addAxial, neighbors, hexDistance, axialToPixel, hexPolygonPoints, makeBoard, withinBoard, axialKey, equalAxial, bounds, } from "./board";
export { DEFAULT_SYNERGY_THRESHOLDS, createSynergyCounts, tallySynergies, computeSynergies, effective, } from "./synergies";
export { step } from "./combat";
export function makeDemoWorld(bounds) {
    return {
        t: 0,
        bounds,
        units: [
            {
                id: "emberon",
                pos: { x: bounds.width / 2, y: bounds.height / 2 },
                vel: { x: 80, y: 55 },
                radius: 16,
            },
        ],
    };
}
export function stepDemoWorld(world, dt) {
    for (const unit of world.units) {
        unit.pos.x += unit.vel.x * dt;
        unit.pos.y += unit.vel.y * dt;
        const r = unit.radius;
        if (unit.pos.x < r) {
            unit.pos.x = r;
            unit.vel.x *= -1;
        }
        else if (unit.pos.x > world.bounds.width - r) {
            unit.pos.x = world.bounds.width - r;
            unit.vel.x *= -1;
        }
        if (unit.pos.y < r) {
            unit.pos.y = r;
            unit.vel.y *= -1;
        }
        else if (unit.pos.y > world.bounds.height - r) {
            unit.pos.y = world.bounds.height - r;
            unit.vel.y *= -1;
        }
    }
    world.t += dt;
}

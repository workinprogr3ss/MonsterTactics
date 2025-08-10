// Headless demo world + step function (deterministic, UI-agnostic)
export type Vec2 = { x: number; y: number }

export interface Unit {
  id: string
  pos: Vec2
  vel: Vec2
  radius: number
}

export interface Bounds { width: number; height: number }

export interface World {
  t: number // seconds
  units: Unit[]
  bounds: Bounds
}

export function makeWorld(bounds: Bounds): World {
  return {
    t: 0,
    bounds,
    units: [
      {
        id: 'emberon',
        pos: { x: bounds.width / 2, y: bounds.height / 2 },
        vel: { x: 80, y: 55 }, // px/sec
        radius: 16,
      },
    ],
  }
}

export function step(world: World, dt: number): void {
  // Integrate simple physics and bounce off edges
  for (const u of world.units) {
    u.pos.x += u.vel.x * dt
    u.pos.y += u.vel.y * dt

    const r = u.radius
    if (u.pos.x < r) {
      u.pos.x = r
      u.vel.x *= -1
    } else if (u.pos.x > world.bounds.width - r) {
      u.pos.x = world.bounds.width - r
      u.vel.x *= -1
    }

    if (u.pos.y < r) {
      u.pos.y = r
      u.vel.y *= -1
    } else if (u.pos.y > world.bounds.height - r) {
      u.pos.y = world.bounds.height - r
      u.vel.y *= -1
    }
  }
  world.t += dt
}
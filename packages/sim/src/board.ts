import type { Axial, Cell, Point2D } from "./types"

export const HEX_DIRECTIONS: readonly Axial[] = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
] as const

export const DEFAULT_HEX_SIZE = 28

export function addAxial(a: Axial, b: Axial): Axial {
  return { q: a.q + b.q, r: a.r + b.r }
}

export function neighbors(origin: Axial): Axial[] {
  return HEX_DIRECTIONS.map((dir) => addAxial(origin, dir))
}

export function hexDistance(a: Axial, b: Axial): number {
  const ax = a.q
  const az = a.r
  const ay = -ax - az
  const bx = b.q
  const bz = b.r
  const by = -bx - bz
  return Math.max(Math.abs(ax - bx), Math.abs(ay - by), Math.abs(az - bz))
}

export function axialToPixel(a: Axial, size: number = DEFAULT_HEX_SIZE): Point2D {
  const x = size * (Math.sqrt(3) * a.q + (Math.sqrt(3) / 2) * a.r)
  const y = size * ((3 / 2) * a.r)
  return { x, y }
}

export function hexPolygonPoints(cx: number, cy: number, size: number): string {
  const pts: string[] = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 30)
    const x = cx + size * Math.cos(angle)
    const y = cy + size * Math.sin(angle)
    pts.push(`${x},${y}`)
  }
  return pts.join(" ")
}

export function makeBoard(radius: number): Cell[] {
  const cells: Cell[] = []
  for (let q = -radius; q <= radius; q++) {
    const r1 = Math.max(-radius, -q - radius)
    const r2 = Math.min(radius, -q + radius)
    for (let r = r1; r <= r2; r++) {
      cells.push({ pos: { q, r }, walkable: true })
    }
  }
  return cells
}

export function withinBoard(p: Axial, radius: number): boolean {
  return hexDistance(p, { q: 0, r: 0 }) <= radius
}

export function axialKey(p: Axial): string {
  return `${p.q},${p.r}`
}

export function equalAxial(a: Axial, b: Axial): boolean {
  return a.q === b.q && a.r === b.r
}

export function bounds(points: Point2D[]) {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const p of points) {
    if (p.x < minX) minX = p.x
    if (p.y < minY) minY = p.y
    if (p.x > maxX) maxX = p.x
    if (p.y > maxY) maxY = p.y
  }
  return { minX, minY, maxX, maxY }
}

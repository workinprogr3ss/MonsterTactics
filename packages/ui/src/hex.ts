// Minimal axial hex helpers for later (rendering grid background)
// Axial q,r with flat-top hexes.
export type Axial = { q: number; r: number }

export function axialToPixel(a: Axial, size: number): { x: number; y: number } {
  const x = size * (3 / 2) * a.q
  const y = size * (Math.sqrt(3) / 2 * a.q + Math.sqrt(3) * a.r)
  return { x, y }
}
import type { SynergyThresholds } from "@monstertactics/sim"

export const BOARD = {
  cols: 7,
  rows: 6,
  hexSize: 42,
  radius: 4,
} as const

export const DEFAULT_SEED = 1337

export const SYNERGY_THRESHOLDS: SynergyThresholds = {
  Brawler: 2,
  Ranger: 2,
  Mystic: 2,
}

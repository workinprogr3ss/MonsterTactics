import { describe, expect, test } from "vitest"

import { BOARD, DEFAULT_SEED, SYNERGY_THRESHOLDS, UNIT_CATALOG } from "@monstertactics/content"

import { SimAdapter, type SeedSpec } from "./sim-adapter"

const PLAYER_SPAWN: SeedSpec[] = [{ id: "SQUIRE", team: "PLAYER", q: 0, r: 0 }]
const ENEMY_SPAWN: SeedSpec[] = [{ id: "SQUIRE", team: "ENEMY", q: 1, r: 0 }]

describe("SimAdapter", () => {
  test("produces deterministic outcomes for the same seed", () => {
    const first = new SimAdapter({
      seed: DEFAULT_SEED,
      thresholds: SYNERGY_THRESHOLDS,
      board: BOARD,
      catalog: UNIT_CATALOG,
      tickMs: 50,
    })
    first.spawnTeams(PLAYER_SPAWN, ENEMY_SPAWN)
    first.start()

    for (let i = 0; i < 200; i += 1) {
      first.step(50)
    }

    const snapshot = JSON.stringify(first.state)

    const second = new SimAdapter({
      seed: DEFAULT_SEED,
      thresholds: SYNERGY_THRESHOLDS,
      board: BOARD,
      catalog: UNIT_CATALOG,
      tickMs: 50,
    })
    second.spawnTeams(PLAYER_SPAWN, ENEMY_SPAWN)
    second.start()

    for (let i = 0; i < 200; i += 1) {
      second.step(50)
    }

    expect(JSON.stringify(second.state)).toBe(snapshot)
  })

  test("computes synergies from spawned units", () => {
    const adapter = new SimAdapter({
      seed: 1,
      thresholds: SYNERGY_THRESHOLDS,
      board: BOARD,
      catalog: UNIT_CATALOG,
    })

    adapter.spawnTeams(
      [
        { id: "SQUIRE", team: "PLAYER", q: 0, r: 0 },
        { id: "SQUIRE", team: "PLAYER", q: 0, r: 1 },
      ],
      [],
    )

    expect(adapter.state.synergies.PLAYER.Brawler).toBe(true)
  })
})

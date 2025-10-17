/* @vitest-environment jsdom */

import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import React from "react"
import { act } from "react-dom/test-utils"
import { createRoot } from "react-dom/client"

import { BOARD, DEFAULT_SEED, SYNERGY_THRESHOLDS, UNIT_CATALOG } from "@monstertactics/content"

import { SimAdapter } from "./adapters/sim-adapter"
import { useBattleLoop } from "./useBattleLoop"

const TICK_MS = 50

function HookHarness({ adapter }: { adapter: SimAdapter }) {
  useBattleLoop(adapter, { tickMs: TICK_MS })
  return null
}

describe("useBattleLoop", () => {
  const callbacks: FrameRequestCallback[] = []
  const cancelSpy = vi.fn()

  beforeEach(() => {
    callbacks.length = 0
    cancelSpy.mockReset()
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      callbacks.push(cb)
      return callbacks.length
    })
    vi.stubGlobal("cancelAnimationFrame", cancelSpy)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test("advances the adapter on a fixed cadence", () => {
    const adapter = new SimAdapter({
      seed: DEFAULT_SEED,
      thresholds: SYNERGY_THRESHOLDS,
      board: BOARD,
      catalog: UNIT_CATALOG,
      tickMs: TICK_MS,
    })

    adapter.spawnTeams(
      [{ id: "SQUIRE", team: "PLAYER", q: 0, r: 0 }],
      [{ id: "SQUIRE", team: "ENEMY", q: 1, r: 0 }],
    )
    adapter.start()

    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)

    act(() => {
      root.render(<HookHarness adapter={adapter} />)
    })

    expect(callbacks.length).toBe(1)

    act(() => {
      const first = callbacks.shift()
      if (first) first(0)
    })

    expect(callbacks.length).toBe(1)
    expect(adapter.state.tick).toBe(0)

    act(() => {
      const next = callbacks.shift()
      if (next) next(TICK_MS)
    })

    expect(adapter.state.tick).toBeGreaterThanOrEqual(1)

    act(() => {
      adapter.reset(DEFAULT_SEED)
    })

    expect(cancelSpy).toHaveBeenCalled()

    act(() => {
      root.unmount()
    })

    document.body.removeChild(container)
  })
})

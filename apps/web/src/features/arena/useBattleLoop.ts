import { useEffect, useRef, useState } from "react"

import type { SimAdapter } from "./adapters/sim-adapter"

export interface LoopOptions {
  tickMs?: number
  autoStart?: boolean
}

export function useBattleLoop(adapter: SimAdapter, opts: LoopOptions = {}) {
  const [view, setView] = useState(adapter.state)
  const rafId = useRef<number | null>(null)
  const lastTs = useRef<number | null>(null)
  const acc = useRef(0)
  const tickMs = opts.tickMs ?? 50

  useEffect(() => adapter.subscribe(setView), [adapter])

  useEffect(() => {
    const shouldRun = opts.autoStart || view.phase === "running"
    if (!shouldRun) {
      if (rafId.current != null) {
        cancelAnimationFrame(rafId.current)
      }
      rafId.current = null
      lastTs.current = null
      acc.current = 0
      return
    }

    let active = true
    const frame = (ts: number) => {
      if (!active) return
      if (lastTs.current == null) lastTs.current = ts
      const delta = ts - lastTs.current
      lastTs.current = ts
      acc.current += delta

      while (acc.current >= tickMs) {
        adapter.step(tickMs)
        acc.current -= tickMs
      }

      rafId.current = requestAnimationFrame(frame)
    }

    rafId.current = requestAnimationFrame(frame)
    return () => {
      active = false
      if (rafId.current != null) cancelAnimationFrame(rafId.current)
      rafId.current = null
      lastTs.current = null
      acc.current = 0
    }
  }, [adapter, tickMs, opts.autoStart, view.phase])

  return view
}

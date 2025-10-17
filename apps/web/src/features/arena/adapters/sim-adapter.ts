import { computeSynergies, type SynergyActive, type SynergyThresholds, step as simStep } from "@monstertactics/sim"
import type { Team, Unit, UnitKind } from "@monstertactics/sim"

import { createRng } from "../rng/seeded"

export type BattlePhase = "idle" | "spawning" | "running" | "victory" | "defeat" | "draw" | "ended"

export interface BattleStateView {
  tick: number
  timeMs: number
  phase: BattlePhase
  units: Unit[]
  synergies: SynergyActive
  winner?: Team | "DRAW"
  seed: number
}

export interface BoardConfig {
  cols: number
  rows: number
  hexSize: number
  radius: number
}

export type UnitId = string

export interface SeedSpec {
  id: UnitId
  team: Team
  q: number
  r: number
}

export interface AdapterConfig {
  seed: number
  thresholds: SynergyThresholds
  board: BoardConfig
  catalog: Record<UnitId, UnitKind>
  tickMs?: number
}

type Listener = (state: BattleStateView) => void

export class SimAdapter {
  private cfg: AdapterConfig
  private listeners = new Set<Listener>()
  private rng: () => number
  private _state: BattleStateView

  constructor(cfg: AdapterConfig) {
    this.cfg = { ...cfg, tickMs: cfg.tickMs ?? 50 }
    this.rng = createRng(this.cfg.seed)
    this._state = {
      tick: 0,
      timeMs: 0,
      phase: "idle",
      units: [],
      synergies: computeSynergies([], this.cfg.thresholds),
      seed: this.cfg.seed,
    }
  }

  get state(): BattleStateView {
    return this._state
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn)
    fn(this._state)
    return () => {
      this.listeners.delete(fn)
    }
  }

  spawnTeams(player: SeedSpec[], enemy: SeedSpec[]): void {
    if (this._state.phase !== "idle" && this._state.phase !== "ended") return

    const created: Unit[] = []
    for (const seed of [...player, ...enemy]) {
      const kind = this.cfg.catalog[seed.id]
      if (!kind) continue
      created.push({
        id: this.nextUnitId(seed.team, seed.id),
        kind,
        team: seed.team,
        pos: { q: seed.q, r: seed.r },
        hp: kind.maxHP,
        cd: 0,
      })
    }

    this._state = {
      ...this._state,
      units: created,
      phase: "spawning",
      tick: 0,
      timeMs: 0,
      synergies: computeSynergies(created, this.cfg.thresholds),
      winner: undefined,
    }
    this.emit()
  }

  start(): void {
    if (this._state.units.length === 0) return
    this._state = {
      ...this._state,
      phase: "running",
    }
    this.emit()
  }

  reset(seed?: number): void {
    if (typeof seed === "number") {
      this.cfg.seed = seed
      this.rng = createRng(seed)
    } else {
      this.rng = createRng(this.cfg.seed)
    }

    this._state = {
      tick: 0,
      timeMs: 0,
      phase: "idle",
      units: [],
      synergies: computeSynergies([], this.cfg.thresholds),
      winner: undefined,
      seed: this.cfg.seed,
    }
    this.emit()
  }

  step(dtMs: number): void {
    if (this._state.phase !== "running") return

    const battleState = {
      world: { radius: this.cfg.board.radius },
      units: this._state.units,
    }

    const result = simStep(battleState, { synergies: this._state.synergies })
    const units = result.units

    const playerAlive = units.some((unit) => unit.team === "PLAYER")
    const enemyAlive = units.some((unit) => unit.team === "ENEMY")

    let phase: BattlePhase = "running"
    let winner: BattleStateView["winner"] = undefined

    if (!playerAlive && !enemyAlive) {
      phase = "draw"
      winner = "DRAW"
    } else if (playerAlive && !enemyAlive) {
      phase = "victory"
      winner = "PLAYER"
    } else if (!playerAlive && enemyAlive) {
      phase = "defeat"
      winner = "ENEMY"
    }

    this._state = {
      ...this._state,
      units,
      tick: this._state.tick + 1,
      timeMs: this._state.timeMs + dtMs,
      phase,
      winner,
    }
    this.recomputeSynergies()
    this.emit()
  }

  private recomputeSynergies(): void {
    this._state = {
      ...this._state,
      synergies: computeSynergies(this._state.units, this.cfg.thresholds),
    }
  }

  private nextUnitId(team: Team, unitId: UnitId): string {
    const rand = this.rng().toString(36).slice(2, 8)
    return `${team}-${unitId}-${rand}`
  }

  private emit(): void {
    for (const listener of this.listeners) {
      listener(this._state)
    }
  }
}

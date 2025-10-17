import React, { useMemo } from "react"

import { axialToPixel, hexPolygonPoints, makeBoard } from "@monstertactics/sim"
import type { Trait, Unit } from "@monstertactics/sim"

import { BOARD, DEFAULT_SEED, SYNERGY_THRESHOLDS, UNIT_CATALOG } from "@monstertactics/content"

import { SimAdapter, type SeedSpec } from "./adapters/sim-adapter"
import { useBattleLoop } from "./useBattleLoop"

const adapter = new SimAdapter({
  seed: DEFAULT_SEED,
  thresholds: SYNERGY_THRESHOLDS,
  board: BOARD,
  catalog: UNIT_CATALOG,
  tickMs: 50,
})

const PLAYER_SEEDS: SeedSpec[] = [
  { id: "SQUIRE", team: "PLAYER", q: 1, r: 1 },
  { id: "ARCHER", team: "PLAYER", q: 2, r: 1 },
]

const ENEMY_SEEDS: SeedSpec[] = [
  { id: "MYSTIC", team: "ENEMY", q: -1, r: -1 },
  { id: "SQUIRE", team: "ENEMY", q: -2, r: -1 },
]

const TRAITS: Trait[] = ["Brawler", "Ranger", "Mystic"]

const HEX_SIZE = BOARD.hexSize

export default function MonsterTacticsPrototype(): JSX.Element {
  const state = useBattleLoop(adapter, { autoStart: false, tickMs: 50 })
  const board = useMemo(() => makeBoard(BOARD.radius), [])

  const handleStart = () => {
    if (adapter.state.phase === "running") return
    if (adapter.state.phase !== "idle") {
      adapter.reset(adapter.state.seed)
    }
    adapter.spawnTeams(PLAYER_SEEDS, ENEMY_SEEDS)
    adapter.start()
  }

  const handleReset = () => {
    adapter.reset(DEFAULT_SEED)
  }

  return (
    <div className="flex flex-col gap-6 p-6 text-zinc-100">
      <header className="flex flex-wrap items-center gap-4">
        <button
          className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium disabled:opacity-50"
          onClick={handleStart}
          disabled={state.phase === "running"}
        >
          Start Battle
        </button>
        <button className="rounded bg-zinc-700 px-4 py-2 text-sm font-medium" onClick={handleReset}>
          Reset
        </button>
        <div className="flex gap-4 text-sm">
          <span>Tick: {state.tick}</span>
          <span>Time: {state.timeMs} ms</span>
          <span>Phase: {state.phase}</span>
          <span>Seed: {state.seed}</span>
        </div>
        {state.winner ? <span className="text-sm font-semibold">Winner: {state.winner}</span> : null}
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <BoardView units={state.units} board={board} />
        <div className="space-y-4">
          <SynergyPanel title="Player Synergies" traits={TRAITS} active={state.synergies.PLAYER} />
          <SynergyPanel title="Enemy Synergies" traits={TRAITS} active={state.synergies.ENEMY} />
          <UnitList units={state.units} />
        </div>
      </section>
    </div>
  )
}

interface BoardViewProps {
  units: Unit[]
  board: ReturnType<typeof makeBoard>
}

function BoardView({ units, board }: BoardViewProps) {
  const width = 600
  const height = 400

  const unitPositions = new Map<string, Unit>()
  for (const unit of units) {
    unitPositions.set(`${unit.pos.q},${unit.pos.r}`, unit)
  }

  return (
    <svg viewBox={`-320 -220 640 440`} width={width} height={height} className="rounded bg-zinc-900">
      {board.map((cell) => {
        const key = `${cell.pos.q},${cell.pos.r}`
        const center = axialToPixel(cell.pos, HEX_SIZE)
        const occupant = unitPositions.get(key)

        return (
          <g key={key} transform={`translate(${center.x}, ${center.y})`}>
            <polygon
              points={hexPolygonPoints(0, 0, HEX_SIZE - 2)}
              fill="transparent"
              stroke="#3f3f46"
              strokeWidth={1}
            />
            {occupant ? (
              <text
                x={0}
                y={4}
                textAnchor="middle"
                fontSize={12}
                fill={occupant.team === "PLAYER" ? "#34d399" : "#f87171"}
              >
                {occupant.kind.name}
              </text>
            ) : null}
          </g>
        )
      })}
    </svg>
  )
}

interface SynergyPanelProps {
  title: string
  traits: Trait[]
  active: Partial<Record<Trait, boolean>>
}

function SynergyPanel({ title, traits, active }: SynergyPanelProps) {
  return (
    <div className="rounded border border-zinc-700 p-4">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-400">{title}</h2>
      <ul className="space-y-1 text-sm">
        {traits.map((trait) => (
          <li key={trait} className="flex items-center justify-between">
            <span>{trait}</span>
            <span className={active[trait] ? "text-emerald-400" : "text-zinc-500"}>
              {active[trait] ? "Active" : "Inactive"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

interface UnitListProps {
  units: Unit[]
}

function UnitList({ units }: UnitListProps) {
  if (units.length === 0) {
    return (
      <div className="rounded border border-zinc-700 p-4 text-sm text-zinc-400">
        No units on the board. Press Start to spawn teams.
      </div>
    )
  }

  return (
    <div className="rounded border border-zinc-700 p-4">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-400">Units</h2>
      <ul className="space-y-1 text-sm">
        {units.map((unit) => (
          <li key={unit.id} className="flex items-center justify-between">
            <span>
              {unit.kind.name} ({unit.team})
            </span>
            <span className="text-zinc-400">
              HP {unit.hp} • CD {unit.cd}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

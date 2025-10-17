import { axialKey, hexDistance, neighbors, withinBoard } from "./board"
import { computeSynergies, effective } from "./synergies"
import type { BattleState, SynergyActive, Unit } from "./types"

export interface StepOptions {
  synergies?: SynergyActive
}

export function step(state: BattleState, options: StepOptions = {}): BattleState {
  const alive = state.units.filter((unit) => unit.hp > 0)
  alive.sort((a, b) => a.id.localeCompare(b.id))

  const activeSynergies = options.synergies ?? computeSynergies(alive)
  const radius = state.world.radius

  const nextUnits: Unit[] = alive.map((unit) => ({
    ...unit,
    pos: { ...unit.pos },
  }))

  const occupied = new Set(nextUnits.map((unit) => axialKey(unit.pos)))

  for (const unit of nextUnits) {
    if (unit.hp <= 0) continue

    const eff = effective(unit, activeSynergies)
    unit.cd = Math.max(0, unit.cd - 1)

    const enemies = nextUnits.filter((candidate) => candidate.team !== unit.team && candidate.hp > 0)
    if (enemies.length === 0) continue

    enemies.sort((a, b) => hexDistance(unit.pos, a.pos) - hexDistance(unit.pos, b.pos))
    const target = enemies[0]
    const distance = hexDistance(unit.pos, target.pos)

    if (distance <= eff.range) {
      if (unit.cd === 0) {
        target.hp = Math.max(0, target.hp - eff.atk)
        unit.cd = eff.attackCooldown
      }
      continue
    }

    const options = neighbors(unit.pos)
      .filter((pos) => withinBoard(pos, radius))
      .filter((pos) => !occupied.has(axialKey(pos)))

    if (options.length === 0) continue

    options.sort((a, b) => hexDistance(a, target.pos) - hexDistance(b, target.pos))
    const best = options[0]
    occupied.delete(axialKey(unit.pos))
    unit.pos = { ...best }
    occupied.add(axialKey(unit.pos))
  }

  return {
    world: state.world,
    units: nextUnits,
  }
}

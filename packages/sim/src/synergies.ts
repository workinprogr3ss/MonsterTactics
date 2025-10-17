import type {
  SynergyActive,
  SynergyCounts,
  SynergyThresholds,
  Team,
  Trait,
  Unit,
  UnitKind,
} from "./types"

export const DEFAULT_SYNERGY_THRESHOLDS: SynergyThresholds = {
  Brawler: 2,
  Ranger: 2,
  Mystic: 2,
}

export const ALL_TEAMS: readonly Team[] = ["PLAYER", "ENEMY"] as const
export const ALL_TRAITS: readonly Trait[] = ["Brawler", "Ranger", "Mystic"] as const

export function createSynergyCounts(): SynergyCounts {
  return {
    PLAYER: { Brawler: 0, Ranger: 0, Mystic: 0 },
    ENEMY: { Brawler: 0, Ranger: 0, Mystic: 0 },
  }
}

export function tallySynergies(units: Unit[]): SynergyCounts {
  const counts = createSynergyCounts()
  for (const unit of units) {
    counts[unit.team][unit.kind.trait] += 1
  }
  return counts
}

export function computeSynergies(
  units: Unit[],
  thresholds: SynergyThresholds = DEFAULT_SYNERGY_THRESHOLDS,
): SynergyActive {
  const counts = tallySynergies(units)
  const active: SynergyActive = {
    PLAYER: {} as Partial<Record<Trait, boolean>>,
    ENEMY: {} as Partial<Record<Trait, boolean>>,
  }

  for (const team of ALL_TEAMS) {
    for (const trait of ALL_TRAITS) {
      active[team][trait] = counts[team][trait] >= thresholds[trait]
    }
  }

  return active
}

export function effective(unit: Unit, synergies: SynergyActive): UnitKind {
  const base = unit.kind
  const active = synergies[unit.team]
  let maxHP = base.maxHP
  let atk = base.atk
  let cd = base.attackCooldown

  if (active.Brawler) maxHP = Math.round(maxHP * 1.1)
  if (active.Ranger) atk = Math.round(atk * 1.1)
  if (active.Mystic) cd = Math.max(3, cd - 1)

  return {
    ...base,
    maxHP,
    atk,
    attackCooldown: cd,
  }
}

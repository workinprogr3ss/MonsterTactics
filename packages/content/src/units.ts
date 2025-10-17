import type { UnitKind } from "@monstertactics/sim"

export type UnitId = "SQUIRE" | "ARCHER" | "MYSTIC"

export const UNIT_CATALOG: Record<UnitId, UnitKind> = {
  SQUIRE: {
    id: "SQUIRE",
    name: "Squire",
    trait: "Brawler",
    maxHP: 120,
    atk: 18,
    range: 1,
    moveSpeed: 1,
    attackCooldown: 6,
  },
  ARCHER: {
    id: "ARCHER",
    name: "Archer",
    trait: "Ranger",
    maxHP: 80,
    atk: 22,
    range: 3,
    moveSpeed: 1,
    attackCooldown: 6,
  },
  MYSTIC: {
    id: "MYSTIC",
    name: "Mystic",
    trait: "Mystic",
    maxHP: 90,
    atk: 16,
    range: 2,
    moveSpeed: 1,
    attackCooldown: 5,
  },
}

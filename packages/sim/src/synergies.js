export const DEFAULT_SYNERGY_THRESHOLDS = {
    Brawler: 2,
    Ranger: 2,
    Mystic: 2,
};
export const ALL_TEAMS = ["PLAYER", "ENEMY"];
export const ALL_TRAITS = ["Brawler", "Ranger", "Mystic"];
export function createSynergyCounts() {
    return {
        PLAYER: { Brawler: 0, Ranger: 0, Mystic: 0 },
        ENEMY: { Brawler: 0, Ranger: 0, Mystic: 0 },
    };
}
export function tallySynergies(units) {
    const counts = createSynergyCounts();
    for (const unit of units) {
        counts[unit.team][unit.kind.trait] += 1;
    }
    return counts;
}
export function computeSynergies(units, thresholds = DEFAULT_SYNERGY_THRESHOLDS) {
    const counts = tallySynergies(units);
    const active = {
        PLAYER: {},
        ENEMY: {},
    };
    for (const team of ALL_TEAMS) {
        for (const trait of ALL_TRAITS) {
            active[team][trait] = counts[team][trait] >= thresholds[trait];
        }
    }
    return active;
}
export function effective(unit, synergies) {
    const base = unit.kind;
    const active = synergies[unit.team];
    let maxHP = base.maxHP;
    let atk = base.atk;
    let cd = base.attackCooldown;
    if (active.Brawler)
        maxHP = Math.round(maxHP * 1.1);
    if (active.Ranger)
        atk = Math.round(atk * 1.1);
    if (active.Mystic)
        cd = Math.max(3, cd - 1);
    return {
        ...base,
        maxHP,
        atk,
        attackCooldown: cd,
    };
}

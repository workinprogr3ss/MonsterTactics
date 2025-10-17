export type Team = "PLAYER" | "ENEMY";
export type Trait = "Brawler" | "Ranger" | "Mystic";
export type Axial = {
    q: number;
    r: number;
};
export type Point2D = {
    x: number;
    y: number;
};
export interface UnitKind {
    id: string;
    name: string;
    trait: Trait;
    maxHP: number;
    atk: number;
    range: number;
    moveSpeed: number;
    attackCooldown: number;
}
export interface Unit {
    id: string;
    kind: UnitKind;
    team: Team;
    pos: Axial;
    hp: number;
    cd: number;
}
export interface Cell {
    pos: Axial;
    walkable: boolean;
}
export interface BattleWorld {
    radius: number;
}
export interface BattleState {
    world: BattleWorld;
    units: Unit[];
}
export type SynergyCounts = Record<Team, Record<Trait, number>>;
export type SynergyActive = Record<Team, Partial<Record<Trait, boolean>>>;
export type SynergyThresholds = Record<Trait, number>;
export interface RandomSource {
    (): number;
}
export type IdFactory = () => string;

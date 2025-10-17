import type { SynergyActive, SynergyCounts, SynergyThresholds, Team, Trait, Unit, UnitKind } from "./types";
export declare const DEFAULT_SYNERGY_THRESHOLDS: SynergyThresholds;
export declare const ALL_TEAMS: readonly Team[];
export declare const ALL_TRAITS: readonly Trait[];
export declare function createSynergyCounts(): SynergyCounts;
export declare function tallySynergies(units: Unit[]): SynergyCounts;
export declare function computeSynergies(units: Unit[], thresholds?: SynergyThresholds): SynergyActive;
export declare function effective(unit: Unit, synergies: SynergyActive): UnitKind;

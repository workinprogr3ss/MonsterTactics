import type { BattleState, SynergyActive } from "./types";
export interface StepOptions {
    synergies?: SynergyActive;
}
export declare function step(state: BattleState, options?: StepOptions): BattleState;

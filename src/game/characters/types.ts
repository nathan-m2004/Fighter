import Fighter from "./Fighter";

export type Characters = Fighter;

type AttackList = { attacking: boolean; direction: string; frameStart: number; frameLength: number };
export type AttackStates = {
    list: { [key: string]: AttackList };
    size: number;
    canAttack: boolean;
    attackCooldown: number;
    attackFrameStart: number;
    attacking: boolean;
    hitbox: { show: boolean; map: { [key: string]: { x: number; y: number; width: number; height: number } } };
};

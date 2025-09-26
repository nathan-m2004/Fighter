import { InputState } from "../classes/Player";
import Fighter from "./Fighter";

export type Characters = Fighter;

export type Attack = {
    [key: string]: {
        x: { current: number; offset: number };
        y: { current: number; offset: number };
        width: number;
        height: number;
        directional: { bool: boolean; direction: string };
        keys: { pressed: InputState[]; sideKeysPressed: boolean; notPressed: InputState[] };
        onGround: { checkFor: boolean; noCheck: boolean };
        attacking: { bool: boolean; hit: boolean; framesToHit: number };
        attackKey: InputState;
        velocity: { x: number; y: number; noChange: boolean };
        frameStart: number;
        frameLength: number;
        frameToUnlockMovement: number;
        stopMovement: { bool: boolean; frame: number };
    };
};

export type AttackStates = {
    size: number;
    canAttack: boolean;
    attackCooldown: number;
    attackFrameStart: number;
    readonly current: string;
    map: Attack;
    hitbox: {
        show: boolean;
    };
};

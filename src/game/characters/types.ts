import { InputState } from "../classes/Player";
import Fighter from "./Fighter";

export type Characters = Fighter;

export type Attack = {
    x: { current: number; offset: number };
    y: { current: number; offset: number };
    width: number;
    height: number;
    directional: { bool: boolean; horizontal: string; vertical: string };
    keys: { pressed: InputState[]; sideKeysPressed: boolean; notPressed: InputState[] };
    onGround: { checkFor: boolean; noCheck: boolean };
    hitPoints: number;
    knockBack: { force: number; stopTime: number };
    attacking: { bool: boolean; hit: boolean; framesToHitDelta: number };
    attackKey: InputState;
    velocity: { x: number; y: number; noChange: boolean };
    firstFrame: boolean;
    frameTimeDelta: number;
    frameLengthDelta: number;
    frameToUnlockMovementDelta: number;
    stopMovement: { bool: boolean; frameDelta: number };
};

export type AttackStates = {
    size: number;
    canAttack: boolean;
    attackCooldownDelta: number;
    attackFrameDelta: number;
    readonly current: Attack;
    readonly currentsPositionSize: {};
    map: { [key: string]: Attack };

    hitbox: {
        show: boolean;
    };
};

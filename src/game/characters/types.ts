import { InputState } from "../classes/Player";
import Fighter from "./Fighter";

export type Characters = Fighter;

export type AttackStates = {
    size: number;
    canAttack: boolean;
    attackCooldown: number;
    attackFrameStart: number;
    attacking: boolean;
    map: {
        [key: string]: {
            x: { current: number; offset: number };
            y: { current: number; offset: number };
            width: number;
            height: number;
            direction: string;
            keys: { pressed: InputState[]; notPressed: InputState[] };
            onGround: { checkFor: boolean; noCheck: boolean };
            attacking: boolean;
            attackKey: InputState;
            velocity: { x: number; y: number; noChange: boolean };
            frameStart: number;
            frameLength: number;
            frameToUnlockMovement: number;
            stopMovement: { bool: boolean; frame: number };
        };
    };
    hitbox: {
        show: boolean;
    };
};
